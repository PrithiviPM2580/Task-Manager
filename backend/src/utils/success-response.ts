import type { Response } from "express";

export function successResponse<T>(
  res: Response,
  statusCode: number = 200,
  message: string = "Success",
  data?: T,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
