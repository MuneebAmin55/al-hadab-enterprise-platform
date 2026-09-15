import { Request, Response, NextFunction } from "express";
import {
  CreateClientSchema,
  UpdateClientSchema,
  ReorderClientsSchema,
  VERIFIED_CLIENTS,
  ClientEntity
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

// Helper to format client entity to standard shape
function formatClient(c: any): ClientEntity {
  return {
    id: c.id,
    slug: c.slug,
    nameAr: c.nameAr,
    nameEn: c.nameEn,
    category: c.category,
    monogram: c.monogram ?? "",
    logoUrl: c.logoUrl ?? "",
    websiteUrl: c.websiteUrl ?? "",
    descriptionAr: c.descriptionAr ?? "",
    descriptionEn: c.descriptionEn ?? "",
    displayOrder: c.displayOrder ?? 0,
    isFeatured: c.isFeatured ?? true,
    isActive: c.isActive ?? true,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : (c.createdAt ?? ""),
    updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : (c.updatedAt ?? "")
  };
}

const clientDb = (prisma as any).clientEntity;

export class ClientsController {
  /**
   * GET /api/v1/clients or /api/v1/company/clients
   * Returns active clients ordered by displayOrder.
   * Falls back gracefully to VERIFIED_CLIENTS if DB is empty or unreachable.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await clientDb.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" }
      });

      if (clients && clients.length > 0) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          data: clients.map(formatClient)
        });
      }

      // Fallback if table not seeded
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: VERIFIED_CLIENTS
      });
    } catch (error) {
      // Fallback on DB connection issue
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: VERIFIED_CLIENTS
      });
    }
  }

  /**
   * GET /api/v1/clients/admin
   * Returns all clients with metadata counts. Admin only.
   */
  static async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      let clients = await clientDb.findMany({
        orderBy: { displayOrder: "asc" }
      });

      // If database is empty, return verified clients with defaults so admin can see/manage
      let formatted: ClientEntity[];
      if (!clients || clients.length === 0) {
        formatted = VERIFIED_CLIENTS.map((c, idx) => ({
          ...c,
          logoUrl: "",
          websiteUrl: "",
          displayOrder: idx,
          isFeatured: true,
          isActive: true
        }));
      } else {
        formatted = clients.map(formatClient);
      }

      const totalCount = formatted.length;
      const activeCount = formatted.filter((c) => c.isActive !== false).length;
      const featuredCount = formatted.filter((c) => c.isFeatured !== false).length;

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: { totalCount, activeCount, featuredCount }
      });
    } catch (error) {
      // Return verified clients fallback if DB unreachable
      const formatted = VERIFIED_CLIENTS.map((c, idx) => ({
        ...c,
        logoUrl: "",
        websiteUrl: "",
        displayOrder: idx,
        isFeatured: true,
        isActive: true
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted,
        meta: {
          totalCount: formatted.length,
          activeCount: formatted.length,
          featuredCount: formatted.length
        }
      });
    }
  }

  /**
   * GET /api/v1/clients/:id
   * Returns a single client. Admin only.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const client = await clientDb.findUnique({
        where: { id }
      });

      if (!client) {
        throw new AppError("Client not found.", 404, "CLIENT_NOT_FOUND");
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatClient(client)
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/clients
   * Creates a new client. Admin only.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = CreateClientSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;

      // Check uniqueness of id and slug
      const existing = await clientDb.findFirst({
        where: { OR: [{ id: data.id }, { slug: data.slug }] }
      });

      if (existing) {
        throw new AppError(
          existing.id === data.id
            ? `A client with ID "${data.id}" already exists.`
            : `A client with slug "${data.slug}" already exists.`,
          409,
          "DUPLICATE_CLIENT"
        );
      }

      const client = await clientDb.create({
        data: {
          id: data.id,
          slug: data.slug,
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          category: data.category,
          monogram: data.monogram || "",
          logoUrl: data.logoUrl || "",
          websiteUrl: data.websiteUrl || "",
          descriptionAr: data.descriptionAr || "",
          descriptionEn: data.descriptionEn || "",
          displayOrder: data.displayOrder ?? 0,
          isFeatured: data.isFeatured ?? true,
          isActive: data.isActive ?? true
        }
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: formatClient(client),
        message: "Client created successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/clients/:id
   * Updates an existing client. Admin only.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await clientDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Client not found.", 404, "CLIENT_NOT_FOUND");
      }

      const parsed = UpdateClientSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          `Validation failed: ${parsed.error.errors.map((e) => e.message).join(", ")}`,
          400,
          "VALIDATION_ERROR"
        );
      }

      const data = parsed.data;

      // If slug changed, check uniqueness
      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await clientDb.findUnique({ where: { slug: data.slug } });
        if (slugExists) {
          throw new AppError(`A client with slug "${data.slug}" already exists.`, 409, "DUPLICATE_SLUG");
        }
      }

      const updated = await clientDb.update({
        where: { id },
        data: {
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.nameAr !== undefined && { nameAr: data.nameAr }),
          ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.monogram !== undefined && { monogram: data.monogram }),
          ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
          ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
          ...(data.descriptionAr !== undefined && { descriptionAr: data.descriptionAr }),
          ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
          ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isActive !== undefined && { isActive: data.isActive })
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatClient(updated),
        message: "Client updated successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/clients/:id
   * Deletes a client. Admin only.
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await clientDb.findUnique({
        where: { id },
        include: {
          projects: { select: { id: true, titleEn: true } }
        }
      });

      if (!existing) {
        throw new AppError("Client not found.", 404, "CLIENT_NOT_FOUND");
      }

      if (existing.projects && existing.projects.length > 0) {
        throw new AppError(
          `Cannot delete client "${existing.nameEn}" because it is referenced in ${existing.projects.length} project(s). Please reassign or remove the associated projects first.`,
          409,
          "CLIENT_IN_USE"
        );
      }

      await clientDb.delete({ where: { id } });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Client deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/clients/:id/toggle-active
   * Toggles the isActive status of a client. Admin only.
   */
  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await clientDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Client not found.", 404, "CLIENT_NOT_FOUND");
      }

      const updated = await clientDb.update({
        where: { id },
        data: { isActive: !existing.isActive }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatClient(updated),
        message: `Client ${updated.isActive ? "activated" : "deactivated"} successfully.`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/clients/:id/toggle-featured
   * Toggles the isFeatured status of a client. Admin only.
   */
  static async toggleFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await clientDb.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError("Client not found.", 404, "CLIENT_NOT_FOUND");
      }

      const updated = await clientDb.update({
        where: { id },
        data: { isFeatured: !existing.isFeatured }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatClient(updated),
        message: `Client ${updated.isFeatured ? "marked as featured" : "unfeatured"} successfully.`
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/clients/reorder
   * Bulk updates displayOrder for clients. Admin only.
   */
  static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ReorderClientsSchema.safeParse(req.body);
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
          clientDb.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder }
          })
        )
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Reordered ${items.length} clients successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
}
