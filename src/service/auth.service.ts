import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../model/user.model.js";
import { RefreshTokenModel } from "../model/refreshToken.model.js";
import { signToken } from "../config/auth/jwt.js";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export async function register(email: string, password: string) {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ email, passwordHash });

  return issueTokens(user.id);
}

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  return issueTokens(user.id);
}

async function issueTokens(userId: string) {
  const accessToken = signToken({ sub: userId, role: "user" });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.create({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

export async function refresh(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  const stored = await RefreshTokenModel.findOne({
    tokenHash,
    revoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!stored) throw new Error("Invalid refresh token");

  // ROTATION (revoke old)
  stored.revoked = true;
  await stored.save();

  return issueTokens(stored.userId.toString());
}

export async function logout(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  await RefreshTokenModel.updateOne({ tokenHash }, { revoked: true });
}
