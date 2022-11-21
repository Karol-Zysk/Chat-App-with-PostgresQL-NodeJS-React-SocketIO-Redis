import { IncomingMessage } from "http";
import { NextFunction } from "express";
import { ExtendedError } from "socket.io/dist/namespace";

export interface IExpressMiddleware {
  (
    arg0: IncomingMessage,
    arg1: {},
    arg2: (err?: ExtendedError | undefined) => void
  ): void;
}
