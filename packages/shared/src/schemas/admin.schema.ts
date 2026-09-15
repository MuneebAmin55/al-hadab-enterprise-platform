import { z } from "zod";

export const AdminRoleEnum = z.enum(["SUPERADMIN", "EDITOR", "ESTIMATOR", "AUDITOR"]);
export type AdminRole = z.infer<typeof AdminRoleEnum>;

export interface AdminUserEntity {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export const CreateAdminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: AdminRoleEnum.default("EDITOR"),
  isActive: z.boolean().default(true)
});

export type CreateAdminUserInput = z.infer<typeof CreateAdminUserSchema>;

export const UpdateAdminUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  role: AdminRoleEnum.optional(),
  isActive: z.boolean().optional()
});

export type UpdateAdminUserInput = z.infer<typeof UpdateAdminUserSchema>;

export interface AdminOverviewStats {
  projects: {
    total: number;
    published: number;
    drafts: number;
    featured: number;
  };
  capabilities: {
    total: number;
    active: number;
  };
  clients: {
    total: number;
    active: number;
    featured: number;
  };
  workforce: {
    totalEmployees: number;
    totalCategories: number;
  };
  news: {
    total: number;
    published: number;
    drafts: number;
  };
  inquiries: {
    total: number;
    new: number;
    inProgress: number;
    unread: number;
    completed: number;
    archived: number;
  };
  jobOpenings: {
    total: number;
    published: number;
    drafts: number;
  };
  jobApplications: {
    total: number;
    new: number;
    reviewing: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
  };
  vendors: {
    total: number;
    pending: number;
    approved: number;
  };
  users?: {
    total: number;
    active: number;
  };
  recentInquiries: Array<{
    id: string;
    trackingCode: string;
    organizationName: string;
    contactPerson: string;
    intentType: string;
    workflowStatus: string;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: string;
    applicantName: string;
    jobTitleAr: string;
    jobTitleEn: string;
    status: string;
    createdAt: string;
  }>;
}
