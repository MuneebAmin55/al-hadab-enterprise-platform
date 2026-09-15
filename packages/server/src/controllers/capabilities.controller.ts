import { Request, Response, NextFunction } from "express";
import {
  CreateCapabilitySchema,
  UpdateCapabilitySchema,
  ReorderCapabilitiesSchema,
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

// ---------------------------------------------------------------------------
// Response shape contracts — keep in sync with @alhadab/shared CapabilityVertical
// ---------------------------------------------------------------------------
interface SubServiceList {
  ar: string[];
  en: string[];
}

interface CapabilityVerticalListItem {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  fullDescAr: string;
  fullDescEn: string;
  iconName: string;
  imageUrl: string;
  subServices: SubServiceList;
  subServicesAr: string[];
  subServicesEn: string[];
  equipmentDeployed: string[];
  standards: string[];
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  recentProjects: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    heroImageUrl: string;
  }[];
}

interface CapabilityVerticalDetail extends Omit<CapabilityVerticalListItem, "recentProjects"> {
  projects: {
    id: string;
    slug: string;
    titleAr: string;
    titleEn: string;
    clientNameAr: string;
    clientNameEn: string;
    heroImageUrl: string;
    executionStatus: string;
  }[];
}

// ---------------------------------------------------------------------------
// Helper — safely parse JSON fields from DB text columns
// ---------------------------------------------------------------------------
function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Helper — format a DB capability row to API response shape
// ---------------------------------------------------------------------------
function formatVertical(v: any): Omit<CapabilityVerticalListItem, "recentProjects"> & { recentProjects?: any[] } {
  return {
    id: v.id,
    code: v.code,
    titleAr: v.titleAr,
    titleEn: v.titleEn,
    shortDescAr: v.shortDescAr,
    shortDescEn: v.shortDescEn,
    fullDescAr: v.fullDescAr,
    fullDescEn: v.fullDescEn,
    iconName: v.iconName,
    imageUrl: v.imageUrl ?? "",
    subServices: {
      ar: safeParseJson<string[]>(v.subServicesAr, []),
      en: safeParseJson<string[]>(v.subServicesEn, []),
    },
    subServicesAr: safeParseJson<string[]>(v.subServicesAr, []),
    subServicesEn: safeParseJson<string[]>(v.subServicesEn, []),
    equipmentDeployed: safeParseJson<string[]>(v.equipmentDeployed, []),
    standards: safeParseJson<string[]>(v.standards, []),
    displayOrder: v.displayOrder ?? 0,
    isFeatured: v.isFeatured ?? false,
    isActive: v.isActive ?? true,
    createdAt: v.createdAt instanceof Date ? v.createdAt.toISOString() : (v.createdAt ?? ""),
    updatedAt: v.updatedAt instanceof Date ? v.updatedAt.toISOString() : (v.updatedAt ?? ""),
    recentProjects: v.projects ?? [],
  };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
export class CapabilitiesController {
  /**
   * GET /api/capabilities
   * Returns the full list of active capability verticals with abbreviated project previews.
   * Public endpoint.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const verticals = await prisma.capabilityVertical.findMany({
        where: { isActive: true },
        include: {
          projects: {
            take: 3,
            orderBy: { isFlagship: "desc" },
            select: {
              id: true,
              slug: true,
              titleAr: true,
              titleEn: true,
              heroImageUrl: true,
            },
          },
        },
        orderBy: { displayOrder: "asc" },
      });

      const formatted = verticals.map(formatVertical);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/capabilities/:id
   * Returns a single capability vertical with its full project list. Public endpoint.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const vertical = await prisma.capabilityVertical.findUnique({
        where: { id },
        include: {
          projects: {
            orderBy: [{ isFlagship: "desc" }, { yearGregorian: "desc" }],
            include: {
              client: {
                select: { nameAr: true, nameEn: true },
              },
            },
          },
        },
      });

      if (!vertical) {
        throw new AppError("Capability vertical not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      const formatted: CapabilityVerticalDetail = {
        ...formatVertical(vertical),
        projects: vertical.projects.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          clientNameAr: p.client.nameAr,
          clientNameEn: p.client.nameEn,
          heroImageUrl: p.heroImageUrl,
          executionStatus: p.executionStatus,
        })),
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  }

  // ── ADMIN ROUTES ──────────────────────────────────────────────────────────

  /**
   * GET /api/capabilities/admin
   * Returns ALL capabilities (active + inactive) ordered by displayOrder. Admin only.
   */
  static async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      const verticals = await prisma.capabilityVertical.findMany({
        include: {
          projects: {
            take: 3,
            orderBy: { isFlagship: "desc" },
            select: { id: true, slug: true, titleAr: true, titleEn: true, heroImageUrl: true },
          },
        },
        orderBy: { displayOrder: "asc" },
      });

      const formatted = verticals.map(formatVertical);

      const totalCount = verticals.length;
      const activeCount = verticals.filter((v) => v.isActive).length;
      const featuredCount = verticals.filter((v) => v.isFeatured).length;

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: { totalCount, activeCount, featuredCount },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/capabilities
   * Creates a new capability vertical. Admin only.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateCapabilitySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;

      // Check uniqueness of id and code
      const existing = await prisma.capabilityVertical.findFirst({
        where: { OR: [{ id: data.id }, { code: data.code }] },
      });
      if (existing) {
        throw new AppError(
          existing.id === data.id
            ? `A capability with ID "${data.id}" already exists.`
            : `A capability with code "${data.code}" already exists.`,
          409,
          "DUPLICATE_CAPABILITY"
        );
      }

      const vertical = await prisma.capabilityVertical.create({
        data: {
          id: data.id,
          code: data.code,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          shortDescAr: data.shortDescAr,
          shortDescEn: data.shortDescEn,
          fullDescAr: data.fullDescAr,
          fullDescEn: data.fullDescEn,
          iconName: data.iconName,
          imageUrl: data.imageUrl ?? "",
          subServicesAr: JSON.stringify(data.subServicesAr ?? []),
          subServicesEn: JSON.stringify(data.subServicesEn ?? []),
          equipmentDeployed: JSON.stringify(data.equipmentDeployed ?? []),
          standards: JSON.stringify(data.standards ?? []),
          displayOrder: data.displayOrder ?? 0,
          isFeatured: data.isFeatured ?? false,
          isActive: data.isActive ?? true,
        },
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: formatVertical(vertical),
        message: "Capability created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/capabilities/:id
   * Updates an existing capability vertical. Admin only.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.capabilityVertical.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Capability not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      const parsed = UpdateCapabilitySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;
      const updatePayload: Record<string, any> = {};

      if (data.titleAr !== undefined) updatePayload.titleAr = data.titleAr;
      if (data.titleEn !== undefined) updatePayload.titleEn = data.titleEn;
      if (data.shortDescAr !== undefined) updatePayload.shortDescAr = data.shortDescAr;
      if (data.shortDescEn !== undefined) updatePayload.shortDescEn = data.shortDescEn;
      if (data.fullDescAr !== undefined) updatePayload.fullDescAr = data.fullDescAr;
      if (data.fullDescEn !== undefined) updatePayload.fullDescEn = data.fullDescEn;
      if (data.iconName !== undefined) updatePayload.iconName = data.iconName;
      if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;
      if (data.subServicesAr !== undefined) updatePayload.subServicesAr = JSON.stringify(data.subServicesAr);
      if (data.subServicesEn !== undefined) updatePayload.subServicesEn = JSON.stringify(data.subServicesEn);
      if (data.equipmentDeployed !== undefined) updatePayload.equipmentDeployed = JSON.stringify(data.equipmentDeployed);
      if (data.standards !== undefined) updatePayload.standards = JSON.stringify(data.standards);
      if (data.displayOrder !== undefined) updatePayload.displayOrder = data.displayOrder;
      if (data.isFeatured !== undefined) updatePayload.isFeatured = data.isFeatured;
      if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

      const updated = await prisma.capabilityVertical.update({
        where: { id },
        data: updatePayload,
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatVertical(updated),
        message: "Capability updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/capabilities/:id
   * Deletes a capability vertical. Admin only.
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.capabilityVertical.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Capability not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      await prisma.capabilityVertical.delete({ where: { id } });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Capability deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/capabilities/:id/toggle-active
   * Toggles the isActive status of a capability. Admin only.
   */
  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.capabilityVertical.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Capability not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      const updated = await prisma.capabilityVertical.update({
        where: { id },
        data: { isActive: !existing.isActive },
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatVertical(updated),
        message: `Capability ${updated.isActive ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/capabilities/:id/toggle-featured
   * Toggles the isFeatured status of a capability. Admin only.
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.capabilityVertical.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Capability not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      const updated = await prisma.capabilityVertical.update({
        where: { id },
        data: { isFeatured: !existing.isFeatured },
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatVertical(updated),
        message: `Capability ${updated.isFeatured ? "marked as featured" : "unfeatured"} successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/capabilities/reorder
   * Bulk-updates displayOrder for all capabilities. Admin only.
   */
  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ReorderCapabilitiesSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const { items } = parsed.data;

      await prisma.$transaction(
        items.map((item) =>
          prisma.capabilityVertical.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Reordered ${items.length} capabilities successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }
}
