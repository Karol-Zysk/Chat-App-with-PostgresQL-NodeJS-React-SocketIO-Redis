import { pool } from "../../db/dbConnect";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { existingUserQuery, registerQuery } from "../../queries/authQueries";

export const attemptRegister = async (req: Request, res: Response) => {
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
