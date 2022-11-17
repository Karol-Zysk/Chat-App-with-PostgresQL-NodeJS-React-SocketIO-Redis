import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import Redis from "ioredis";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { port } from "./config/config";
import authRouter from "./routes/authRouter";
import session from "express-session";
import connectRedis from "connect-redis";
import { redisClient } from "./redis";
dotenv.config({ path: "config.env" });

const RedisStore = connectRedis(session);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://127.0.0.1:5173", credentials: true },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  })
);
app.use(express.json());

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 100000,
      secure: `${process.env.NODE_ENV}` === "production" ? true : false,
      sameSite: "none",
    },
    secret: `${process.env.COOKIE_SECRET}`,
    name: "sid",
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    resave: false,
  })
);

app.get("/", (req, res) => {
  res.send("elo elo");
});

io.on("connect", (socket) => {
  console.log("hello from io");
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`${process.env.HELLO} server listenig on port ${port}`);
});
