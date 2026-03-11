import express from "express";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import "./db";
import "./cache";

// start server
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "3000");
app.listen(SERVER_PORT, () => {
	console.log(`Server is running on port ${SERVER_PORT}`);
});
