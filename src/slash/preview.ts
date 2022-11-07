import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import createWelcome from "../lib/createWelcome";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("preview")
		.setDescription("Preview your welcome image (if you have one)."),
	async execute(client, interaction) {
		const { Server } = (client as any).Schema;
	
		let [server] = await Server.find({id: interaction.guild.id});

		if (server) {
			await interaction.deferReply();
			let attachment = await createWelcome(interaction.user, interaction.guild);
			const embed = new EmbedBuilder()
			.setDescription("Preview of your welcome image:")
			.setImage("attachment://welcome.jpg");
			await interaction.editReply({embeds: [embed], files: [{attachment, name: "welcome.jpg"}]});
			interaction.editReply({embeds: [embed], files: [attachment]});
		} else {
			const errorEmbed = new EmbedBuilder()
			.setDescription("You don't have a welcome image set up yet! Use `/setup` to set one up.")
			.setColor("Red")
			.setTimestamp();
			interaction.reply({embeds: [errorEmbed]});
		}
	},
};
