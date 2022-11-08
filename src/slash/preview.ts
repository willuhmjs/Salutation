import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import createWelcome from "../lib/createWelcome";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("preview")
		.setDescription("Preview your welcome image (if you have one).")
		.addUserOption((option) => option.setName("user").setDescription("The user to preview the welcome image for.").setRequired(false)),
	async execute(client, interaction) {
		const { Server } = (client as any).Schema;

		let [server] = await Server.find({ id: interaction.guild.id });

		if (server) {
			await interaction.reply({
				embeds: [new EmbedBuilder().setDescription("Loading example welcome message...").setColor("Blurple")]
			});
			let attachment = await createWelcome(interaction.options.getUser("user") ?? interaction.user, interaction.guild);
			await interaction.editReply({
				embeds: [new EmbedBuilder().setDescription("Preview of your welcome image:").setImage("attachment://welcome.jpg").setColor("Green")],
				files: [{ attachment, name: "welcome.jpg" }],
			});
		} else {
			const errorEmbed = new EmbedBuilder()
				.setDescription(
					"⚠️ You don't have a welcome image set up yet! Use `/setup` to set one up."
				)
				.setColor("Red")
				.setTimestamp();
			interaction.reply({ embeds: [errorEmbed] });
		}
	},
};
