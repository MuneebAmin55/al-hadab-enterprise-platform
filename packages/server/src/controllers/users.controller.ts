import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { CreateAdminUserSchema, UpdateAdminUserSchema, AdminUserEntity } from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";
import { FALLBACK_USERS } from "./auth.controller";

let mockAdminUsers: AdminUserEntity[] = FALLBACK_USERS.map((u) => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  role: u.role as any,
  isActive: u.isActive,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  lastLoginAt: "2026-03-01T12:00:00Z"
}));

export class UsersController {
  /**
   * GET /api/v1/users — Admin (SUPERADMIN only)
   * Lists all admin users with roles, status, and last login.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const db = prisma as any;
      let users: any[] = [];
      try {
        users = await db.user.findMany({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            auditLogs: {
              where: { action: "LOGIN" },
              orderBy: { timestamp: "desc" },
              take: 1,
              select: { timestamp: true }
            }
          }
        });
      } catch (dbErr) {
        // Fallback to mockAdminUsers
      }

      if (!users || users.length === 0) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          data: mockAdminUsers
        });
      }

      const formatted: AdminUserEntity[] = users.map((u: any) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
        updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt,
        lastLoginAt: u.auditLogs?.[0]?.timestamp
          ? (u.auditLogs[0].timestamp instanceof Date ? u.auditLogs[0].timestamp.toISOString() : u.auditLogs[0].timestamp)
          : null
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users — Admin (SUPERADMIN only)
   * Creates a new admin user account.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateAdminUserSchema.parse(req.body);
      const db = prisma as any;

      let createdUser: AdminUserEntity;

      try {
        const existing = await db.user.findUnique({
          where: { email: parsed.email.toLowerCase() }
        });

        if (existing) {
          throw new AppError("An account with this email already exists.", 409, "USER_EXISTS");
        }

        const passwordHash = await bcrypt.hash(parsed.password, 12);

        const user = await db.user.create({
          data: {
            email: parsed.email.toLowerCase(),
            fullName: parsed.fullName,
            passwordHash,
            role: parsed.role,
            isActive: parsed.isActive ?? true
          }
        });

        // Audit Log
        await db.adminAuditLog.create({
          data: {
            userId: req.user?.userId || user.id,
            ipAddress: req.ip || "127.0.0.1",
            action: "CREATE_USER",
            resourceType: "USERS",
            resourceId: user.id,
            details: JSON.stringify({ email: user.email, role: user.role })
          }
        }).catch(() => {});

        createdUser = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
          updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
          lastLoginAt: null
        };
      } catch (dbErr: any) {
        if (dbErr instanceof AppError) throw dbErr;

        if (mockAdminUsers.some((u) => u.email.toLowerCase() === parsed.email.toLowerCase())) {
          throw new AppError("An account with this email already exists.", 409, "USER_EXISTS");
        }

        createdUser = {
          id: `usr-${Date.now()}`,
          email: parsed.email.toLowerCase(),
          fullName: parsed.fullName,
          role: parsed.role as any,
          isActive: parsed.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null
        };
        mockAdminUsers.unshift(createdUser);
      }

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: createdUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id — Admin (SUPERADMIN only)
   * Updates an admin user's name, role, active state, or password.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parsed = UpdateAdminUserSchema.parse(req.body);
      const db = prisma as any;

      // Self protection: cannot deactivate self
      if (req.user?.userId === id && parsed.isActive === false) {
        throw new AppError("You cannot deactivate your own active account.", 400, "CANNOT_DEACTIVATE_SELF");
      }

      // Self protection: cannot demote self from SUPERADMIN
      if (req.user?.userId === id && parsed.role && parsed.role !== "SUPERADMIN") {
        throw new AppError("You cannot revoke your own Superadmin privileges.", 400, "CANNOT_DEMOTE_SELF");
      }

      let updatedUser: AdminUserEntity;

      try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) {
          throw new AppError("User not found.", 404, "NOT_FOUND");
        }

        const dataToUpdate: any = {};
        if (parsed.fullName) dataToUpdate.fullName = parsed.fullName;
        if (parsed.email) dataToUpdate.email = parsed.email.toLowerCase();
        if (parsed.role) dataToUpdate.role = parsed.role;
        if (typeof parsed.isActive === "boolean") dataToUpdate.isActive = parsed.isActive;
        if (parsed.password && parsed.password.length >= 6) {
          dataToUpdate.passwordHash = await bcrypt.hash(parsed.password, 12);
        }

        const updated = await db.user.update({
          where: { id },
          data: dataToUpdate
        });

        // Audit Log
        await db.adminAuditLog.create({
          data: {
            userId: req.user?.userId || id,
            ipAddress: req.ip || "127.0.0.1",
            action: "UPDATE_USER",
            resourceType: "USERS",
            resourceId: id,
            details: JSON.stringify({ email: updated.email, role: updated.role, isActive: updated.isActive })
          }
        }).catch(() => {});

        updatedUser = {
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
          role: updated.role,
          isActive: updated.isActive,
          createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
          updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : updated.updatedAt
        };
      } catch (dbErr: any) {
        if (dbErr instanceof AppError) throw dbErr;

        const idx = mockAdminUsers.findIndex((u) => u.id === id);
        if (idx === -1) {
          throw new AppError("User not found.", 404, "NOT_FOUND");
        }

        mockAdminUsers[idx] = {
          ...mockAdminUsers[idx],
          fullName: parsed.fullName ?? mockAdminUsers[idx].fullName,
          email: parsed.email ? parsed.email.toLowerCase() : mockAdminUsers[idx].email,
          role: (parsed.role as any) ?? mockAdminUsers[idx].role,
          isActive: parsed.isActive !== undefined ? parsed.isActive : mockAdminUsers[idx].isActive,
          updatedAt: new Date().toISOString()
        };
        updatedUser = mockAdminUsers[idx];
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id — Admin (SUPERADMIN only)
   * Deletes an admin user account.
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const db = prisma as any;

      if (req.user?.userId === id) {
        throw new AppError("You cannot delete your own administrative account.", 400, "CANNOT_DELETE_SELF");
      }

      try {
        const user = await db.user.findUnique({ where: { id } });
        if (user) {
          await db.adminAuditLog.deleteMany({ where: { userId: id } }).catch(() => {});
          await db.user.delete({ where: { id } });
        }
      } catch (dbErr) {
        // Fallback
      }

      const idx = mockAdminUsers.findIndex((u) => u.id === id);
      if (idx !== -1) {
        mockAdminUsers.splice(idx, 1);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: { message: "User deleted successfully." }
      });
    } catch (error) {
      next(error);
    }
  }
}
