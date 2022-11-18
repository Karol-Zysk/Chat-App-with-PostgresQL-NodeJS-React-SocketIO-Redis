import { Router } from "express";
import { isLoggedIn, login, register } from "../controllers/authController";
import { validateForm } from "../controllers/formValidation";
import { rateLimiter } from "../controllers/rateLimiter";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const router = Router();

router
  .route("/login")
  .get(isLoggedIn)
  .post(validateForm, rateLimiter(60, 10), login);

router.post("/register", validateForm, rateLimiter(30, 4), register);

export default router;
