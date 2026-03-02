import jwt, { type Secret } from "jsonwebtoken";
import APIError from "./api-error.lib.js";
import logger from "./logger.lib.js";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

export const generateToken = (
  payload: Payload,
  options?: JWTSignOptions,
): string => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): Payload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Payload;
    return decoded;
  } catch (error) {
    logger.error("Token verification failed", {
      label: "JWT_Library",
      error: error instanceof Error ? error.message : String(error),
    });
    throw new APIError(401, "Invalid token", true, {
      details: [
        {
          message: "The provided token is invalid or has expired",
        },
      ],
    });
  }
};
