import express from "express";
import cors from 'cors'
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();
app.use(cors({
	origin: 'http://localhost:3000'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import router from "./routes";
app.use("/", router);

import "./db";
import "./cache";

// start server
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "5000");
app.listen(SERVER_PORT, () => {
	console.log(`Server Running on Port ${SERVER_PORT}`);
});
