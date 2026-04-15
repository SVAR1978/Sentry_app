import { Router } from "express";
import { Queue } from "bullmq";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";
import { redis } from "../config/redis.js";
import type { Request, Response } from "express";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
const emailQueue = new Queue("emailQueue", { connection: redis });


router.post("/signup", async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    console.log("[AUTH][SIGNUP] Request received", {
      email,
      hasName: Boolean(name),
      hasPhone: Boolean(phone),
      requestedRole: role,
    });

    if (!email || !password) {
      console.warn("[AUTH][SIGNUP] Missing required fields", { emailPresent: Boolean(email) });
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn("[AUTH][SIGNUP] Existing user attempted signup", { email });
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

    console.log("[AUTH][SIGNUP] User created", {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        role: newUser.role, // ✅ role in JWT
      },
      JWT_SECRET
    );

    // ============================================================
    // Publish USER_SESSION SIGNUP event to Redis for real-time admin notifications
    // ============================================================
    try {
      await redis.publish(
        "user-session-events",
        JSON.stringify({
          userId: newUser.id,
          userName: newUser.name || newUser.email,
          action: "SIGNUP",
          timestamp: new Date().toISOString(),
        })
      );
      console.log("[AUTH][SIGNUP] Published USER_SESSION SIGNUP event to Redis", {
        userId: newUser.id,
      });
    } catch (publishErr) {
      console.error("[AUTH][SIGNUP] Failed to publish USER_SESSION event:", publishErr);
    }

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
  } catch (error) {
    console.error("[AUTH][SIGNUP] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * SIGNIN
 */
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("[AUTH][SIGNIN] Request received", { email });

    if (!email || !password) {
      console.warn("[AUTH][SIGNIN] Missing required fields", { emailPresent: Boolean(email) });
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn("[AUTH][SIGNIN] User not found", { email });
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.warn("[AUTH][SIGNIN] Invalid password", { email, userId: user.id });
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("[AUTH][SIGNIN] Password verified", { email, userId: user.id });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role, //  role in JWT
      },
      JWT_SECRET
    );

    // ============================================================
    // Publish USER_SESSION event to Redis for real-time admin activity feed
    // ============================================================
    try {
      const userSessionEvent = {
        type: "USER_SESSION",
        payload: {
          userId: user.id,
          userName: user.name || user.email,
          action: "LOGIN",
          timestamp: new Date().toISOString(),
        },
      };

      // Publish to Redis for WebSocket backend to pick up and broadcast to admins
      await redis.publish(
        "user-session-events",
        JSON.stringify(userSessionEvent.payload)
      );

      console.log("[AUTH][SIGNIN] Published USER_SESSION LOGIN event to Redis", {
        userId: user.id,
        userName: user.name || user.email,
      });
    } catch (publishErr) {
      console.error("[AUTH][SIGNIN] Failed to publish USER_SESSION event:", publishErr);
      // Don't fail the login if publishing fails - this is a non-critical operation
    }

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
  } catch (error) {
    console.error("[AUTH][SIGNIN] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route A: POST /forgot-password
 */
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("[AUTH][FORGOT_PASSWORD] Request received", { email });

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn("[AUTH][FORGOT_PASSWORD] User not found", { email });
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

    await emailQueue.add("sendEmail", {
      email,
      subject: "Password Reset Code",
      htmlContent: emailHtml,
      userId: user.id,
      event: "FORGOT_PASSWORD",
    });
    console.log("[AUTH][FORGOT_PASSWORD] Reset code enqueued", { email, userId: user.id });
    return res.status(200).json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("[AUTH][FORGOT_PASSWORD] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route B: POST /verify-code
 */
router.post("/verify-code", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    console.log("[AUTH][VERIFY_CODE] Request received", { email, hasCode: Boolean(code) });

    if (!email || !code) return res.status(400).json({ message: "Email and code are required." });

    const storedCode = await redis.get(`reset-code:${email}`);
    if (!storedCode) {
      console.warn("[AUTH][VERIFY_CODE] Code missing or expired", { email });
      return res.status(400).json({ success: false, message: "Verification code expired or not found." });
    }

    if (storedCode !== code) {
      console.warn("[AUTH][VERIFY_CODE] Invalid code", { email });
      return res.status(400).json({ success: false, message: "Invalid verification code." });
    }

    console.log("[AUTH][VERIFY_CODE] Code verified", { email });

    return res.status(200).json({ success: true, message: "Code verified." });
  } catch (error) {
    console.error("[AUTH][VERIFY_CODE] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Route C: POST /reset-password
 */
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    console.log("[AUTH][RESET_PASSWORD] Request received", {
      email,
      hasCode: Boolean(code),
      hasNewPassword: Boolean(newPassword),
    });

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, code, and newPassword are required." });
    }

    const storedCode = await redis.get(`reset-code:${email}`);
    if (!storedCode || storedCode !== code) {
      console.warn("[AUTH][RESET_PASSWORD] Invalid or expired code", { email });
      return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the code from Redis so it cannot be reused
    await redis.del(`reset-code:${email}`);

    console.log("[AUTH][RESET_PASSWORD] Password reset successful", { email });

    return res.status(200).json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error("[AUTH][RESET_PASSWORD] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * UPDATE PROFILE Endpoint
 * PATCH /auth/update-profile
 */
router.patch("/update-profile", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      console.warn("[AUTH][UPDATE] No token provided");
      return res.status(401).json({ message: "Token is required" });
    }

    let decoded: { userId: string } | null = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      console.warn("[AUTH][UPDATE] Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    const { name, phone, avatar, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
        address: address || undefined,
      },
    });

    console.log("[AUTH][UPDATE] Profile updated successfully", { userId: decoded.userId });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("[AUTH][UPDATE] Update failed", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * LOGOUT Endpoint
 * POST /auth/logout
 * 
 * Publishes a USER_SESSION LOGOUT event for real-time admin activity feed.
 * Expects Bearer token in Authorization header.
 */
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      console.warn("[AUTH][LOGOUT] No token provided");
      return res.status(401).json({ message: "Token is required" });
    }

    let decoded: { userId: string; role?: string } | null = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string };
    } catch {
      console.warn("[AUTH][LOGOUT] Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!decoded?.userId) {
      console.warn("[AUTH][LOGOUT] Invalid token payload");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch user details for the activity feed
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      console.warn("[AUTH][LOGOUT] User not found", { userId: decoded.userId });
      return res.status(404).json({ message: "User not found" });
    }

    // ============================================================
    // Publish USER_SESSION LOGOUT event to Redis for admin activity feed
    // ============================================================
    try {
      const userSessionEvent = {
        type: "USER_SESSION",
        payload: {
          userId: user.id,
          userName: user.name || user.email,
          action: "LOGOUT",
          timestamp: new Date().toISOString(),
        },
      };

      // Publish to Redis for WebSocket backend to pick up and broadcast to admins
      await redis.publish(
        "user-session-events",
        JSON.stringify(userSessionEvent.payload)
      );

      console.log("[AUTH][LOGOUT] Published USER_SESSION LOGOUT event to Redis", {
        userId: user.id,
        userName: user.name || user.email,
      });
    } catch (publishErr) {
      console.error("[AUTH][LOGOUT] Failed to publish USER_SESSION event:", publishErr);
      // Don't fail the logout if publishing fails - this is a non-critical operation
    }

    console.log("[AUTH][LOGOUT] Logout successful", { userId: user.id });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("[AUTH][LOGOUT] Unexpected error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
