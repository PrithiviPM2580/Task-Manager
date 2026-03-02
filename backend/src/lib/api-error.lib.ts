export default class APIError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly success: boolean;
  public error?: Errorresponse | undefined;

  constructor(
    statusCode: number = 500,
    message: string = "Internal Server Error",
    isOperational: boolean = true,
    error?: Errorresponse | undefined,
    stack?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = isOperational;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
