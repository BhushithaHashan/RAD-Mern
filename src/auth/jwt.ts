import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  sub: string;
  role: "user";
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
