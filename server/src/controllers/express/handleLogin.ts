import { Request, Response } from "express";

export const handleLogin = async (req: Request, res: Response) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
    console.log(req.session.user);
  } else {
    res.json({ loggedIn: false });
  }
};
