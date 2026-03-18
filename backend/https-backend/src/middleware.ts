import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "123123";

export interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export function authenticateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
        const id = (payload as any).userId ?? (payload as any).id;
        if (!id) return res.status(403).json({ message: "Invalid token" });
        req.user = { id };
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid token" });
    }
}