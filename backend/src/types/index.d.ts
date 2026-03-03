import { type SignOptions } from "jsonwebtoken";

declare global {
  type ErrorDetails = {
    field?: string;
    message?: string;
  };

  type ErrorType = {
    type?: string;
    details?: ErrorDetails[];
  };

  type Errorresponse = string | ErrorType;

  type Roles = "admin" | "member";

  type JWTSignOptions = Pick<SignOptions, "expiresIn">;

  interface Payload {
    userId: string;
    email: string;
    tokenVersion: number;
  }

  type Status = "Pending" | "In Progress" | "Completed";
}

export {};
