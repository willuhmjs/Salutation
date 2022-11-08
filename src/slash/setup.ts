import {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	ChannelFlagsBitField,
	ChannelType,
} from "discord.js";
import createWelcome from "../lib/createWelcome";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("setup")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDescription("Setup the welcome image for your server.")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel to send the welcome message in.")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription(
					"The message to send when a user joins the server. (Welcome to the server!)"
				)
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("font")
				.setDescription("The font to use for the welcome message. (Whitney)")
				.setRequired(false)
				.setChoices(
					{ name: "Whitney", value: "whitney.otf" },
					{ name: "Uni Sans", value: "unisans.otf" },
					{ name: "Open Sans", value: "opensans.ttf" },
					{ name: "Open Sans Bold", value: "opensansbold.ttf" },
					{ name: "Lobster", value: "lobster.ttf" },
					{ name: "Roboto", value: "roboto.ttf" },
					{ name: "Comic Sans", value: "comicsans.ttf" },
					{ name: "Times New Roman", value: "timesnewroman.ttf" }
				)
		)
		.addStringOption((option) =>
			option
				.setName("background-color")
				.setDescription(
					"The color of the background of the welcome message. (#23272A)"
				)
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName("font-color")
				.setDescription("The font color of the welcome message. (#FFFFFF)")
				.setRequired(false)
		)
		.addBooleanOption((option) =>
			option
				.setName("show-member-count")
				.setDescription(
					"Whether or not to show the server's member count in the welcome message. (False)"
				)
				.setRequired(false)
		)
		.addBooleanOption((option) =>
			option
				.setName("ping-user")
				.setDescription(
					"Whether or not to ping the user in the welcome message. (False)"
				)
				.setRequired(false)
		),
	async execute(client, interaction) {
		const { Server } = (client as any).Schema;
		const channel = interaction.options.getChannel("channel");
		const message =
			interaction.options.getString("message") ?? "Welcome to the server!";
		const font = interaction.options.getString("font") ?? "whitney.otf";
		const backgroundColor =
			interaction.options.getString("background-color") ?? "#23272A";
		const fontColor = interaction.options.getString("font-color") ?? "#FFFFFF";
		const showMemberCount =
			interaction.options.getBoolean("show-member-count") ?? false;
		const pingUser = interaction.options.getBoolean("ping-user") ?? false;
		await interaction.reply({
			embeds: [new EmbedBuilder().setDescription("Setting up the welcome message...").setColor("Blurple")]
		});
		const server = await Server.findOne({ id: interaction.guildId });
		if (!server) {
			const newServer = await new Server({
				id: interaction.guildId,
				welcome: {
					channel: channel?.id ?? null,
					message,
					font,
					backgroundColor,
					fontColor,
					showMemberCount,
					pingUser,
				},
			}).save();
			const attachment = await createWelcome(interaction.user, interaction.guild);
			await interaction.editReply({
				embeds: [new EmbedBuilder().setTitle("Welcome setup successfully!").setDescription("Here's a preview of the welcome message:").setColor("Green").setImage("attachment://welcome.png")],
				files: [{attachment, name: "welcome.jpg"}]
			});
		} else {
			server.welcome = {
				channel: channel?.id ?? null,
				message,
				font,
				backgroundColor,
				fontColor,
				showMemberCount,
				pingUser,
			};
			await server.save();
			const attachment = await createWelcome(interaction.user, interaction.guild);
			await interaction.editReply({
				embeds: [new EmbedBuilder().setTitle("Welcome edited successfully!").setDescription("Here's a preview of the welcome message:").setColor("Green").setImage("attachment://welcome.jpg")],
				files: [{attachment, name: "welcome.jpg"}]
			});
		}
	},
};
