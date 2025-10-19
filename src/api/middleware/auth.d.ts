import type { Request, Response, NextFunction } from "express";
/**
 * OPTIONAL auth
 * - If token exists → attach user
 * - If not → continue as anonymous
 */
export declare const optionalAuthMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
/**
 * REQUIRED auth
 * - Must be authenticated
 */
export declare const requireAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map