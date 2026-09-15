import { Request, Response, NextFunction } from "express";
import {
  CreateWorkforceCategorySchema,
  UpdateWorkforceCategorySchema,
  ReorderWorkforceCategoriesSchema,
  UpdateEmployeeCountsSchema,
  DEFAULT_WORKFORCE_CATEGORIES,
  WorkforceCategoryEntity
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

/**
 * Calculates summary statistics for a list of categories
 */
function calculateSummary(categories: WorkforceCategoryEntity[]) {
  const totalEmployees = categories.reduce((sum, cat) => sum + (cat.employeeCount || 0), 0);
  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = totalCategories - activeCount;

  return {
    totalEmployees,
    totalCategories,
    activeCount,
    inactiveCount
  };
}

export class WorkforceController {
  /**
   * GET /api/v1/workforce — Public
   * Returns active categories ordered by displayOrder with total headcount summary.
   * Falls back gracefully to default categories if the database table is empty.
   */
  static async getPublicWorkforce(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.workforceCategory.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" }
      });

      if (categories && categories.length > 0) {
        const formatted: WorkforceCategoryEntity[] = categories.map((c) => ({
          id: c.id,
          nameEn: c.nameEn,
          nameAr: c.nameAr,
          employeeCount: c.employeeCount,
          descriptionEn: c.descriptionEn,
          descriptionAr: c.descriptionAr,
          displayOrder: c.displayOrder,
          isActive: c.isActive,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString()
        }));

        const totalEmployees = formatted.reduce((sum, c) => sum + c.employeeCount, 0);

        return res.status(200).json({
          success: true,
          statusCode: 200,
          data: {
            totalEmployees,
            totalCategories: formatted.length,
            categories: formatted
          }
        });
      }

      // Safe fallback when database has no records yet
      const fallbackActive = DEFAULT_WORKFORCE_CATEGORIES.filter((c) => c.isActive);
      const totalEmployees = fallbackActive.reduce((sum, c) => sum + c.employeeCount, 0);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          totalEmployees,
          totalCategories: fallbackActive.length,
          categories: fallbackActive
        }
      });
    } catch (error) {
      // Safe fallback if database is temporarily unreachable
      const fallbackActive = DEFAULT_WORKFORCE_CATEGORIES.filter((c) => c.isActive);
      const totalEmployees = fallbackActive.reduce((sum, c) => sum + c.employeeCount, 0);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          totalEmployees,
          totalCategories: fallbackActive.length,
          categories: fallbackActive
        }
      });
    }
  }

  /**
   * GET /api/v1/workforce/admin — Protected (SUPERADMIN | EDITOR)
   * Returns all categories (both active and inactive) with administrative metrics.
   */
  static async getAdminWorkforce(req: Request, res: Response, next: NextFunction) {
    try {
      let categories = await prisma.workforceCategory.findMany({
        orderBy: { displayOrder: "asc" }
      });

      // Auto-seed default categories if database table is completely empty
      if (!categories || categories.length === 0) {
        try {
          await prisma.$transaction(
            DEFAULT_WORKFORCE_CATEGORIES.map((cat, idx) =>
              prisma.workforceCategory.create({
                data: {
                  nameEn: cat.nameEn,
                  nameAr: cat.nameAr,
                  employeeCount: cat.employeeCount,
                  descriptionEn: cat.descriptionEn || null,
                  descriptionAr: cat.descriptionAr || null,
                  displayOrder: idx + 1,
                  isActive: cat.isActive
                }
              })
            )
          );

          categories = await prisma.workforceCategory.findMany({
            orderBy: { displayOrder: "asc" }
          });
        } catch {
          // If transaction fails (e.g. DB connection issues), return fallback
        }
      }

      const formatted: WorkforceCategoryEntity[] = (categories && categories.length > 0)
        ? categories.map((c) => ({
            id: c.id,
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            employeeCount: c.employeeCount,
            descriptionEn: c.descriptionEn,
            descriptionAr: c.descriptionAr,
            displayOrder: c.displayOrder,
            isActive: c.isActive,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString()
          }))
        : DEFAULT_WORKFORCE_CATEGORIES;

      const summary = calculateSummary(formatted);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          ...summary,
          categories: formatted
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/workforce — Protected (SUPERADMIN | EDITOR)
   * Creates a new workforce category.
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateWorkforceCategorySchema.parse(req.body);

      // Determine next displayOrder if not specified or 0
      let order = validated.displayOrder;
      if (!order || order <= 0) {
        const highest = await prisma.workforceCategory.findFirst({
          orderBy: { displayOrder: "desc" },
          select: { displayOrder: true }
        });
        order = (highest?.displayOrder ?? 0) + 1;
      }

      const created = await prisma.workforceCategory.create({
        data: {
          nameEn: validated.nameEn,
          nameAr: validated.nameAr,
          employeeCount: validated.employeeCount,
          descriptionEn: validated.descriptionEn || null,
          descriptionAr: validated.descriptionAr || null,
          displayOrder: order,
          isActive: validated.isActive ?? true
        }
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          ...created,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString()
        },
        messageAr: "تمت إضافة فئة القوى العاملة بنجاح.",
        messageEn: "Workforce category created successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/workforce/:id — Protected (SUPERADMIN | EDITOR)
   * Updates an existing workforce category.
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateWorkforceCategorySchema.parse(req.body);

      const existing = await prisma.workforceCategory.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Workforce category not found.", 404, "CATEGORY_NOT_FOUND");
      }

      const updated = await prisma.workforceCategory.update({
        where: { id },
        data: {
          ...(validated.nameEn !== undefined ? { nameEn: validated.nameEn } : {}),
          ...(validated.nameAr !== undefined ? { nameAr: validated.nameAr } : {}),
          ...(validated.employeeCount !== undefined ? { employeeCount: validated.employeeCount } : {}),
          ...(validated.descriptionEn !== undefined ? { descriptionEn: validated.descriptionEn } : {}),
          ...(validated.descriptionAr !== undefined ? { descriptionAr: validated.descriptionAr } : {}),
          ...(validated.displayOrder !== undefined ? { displayOrder: validated.displayOrder } : {}),
          ...(validated.isActive !== undefined ? { isActive: validated.isActive } : {})
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString()
        },
        messageAr: "تم تحديث فئة القوى العاملة بنجاح.",
        messageEn: "Workforce category updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/workforce/:id — Protected (SUPERADMIN | EDITOR)
   * Deletes a workforce category.
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.workforceCategory.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Workforce category not found.", 404, "CATEGORY_NOT_FOUND");
      }

      await prisma.workforceCategory.delete({
        where: { id }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        messageAr: "تم حذف فئة القوى العاملة بنجاح.",
        messageEn: "Workforce category deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/workforce/reorder — Protected (SUPERADMIN | EDITOR)
   * Updates display orders for multiple categories in a single transaction.
   */
  static async reorderCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = ReorderWorkforceCategoriesSchema.parse(req.body);

      await prisma.$transaction(
        validated.items.map((item) =>
          prisma.workforceCategory.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder }
          })
        )
      );

      const all = await prisma.workforceCategory.findMany({
        orderBy: { displayOrder: "asc" }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: all.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString()
        })),
        messageAr: "تم إعادة ترتيب الفئات بنجاح.",
        messageEn: "Categories reordered successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/workforce/counts — Protected (SUPERADMIN | EDITOR)
   * Batch updates employee counts across categories.
   */
  static async updateEmployeeCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = UpdateEmployeeCountsSchema.parse(req.body);

      await prisma.$transaction(
        validated.updates.map((item) =>
          prisma.workforceCategory.update({
            where: { id: item.id },
            data: { employeeCount: item.employeeCount }
          })
        )
      );

      const all = await prisma.workforceCategory.findMany({
        orderBy: { displayOrder: "asc" }
      });

      const totalEmployees = all.filter((c) => c.isActive).reduce((sum, c) => sum + c.employeeCount, 0);

      // Also keep CompanyProfile statsActiveWorkforce aligned if singleton exists
      try {
        await prisma.companyProfile.updateMany({
          where: { id: "singleton" },
          data: { statsActiveWorkforce: totalEmployees }
        });
      } catch {
        // Non-fatal if companyProfile singleton is not yet created
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          totalEmployees,
          categories: all.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString()
          }))
        },
        messageAr: "تم تحديث أعداد القوى العاملة بنجاح.",
        messageEn: "Workforce counts updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
