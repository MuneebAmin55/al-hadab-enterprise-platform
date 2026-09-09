import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const correlationId = (req.headers["x-correlation-id"] as string) || "req_internal";

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      correlationId,
      error: {
        code: "VALIDATION_FAILED",
        message: "The provided payload failed schema validation.",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          issue: e.message
        }))
      }
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      correlationId,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  console.error(`[Unhandled Error] [${correlationId}]`, err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    correlationId,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred. Please contact AL-HADAB technical support."
    }
  });
}
