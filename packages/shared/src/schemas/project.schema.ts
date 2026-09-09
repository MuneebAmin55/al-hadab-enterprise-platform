import { z } from "zod";

export const ProjectQueryFilterSchema = z.object({
  vertical: z.string().optional(),
  clientCategory: z.enum(["MINISTRY", "AMANAT", "PIF_GIGA", "SEMI_GOV", "AUTHORITY", "PRIVATE"]).optional(),
  region: z.enum(["CENTRAL", "WESTERN", "EASTERN", "SOUTHERN", "NORTHERN"]).optional(),
  status: z.enum(["ACTIVE_EXECUTION", "COMPLETED"]).optional(),
  searchQuery: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12)
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
  clientNameAr: string;
  clientNameEn: string;
  verticalId: string;
  verticalTitleAr: string;
  verticalTitleEn: string;
  region: "CENTRAL" | "WESTERN" | "EASTERN" | "SOUTHERN" | "NORTHERN";
  cityAr: string;
  cityEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  executionStatus: "ACTIVE_EXECUTION" | "COMPLETED";
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
}
