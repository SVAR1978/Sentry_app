import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password, } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: name || "",
                email,
                phone: phone || "",
                password: hashedPassword,
                role: "USER",
            },
        });
        const token = jwt.sign({
            userId: newUser.id,
            role: newUser.role, // ✅ role in JWT
        }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
/**
 * SIGNIN
 */
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role, //  role in JWT
        }, JWT_SECRET, { expiresIn: "6h" });
        return res.status(200).json({
            message: "Signin successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=auth.js.map