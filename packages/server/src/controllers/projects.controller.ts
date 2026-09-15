import { Request, Response, NextFunction } from "express";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ReorderProjectsSchema,
  ProjectCaseStudy
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatProject(p: any): ProjectCaseStudy {
  return {
    id: p.id,
    slug: p.slug,
    titleAr: p.titleAr,
    titleEn: p.titleEn,
    clientId: p.clientId,
    clientNameAr: p.client?.nameAr || "",
    clientNameEn: p.client?.nameEn || "",
    clientCategory: p.client?.category || "",
    verticalId: p.verticalId,
    verticalTitleAr: p.vertical?.titleAr || "",
    verticalTitleEn: p.vertical?.titleEn || "",
    region: p.region,
    cityAr: p.cityAr,
    cityEn: p.cityEn,
    coordinates: { lat: p.lat ?? 24.7136, lng: p.lng ?? 46.6753 },
    executionStatus: p.executionStatus,
    yearHijri: p.yearHijri,
    yearGregorian: p.yearGregorian,
    summaryAr: p.summaryAr,
    summaryEn: p.summaryEn,
    challengeAr: p.challengeAr || "",
    challengeEn: p.challengeEn || "",
    solutionAr: p.solutionAr || "",
    solutionEn: p.solutionEn || "",
    metrics: safeParseJson(p.metrics, []),
    fleetUnitsDeployed: safeParseJson(p.fleetUnits, []),
    heroImageUrl: p.heroImageUrl,
    galleryUrls: safeParseJson(p.galleryUrls, []),
    isFlagship: Boolean(p.isFlagship),
    displayOrder: p.displayOrder ?? 0,
    isPublished: p.isPublished ?? true,
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString()
  };
}

export class ProjectsController {
  /**
   * GET /api/v1/projects — Public list
   * Returns published projects ordered by isFlagship, displayOrder, and year.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { vertical, clientCategory, region, status, searchQuery, isFlagship } = req.query;

      const whereClause: Record<string, unknown> = {
        isPublished: true
      };

      if (vertical && typeof vertical === "string") {
        whereClause.verticalId = vertical;
      }

      if (region && typeof region === "string") {
        whereClause.region = region.toUpperCase();
      }

      if (status && typeof status === "string") {
        whereClause.executionStatus = status.toUpperCase();
      }

      if (isFlagship !== undefined) {
        whereClause.isFlagship = isFlagship === "true";
      }

      if (clientCategory && typeof clientCategory === "string") {
        whereClause.client = {
          category: clientCategory.toUpperCase()
        };
      }

      if (searchQuery && typeof searchQuery === "string" && searchQuery.trim() !== "") {
        whereClause.OR = [
          { titleAr: { contains: searchQuery, mode: "insensitive" } },
          { titleEn: { contains: searchQuery, mode: "insensitive" } },
          { summaryAr: { contains: searchQuery, mode: "insensitive" } },
          { summaryEn: { contains: searchQuery, mode: "insensitive" } },
          { cityAr: { contains: searchQuery, mode: "insensitive" } },
          { cityEn: { contains: searchQuery, mode: "insensitive" } }
        ];
      }

      const projects = await prisma.projectCaseStudy.findMany({
        where: whereClause,
        include: {
          client: true,
          vertical: true
        },
        orderBy: [
          { isFlagship: "desc" },
          { displayOrder: "asc" },
          { yearGregorian: "desc" }
        ]
      });

      const formatted = projects.map(formatProject);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: {
          total: formatted.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/admin — Admin list with full metrics & pagination
   */
  static async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      const { vertical, region, status, searchQuery, isPublished, isFlagship } = req.query;

      const whereClause: Record<string, unknown> = {};

      if (vertical && typeof vertical === "string") {
        whereClause.verticalId = vertical;
      }

      if (region && typeof region === "string") {
        whereClause.region = region.toUpperCase();
      }

      if (status && typeof status === "string") {
        whereClause.executionStatus = status.toUpperCase();
      }

      if (isPublished !== undefined) {
        whereClause.isPublished = isPublished === "true";
      }

      if (isFlagship !== undefined) {
        whereClause.isFlagship = isFlagship === "true";
      }

      if (searchQuery && typeof searchQuery === "string" && searchQuery.trim() !== "") {
        whereClause.OR = [
          { titleAr: { contains: searchQuery, mode: "insensitive" } },
          { titleEn: { contains: searchQuery, mode: "insensitive" } },
          { slug: { contains: searchQuery, mode: "insensitive" } },
          { cityAr: { contains: searchQuery, mode: "insensitive" } },
          { cityEn: { contains: searchQuery, mode: "insensitive" } }
        ];
      }

      const projects = await prisma.projectCaseStudy.findMany({
        where: whereClause,
        include: {
          client: true,
          vertical: true
        },
        orderBy: [
          { displayOrder: "asc" },
          { updatedAt: "desc" }
        ]
      });

      const allProjects = await prisma.projectCaseStudy.findMany({
        select: { id: true, isPublished: true, isFlagship: true }
      });

      const formatted = projects.map(formatProject);

      const publishedCount = allProjects.filter((p) => p.isPublished).length;
      const flagshipCount = allProjects.filter((p) => p.isFlagship).length;
      const draftCount = allProjects.length - publishedCount;

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: {
          total: allProjects.length,
          matching: formatted.length,
          publishedCount,
          flagshipCount,
          draftCount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/:slug — Public get by slug
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const project = await prisma.projectCaseStudy.findUnique({
        where: { slug },
        include: {
          client: true,
          vertical: true
        }
      });

      if (!project) {
        throw new AppError("Project case study not found.", 404, "PROJECT_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatProject(project)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/id/:id — Get by ID (for admin editor)
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const project = await prisma.projectCaseStudy.findUnique({
        where: { id },
        include: {
          client: true,
          vertical: true
        }
      });

      if (!project) {
        throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatProject(project)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects — Protected (SUPERADMIN | EDITOR)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateProjectSchema.parse(req.body);

      // Generate or sanitize slug
      let generatedSlug = validated.slug ? slugify(validated.slug) : slugify(validated.titleEn);
      if (!generatedSlug || generatedSlug.length < 2) {
        generatedSlug = `project-${Date.now()}`;
      }

      // Ensure slug uniqueness
      const existingSlug = await prisma.projectCaseStudy.findUnique({
        where: { slug: generatedSlug }
      });
      if (existingSlug) {
        generatedSlug = `${generatedSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Determine display order
      let order = validated.displayOrder;
      if (!order || order <= 0) {
        const highest = await prisma.projectCaseStudy.findFirst({
          orderBy: { displayOrder: "desc" },
          select: { displayOrder: true }
        });
        order = (highest?.displayOrder ?? 0) + 1;
      }

      const created = await prisma.projectCaseStudy.create({
        data: {
          slug: generatedSlug,
          titleAr: validated.titleAr,
          titleEn: validated.titleEn,
          clientId: validated.clientId,
          verticalId: validated.verticalId,
          region: validated.region,
          cityAr: validated.cityAr,
          cityEn: validated.cityEn,
          lat: validated.lat ?? 24.7136,
          lng: validated.lng ?? 46.6753,
          executionStatus: validated.executionStatus ?? "COMPLETED",
          yearHijri: validated.yearHijri ?? 1445,
          yearGregorian: validated.yearGregorian ?? 2024,
          summaryAr: validated.summaryAr,
          summaryEn: validated.summaryEn,
          challengeAr: validated.challengeAr || "",
          solutionAr: validated.solutionAr || "",
          challengeEn: validated.challengeEn || "",
          solutionEn: validated.solutionEn || "",
          metrics: JSON.stringify(validated.metrics || []),
          fleetUnits: JSON.stringify(validated.fleetUnits || []),
          heroImageUrl: validated.heroImageUrl,
          galleryUrls: JSON.stringify(validated.galleryUrls || []),
          isFlagship: validated.isFlagship ?? false,
          displayOrder: order,
          isPublished: validated.isPublished ?? true
        },
        include: {
          client: true,
          vertical: true
        }
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: formatProject(created),
        messageAr: "تم إنشاء المشروع بنجاح.",
        messageEn: "Project created successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/projects/:id — Protected (SUPERADMIN | EDITOR)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateProjectSchema.parse(req.body);

      const existing = await prisma.projectCaseStudy.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
      }

      // Check slug uniqueness if changed
      let targetSlug = existing.slug;
      if (validated.slug && validated.slug !== existing.slug) {
        const slugFormatted = slugify(validated.slug);
        const collision = await prisma.projectCaseStudy.findUnique({
          where: { slug: slugFormatted }
        });
        if (collision && collision.id !== id) {
          throw new AppError("A project with this slug already exists.", 409, "SLUG_COLLISION");
        }
        targetSlug = slugFormatted;
      }

      const updateData: Record<string, unknown> = {
        slug: targetSlug
      };

      if (validated.titleAr !== undefined) updateData.titleAr = validated.titleAr;
      if (validated.titleEn !== undefined) updateData.titleEn = validated.titleEn;
      if (validated.clientId !== undefined) updateData.clientId = validated.clientId;
      if (validated.verticalId !== undefined) updateData.verticalId = validated.verticalId;
      if (validated.region !== undefined) updateData.region = validated.region;
      if (validated.cityAr !== undefined) updateData.cityAr = validated.cityAr;
      if (validated.cityEn !== undefined) updateData.cityEn = validated.cityEn;
      if (validated.lat !== undefined) updateData.lat = validated.lat;
      if (validated.lng !== undefined) updateData.lng = validated.lng;
      if (validated.executionStatus !== undefined) updateData.executionStatus = validated.executionStatus;
      if (validated.yearHijri !== undefined) updateData.yearHijri = validated.yearHijri;
      if (validated.yearGregorian !== undefined) updateData.yearGregorian = validated.yearGregorian;
      if (validated.summaryAr !== undefined) updateData.summaryAr = validated.summaryAr;
      if (validated.summaryEn !== undefined) updateData.summaryEn = validated.summaryEn;
      if (validated.challengeAr !== undefined) updateData.challengeAr = validated.challengeAr;
      if (validated.challengeEn !== undefined) updateData.challengeEn = validated.challengeEn;
      if (validated.solutionAr !== undefined) updateData.solutionAr = validated.solutionAr;
      if (validated.solutionEn !== undefined) updateData.solutionEn = validated.solutionEn;
      if (validated.metrics !== undefined) updateData.metrics = JSON.stringify(validated.metrics);
      if (validated.fleetUnits !== undefined) updateData.fleetUnits = JSON.stringify(validated.fleetUnits);
      if (validated.heroImageUrl !== undefined) updateData.heroImageUrl = validated.heroImageUrl;
      if (validated.galleryUrls !== undefined) updateData.galleryUrls = JSON.stringify(validated.galleryUrls);
      if (validated.isFlagship !== undefined) updateData.isFlagship = validated.isFlagship;
      if (validated.displayOrder !== undefined) updateData.displayOrder = validated.displayOrder;
      if (validated.isPublished !== undefined) updateData.isPublished = validated.isPublished;

      const updated = await prisma.projectCaseStudy.update({
        where: { id },
        data: updateData,
        include: {
          client: true,
          vertical: true
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatProject(updated),
        messageAr: "تم تحديث بيانات المشروع بنجاح.",
        messageEn: "Project updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/projects/:id — Protected (SUPERADMIN | EDITOR)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.projectCaseStudy.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
      }

      await prisma.projectCaseStudy.delete({
        where: { id }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        messageAr: "تم حذف المشروع بنجاح.",
        messageEn: "Project deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/projects/:id/publish — Quick toggle publish status
   */
  static async togglePublish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      const existing = await prisma.projectCaseStudy.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
      }

      const targetStatus = typeof isPublished === "boolean" ? isPublished : !existing.isPublished;

      const updated = await prisma.projectCaseStudy.update({
        where: { id },
        data: { isPublished: targetStatus },
        include: { client: true, vertical: true }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatProject(updated),
        messageAr: targetStatus ? "تم نشر المشروع." : "تم إلغاء نشر المشروع.",
        messageEn: targetStatus ? "Project published." : "Project unpublished."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/projects/:id/featured — Quick toggle flagship/featured status
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isFlagship } = req.body;

      const existing = await prisma.projectCaseStudy.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new AppError("Project not found.", 404, "PROJECT_NOT_FOUND");
      }

      const targetStatus = typeof isFlagship === "boolean" ? isFlagship : !existing.isFlagship;

      const updated = await prisma.projectCaseStudy.update({
        where: { id },
        data: { isFlagship: targetStatus },
        include: { client: true, vertical: true }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatProject(updated),
        messageAr: targetStatus ? "تم تعيين المشروع كمشروع استراتيجي رئيسي." : "تم إلغاء تمييز المشروع.",
        messageEn: targetStatus ? "Project marked as Flagship." : "Project unmarked as Flagship."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/projects/reorder — Bulk reordering
   */
  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = ReorderProjectsSchema.parse(req.body);

      await prisma.$transaction(
        validated.items.map((item) =>
          prisma.projectCaseStudy.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder }
          })
        )
      );

      const projects = await prisma.projectCaseStudy.findMany({
        include: { client: true, vertical: true },
        orderBy: [{ displayOrder: "asc" }]
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: projects.map(formatProject),
        messageAr: "تم إعادة ترتيب المشاريع بنجاح.",
        messageEn: "Projects reordered successfully."
      });
    } catch (error) {
      next(error);
    }
  }
}
