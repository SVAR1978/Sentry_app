import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({
            error: "MISSING_TOKEN",
            message: "Authorization header missing"
        });
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({
            error: "MISSING_TOKEN",
            message: "Token missing"
        });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const id = payload.userId ?? payload.id;
        if (!id)
            return res.status(403).json({
                error: "INVALID_TOKEN",
                message: "Invalid token"
            });
        req.user = { id };
        next();
    }
    catch (err) {
        const errorMessage = err.name === "TokenExpiredError"
            ? "JWT token has expired. Please login again."
            : "Invalid or malformed JWT token";
        const errorCode = err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
        const statusCode = err.name === "TokenExpiredError" ? 401 : 403;
        console.warn("[Auth] JWT verification failed:", {
            error: errorCode,
            reason: err.message,
        });
        return res.status(statusCode).json({
            error: errorCode,
            message: errorMessage,
            expiresAt: err.expiredAt || null
        });
    }
}
//# sourceMappingURL=middleware.js.map