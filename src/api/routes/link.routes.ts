import { Router } from "express";
import * as linkController from "../../controller/link.controller.js";
import { optionalAuthMiddleware, requireAuthMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * =====================================
 * PUBLIC ROUTES
 * =====================================
 */

// Create link (anonymous OR registered user)
router.post("/", optionalAuthMiddleware, linkController.createLink);

// Resolve short link (redirect or get original)
router.get("/:code", linkController.getLink);

/**
 * =====================================
 * AUTHENTICATED ROUTES
 * =====================================
 */

// Apply auth middleware to all routes below
router.use(optionalAuthMiddleware); // parse token if present
router.use(requireAuthMiddleware);  // enforce authentication

// Get all links owned by logged-in user
router.get("/me", linkController.getMyLinks);

// Delete link (only by owner)
router.delete("/:code", linkController.deleteLink);

export default router;
