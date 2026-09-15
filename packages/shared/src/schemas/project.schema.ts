import { z } from "zod";

export const ProjectQueryFilterSchema = z.object({
  vertical: z.string().optional(),
  clientCategory: z.enum(["MINISTRY", "AMANAT", "PIF_GIGA", "SEMI_GOV", "AUTHORITY", "PRIVATE"]).optional(),
  region: z.enum(["CENTRAL", "WESTERN", "EASTERN", "SOUTHERN", "NORTHERN"]).optional(),
  status: z.enum(["ACTIVE_EXECUTION", "COMPLETED"]).optional(),
  searchQuery: z.string().optional(),
  isPublished: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),
  isFlagship: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12)
});

export type ProjectQueryFilter = z.infer<typeof ProjectQueryFilterSchema>;

export interface ProjectMetric {
  labelAr: string;
  labelEn: string;
  value: string;
  unitAr: string;
  unitEn: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  clientId: string;
  clientNameAr?: string;
  clientNameEn?: string;
  clientCategory?: string;
  verticalId: string;
  verticalTitleAr?: string;
  verticalTitleEn?: string;
  region: "CENTRAL" | "WESTERN" | "EASTERN" | "SOUTHERN" | "NORTHERN" | string;
  cityAr: string;
  cityEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  executionStatus: "ACTIVE_EXECUTION" | "COMPLETED" | string;
  yearHijri: number;
  yearGregorian: number;
  summaryAr: string;
  summaryEn: string;
  challengeAr: string;
  challengeEn: string;
  solutionAr: string;
  solutionEn: string;
  metrics: ProjectMetric[];
  fleetUnitsDeployed: string[];
  heroImageUrl: string;
  galleryUrls: string[];
  isFlagship: boolean;
  displayOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ProjectMetricSchema = z.object({
  labelAr: z.string().min(1, "Arabic metric label required"),
  labelEn: z.string().min(1, "English metric label required"),
  value: z.string().min(1, "Metric value required"),
  unitAr: z.string().default(""),
  unitEn: z.string().default("")
});

export const CreateProjectSchema = z.object({
  titleAr: z.string().min(2, "Arabic title must be at least 2 characters"),
  titleEn: z.string().min(2, "English title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric and hyphens only").optional(),
  clientId: z.string().min(1, "Client selection is required"),
  verticalId: z.string().min(1, "Capability sector is required"),
  region: z.enum(["CENTRAL", "WESTERN", "EASTERN", "SOUTHERN", "NORTHERN"]),
  cityAr: z.string().min(2, "Arabic city name is required"),
  cityEn: z.string().min(2, "English city name is required"),
  lat: z.number().default(24.7136),
  lng: z.number().default(46.6753),
  executionStatus: z.enum(["ACTIVE_EXECUTION", "COMPLETED"]).default("COMPLETED"),
  yearHijri: z.number().int().min(1390).max(1500).default(1445),
  yearGregorian: z.number().int().min(1970).max(2100).default(2024),
  summaryAr: z.string().min(5, "Arabic summary must be at least 5 characters"),
  summaryEn: z.string().min(5, "English summary must be at least 5 characters"),
  challengeAr: z.string().optional().default(""),
  challengeEn: z.string().optional().default(""),
  solutionAr: z.string().optional().default(""),
  solutionEn: z.string().optional().default(""),
  metrics: z.array(ProjectMetricSchema).optional().default([]),
  fleetUnits: z.array(z.string()).optional().default([]),
  heroImageUrl: z.string().min(1, "Hero image URL is required"),
  galleryUrls: z.array(z.string()).optional().default([]),
  isFlagship: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true)
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = z.object({
  titleAr: z.string().min(2).optional(),
  titleEn: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  clientId: z.string().min(1).optional(),
  verticalId: z.string().min(1).optional(),
  region: z.enum(["CENTRAL", "WESTERN", "EASTERN", "SOUTHERN", "NORTHERN"]).optional(),
  cityAr: z.string().min(2).optional(),
  cityEn: z.string().min(2).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  executionStatus: z.enum(["ACTIVE_EXECUTION", "COMPLETED"]).optional(),
  yearHijri: z.number().int().min(1390).max(1500).optional(),
  yearGregorian: z.number().int().min(1970).max(2100).optional(),
  summaryAr: z.string().min(5).optional(),
  summaryEn: z.string().min(5).optional(),
  challengeAr: z.string().optional(),
  challengeEn: z.string().optional(),
  solutionAr: z.string().optional(),
  solutionEn: z.string().optional(),
  metrics: z.array(ProjectMetricSchema).optional(),
  fleetUnits: z.array(z.string()).optional(),
  heroImageUrl: z.string().min(1).optional(),
  galleryUrls: z.array(z.string()).optional(),
  isFlagship: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export const ReorderProjectsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "Project ID is required"),
      displayOrder: z.number().int()
    })
  ).min(1, "At least one item required")
});

export type ReorderProjectsInput = z.infer<typeof ReorderProjectsSchema>;
