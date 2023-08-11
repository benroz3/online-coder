import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import createWebSocketServer from "./webSocket";

const app = express();
dotenv.config();

//mongoDB connection
const mongoURL = process.env.MONGO_URL || "";
const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB!");
  });
};

//middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

//socket
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
createWebSocketServer(io);

//start server
server.listen(process.env.PORT, () => {
  connectMongo();
  console.log(`Server running on port ${process.env.PORT}.`);
});
