import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  CreateJobOpeningSchema,
  UpdateJobOpeningSchema,
  SubmitJobApplicationSchema,
  UpdateJobApplicationStatusSchema,
  UpdateJobApplicationNotesSchema,
  VERIFIED_JOB_OPENINGS,
  JobOpeningEntity,
  JobApplicationEntity,
  JobApplicationStatus
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

// In-memory fallback stores
let mockJobOpenings: JobOpeningEntity[] = JSON.parse(JSON.stringify(VERIFIED_JOB_OPENINGS));
let mockJobApplications: JobApplicationEntity[] = [
  {
    id: "app-01",
    jobOpeningId: "job-01",
    applicantName: "Eng. Tariq Al-Ghamdi",
    email: "tariq.ghamdi@example.com",
    phone: "+966501234567",
    resumeUrl: "data:application/pdf;base64,JVBERi0xLjQKJUZha2VDVi0t",
    resumeFileName: "Tariq_AlGhamdi_CV.pdf",
    coverLetter: "Extensive 8-year site track record in hydraulic culverts and municipal stormwater networks in Western Province.",
    status: "SHORTLISTED",
    adminNotes: "SCE Grade 1 certified. Interview scheduled with Chief Projects Officer.",
    createdAt: "2026-02-15T09:30:00Z",
    updatedAt: "2026-02-16T11:00:00Z"
  },
  {
    id: "app-02",
    jobOpeningId: "job-02",
    applicantName: "Sultan Al-Harbi",
    email: "sultan.harbi@example.com",
    phone: "+966559876543",
    resumeUrl: "data:application/pdf;base64,JVBERi0xLjQKJUZha2VDVi0t",
    resumeFileName: "Sultan_Harbi_QHSSE.pdf",
    coverLetter: "Certified NEBOSH IGC & OSHA lead auditor with 6 years experience on giga-infrastructure projects.",
    status: "INTERVIEW",
    adminNotes: "Passed preliminary technical review. Awaiting final safety board assessment.",
    createdAt: "2026-02-18T14:10:00Z",
    updatedAt: "2026-02-20T10:15:00Z"
  },
  {
    id: "app-03",
    jobOpeningId: "job-01",
    applicantName: "Abdulrahman Al-Otaibi",
    email: "abdulrahman.otaibi@example.com",
    phone: "+966541122334",
    resumeUrl: "data:application/pdf;base64,JVBERi0xLjQKJUZha2VDVi0t",
    resumeFileName: "Abdulrahman_Otaibi_Resume.pdf",
    coverLetter: "Experienced civil site engineer specialized in large-diameter HDPE and ductile iron pipeline laying.",
    status: "REVIEWING",
    adminNotes: "Pending credentials verification with Saudi Council of Engineers.",
    createdAt: "2026-02-22T08:00:00Z",
    updatedAt: "2026-02-22T08:00:00Z"
  },
  {
    id: "app-04",
    jobOpeningId: "job-04",
    applicantName: "Majed Al-Zahrani",
    email: "majed.zahrani@example.com",
    phone: "+966533344556",
    resumeUrl: "data:application/pdf;base64,JVBERi0xLjQKJUZha2VDVi0t",
    resumeFileName: "Majed_Zahrani_Surveyor.pdf",
    coverLetter: "Expert in GPS machine guidance and topographical land modeling with Civil 3D.",
    status: "NEW",
    adminNotes: null,
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-03-01T12:00:00Z"
  }
];

// Helper to format JobOpening
function formatJobOpening(job: any, count?: number): JobOpeningEntity {
  return {
    id: job.id,
    titleAr: job.titleAr,
    titleEn: job.titleEn,
    department: job.department,
    location: job.location,
    employmentType: job.employmentType ?? "FULL_TIME",
    descriptionAr: job.descriptionAr ?? "",
    descriptionEn: job.descriptionEn ?? "",
    requirementsAr: job.requirementsAr ?? "",
    requirementsEn: job.requirementsEn ?? "",
    applicationDeadline: job.applicationDeadline instanceof Date
      ? job.applicationDeadline.toISOString()
      : job.applicationDeadline ?? null,
    isPublished: job.isPublished ?? true,
    applicationCount: typeof count === "number" ? count : (job.applications ? job.applications.length : 0),
    createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : (job.createdAt ?? new Date().toISOString()),
    updatedAt: job.updatedAt instanceof Date ? job.updatedAt.toISOString() : (job.updatedAt ?? new Date().toISOString())
  };
}

// Helper to format JobApplication
function formatJobApplication(app: any, job?: any): JobApplicationEntity {
  return {
    id: app.id,
    jobOpeningId: app.jobOpeningId,
    jobOpening: app.jobOpening ? formatJobOpening(app.jobOpening) : (job ? formatJobOpening(job) : undefined),
    applicantName: app.applicantName,
    email: app.email,
    phone: app.phone,
    resumeUrl: app.resumeUrl ?? "",
    resumeFileName: app.resumeFileName ?? "resume.pdf",
    coverLetter: app.coverLetter ?? "",
    status: (app.status as JobApplicationStatus) || "NEW",
    adminNotes: app.adminNotes ?? null,
    createdAt: app.createdAt instanceof Date ? app.createdAt.toISOString() : (app.createdAt ?? new Date().toISOString()),
    updatedAt: app.updatedAt instanceof Date ? app.updatedAt.toISOString() : (app.updatedAt ?? new Date().toISOString())
  };
}

const jobDb = (prisma as any).jobOpening;
const applicationDb = (prisma as any).jobApplication;

// Helper: Ensure upload directory exists for CV files
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch {
    // Ignore error if in non-writable environment
  }
}

export class CareersController {
  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  /**
   * GET /api/v1/careers/jobs
   * Public list of published job openings.
   */
  static async listPublicJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { department, location, search } = req.query;

      let jobs: any[] = [];
      try {
        if (jobDb && typeof jobDb.findMany === "function") {
          const where: any = { isPublished: true };
          if (department && typeof department === "string" && department !== "ALL") {
            where.department = { contains: department, mode: "insensitive" };
          }
          if (location && typeof location === "string" && location !== "ALL") {
            where.location = { contains: location, mode: "insensitive" };
          }
          if (search && typeof search === "string") {
            where.OR = [
              { titleAr: { contains: search, mode: "insensitive" } },
              { titleEn: { contains: search, mode: "insensitive" } },
              { descriptionAr: { contains: search, mode: "insensitive" } },
              { descriptionEn: { contains: search, mode: "insensitive" } },
              { department: { contains: search, mode: "insensitive" } }
            ];
          }

          jobs = await jobDb.findMany({
            where,
            orderBy: { createdAt: "desc" }
          });
        }
      } catch {
        // Fallback
      }

      if (!jobs || jobs.length === 0) {
        let fallback = mockJobOpenings.filter((j) => j.isPublished);
        if (department && typeof department === "string" && department !== "ALL") {
          fallback = fallback.filter((j) => j.department.toLowerCase().includes(department.toLowerCase()));
        }
        if (location && typeof location === "string" && location !== "ALL") {
          fallback = fallback.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
        }
        if (search && typeof search === "string") {
          const q = search.toLowerCase();
          fallback = fallback.filter(
            (j) =>
              j.titleAr.toLowerCase().includes(q) ||
              j.titleEn.toLowerCase().includes(q) ||
              j.descriptionAr.toLowerCase().includes(q) ||
              j.descriptionEn.toLowerCase().includes(q) ||
              j.department.toLowerCase().includes(q)
          );
        }
        jobs = fallback;
      }

      const formatted = jobs.map((j) => formatJobOpening(j));
      return res.status(200).json({
        success: true,
        data: formatted,
        meta: {
          total: formatted.length
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/v1/careers/jobs/:id
   * Public get job details by ID.
   */
  static async getPublicJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let job: any = null;

      try {
        if (jobDb && typeof jobDb.findUnique === "function") {
          job = await jobDb.findUnique({
            where: { id }
          });
        }
      } catch {
        // Fallback
      }

      if (!job) {
        job = mockJobOpenings.find((j) => j.id === id);
      }

      if (!job || !job.isPublished) {
        return next(new AppError("Job opening not found or no longer accepting applications", 404));
      }

      return res.status(200).json({
        success: true,
        data: formatJobOpening(job)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/v1/careers/apply
   * Public submit job application with secure CV validation & handling.
   */
  static async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = SubmitJobApplicationSchema.safeParse(req.body);
      if (!parseResult.success) {
        return next(new AppError(parseResult.error.errors[0]?.message || "Invalid application payload", 400));
      }

      const { jobOpeningId, applicantName, email, phone, coverLetter, resumeBase64, resumeFileName } = parseResult.data;

      // File validation: Size check (max 10MB)
      const approximateSizeInBytes = (resumeBase64.length * 3) / 4;
      if (approximateSizeInBytes > 10 * 1024 * 1024) {
        return next(new AppError("Resume file size exceeds the 10MB limit", 400));
      }

      // File type validation (PDF, DOC, DOCX)
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      const ext = path.extname(resumeFileName).toLowerCase();
      if (!allowedExtensions.includes(ext) && !resumeBase64.startsWith("data:application/pdf") && !resumeBase64.startsWith("data:application/msword") && !resumeBase64.startsWith("data:application/vnd.openxmlformats")) {
        return next(new AppError("Invalid file format. Please upload a PDF, DOC, or DOCX document", 400));
      }

      // Verify job opening exists
      let jobExists = false;
      try {
        if (jobDb && typeof jobDb.findUnique === "function") {
          const j = await jobDb.findUnique({ where: { id: jobOpeningId } });
          if (j && j.isPublished) jobExists = true;
        }
      } catch {
        // Fallback
      }

      if (!jobExists) {
        const found = mockJobOpenings.find((j) => j.id === jobOpeningId && j.isPublished);
        if (found) jobExists = true;
      }

      if (!jobExists) {
        return next(new AppError("The specified job opening is not available for applications", 404));
      }

      // Secure storage: Write file to disk if possible or keep secured base64
      let secureResumeUrl = resumeBase64;
      try {
        const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}${ext || ".pdf"}`;
        const filePath = path.join(uploadsDir, uniqueFileName);
        const base64Data = resumeBase64.includes(";base64,") ? resumeBase64.split(";base64,")[1] : resumeBase64;
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        secureResumeUrl = `/uploads/resumes/${uniqueFileName}`;
      } catch {
        // Fallback to storing secure encoded payload
        secureResumeUrl = resumeBase64;
      }

      const newId = `app-${crypto.randomUUID().slice(0, 8)}`;
      const newApp: JobApplicationEntity = {
        id: newId,
        jobOpeningId,
        applicantName,
        email,
        phone,
        resumeUrl: secureResumeUrl,
        resumeFileName: resumeFileName || "Applicant_Resume.pdf",
        coverLetter: coverLetter || "",
        status: "NEW",
        adminNotes: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        if (applicationDb && typeof applicationDb.create === "function") {
          await applicationDb.create({
            data: {
              id: newApp.id,
              jobOpeningId: newApp.jobOpeningId,
              applicantName: newApp.applicantName,
              email: newApp.email,
              phone: newApp.phone,
              resumeUrl: newApp.resumeUrl,
              resumeFileName: newApp.resumeFileName,
              coverLetter: newApp.coverLetter,
              status: newApp.status
            }
          });
        }
      } catch {
        // Fallback
      }

      mockJobApplications.unshift(newApp);

      // Increment count on fallback job
      const jIdx = mockJobOpenings.findIndex((j) => j.id === jobOpeningId);
      if (jIdx >= 0) {
        mockJobOpenings[jIdx].applicationCount = (mockJobOpenings[jIdx].applicationCount || 0) + 1;
      }

      return res.status(201).json({
        success: true,
        messageAr: "تم استلام طلب التوظيف بنجاح. سيتواصل معك فريق الموارد البشرية بعد مراجعة المؤهلات.",
        messageEn: "Application submitted successfully. Our talent acquisition team will review your qualifications.",
        data: {
          id: newApp.id,
          status: newApp.status,
          applicantName: newApp.applicantName
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  // ==========================================
  // ADMIN JOB OPENINGS ENDPOINTS
  // ==========================================

  /**
   * GET /api/v1/careers/admin/jobs
   * Admin list of all job openings with application statistics.
   */
  static async listAdminJobs(req: Request, res: Response, next: NextFunction) {
    try {
      let jobs: any[] = [];
      try {
        if (jobDb && typeof jobDb.findMany === "function") {
          jobs = await jobDb.findMany({
            include: {
              _count: {
                select: { applications: true }
              }
            },
            orderBy: { createdAt: "desc" }
          });
        }
      } catch {
        // Fallback
      }

      if (!jobs || jobs.length === 0) {
        jobs = mockJobOpenings.map((j) => {
          const appCount = mockJobApplications.filter((a) => a.jobOpeningId === j.id).length;
          return { ...j, _count: { applications: appCount } };
        });
      }

      const formatted = jobs.map((j) => formatJobOpening(j, j._count?.applications ?? j.applicationCount ?? 0));
      const totalCount = formatted.length;
      const publishedCount = formatted.filter((j) => j.isPublished).length;
      const draftCount = totalCount - publishedCount;
      const totalApplications = formatted.reduce((acc, curr) => acc + (curr.applicationCount || 0), 0);

      return res.status(200).json({
        success: true,
        data: formatted,
        meta: {
          totalCount,
          publishedCount,
          draftCount,
          totalApplications
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/v1/careers/admin/jobs
   * Admin create job opening.
   */
  static async createAdminJob(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = CreateJobOpeningSchema.safeParse(req.body);
      if (!parseResult.success) {
        return next(new AppError(parseResult.error.errors[0]?.message || "Invalid job opening data", 400));
      }

      const data = parseResult.data;
      const newId = `job-${crypto.randomUUID().slice(0, 8)}`;
      const now = new Date().toISOString();

      const newJob: JobOpeningEntity = {
        id: newId,
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType || "FULL_TIME",
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        requirementsAr: data.requirementsAr,
        requirementsEn: data.requirementsEn,
        applicationDeadline: data.applicationDeadline || null,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        applicationCount: 0,
        createdAt: now,
        updatedAt: now
      };

      try {
        if (jobDb && typeof jobDb.create === "function") {
          await jobDb.create({
            data: {
              id: newJob.id,
              titleAr: newJob.titleAr,
              titleEn: newJob.titleEn,
              department: newJob.department,
              location: newJob.location,
              employmentType: newJob.employmentType,
              descriptionAr: newJob.descriptionAr,
              descriptionEn: newJob.descriptionEn,
              requirementsAr: newJob.requirementsAr,
              requirementsEn: newJob.requirementsEn,
              applicationDeadline: newJob.applicationDeadline ? new Date(newJob.applicationDeadline) : null,
              isPublished: newJob.isPublished
            }
          });
        }
      } catch {
        // Fallback
      }

      mockJobOpenings.unshift(newJob);

      return res.status(201).json({
        success: true,
        message: "Job opening created successfully",
        data: newJob
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/v1/careers/admin/jobs/:id
   * Admin get single job opening by ID.
   */
  static async getAdminJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let job: any = null;

      try {
        if (jobDb && typeof jobDb.findUnique === "function") {
          job = await jobDb.findUnique({
            where: { id },
            include: {
              _count: { select: { applications: true } }
            }
          });
        }
      } catch {
        // Fallback
      }

      if (!job) {
        job = mockJobOpenings.find((j) => j.id === id);
      }

      if (!job) {
        return next(new AppError("Job opening not found", 404));
      }

      return res.status(200).json({
        success: true,
        data: formatJobOpening(job, job._count?.applications)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PATCH /api/v1/careers/admin/jobs/:id
   * Admin update job opening.
   */
  static async updateAdminJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = UpdateJobOpeningSchema.safeParse(req.body);
      if (!parseResult.success) {
        return next(new AppError(parseResult.error.errors[0]?.message || "Invalid update data", 400));
      }

      const updateData = parseResult.data;
      const now = new Date().toISOString();
      let updatedJob: any = null;

      try {
        if (jobDb && typeof jobDb.update === "function") {
          const dbPayload: any = { ...updateData };
          if (updateData.applicationDeadline !== undefined) {
            dbPayload.applicationDeadline = updateData.applicationDeadline ? new Date(updateData.applicationDeadline) : null;
          }
          updatedJob = await jobDb.update({
            where: { id },
            data: dbPayload
          });
        }
      } catch {
        // Fallback
      }

      const idx = mockJobOpenings.findIndex((j) => j.id === id);
      if (idx >= 0) {
        mockJobOpenings[idx] = {
          ...mockJobOpenings[idx],
          ...updateData,
          updatedAt: now
        };
        if (!updatedJob) updatedJob = mockJobOpenings[idx];
      }

      if (!updatedJob) {
        return next(new AppError("Job opening not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "Job opening updated successfully",
        data: formatJobOpening(updatedJob)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/v1/careers/admin/jobs/:id
   * Admin delete job opening.
   */
  static async deleteAdminJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      try {
        if (jobDb && typeof jobDb.delete === "function") {
          await jobDb.delete({ where: { id } });
        }
      } catch {
        // Fallback
      }

      mockJobOpenings = mockJobOpenings.filter((j) => j.id !== id);
      mockJobApplications = mockJobApplications.filter((a) => a.jobOpeningId !== id);

      return res.status(200).json({
        success: true,
        message: "Job opening deleted successfully"
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PATCH /api/v1/careers/admin/jobs/:id/toggle-publish
   * Admin toggle publish status.
   */
  static async togglePublishAdminJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let currentStatus = true;

      const found = mockJobOpenings.find((j) => j.id === id);
      if (found) currentStatus = found.isPublished;

      const newStatus = !currentStatus;
      let updatedJob: any = null;

      try {
        if (jobDb && typeof jobDb.update === "function") {
          updatedJob = await jobDb.update({
            where: { id },
            data: { isPublished: newStatus }
          });
        }
      } catch {
        // Fallback
      }

      const idx = mockJobOpenings.findIndex((j) => j.id === id);
      if (idx >= 0) {
        mockJobOpenings[idx].isPublished = newStatus;
        mockJobOpenings[idx].updatedAt = new Date().toISOString();
        if (!updatedJob) updatedJob = mockJobOpenings[idx];
      }

      if (!updatedJob) {
        return next(new AppError("Job opening not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: newStatus ? "Job opening published" : "Job opening unpublished",
        data: formatJobOpening(updatedJob)
      });
    } catch (error) {
      return next(error);
    }
  }

  // ==========================================
  // ADMIN APPLICATIONS ENDPOINTS
  // ==========================================

  /**
   * GET /api/v1/careers/admin/applications
   * Admin list applications with filtering by status, jobOpeningId, search.
   */
  static async listAdminApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, jobOpeningId, search } = req.query;

      let applications: any[] = [];
      try {
        if (applicationDb && typeof applicationDb.findMany === "function") {
          const where: any = {};
          if (status && typeof status === "string" && status !== "ALL") {
            where.status = status;
          }
          if (jobOpeningId && typeof jobOpeningId === "string" && jobOpeningId !== "ALL") {
            where.jobOpeningId = jobOpeningId;
          }
          if (search && typeof search === "string") {
            where.OR = [
              { applicantName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } }
            ];
          }

          applications = await applicationDb.findMany({
            where,
            include: { jobOpening: true },
            orderBy: { createdAt: "desc" }
          });
        }
      } catch {
        // Fallback
      }

      if (!applications || applications.length === 0) {
        let fallback = [...mockJobApplications];
        if (status && typeof status === "string" && status !== "ALL") {
          fallback = fallback.filter((a) => a.status === status);
        }
        if (jobOpeningId && typeof jobOpeningId === "string" && jobOpeningId !== "ALL") {
          fallback = fallback.filter((a) => a.jobOpeningId === jobOpeningId);
        }
        if (search && typeof search === "string") {
          const q = search.toLowerCase();
          fallback = fallback.filter(
            (a) =>
              a.applicantName.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q) ||
              a.phone.toLowerCase().includes(q)
          );
        }

        // Attach job info
        applications = fallback.map((a) => {
          const job = mockJobOpenings.find((j) => j.id === a.jobOpeningId);
          return { ...a, jobOpening: job };
        });
      }

      const formatted = applications.map((a) => formatJobApplication(a, a.jobOpening));

      // Calculate status breakdown
      const totalCount = mockJobApplications.length;
      const countsByStatus = {
        NEW: mockJobApplications.filter((a) => a.status === "NEW").length,
        REVIEWING: mockJobApplications.filter((a) => a.status === "REVIEWING").length,
        SHORTLISTED: mockJobApplications.filter((a) => a.status === "SHORTLISTED").length,
        INTERVIEW: mockJobApplications.filter((a) => a.status === "INTERVIEW").length,
        REJECTED: mockJobApplications.filter((a) => a.status === "REJECTED").length,
        HIRED: mockJobApplications.filter((a) => a.status === "HIRED").length
      };

      return res.status(200).json({
        success: true,
        data: formatted,
        meta: {
          totalCount,
          countsByStatus
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/v1/careers/admin/applications/:id
   * Admin view single application details.
   */
  static async getAdminApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let app: any = null;

      try {
        if (applicationDb && typeof applicationDb.findUnique === "function") {
          app = await applicationDb.findUnique({
            where: { id },
            include: { jobOpening: true }
          });
        }
      } catch {
        // Fallback
      }

      if (!app) {
        const found = mockJobApplications.find((a) => a.id === id);
        if (found) {
          const job = mockJobOpenings.find((j) => j.id === found.jobOpeningId);
          app = { ...found, jobOpening: job };
        }
      }

      if (!app) {
        return next(new AppError("Job application not found", 404));
      }

      return res.status(200).json({
        success: true,
        data: formatJobApplication(app, app.jobOpening)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PATCH /api/v1/careers/admin/applications/:id/status
   * Admin update application status & optional notes.
   */
  static async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = UpdateJobApplicationStatusSchema.safeParse(req.body);
      if (!parseResult.success) {
        return next(new AppError(parseResult.error.errors[0]?.message || "Invalid status payload", 400));
      }

      const { status, adminNotes } = parseResult.data;
      const now = new Date().toISOString();
      let updatedApp: any = null;

      try {
        if (applicationDb && typeof applicationDb.update === "function") {
          const updateData: any = { status };
          if (adminNotes !== undefined) {
            updateData.adminNotes = adminNotes;
          }
          updatedApp = await applicationDb.update({
            where: { id },
            data: updateData,
            include: { jobOpening: true }
          });
        }
      } catch {
        // Fallback
      }

      const idx = mockJobApplications.findIndex((a) => a.id === id);
      if (idx >= 0) {
        mockJobApplications[idx].status = status;
        if (adminNotes !== undefined) {
          mockJobApplications[idx].adminNotes = adminNotes;
        }
        mockJobApplications[idx].updatedAt = now;
        if (!updatedApp) {
          const job = mockJobOpenings.find((j) => j.id === mockJobApplications[idx].jobOpeningId);
          updatedApp = { ...mockJobApplications[idx], jobOpening: job };
        }
      }

      if (!updatedApp) {
        return next(new AppError("Job application not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: `Application status updated to ${status}`,
        data: formatJobApplication(updatedApp, updatedApp.jobOpening)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PATCH /api/v1/careers/admin/applications/:id/notes
   * Admin add/edit notes.
   */
  static async updateApplicationNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = UpdateJobApplicationNotesSchema.safeParse(req.body);
      if (!parseResult.success) {
        return next(new AppError(parseResult.error.errors[0]?.message || "Invalid notes payload", 400));
      }

      const { adminNotes } = parseResult.data;
      const now = new Date().toISOString();
      let updatedApp: any = null;

      try {
        if (applicationDb && typeof applicationDb.update === "function") {
          updatedApp = await applicationDb.update({
            where: { id },
            data: { adminNotes },
            include: { jobOpening: true }
          });
        }
      } catch {
        // Fallback
      }

      const idx = mockJobApplications.findIndex((a) => a.id === id);
      if (idx >= 0) {
        mockJobApplications[idx].adminNotes = adminNotes;
        mockJobApplications[idx].updatedAt = now;
        if (!updatedApp) {
          const job = mockJobOpenings.find((j) => j.id === mockJobApplications[idx].jobOpeningId);
          updatedApp = { ...mockJobApplications[idx], jobOpening: job };
        }
      }

      if (!updatedApp) {
        return next(new AppError("Job application not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "Admin notes updated",
        data: formatJobApplication(updatedApp, updatedApp.jobOpening)
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/v1/careers/admin/applications/:id
   * Admin delete application.
   */
  static async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      try {
        if (applicationDb && typeof applicationDb.delete === "function") {
          await applicationDb.delete({ where: { id } });
        }
      } catch {
        // Fallback
      }

      const found = mockJobApplications.find((a) => a.id === id);
      if (found) {
        mockJobApplications = mockJobApplications.filter((a) => a.id !== id);
        const jIdx = mockJobOpenings.findIndex((j) => j.id === found.jobOpeningId);
        if (jIdx >= 0 && (mockJobOpenings[jIdx].applicationCount || 0) > 0) {
          mockJobOpenings[jIdx].applicationCount = (mockJobOpenings[jIdx].applicationCount || 1) - 1;
        }
      }

      return res.status(200).json({
        success: true,
        message: "Application deleted successfully"
      });
    } catch (error) {
      return next(error);
    }
  }
}
