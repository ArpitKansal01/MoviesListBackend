// backend/types.d.ts
import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // or number, depending on your JWT payload
    }
  }
}
