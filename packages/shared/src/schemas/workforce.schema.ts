import { z } from "zod";

/**
 * Schema for creating a new workforce category
 */
export const CreateWorkforceCategorySchema = z.object({
  nameEn: z.string().min(2, "English category name must be at least 2 characters"),
  nameAr: z.string().min(2, "Arabic category name must be at least 2 characters"),
  employeeCount: z.number().int().min(0, "Employee count must be 0 or greater"),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true)
});

export type CreateWorkforceCategoryInput = z.infer<typeof CreateWorkforceCategorySchema>;

/**
 * Schema for updating an existing workforce category
 */
export const UpdateWorkforceCategorySchema = z.object({
  nameEn: z.string().min(2, "English category name must be at least 2 characters").optional(),
  nameAr: z.string().min(2, "Arabic category name must be at least 2 characters").optional(),
  employeeCount: z.number().int().min(0, "Employee count must be 0 or greater").optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export type UpdateWorkforceCategoryInput = z.infer<typeof UpdateWorkforceCategorySchema>;

/**
 * Schema for reordering workforce categories
 */
export const ReorderWorkforceCategoriesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "Category ID is required"),
      displayOrder: z.number().int()
    })
  ).min(1, "At least one category order must be provided")
});

export type ReorderWorkforceCategoriesInput = z.infer<typeof ReorderWorkforceCategoriesSchema>;

/**
 * Schema for updating employee counts (single or batch)
 */
export const UpdateEmployeeCountsSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1, "Category ID is required"),
      employeeCount: z.number().int().min(0, "Employee count must be 0 or greater")
    })
  ).min(1, "At least one count update must be provided")
});

export type UpdateEmployeeCountsInput = z.infer<typeof UpdateEmployeeCountsSchema>;
