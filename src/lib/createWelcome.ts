import {
	Canvas,
	loadImage,
	loadFont,
} from "canvas-constructor/skia";
import { Guild, User } from "discord.js";
import Server from "../server";
import path from "node:path";

const fonts = ["whitney.otf", "unisans.otf", "opensans.ttf", "opensansbold.ttf", "lobster.ttf", "roboto.ttf", "comicsans.ttf", "timesnewroman.ttf"];
for (const font of fonts) {
	loadFont(font, path.join(__dirname, `../../fonts/${font}`));
}

export default async (user: User, guild: Guild) => {
	// TODO remove any type
	let { welcome }: any = await Server.findOne({ id: guild.id });
	if (!welcome) throw Error("unexpected: guild not in database");
	let avatarURL = user.displayAvatarURL({ extension: "jpg" });
	let avatar = await loadImage(avatarURL);
	let canvas = new Canvas(500, 200);

	canvas
		.setColor(welcome.backgroundColor)
		.printRectangle(0, 0, 500, 200)
		.setColor(welcome.fontColor)
		.printCircle(95, 100, 75)
		.printCircularImage(avatar, 95, 100, 70)
		.setTextFont(`25px ${welcome.font}`)
		.printResponsiveText(`${welcome.message}`, 195, 85, 279)
		.setTextFont(`30px ${welcome.font}`)
		.printResponsiveText(user.tag, 195, 125, 279)
		.setTextFont(`21px ${welcome.font}`)
		.setTextAlign("right");

	if (welcome.showMemberCount) {
		canvas = canvas.printText(`${guild.memberCount} member${guild.memberCount !== 1 ? "s" : ""}!`, 490, 180);
	}

	return canvas.jpeg();
};
