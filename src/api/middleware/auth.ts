import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../auth/jwt.js";

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

    req.user = {
      id: payload.sub,
      role: payload.role,
    };
  } catch {
    // invalid / expired token → anonymous
  }

  next();
};

export const requireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }
  next();
};
