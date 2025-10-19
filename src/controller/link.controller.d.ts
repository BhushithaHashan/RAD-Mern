import type { Request, Response, NextFunction } from "express";
/**
 * Create a new short link
 * Handles both anonymous and registered users
 */
export declare const createLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get the original URL by code
 */
export declare const getLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete a link (registered users only)
 */
export declare const deleteLink: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=link.controller.d.ts.map