import { redisClient } from "../../redis";
import { NextFunction, Response, Request } from "express";

export const rateLimiter =
  (secondsLimit: number, limitAmount: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.remoteAddress;

    const [response]: any = await redisClient
      .multi()
      .incr(ip!)
      .expire(ip!, secondsLimit)
      .exec();

    console.log(response[1]);
    if (response[1] > limitAmount)
      res.json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute.",
      });
    else next();
  };
