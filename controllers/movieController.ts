import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: number;
}

export const addMovie = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const movie = await prisma.movie.create({
      data: {
        ...data,
        createdById: req.userId!, // user ID from verifyToken middleware
      },
    });
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMovies = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!userId) return res.status(400).json({ message: "User ID missing" });

  try {
    const skip = (page - 1) * limit;
    const movies = await prisma.movie.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
    res.json(movies); // Must be JSON array
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMovie = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await prisma.movie.updateMany({
      where: { id, createdById: req.userId! },
      data: req.body,
    });
    if (movie.count === 0)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie updated" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMovie = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await prisma.movie.deleteMany({
      where: { id, createdById: req.userId! },
    });
    if (movie.count === 0)
      return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
