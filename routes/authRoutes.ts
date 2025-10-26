import express from "express";
import { signup, login, verifyToken } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", verifyToken, (req, res) => {});

export default router;
