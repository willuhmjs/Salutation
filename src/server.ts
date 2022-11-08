// Require mongoose, scehma
import mongoose from "mongoose";
const { Schema } = mongoose;

// Create the server schema
const serverSchema = new Schema(
	{
		id: {
			required: true,
			type: String,
		},
		background: {
			required: true,
			type: String,
			default: "#000000",
		},
		font: {
			required: true,
			type: String,
			default: "whitney",
		},
		font_color: {
			required: true,
			type: String,
			default: "#FFFFFF",
		},
		channel: {
			required: true,
			type: String,
		},
		message: {
			required: true,
			type: String,
			default: "Welcome to the server",
		},
		memberCount: {
			required: true,
			type: Boolean,
			default: false,
		},
		ping: {
			required: true,
			type: Boolean,
			default: true,
		},
		image: {
			required: true,
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Export model
const Server = mongoose.model("Server", serverSchema);
export default Server;
