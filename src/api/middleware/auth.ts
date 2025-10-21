import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../config/auth/jwt.js";
import jwt from "jsonwebtoken";

/**
 * OPTIONAL AUTH
 * - Used for anonymous + authenticated routes
 * - Never blocks
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return next();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch (err) {
    // Ignore errors here (expired / invalid)
    // Anonymous access allowed
  }

  next();
};

/**
 * REQUIRED AUTH
 * - Must be authenticated
 * - Token MUST be valid
 */
export const requireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};
