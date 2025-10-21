import bcrypt from "bcrypt";
import { UserModel } from "../model/user.model.js";
import { signToken } from "../config/auth/jwt.js";

export async function register(email: string, password: string) {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    email,
    passwordHash,
  });

  const token = signToken({ sub: user.id, role: "user" });

  return { token };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ sub: user.id, role: "user" });

  return { token };
}
