import { Router } from "express";
import { isLoggedIn, login, register } from "../controllers/authController";
import { validateForm } from "../controllers/formValidation";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const router = Router();

router.route("/login").get(isLoggedIn).post(validateForm, login);

router.post("/register", validateForm, register);

export default router;
