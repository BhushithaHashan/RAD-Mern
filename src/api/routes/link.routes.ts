import { Router } from "express";
import * as linkController from "../../controller/link.controller.js";
import { optionalAuthMiddleware, requireAuthMiddleware } from "../middleware/auth.js";

const router = Router();

// Create link (anonymous or registered)
router.post("/", optionalAuthMiddleware, linkController.createLink);

// Get original link by code
router.get("/:code", linkController.getLink);

// Delete link (registered users only)
router.delete("/:code", requireAuthMiddleware, linkController.deleteLink);

export default router;
