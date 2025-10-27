"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../validation/auth");
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    try {
        const data = auth_1.signupSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            },
        });
        res
            .status(201)
            .json({ message: "User registered successfully", userId: user.id });
    }
    catch (err) {
        if (err?.errors)
            return res.status(400).json({ errors: err.errors });
        res.status(500).json({ error: err.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const data = auth_1.loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ message: "Login successful", token });
    }
    catch (err) {
        if (err?.errors)
            return res.status(400).json({ errors: err.errors });
        res.status(500).json({ error: err.message });
    }
};
exports.login = login;
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch {
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
