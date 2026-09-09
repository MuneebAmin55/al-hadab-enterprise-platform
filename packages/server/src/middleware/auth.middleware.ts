import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { AppError } from "./error.middleware";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please provide a valid Bearer token.", 401, "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Access token is invalid or expired.", 401, "TOKEN_EXPIRED");
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401, "UNAUTHORIZED");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Access forbidden: insufficient role permissions.", 403, "FORBIDDEN");
    }

    next();
  };
}
