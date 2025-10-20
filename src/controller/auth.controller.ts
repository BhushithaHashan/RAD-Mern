import type { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const result = await authService.register(email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
