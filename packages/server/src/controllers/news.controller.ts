import { Request, Response, NextFunction } from "express";
import {
  CreateNewsArticleSchema,
  UpdateNewsArticleSchema,
  VERIFIED_NEWS_ARTICLES,
  NewsArticleEntity
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

// Helper to safely format DB row or mock object
function formatArticle(a: any): NewsArticleEntity {
  return {
    id: a.id,
    slug: a.slug,
    titleAr: a.titleAr,
    titleEn: a.titleEn,
    summaryAr: a.summaryAr ?? "",
    summaryEn: a.summaryEn ?? "",
    contentAr: a.contentAr ?? "",
    contentEn: a.contentEn ?? "",
    featuredImageUrl: a.featuredImageUrl ?? "",
    author: a.author ?? "AL-HADAB Media Center",
    publishedAt: a.publishedAt instanceof Date ? a.publishedAt.toISOString() : (a.publishedAt ?? new Date().toISOString()),
    category: a.category ?? "CORPORATE",
    isFeatured: a.isFeatured ?? false,
    isPublished: a.isPublished ?? true,
    seoTitleAr: a.seoTitleAr ?? "",
    seoTitleEn: a.seoTitleEn ?? "",
    seoDescAr: a.seoDescAr ?? "",
    seoDescEn: a.seoDescEn ?? "",
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : (a.createdAt ?? ""),
    updatedAt: a.updatedAt instanceof Date ? a.updatedAt.toISOString() : (a.updatedAt ?? "")
  };
}

const newsDb = (prisma as any).newsArticle;

export class NewsController {
  /**
   * GET /api/v1/news
   * Public news listing with category filtering, search, and pagination.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, page = "1", limit = "9" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 9));
      const skip = (pageNum - 1) * limitNum;

      let articles: any[] = [];
      let total = 0;

      try {
        if (newsDb && typeof newsDb.findMany === "function") {
          const where: any = { isPublished: true };
          if (category && typeof category === "string" && category !== "ALL") {
            where.category = category;
          }
          if (search && typeof search === "string") {
            where.OR = [
              { titleAr: { contains: search, mode: "insensitive" } },
              { titleEn: { contains: search, mode: "insensitive" } },
              { summaryAr: { contains: search, mode: "insensitive" } },
              { summaryEn: { contains: search, mode: "insensitive" } }
            ];
          }

          [articles, total] = await Promise.all([
            newsDb.findMany({
              where,
              orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
              skip,
              take: limitNum
            }),
            newsDb.count({ where })
          ]);
        }
      } catch {
        // Fallback below
      }

      if (!articles || articles.length === 0) {
        let fallback = [...VERIFIED_NEWS_ARTICLES];
        if (category && typeof category === "string" && category !== "ALL") {
          fallback = fallback.filter((a) => a.category === category);
        }
        if (search && typeof search === "string") {
          const q = (search as string).toLowerCase();
          fallback = fallback.filter(
            (a) =>
              a.titleAr.toLowerCase().includes(q) ||
              a.titleEn.toLowerCase().includes(q) ||
              a.summaryAr.toLowerCase().includes(q) ||
              a.summaryEn.toLowerCase().includes(q)
          );
        }
        total = fallback.length;
        articles = fallback.slice(skip, skip + limitNum);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: articles.map(formatArticle),
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/:slug
   * Public single article details by slug.
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      let article: any = null;

      try {
        if (newsDb && typeof newsDb.findUnique === "function") {
          article = await newsDb.findUnique({
            where: { slug }
          });
        }
      } catch {
        // Fallback below
      }

      if (!article) {
        article = VERIFIED_NEWS_ARTICLES.find((a) => a.slug === slug);
      }

      if (!article) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatArticle(article)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/admin
   * Returns all news articles for admin with metadata stats. Admin only.
   */
  static async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      let articles: any[] = [];

      try {
        if (newsDb && typeof newsDb.findMany === "function") {
          articles = await newsDb.findMany({
            orderBy: [{ publishedAt: "desc" }]
          });
        }
      } catch {
        // Fallback below
      }

      let formatted: NewsArticleEntity[];
      if (!articles || articles.length === 0) {
        formatted = VERIFIED_NEWS_ARTICLES.map(formatArticle);
      } else {
        formatted = articles.map(formatArticle);
      }

      const totalCount = formatted.length;
      const publishedCount = formatted.filter((a) => a.isPublished !== false).length;
      const draftCount = formatted.filter((a) => a.isPublished === false).length;
      const featuredCount = formatted.filter((a) => a.isFeatured === true).length;

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: {
          totalCount,
          publishedCount,
          draftCount,
          featuredCount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/news/id/:id
   * Admin lookup by id. Admin only.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      let article = null;
      try {
        if (newsDb && typeof newsDb.findUnique === "function") {
          article = await newsDb.findUnique({ where: { id } });
        }
      } catch {}

      if (!article) {
        article = VERIFIED_NEWS_ARTICLES.find((a) => a.id === id);
      }

      if (!article) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatArticle(article)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/news
   * Creates a new news article. Admin only.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateNewsArticleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;

      // Check slug uniqueness
      try {
        if (newsDb && typeof newsDb.findUnique === "function") {
          const existing = await newsDb.findUnique({ where: { slug: data.slug } });
          if (existing) {
            throw new AppError(`A news article with slug "${data.slug}" already exists.`, 409, "DUPLICATE_SLUG");
          }
        }
      } catch (e: any) {
        if (e instanceof AppError) throw e;
      }

      const created = await newsDb.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          slug: data.slug,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          summaryAr: data.summaryAr,
          summaryEn: data.summaryEn,
          contentAr: data.contentAr,
          contentEn: data.contentEn,
          featuredImageUrl: data.featuredImageUrl || "",
          author: data.author || "AL-HADAB Media Center",
          publishedAt: new Date(data.publishedAt),
          category: data.category,
          isFeatured: data.isFeatured ?? false,
          isPublished: data.isPublished ?? true,
          seoTitleAr: data.seoTitleAr || "",
          seoTitleEn: data.seoTitleEn || "",
          seoDescAr: data.seoDescAr || "",
          seoDescEn: data.seoDescEn || ""
        }
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: formatArticle(created),
        message: "News article created successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/news/:id
   * Updates an existing news article. Admin only.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await newsDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      const parsed = UpdateNewsArticleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;

      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await newsDb.findUnique({ where: { slug: data.slug } });
        if (slugExists) {
          throw new AppError(`A news article with slug "${data.slug}" already exists.`, 409, "DUPLICATE_SLUG");
        }
      }

      const updated = await newsDb.update({
        where: { id },
        data: {
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.titleAr !== undefined && { titleAr: data.titleAr }),
          ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
          ...(data.summaryAr !== undefined && { summaryAr: data.summaryAr }),
          ...(data.summaryEn !== undefined && { summaryEn: data.summaryEn }),
          ...(data.contentAr !== undefined && { contentAr: data.contentAr }),
          ...(data.contentEn !== undefined && { contentEn: data.contentEn }),
          ...(data.featuredImageUrl !== undefined && { featuredImageUrl: data.featuredImageUrl }),
          ...(data.author !== undefined && { author: data.author }),
          ...(data.publishedAt !== undefined && { publishedAt: new Date(data.publishedAt) }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
          ...(data.seoTitleAr !== undefined && { seoTitleAr: data.seoTitleAr }),
          ...(data.seoTitleEn !== undefined && { seoTitleEn: data.seoTitleEn }),
          ...(data.seoDescAr !== undefined && { seoDescAr: data.seoDescAr }),
          ...(data.seoDescEn !== undefined && { seoDescEn: data.seoDescEn })
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatArticle(updated),
        message: "News article updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/news/:id
   * Deletes a news article. Admin only.
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await newsDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      await newsDb.delete({ where: { id } });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "News article deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/news/:id/toggle-publish
   * Toggles published/draft status. Admin only.
   */
  static async togglePublish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await newsDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      const updated = await newsDb.update({
        where: { id },
        data: { isPublished: !existing.isPublished }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatArticle(updated),
        message: `Article ${updated.isPublished ? "published" : "set to draft"} successfully.`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/news/:id/toggle-featured
   * Toggles featured status. Admin only.
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await newsDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("News article not found.", 404, "NEWS_NOT_FOUND");
      }

      const updated = await newsDb.update({
        where: { id },
        data: { isFeatured: !existing.isFeatured }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatArticle(updated),
        message: `Article ${updated.isFeatured ? "marked as featured" : "unfeatured"} successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
}
