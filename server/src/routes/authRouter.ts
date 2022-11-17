import { Router } from "express";
import { validateForm } from "../controllers/formValidation";
import { pool } from "../db/dbConnect";
import bcrypt from "bcrypt";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const router = Router();

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);

    const potentialLogin = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [req.body.username]
    );

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
        
        return res.json({ loggedIn: true, username: req.body.username });
      }
      console.log("not good");
      return res.json({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    }
    console.log("not good");
    return res.json({ loggedIn: false, status: "Wrong username or password!" });
  });

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rowCount === 0) {
    //register
    const hashedPass = await bcrypt.hash(password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users (username, passhash) values ($1, $2) RETURNING id username",
      [username, hashedPass]
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };
    console.log(req.session);

    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false, status: "username taken" });
  }
});

export default router;
