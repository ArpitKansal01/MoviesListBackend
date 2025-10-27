"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.getMovies = exports.addMovie = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addMovie = async (req, res) => {
    try {
        const data = req.body;
        const movie = await prisma.movie.create({
            data: {
                ...data,
                createdById: req.userId, // user ID from verifyToken middleware
            },
        });
        res.status(201).json(movie);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.addMovie = addMovie;
const getMovies = async (req, res) => {
    const userId = parseInt(req.query.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!userId)
        return res.status(400).json({ message: "User ID missing" });
    try {
        const skip = (page - 1) * limit;
        const movies = await prisma.movie.findMany({
            where: { createdById: userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });
        res.json(movies); // Must be JSON array
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMovies = getMovies;
const updateMovie = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const movie = await prisma.movie.updateMany({
            where: { id, createdById: req.userId },
            data: req.body,
        });
        if (movie.count === 0)
            return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie updated" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateMovie = updateMovie;
const deleteMovie = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const movie = await prisma.movie.deleteMany({
            where: { id, createdById: req.userId },
        });
        if (movie.count === 0)
            return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteMovie = deleteMovie;
