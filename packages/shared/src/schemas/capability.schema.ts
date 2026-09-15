import { z } from "zod";

/**
 * Schema for creating a new capability vertical / service
 */
export const CreateCapabilitySchema = z.object({
  id: z.string().min(2, "ID must be at least 2 characters (used as slug)").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  code: z.string().min(2, "Code must be at least 2 characters").regex(/^[A-Z0-9_]+$/, "Code must be UPPERCASE_SNAKE_CASE"),
  titleAr: z.string().min(3, "Arabic title must be at least 3 characters"),
  titleEn: z.string().min(3, "English title must be at least 3 characters"),
  shortDescAr: z.string().min(5, "Arabic short description must be at least 5 characters"),
  shortDescEn: z.string().min(5, "English short description must be at least 5 characters"),
  fullDescAr: z.string().min(10, "Arabic full description must be at least 10 characters"),
  fullDescEn: z.string().min(10, "English full description must be at least 10 characters"),
  iconName: z.string().min(1, "Icon name is required"),
  imageUrl: z.string().default(""),
  subServicesAr: z.array(z.string().min(1)).default([]),
  subServicesEn: z.array(z.string().min(1)).default([]),
  equipmentDeployed: z.array(z.string().min(1)).default([]),
  standards: z.array(z.string().min(1)).default([]),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export type CreateCapabilityInput = z.infer<typeof CreateCapabilitySchema>;

/**
 * Schema for updating an existing capability vertical / service
 */
export const UpdateCapabilitySchema = z.object({
  titleAr: z.string().min(3).optional(),
  titleEn: z.string().min(3).optional(),
  shortDescAr: z.string().min(5).optional(),
  shortDescEn: z.string().min(5).optional(),
  fullDescAr: z.string().min(10).optional(),
  fullDescEn: z.string().min(10).optional(),
  iconName: z.string().min(1).optional(),
  imageUrl: z.string().optional(),
  subServicesAr: z.array(z.string().min(1)).optional(),
  subServicesEn: z.array(z.string().min(1)).optional(),
  equipmentDeployed: z.array(z.string().min(1)).optional(),
  standards: z.array(z.string().min(1)).optional(),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export type UpdateCapabilityInput = z.infer<typeof UpdateCapabilitySchema>;

/**
 * Schema for reordering capability verticals
 */
export const ReorderCapabilitiesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1, "Capability ID is required"),
        displayOrder: z.number().int()
      })
    )
    .min(1, "At least one item required")
});

export type ReorderCapabilitiesInput = z.infer<typeof ReorderCapabilitiesSchema>;
