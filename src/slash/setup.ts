import {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
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
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message to send when a user joins the server. (ex. Welcome to the server!)")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("font")
				.setDescription("The font to use for the welcome message.")
				.setRequired(true)
				.setChoices(
					{ name: "Whitney", value: "whitney" },
					{ name: "Uni Sans", value: "unisans" },
					{ name: "Open Sans", value: "opensans" },
					{ name: "Open Sans Bold", value: "opensansbold" },
					{ name: "Lobster", value: "lobster" },
					{ name: "Roboto", value: "roboto" },
					{ name: "Comic Sans", value: "comicsans" },
					{ name: "Times New Roman", value: "timesnewroman" }
				)
		)
		.addStringOption((option) =>
			option
				.setName("background-color")
				.setDescription(
					"The color of the background of the welcome message. (ex. #7289da or rgb(114, 137, 218))"
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("font-color")
				.setDescription("The font color of the welcome message. (ex. #7289da or rgb(114, 137, 218))")
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("show-member-count")
				.setDescription(
					"Whether or not to show the server's member count in the welcome message."
				)
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("ping-user")
				.setDescription(
					"Whether or not to ping the user in the welcome message."
				)
				.setRequired(true)
		),
	async execute(client, interaction) {
		const { Server } = (client as any).Schema;
		// todo make command
	},
};
