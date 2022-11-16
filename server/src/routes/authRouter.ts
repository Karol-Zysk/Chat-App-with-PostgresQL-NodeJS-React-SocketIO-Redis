import { Router } from "express";
import { validateForm } from "../controllers/formValidation";

const router = Router();

router.post("/login", (req, res) => {
  validateForm(req, res);
});
router.post("/register", (req, res) => {
  validateForm(req, res);
});

export default router;
