import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../model/user.model.js";
import { RefreshTokenModel } from "../model/refreshToken.model.js";
import { signToken } from "../config/auth/jwt.js";

/** ----------------- HELPERS ----------------- */

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

/** ----------------- AUTH LOGIC ----------------- */

/**
 * Register a new user
 */
export async function register(email: string, password: string) {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ email, passwordHash });

  return issueTokens(user.id);
}

/**
 * Login existing user
 */
export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  return issueTokens(user.id);
}

/**
 * Issue new access and refresh tokens
 */
async function issueTokens(userId: string) {
  const accessToken = signToken({ sub: userId, role: "user" });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { accessToken, refreshToken };
}

/**
 * Refresh access token using refresh token
 * Rotates refresh token only if expired or revoked
 */
export async function refresh(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  // Find the token even if expired
  const stored = await RefreshTokenModel.findOne({ tokenHash });
  if (!stored) throw new Error("Invalid refresh token");

  const now = new Date();
  let newRefreshToken = refreshToken; // keep old token by default

  // Revoke and replace if expired or revoked
  if (stored.revoked || (stored.expiresAt && stored.expiresAt < now)) {
    if (!stored.revoked) {
      stored.revoked = true;
      await stored.save();
    }

    newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);

    await RefreshTokenModel.create({
      userId: stored.userId,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  // Always generate new access token
  const accessToken = signToken({ sub: stored.userId.toString(), role: "user" });

  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Logout by revoking refresh token
 */
export async function logout(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await RefreshTokenModel.updateOne({ tokenHash }, { revoked: true });
}
