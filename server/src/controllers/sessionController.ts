import Redis from "ioredis";
import dotenv from "dotenv";
import session from "express-session";
import { redisClient } from "../redis";
import connectRedis from "connect-redis";
import { Socket } from "socket.io";
import { NextFunction } from "express";
import { IExpressMiddleware } from "../interfaces/sessionInterface";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExtendedError } from "socket.io/dist/namespace";
dotenv.config({ path: "../../config.env" });

const RedisStore = connectRedis(session);

export const sessionMiddleware = () => {
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
  });
};

export const wrap =
  (expressMiddleware: IExpressMiddleware) =>
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    next: (err?: ExtendedError | undefined) => void
  ) =>
    expressMiddleware(socket.request, {}, next);

export const corsConfig = {
  origin: "http://127.0.0.1:5173",
  credentials: true,
};
