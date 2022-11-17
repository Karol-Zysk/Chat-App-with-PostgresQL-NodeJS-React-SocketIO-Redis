import { Request, Response, NextFunction } from "express";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const ip = req.connection.remoteAddress
};
