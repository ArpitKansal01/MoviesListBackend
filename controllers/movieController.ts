import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: number;
}

export const addMovie = async (req: AuthRequest, res: Response) => {
  try {
    const movie = await prisma.movie.create({
      data: { ...req.body, createdById: req.userId! },
    });
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMovies = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await prisma.movie.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { username: true, email: true } } },
    });
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMovie = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const updated = await prisma.movie.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMovie = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.movie.delete({ where: { id } });
    res.json({ message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
