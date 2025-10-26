import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import db from "./config/Db"; // Import the MySQL connection

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

db.connect();
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
