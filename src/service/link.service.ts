import crypto from "crypto";
import type { Request } from "express";
import { LinkModel, LinkDocument } from "../model/link.model.js";

interface UserContext {
  id: string;
  role: "user";
}

/**
 * Generate a random short code
 */
function generateCode(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

/**
 * Create a new link (anonymous or registered user)
 */
export async function createLink(url: string, user?: UserContext): Promise<LinkDocument> {
  const code = generateCode();
  const now = new Date();

  const linkData: Partial<LinkDocument> = {
    code,
    url,
    userId: user?.id,
    revoked: false,
  };

  // Set expiration for anonymous links (7 days)
  if (!user) {
    linkData.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  const link = await LinkModel.create(linkData);
  return link;
}

/**
 * Get original link by code
 * Records a click if Request is provided
 */
export async function getLinkByCode(
  code: string,
  req?: Request // pass req to record IP/userAgent
): Promise<LinkDocument | null> {
  const now = new Date();

  const link = await LinkModel.findOne({
    code,
    revoked: false,
    $or: [
      { expiresAt: { $exists: false } }, // user links
      { expiresAt: { $gt: now } },       // anonymous not expired
    ],
  });

  if (!link) return null;

  // Track clicks
  if (req) {
    link.clicks.push({
      ip: req.ip,
      userAgent: req.headers["user-agent"] || undefined,
      createdAt: new Date(),
    });
    await link.save();
  }

  return link;
}

/**
 * Delete a link (registered users only)
 */
export async function deleteLink(code: string, user: UserContext): Promise<boolean> {
  const link = await LinkModel.findOne({ code });

  if (!link) return false;

  // Only owner can delete
  if (!link.userId || link.userId.toString() !== user.id) return false;

  link.revoked = true;
  await link.save();

  return true;
}

/**
 * Get all links owned by a registered user
 */
export async function getLinksByUser(user: UserContext): Promise<LinkDocument[]> {
  return await LinkModel.find({
    userId: user.id,
    revoked: false,
  }).sort({ createdAt: -1 });
}

/**
 * Optional: background cleanup for expired anonymous links
 * Revokes expired links without deleting them
 */
export async function cleanupExpiredLinks(): Promise<void> {
  const now = new Date();
  await LinkModel.updateMany(
    { revoked: false, expiresAt: { $lte: now } },
    { revoked: true }
  );
}
