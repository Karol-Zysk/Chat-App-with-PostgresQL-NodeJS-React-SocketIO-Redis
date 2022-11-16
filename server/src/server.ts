import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { port } from "./config/config";
import authRouter from "./routes/authRouter";
dotenv.config({ path: "config.env" });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://127.0.0.1:5173", credentials: true },
});

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));

app.get("/", (req, res) => {
  res.send("elo elo");
});

io.on("connect", (socket) => {
  console.log("hello from io");
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`${process.env.HELLO} server listening on port ${port}`);
});
