import type { RateLimitInfo } from "express-rate-limit";

declare global {
  namespace Express {
    interface Request {
      rateLimit?: RateLimitInfo;
      user?: {
        userId: string;
        role: Roles;
      };
    }
  }
}

export {};
