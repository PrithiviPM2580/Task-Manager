import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib.js";

export default function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  void next;

  let customError: APIError;

  if (err instanceof APIError) {
    customError = err;
  } else {
    const unknownError = err as Error;

    customError = new APIError(
      500,
      unknownError.message || "Internal Server Error",
      undefined,
      unknownError.stack,
    );
  }

  res.status(customError.statusCode).json({
    success: customError.success,
    message: customError.message,
    error: customError.error,
  });
}
