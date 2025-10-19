import type { Request, Response, NextFunction } from "express";
import * as linkService from "../service/link.service";

/**
 * Create a new short link
 * Handles both anonymous and registered users
 */
export const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract URL from body
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing URL in request body" });
    }

    // Pass request context to service
    const user = req.user; // undefined if anonymous
    const shortLink = await linkService.createLink(url, user);

    return res.status(201).json({
      message: "Short link created successfully",
      data: shortLink,
    });
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

/**
 * Get the original URL by code
 */
export const getLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: "Missing code parameter" });
    }

    const link = await linkService.getLinkByCode(code);
    if (!link) {
      return res.status(404).json({ error: "Link not found or expired" });
    }

    return res.status(200).json({
      data: link,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a link (registered users only)
 */
export const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const deleted = await linkService.deleteLink(code, user);

    if (!deleted) {
      return res.status(403).json({ error: "Forbidden or link not found" });
    }

    return res.status(200).json({ message: "Link deleted successfully" });
  } catch (err) {
    next(err);
  }
};
