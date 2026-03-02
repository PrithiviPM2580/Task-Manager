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

  type Roles = "admin" | "user";

  interface JWTPayload {
    userId: string;
    purpose: "email-verification" | "reset-password" | "access" | "refresh";
    iat?: number;
    exp?: number;
  }
}

export {};
