import APIError from "@/lib/api-error.lib.js";
import { verifyToken } from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import User from "@/models/user.model.js";
import type { Request, Response, NextFunction } from "express";

export const authenticateMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    logger.error("Authentication failed: No token provided", {
      label: "Authentication_Middleware",
    });
    return next(new APIError(401, "Authentication failed: No token provided"));
  }

  const decode = verifyToken(token) as Payload;
  if (!decode.userId || !decode.email) {
    logger.error("Authentication failed: Invalid token payload", {
      label: "Authentication_Middleware",
    });
    return next(
      new APIError(401, "Authentication failed: Invalid token payload"),
    );
  }

  const user = await User.findById(decode.userId).lean();
  if (!user) {
    logger.error("Authentication failed: User not found", {
      label: "Authentication_Middleware",
      userId: decode.userId,
    });
    return next(new APIError(401, "Authentication failed: User not found"));
  }

  if (user.tokenVersion !== decode.tokenVersion) {
    logger.error("Authentication failed: Token version mismatch", {
      label: "Authentication_Middleware",
      userId: decode.userId,
    });
    return next(
      new APIError(401, "Authentication failed: Token version mismatch"),
    );
  }

  req.user = {
    userId: String(user._id),
    role: user.role,
  };
  next();
};

export const authorizeMiddleware = (roles: Roles[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.error("Authorization failed: No user information in request", {
        label: "Authorization_Middleware",
      });
      return next(
        new APIError(
          403,
          "Authorization failed: No user information in request",
        ),
      );
    }

    if (!roles.includes(req.user.role)) {
      logger.error("Authorization failed: User role not authorized", {
        label: "Authorization_Middleware",
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
      });
      return next(
        new APIError(403, "Authorization failed: User role not authorized"),
      );
    }

    next();
  };
};
