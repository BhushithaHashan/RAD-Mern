import type { Request, Response, NextFunction } from "express";

/**
 * OPTIONAL auth
 * - If token exists → attach user
 * - If not → continue as anonymous
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  // Placeholder logic (JWT ltr)
  
  const [, token] = authHeader.split(" ");

  if (token && token.startsWith("user-")) {
    req.user = {
      id: token,
      role: "user",
    };
  }

  next();
};

/**
 * REQUIRED auth
 * - Must be authenticated
 */
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
