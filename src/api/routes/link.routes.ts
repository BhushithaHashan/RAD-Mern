import type {  Request, Response, NextFunction } from "express";
import {Router} from "express";
const router = Router();

/**
 * POST /api/v1/links
 * Purpose: Create a short URL
 * Body: { url: string }
 */
router.post(
  "/",
  (req: Request, res: Response) => {
    // TEMP: no controller yet
    res.status(501).json({
      message: "Not implemented yet",
    });
  }
);

/**
 * GET /api/v1/links/:code
 * Purpose: Redirect to original URL
 */
router.get(
  "/:code",
  (req: Request, res: Response) => {
    res.status(501).json({
      message: `Lookup for code ${req.params.code} not implemented`,
    });
  }
);

export default router;
