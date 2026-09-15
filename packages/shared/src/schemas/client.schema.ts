import { z } from "zod";

export const ClientCategoryEnum = z.enum([
  "MINISTRY",
  "AMANAT",
  "PIF_GIGA",
  "SEMI_GOV",
  "AUTHORITY",
  "PRIVATE"
]);

export type ClientCategoryType = z.infer<typeof ClientCategoryEnum>;

export const CreateClientSchema = z.object({
  id: z
    .string()
    .min(2, "ID is required and must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "ID must contain only lowercase letters, numbers, and hyphens (e.g. c-housing)"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  nameAr: z.string().min(2, "Arabic name is required"),
  nameEn: z.string().min(2, "English name is required"),
  category: ClientCategoryEnum,
  monogram: z.string().default(""),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).default(""),
  websiteUrl: z.string().url("Must be a valid website URL").or(z.literal("")).default(""),
  descriptionAr: z.string().default(""),
  descriptionEn: z.string().default(""),
  displayOrder: z.number().int().nonnegative().default(0),
  isFeatured: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial().omit({ id: true });

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

export const ReorderClientsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().nonnegative()
    })
  )
});

export type ReorderClientsInput = z.infer<typeof ReorderClientsSchema>;
