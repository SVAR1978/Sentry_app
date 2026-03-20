import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { emailService } from "../services/emailService.js";
import { redis } from "../config/redis.js";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password, role, } = req.body;
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
        // Determine role from request, defaulting safely to USER
        const allowedRoles = ["USER", "ADMIN"];
        const requestedRole = allowedRoles.includes(role) ? role : "USER";
        const newUser = await prisma.user.create({
            data: {
                name: name || "",
                email,
                phone: phone || "",
                password: hashedPassword,
                role: requestedRole,
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
/**
 * Route A: POST /forgot-password
 */
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Store the code in Redis with a 5-minute expiration (300 seconds)
        await redis.setex(`reset-code:${email}`, 300, code);
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset</h2>
        <p>Your password reset code is: <strong>${code}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;
        await emailService.sendEmail(email, "Password Reset Code", emailHtml);
        return res.status(200).json({ success: true, message: "Verification code sent." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
/**
 * Route B: POST /verify-code
 */
router.post("/verify-code", async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code)
            return res.status(400).json({ message: "Email and code are required." });
        const storedCode = await redis.get(`reset-code:${email}`);
        if (!storedCode) {
            return res.status(400).json({ success: false, message: "Verification code expired or not found." });
        }
        if (storedCode !== code) {
            return res.status(400).json({ success: false, message: "Invalid verification code." });
        }
        return res.status(200).json({ success: true, message: "Code verified." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
/**
 * Route C: POST /reset-password
 */
router.post("/reset-password", async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "Email, code, and newPassword are required." });
        }
        const storedCode = await redis.get(`reset-code:${email}`);
        if (!storedCode || storedCode !== code) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        // Delete the code from Redis so it cannot be reused
        await redis.del(`reset-code:${email}`);
        return res.status(200).json({ success: true, message: "Password reset successful." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=auth.js.map