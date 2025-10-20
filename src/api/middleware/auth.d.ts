import type { Request, Response, NextFunction } from "express";
export declare const optionalAuthMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map