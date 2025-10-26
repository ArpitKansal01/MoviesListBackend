import { Request, Response, NextFunction } from "express";
import db from "../config/Db"; // your MySQL connection
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { signupSchema, loginSchema } from "../validation/auth";
import { log } from "node:console";

dotenv.config();

interface AuthRequest extends Request {
  userId?: number;
}

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [data.email],
      async (err, results: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0)
          return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Insert user
        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [data.username, data.email, hashedPassword],
          (err, results: any) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (err: any) {
    if (err?.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [data.email],
      async (err, results: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(400).json({ message: "Invalid credentials" });

        const user = results[0];

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
          expiresIn: "1D",
        });

        res.json({ message: "Login successful", token });
      }
    );
  } catch (err: any) {
    if (err?.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ error: err.message });
  }
};

// Middleware to verify token
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};
