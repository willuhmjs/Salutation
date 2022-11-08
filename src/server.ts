// Require mongoose, scehma
import mongoose from "mongoose";
const { Schema } = mongoose;

// Create the server schema
const serverSchema = new Schema(
	{
		id: { type: String, required: true },
		welcome: {
			channel: { type: String, required: true, default: null },
			message: {
				type: String,
				required: true,
				default: "Welcome to the server!",
			},
			font: { type: String, required: true, default: "whitney" },
			backgroundColor: { type: String, required: true, default: "#23272A" },
			fontColor: { type: String, required: true, default: "#FFFFFF" },
			showMemberCount: { type: Boolean, required: true, default: false },
			pingUser: { type: Boolean, required: true, default: false },
		},
	},
	{ timestamps: true }
);

// Export model
const Server = mongoose.model("Server", serverSchema);
export default Server;
