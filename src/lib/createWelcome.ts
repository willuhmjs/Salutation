import {
	Canvas,
	resolveImage,
	loadFontsFromDirectory,
} from "canvas-constructor/napi-rs";
import { Guild, User } from "discord.js";
import Server from "../server";

import path from "node:path";

// Register font options
/*
registerFont(fontPath('whitney.otf'), 'whitney')
registerFont(fontPath('unisans.otf'),  'uni sans')
registerFont(fontPath('tnr.ttf'),  'times new roman')
registerFont(fontPath('comicsans.ttf'),  'comic sans')
registerFont(fontPath('lobster.ttf'),  'lobster')
registerFont(fontPath('roboto.ttf'),  'roboto')
registerFont(fontPath('opensans.ttf'),  "open sans");
registerFont(fontPath('opensansbold.ttf'),  "open sans bold");*/

loadFontsFromDirectory(path.resolve(__dirname, `./../../fonts/`));

export default async (user: User, guild: Guild) => {
	let [mongoGuild] = await Server.find({ id: guild.id });
	if (!mongoGuild) throw Error("unexpected: guild not in database");
	let avatarURL = user.displayAvatarURL({ extension: "png" });
	let avatar = await resolveImage(avatarURL);
	let canvas = new Canvas(500, 200);

	if (!mongoGuild.image) {
		//no img
		canvas.setColor(mongoGuild.background);
		canvas.printRectangle(0, 0, 500, 200);
	} else if (mongoGuild.image) {
		// its an image
		let bg = await resolveImage(mongoGuild.background);
		canvas.setColor("#000000");
		canvas.printRectangle(0, 0, 500, 200);
		canvas.printImage(bg, 0, 0, 500, 200);
	}

	canvas
		.setColor(mongoGuild.font_color)
		.printCircle(95, 100, 75)
		.printCircularImage(avatar, 95, 100, 70)
		.setTextFont(`25px ${mongoGuild.font}`)
		.printResponsiveText(`${mongoGuild.message},`, 195, 85, 279)
		.setTextFont(`30px ${mongoGuild.font}`)
		.printResponsiveText(user.tag, 195, 125, 279)
		.setTextFont(`21px ${mongoGuild.font}`)
		.setTextAlign("right");

	if (mongoGuild.memberCount) {
		canvas = canvas.printText(`Member #${guild.memberCount}`, 490, 180);
	}

	return canvas.jpeg();
};
