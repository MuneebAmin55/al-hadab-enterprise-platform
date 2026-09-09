import { Request, Response, NextFunction } from "express";
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
  subServices: SubServiceList;
  subServicesAr: string[];
  subServicesEn: string[];
  equipmentDeployed: string[];
  standards: string[];
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
// Helper — safely parse JSON fields from SQLite text columns
// ---------------------------------------------------------------------------
function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
export class CapabilitiesController {
  /**
   * GET /api/capabilities
   * Returns the full list of capability verticals with abbreviated project previews.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const verticals = await prisma.capabilityVertical.findMany({
        include: {
          projects: {
            take: 3,
            orderBy: { isFlagship: "desc" },
            select: {
              id: true,
              slug: true,
              titleAr: true,
              titleEn: true,
              heroImageUrl: true
            }
          }
        },
        orderBy: { createdAt: "asc" }
      });

      const formatted: CapabilityVerticalListItem[] = verticals.map((v) => ({
        id: v.id,
        code: v.code,
        titleAr: v.titleAr,
        titleEn: v.titleEn,
        shortDescAr: v.shortDescAr,
        shortDescEn: v.shortDescEn,
        fullDescAr: v.fullDescAr,
        fullDescEn: v.fullDescEn,
        iconName: v.iconName,
        subServices: {
          ar: safeParseJson<string[]>(v.subServicesAr, []),
          en: safeParseJson<string[]>(v.subServicesEn, [])
        },
        subServicesAr: safeParseJson<string[]>(v.subServicesAr, []),
        subServicesEn: safeParseJson<string[]>(v.subServicesEn, []),
        equipmentDeployed: safeParseJson<string[]>(v.equipmentDeployed, []),
        standards: safeParseJson<string[]>(v.standards, []),
        recentProjects: v.projects
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
   * GET /api/capabilities/:id
   * Returns a single capability vertical with its full project list.
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
                select: { nameAr: true, nameEn: true }
              }
            }
          }
        }
      });

      if (!vertical) {
        throw new AppError("Capability vertical not found.", 404, "CAPABILITY_NOT_FOUND");
      }

      const formatted: CapabilityVerticalDetail = {
        id: vertical.id,
        code: vertical.code,
        titleAr: vertical.titleAr,
        titleEn: vertical.titleEn,
        shortDescAr: vertical.shortDescAr,
        shortDescEn: vertical.shortDescEn,
        fullDescAr: vertical.fullDescAr,
        fullDescEn: vertical.fullDescEn,
        iconName: vertical.iconName,
        subServices: {
          ar: safeParseJson<string[]>(vertical.subServicesAr, []),
          en: safeParseJson<string[]>(vertical.subServicesEn, [])
        },
        subServicesAr: safeParseJson<string[]>(vertical.subServicesAr, []),
        subServicesEn: safeParseJson<string[]>(vertical.subServicesEn, []),
        equipmentDeployed: safeParseJson<string[]>(vertical.equipmentDeployed, []),
        standards: safeParseJson<string[]>(vertical.standards, []),
        projects: vertical.projects.map((p) => ({
          id: p.id,
          slug: p.slug,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          clientNameAr: p.client.nameAr,
          clientNameEn: p.client.nameEn,
          heroImageUrl: p.heroImageUrl,
          executionStatus: p.executionStatus
        }))
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  }
}
