import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { ENV } from "../config/env";
import { AppError } from "../middleware/error.middleware";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user || !user.isActive) {
        throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
      }

      // Generate Tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        ENV.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        ENV.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Log Login Event in Audit Log
      await prisma.adminAuditLog.create({
        data: {
          userId: user.id,
          ipAddress: req.ip || "127.0.0.1",
          action: "LOGIN",
          resourceType: "AUTH",
          details: JSON.stringify({ userAgent: req.headers["user-agent"] })
        }
      });

      // Set Refresh Token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized.", 401, "UNAUTHORIZED");
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true, fullName: true, role: true, createdAt: true }
      });

      if (!user) {
        throw new AppError("User not found.", 404, "USER_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: { message: "Successfully logged out." }
    });
  }
}
