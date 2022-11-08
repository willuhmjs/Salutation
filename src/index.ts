import { commands } from "./slash";
import createWelcome from "./lib/createWelcome";
import {
	Client,
	Collection,
	GatewayIntentBits,
	Routes,
	ActivityType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	ChannelType,
} from "discord.js";
import { REST } from "@discordjs/rest";
import mongoose from "mongoose";
import { clientId, token, mongo } from "./config";
import Server from "./server";
import type {
	CommandLike,
	ChatInputCommandAssertedInteraction,
} from "./slash/command";

if (!token) throw Error("No token!");
if (!clientId) throw Error("No clientId!");

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

(client as any).Schema = { Server };
const commandList = new Collection<string, CommandLike>();

const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (const command of commands) {
	commandList.set(command.data.name, command);
	commandData.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

rest
	.put(Routes.applicationCommands(clientId), { body: commandData })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

client.once("ready", async () => {
	if (!mongo) throw Error("No mongo!");
	if (!client.user) throw Error("Unexpected: client.user is null");
	client.user.setActivity("users join servers!", {
		type: ActivityType.Watching,
	});
	console.log("Connected to Discord API!");
	mongoose.connect(mongo, (error) => {
		if (error) throw error;
		else console.log("Connected to MongoDB");
	});
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.guild) return;

	const command = commandList.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(
			client,
			interaction as ChatInputCommandAssertedInteraction
		);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.on("guildMemberAdd", async (member) => {
	if (!member.guild) return;
	const [server]: any = await Server.find({ id: member.guild.id });
	if (!server) return;
	const channel = member.guild.channels.cache.get(server.welcome.channel);
	if (channel?.type != ChannelType.GuildText) return;
	const attachment = await createWelcome(member.user, member.guild);
	await channel.send({
		files: [{ attachment, name: "welcome.jpg" }],
	});
});

client.login(token);
