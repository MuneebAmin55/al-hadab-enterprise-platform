import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

export class ProjectsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { vertical, clientCategory, region, status, searchQuery } = req.query;

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

      if (clientCategory && typeof clientCategory === "string") {
        whereClause.client = {
          category: clientCategory.toUpperCase()
        };
      }

      if (searchQuery && typeof searchQuery === "string" && searchQuery.trim() !== "") {
        whereClause.OR = [
          { titleAr: { contains: searchQuery } },
          { titleEn: { contains: searchQuery } },
          { summaryAr: { contains: searchQuery } },
          { summaryEn: { contains: searchQuery } }
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
          { yearGregorian: "desc" }
        ]
      });

      // Parse JSON fields into typed objects
      const formattedProjects = projects.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        clientId: p.clientId,
        clientNameAr: p.client.nameAr,
        clientNameEn: p.client.nameEn,
        clientCategory: p.client.category,
        verticalId: p.verticalId,
        verticalTitleAr: p.vertical.titleAr,
        verticalTitleEn: p.vertical.titleEn,
        region: p.region,
        cityAr: p.cityAr,
        cityEn: p.cityEn,
        coordinates: { lat: p.lat, lng: p.lng },
        executionStatus: p.executionStatus,
        yearHijri: p.yearHijri,
        yearGregorian: p.yearGregorian,
        summaryAr: p.summaryAr,
        summaryEn: p.summaryEn,
        challengeAr: p.challengeAr,
        challengeEn: p.challengeEn,
        solutionAr: p.solutionAr,
        solutionEn: p.solutionEn,
        metrics: JSON.parse(p.metrics || "[]"),
        fleetUnitsDeployed: JSON.parse(p.fleetUnits || "[]"),
        heroImageUrl: p.heroImageUrl,
        galleryUrls: JSON.parse(p.galleryUrls || "[]"),
        isFlagship: p.isFlagship
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formattedProjects,
        meta: {
          total: formattedProjects.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

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

      const formatted = {
        id: project.id,
        slug: project.slug,
        titleAr: project.titleAr,
        titleEn: project.titleEn,
        clientId: project.clientId,
        clientNameAr: project.client.nameAr,
        clientNameEn: project.client.nameEn,
        clientCategory: project.client.category,
        verticalId: project.verticalId,
        verticalTitleAr: project.vertical.titleAr,
        verticalTitleEn: project.vertical.titleEn,
        region: project.region,
        cityAr: project.cityAr,
        cityEn: project.cityEn,
        coordinates: { lat: project.lat, lng: project.lng },
        executionStatus: project.executionStatus,
        yearHijri: project.yearHijri,
        yearGregorian: project.yearGregorian,
        summaryAr: project.summaryAr,
        summaryEn: project.summaryEn,
        challengeAr: project.challengeAr,
        challengeEn: project.challengeEn,
        solutionAr: project.solutionAr,
        solutionEn: project.solutionEn,
        metrics: JSON.parse(project.metrics || "[]"),
        fleetUnitsDeployed: JSON.parse(project.fleetUnits || "[]"),
        heroImageUrl: project.heroImageUrl,
        galleryUrls: JSON.parse(project.galleryUrls || "[]"),
        isFlagship: project.isFlagship
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
