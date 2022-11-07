import { config } from "dotenv";
config();

// Discord bot token
export const token = process.env.TOKEN;

// Discord bot client id
export const clientId = process.env.CLIENTID;

// MongoDB connection string URI
// https://www.mongodb.com/docs/manual/reference/connection-string/
export const mongo = process.env.MONGO;