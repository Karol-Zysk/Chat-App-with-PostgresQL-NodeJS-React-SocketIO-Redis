import { Request, Response } from "express";
import { pool } from "../db/dbConnect";
import bcrypt from "bcrypt";
import {
  existingUserQuery,
  potentialLoginQuery,
  registerQuery,
} from "../queries/authQueries";

export const login = async (req: Request, res: Response) => {
  const potentialLogin = await pool.query(potentialLoginQuery, [
    req.body.username,
  ]);

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );
    if (isSamePass) {
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
      };

      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password!" });
      console.log("not good");
    }
  } else {
    console.log("not good");
    res.json({ loggedIn: false, status: "Wrong username or password!" });
  }
};

export const isLoggedIn = async (req: Request, res: Response) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
    console.log(req.session.user);
  } else {
    res.json({ loggedIn: false });
  }
};

export const register = async (req: Request, res: Response) => {
  const existingUser = await pool.query(existingUserQuery, [req.body.username]);

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(registerQuery, [
      req.body.username,
      hashedPass,
    ]);
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };

    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
};
