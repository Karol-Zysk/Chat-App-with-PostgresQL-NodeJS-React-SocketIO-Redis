import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import { port } from "./config/config";
import authRouter from "./routes/authRouter";
import {
  authorizeUser,
  initializeUser,
  addFriend,
} from "./controllers/socketController";
import { redisClient } from "./redis";
import {
  corsConfig,
  sessionMiddleware,
  wrap,
} from "./controllers/sessionController";
dotenv.config({ path: "config.env" });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors({ origin: `http://127.0.0.1:5173`, credentials: true }));
app.use(express.json());

// app.use(sessionMiddleware);

app.get("/", (req, res) => {
  res.send("elo elo");
});

io.use(wrap(sessionMiddleware));
io.on("connect", (socket) => {
  //@ts-ignore
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });
});
io.use(authorizeUser);

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`${process.env.HELLO} server listenig on port ${port}`);
});
