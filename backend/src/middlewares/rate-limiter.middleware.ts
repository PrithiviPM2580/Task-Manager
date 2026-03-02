import type { Request, Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req: Request, res: Response) => {
    const retryAfter = req?.rateLimit?.resetTime ?? null;
    if (retryAfter) {
      res.setHeader(
        "Retry-After",
        Math.ceil((retryAfter.getTime() - Date.now()) / 1000),
      );
    }
    res.status(429).json({
      error:
        "Too many requests from this IP, please try again after 15 minutes.",
      retryAfter: retryAfter,
    });
  },
});

export const authLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipSuccessfulRequests: false,
  message: {
    error:
      "Too many authentication requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime ?? null;
    res.status(429).json({
      error: " Too many authentication requests",
      message:
        " Too many authentication requests from this IP, please try again after 15 minutes",
      retryAfter: retryAfter,
    });
  },
});

export const apiLimitter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500,
  message: {
    error: "Too many requests from this IP, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const userId = req.user?.userId;
    return userId ?? ipKeyGenerator(req as any);
  },
  handler: (req: Request, res: Response) => {
    const retryAfter = req.rateLimit?.resetTime ?? null;
    res.status(429).json({
      error: " Too many requests",
      message:
        " Too many requests from this IP, please try again after a minute",
      retryAfter,
    });
  },
});
