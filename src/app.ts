import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app: Application = express();

/**
 * ======================
 * GLOBAL MIDDLEWARE
 * ======================
 */

// HTTP Headers Hardening
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" }, // Prevent Clickjacking
    hidePoweredBy: true, // Hide Express
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Force HTTPS
    noSniff: true, // Prevent MIME sniffing
    xssFilter: true, // Basic XSS protection
  })
);

//  CORS — only allow frontend origins
app.use(
  cors({
    origin: ["http://localhost:8080"], // restrict to  frontend
    methods: ["GET", "POST","DELETE"], // allow only these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Body parsing + size limit
app.use(express.json({ limit: "10kb" })); // prevent large payload DoS

//Logging
app.use(morgan("combined"));

//  Rate Limiting — prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Disable unused HTTP methods globally
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedMethods = ["GET", "POST","DELETE"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  next();
});

// Health Check (for LB / monitoring)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "UP",
    service: "SwiftLink",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/v1/links", linkRoutes);
app.use("/api/v1/auth", authRoutes);

import linkRoutes from "./api/routes/link.routes.js";
import authRoutes from "./api/routes/auth.routes.js"


export default app;
