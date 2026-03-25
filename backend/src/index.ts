import express from "express";
import cors from "cors";
import path from "path";

// dotenv

const env =
	process.env.NODE_ENV === "production" ? "production" : "development";

if (env !== "production") {
	try {
		const envPath = path.resolve(process.cwd(), `.env.${env}`);
		require("dotenv").config({ quiet: true, path: envPath });
	} catch (err) {
		console.warn(`Couldn't load .env.${env} file, skipping...`);
	}
}

// server
const app = express();
app.set("trust proxy", true); // if behind reverse proxy, req.ip is localhost, so need this set
app.use(
	cors({
		origin: [
			"http://localhost:3000", // for local development run without docker
			"http://frontend:3000",
		],
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import router from "./routes";
app.use("/", router);

import "./db";
import "./cache";
import { scheduleCronJobs } from "./cron";

// start server
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "5000");
app.listen(SERVER_PORT, "0.0.0.0", () => {
	console.log(`Server Running on Port ${SERVER_PORT}`);
});

scheduleCronJobs();
