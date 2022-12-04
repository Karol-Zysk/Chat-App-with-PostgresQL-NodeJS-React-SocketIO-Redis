import { pool } from "../../db/dbConnect";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { potentialLoginQuery } from "../../queries/authQueries";

export const attemptLogin = async (req: Request, res: Response) => {
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
