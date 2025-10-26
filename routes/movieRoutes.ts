import { Router } from "express";
import {
  addMovie,
  getMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, addMovie);
router.get("/", getMovies);
router.put("/:id", verifyToken, updateMovie);
router.delete("/:id", verifyToken, deleteMovie);

export default router;
