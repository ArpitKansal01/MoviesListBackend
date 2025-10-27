import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import movieRoutes from "./routes/movieRoutes";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://movies-list-frontend.vercel.app", // your React dev URL
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
