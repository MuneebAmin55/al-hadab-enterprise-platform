import { Request, Response, NextFunction } from "express";
import {
  ScopedInquirySchema,
  InquiryEntity,
  InquiryStatus,
  VERIFIED_INQUIRIES,
  UpdateInquiryStatusSchema,
  UpdateInquiryNotesSchema
} from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { EmailService } from "../services/email.service";
import { AppError } from "../middleware/error.middleware";

// In-memory resilient state for zero-downtime development & mock fallback
let mockInquiries: InquiryEntity[] = [...VERIFIED_INQUIRIES];

export class InquiriesController {
  /**
   * Public: Ingest an inquiry/RFP/Tender submission
   */
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = ScopedInquirySchema.parse(req.body);
      const trackingId = `INQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const scopedDataObj = {
        governmentDepartment: validated.governmentDepartment,
        etimadReferenceNumber: validated.etimadReferenceNumber,
        projectEstimatedBudget: validated.projectEstimatedBudget,
        executionTimelineMonths: validated.executionTimelineMonths,
        verticalOfInterest: validated.verticalOfInterest,
        crNumber: validated.crNumber,
        vatNumber: validated.vatNumber,
        tradeCategory: validated.tradeCategory,
        sceAccreditationNumber: validated.sceAccreditationNumber,
        yearsOfExperience: validated.yearsOfExperience,
        messageOrScope: validated.messageOrScope
      };

      let createdInquiry: InquiryEntity;

      try {
        const dbRecord = await (prisma as any).inquirySubmission.create({
          data: {
            trackingId,
            intentType: validated.intentType,
            fullName: validated.fullName,
            organization: validated.organization,
            email: validated.email.toLowerCase(),
            phone: validated.phone,
            scopedData: JSON.stringify(scopedDataObj),
            workflowStatus: "NEW",
            isRead: false
          }
        });

        createdInquiry = {
          id: dbRecord.id,
          trackingId: dbRecord.trackingId,
          intentType: dbRecord.intentType,
          fullName: dbRecord.fullName,
          organization: dbRecord.organization,
          email: dbRecord.email,
          phone: dbRecord.phone,
          scopedData: scopedDataObj,
          workflowStatus: dbRecord.workflowStatus as InquiryStatus,
          internalNotes: dbRecord.internalNotes,
          isRead: dbRecord.isRead ?? false,
          createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString()
        };
      } catch (dbErr) {
        createdInquiry = {
          id: `inq-${Date.now()}`,
          trackingId,
          intentType: validated.intentType,
          fullName: validated.fullName,
          organization: validated.organization,
          email: validated.email.toLowerCase(),
          phone: validated.phone,
          scopedData: scopedDataObj,
          workflowStatus: "NEW",
          isRead: false,
          createdAt: new Date().toISOString()
        };
      }

      mockInquiries.unshift(createdInquiry);

      // Dispatch asynchronous confirmation email (failsafe)
      try {
        await EmailService.sendInquiryConfirmation({
          trackingId,
          recipientEmail: validated.email,
          recipientName: validated.fullName,
          organization: validated.organization,
          intentType: validated.intentType
        });
      } catch (mailErr) {
        console.warn("Notice: Inquiry email dispatch skipped:", mailErr);
      }

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          trackingId: createdInquiry.trackingId,
          status: createdInquiry.workflowStatus,
          messageAr: "تم استلام طلبكم بنجاح وتم إحالته إلى الفريق المختص للمراجعة والرد خلال 24 ساعة عمل.",
          messageEn: "Your submission has been received successfully and routed to the specialized department. You will receive a response within 24 business hours."
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: List inquiries with rich search, status, intent, and date range filters
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, intentType, search, startDate, endDate } = req.query;

      let allInquiries: InquiryEntity[] = [];

      try {
        const dbRecords = await (prisma as any).inquirySubmission.findMany({
          orderBy: { createdAt: "desc" }
        });

        if (dbRecords && dbRecords.length > 0) {
          allInquiries = dbRecords.map((s: any) => ({
            id: s.id,
            trackingId: s.trackingId,
            intentType: s.intentType,
            fullName: s.fullName,
            organization: s.organization,
            email: s.email,
            phone: s.phone,
            scopedData: typeof s.scopedData === "string" ? JSON.parse(s.scopedData || "{}") : s.scopedData,
            workflowStatus: (s.workflowStatus || "NEW") as InquiryStatus,
            internalNotes: s.internalNotes,
            isRead: s.isRead ?? false,
            createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : undefined
          }));
        } else {
          allInquiries = [...mockInquiries];
        }
      } catch (dbErr) {
        allInquiries = [...mockInquiries];
      }

      // Compute global analytics before filtering
      const countsByStatus: Record<string, number> = {
        NEW: 0,
        IN_PROGRESS: 0,
        CONTACTED: 0,
        COMPLETED: 0,
        ARCHIVED: 0
      };
      let unreadCount = 0;

      for (const inq of allInquiries) {
        const st = inq.workflowStatus || "NEW";
        countsByStatus[st] = (countsByStatus[st] || 0) + 1;
        if (!inq.isRead) unreadCount++;
      }

      // Apply Filters
      let filtered = allInquiries;

      // Status filter
      if (status && status !== "ALL") {
        const normalizedStatus = String(status).toUpperCase();
        filtered = filtered.filter((i) => (i.workflowStatus || "NEW").toUpperCase() === normalizedStatus);
      }

      // Intent Type filter
      if (intentType && intentType !== "ALL") {
        const normalizedIntent = String(intentType).toUpperCase();
        filtered = filtered.filter((i) => (i.intentType || "").toUpperCase() === normalizedIntent);
      }

      // Search keyword (trackingId, organization, fullName, email, phone, scope message)
      if (search && typeof search === "string" && search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter((i) => {
          const scopeStr = JSON.stringify(i.scopedData || "").toLowerCase();
          return (
            i.trackingId.toLowerCase().includes(query) ||
            i.organization.toLowerCase().includes(query) ||
            i.fullName.toLowerCase().includes(query) ||
            i.email.toLowerCase().includes(query) ||
            i.phone.toLowerCase().includes(query) ||
            (i.internalNotes && i.internalNotes.toLowerCase().includes(query)) ||
            scopeStr.includes(query)
          );
        });
      }

      // Date range filters
      if (startDate && typeof startDate === "string") {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          filtered = filtered.filter((i) => new Date(i.createdAt) >= start);
        }
      }

      if (endDate && typeof endDate === "string") {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Set to end of day
          end.setHours(23, 59, 59, 999);
          filtered = filtered.filter((i) => new Date(i.createdAt) <= end);
        }
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: filtered,
        meta: {
          totalCount: allInquiries.length,
          filteredCount: filtered.length,
          unreadCount,
          archivedCount: countsByStatus.ARCHIVED || 0,
          countsByStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get single inquiry dossier by ID and mark as read
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      let inquiry: InquiryEntity | null = null;

      try {
        const dbRecord = await (prisma as any).inquirySubmission.findFirst({
          where: {
            OR: [{ id }, { trackingId: id }]
          }
        });

        if (dbRecord) {
          // Automatically mark as read if currently unread
          if (!dbRecord.isRead) {
            await (prisma as any).inquirySubmission.update({
              where: { id: dbRecord.id },
              data: { isRead: true }
            });
            dbRecord.isRead = true;
          }

          inquiry = {
            id: dbRecord.id,
            trackingId: dbRecord.trackingId,
            intentType: dbRecord.intentType,
            fullName: dbRecord.fullName,
            organization: dbRecord.organization,
            email: dbRecord.email,
            phone: dbRecord.phone,
            scopedData: typeof dbRecord.scopedData === "string" ? JSON.parse(dbRecord.scopedData || "{}") : dbRecord.scopedData,
            workflowStatus: dbRecord.workflowStatus as InquiryStatus,
            internalNotes: dbRecord.internalNotes,
            isRead: true,
            createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: dbRecord.updatedAt ? new Date(dbRecord.updatedAt).toISOString() : undefined
          };
        }
      } catch (dbErr) {
        // Fallback to mock
      }

      if (!inquiry) {
        const mockMatch = mockInquiries.find((i) => i.id === id || i.trackingId === id);
        if (mockMatch) {
          mockMatch.isRead = true;
          inquiry = mockMatch;
        }
      }

      if (!inquiry) {
        throw new AppError("Inquiry submission not found", 404);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: inquiry
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update workflow status & optional notes
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateInquiryStatusSchema.parse(req.body);

      let updatedInquiry: InquiryEntity | null = null;

      try {
        const dbRecord = await (prisma as any).inquirySubmission.update({
          where: { id },
          data: {
            workflowStatus: validated.status,
            isRead: true,
            ...(validated.notes !== undefined ? { internalNotes: validated.notes } : {})
          }
        });

        updatedInquiry = {
          id: dbRecord.id,
          trackingId: dbRecord.trackingId,
          intentType: dbRecord.intentType,
          fullName: dbRecord.fullName,
          organization: dbRecord.organization,
          email: dbRecord.email,
          phone: dbRecord.phone,
          scopedData: typeof dbRecord.scopedData === "string" ? JSON.parse(dbRecord.scopedData || "{}") : dbRecord.scopedData,
          workflowStatus: dbRecord.workflowStatus as InquiryStatus,
          internalNotes: dbRecord.internalNotes,
          isRead: true,
          createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (dbErr) {
        // Mock fallback
        const mockIdx = mockInquiries.findIndex((i) => i.id === id || i.trackingId === id);
        if (mockIdx !== -1) {
          mockInquiries[mockIdx].workflowStatus = validated.status;
          mockInquiries[mockIdx].isRead = true;
          if (validated.notes !== undefined) {
            mockInquiries[mockIdx].internalNotes = validated.notes;
          }
          mockInquiries[mockIdx].updatedAt = new Date().toISOString();
          updatedInquiry = mockInquiries[mockIdx];
        }
      }

      if (!updatedInquiry) {
        throw new AppError("Inquiry submission not found", 404);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedInquiry,
        message: "Inquiry workflow status updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update internal notes
   */
  static async updateNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateInquiryNotesSchema.parse(req.body);

      let updatedInquiry: InquiryEntity | null = null;

      try {
        const dbRecord = await (prisma as any).inquirySubmission.update({
          where: { id },
          data: {
            internalNotes: validated.internalNotes
          }
        });

        updatedInquiry = {
          id: dbRecord.id,
          trackingId: dbRecord.trackingId,
          intentType: dbRecord.intentType,
          fullName: dbRecord.fullName,
          organization: dbRecord.organization,
          email: dbRecord.email,
          phone: dbRecord.phone,
          scopedData: typeof dbRecord.scopedData === "string" ? JSON.parse(dbRecord.scopedData || "{}") : dbRecord.scopedData,
          workflowStatus: dbRecord.workflowStatus as InquiryStatus,
          internalNotes: dbRecord.internalNotes,
          isRead: dbRecord.isRead ?? true,
          createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (dbErr) {
        const mockIdx = mockInquiries.findIndex((i) => i.id === id || i.trackingId === id);
        if (mockIdx !== -1) {
          mockInquiries[mockIdx].internalNotes = validated.internalNotes;
          mockInquiries[mockIdx].updatedAt = new Date().toISOString();
          updatedInquiry = mockInquiries[mockIdx];
        }
      }

      if (!updatedInquiry) {
        throw new AppError("Inquiry submission not found", 404);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedInquiry,
        message: "Internal notes saved successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Toggle or set read/unread status
   */
  static async toggleRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isRead: explicitRead } = req.body;

      let updatedInquiry: InquiryEntity | null = null;

      try {
        const current = await (prisma as any).inquirySubmission.findUnique({ where: { id } });
        const targetRead = explicitRead !== undefined ? Boolean(explicitRead) : !current?.isRead;

        const dbRecord = await (prisma as any).inquirySubmission.update({
          where: { id },
          data: { isRead: targetRead }
        });

        updatedInquiry = {
          id: dbRecord.id,
          trackingId: dbRecord.trackingId,
          intentType: dbRecord.intentType,
          fullName: dbRecord.fullName,
          organization: dbRecord.organization,
          email: dbRecord.email,
          phone: dbRecord.phone,
          scopedData: typeof dbRecord.scopedData === "string" ? JSON.parse(dbRecord.scopedData || "{}") : dbRecord.scopedData,
          workflowStatus: dbRecord.workflowStatus as InquiryStatus,
          internalNotes: dbRecord.internalNotes,
          isRead: dbRecord.isRead,
          createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (dbErr) {
        const mockIdx = mockInquiries.findIndex((i) => i.id === id || i.trackingId === id);
        if (mockIdx !== -1) {
          const targetRead = explicitRead !== undefined ? Boolean(explicitRead) : !mockInquiries[mockIdx].isRead;
          mockInquiries[mockIdx].isRead = targetRead;
          mockInquiries[mockIdx].updatedAt = new Date().toISOString();
          updatedInquiry = mockInquiries[mockIdx];
        }
      }

      if (!updatedInquiry) {
        throw new AppError("Inquiry submission not found", 404);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedInquiry,
        message: updatedInquiry.isRead ? "Marked as read" : "Marked as unread"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: One-click archive inquiry
   */
  static async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      let updatedInquiry: InquiryEntity | null = null;

      try {
        const dbRecord = await (prisma as any).inquirySubmission.update({
          where: { id },
          data: { workflowStatus: "ARCHIVED" }
        });

        updatedInquiry = {
          id: dbRecord.id,
          trackingId: dbRecord.trackingId,
          intentType: dbRecord.intentType,
          fullName: dbRecord.fullName,
          organization: dbRecord.organization,
          email: dbRecord.email,
          phone: dbRecord.phone,
          scopedData: typeof dbRecord.scopedData === "string" ? JSON.parse(dbRecord.scopedData || "{}") : dbRecord.scopedData,
          workflowStatus: "ARCHIVED",
          internalNotes: dbRecord.internalNotes,
          isRead: dbRecord.isRead ?? true,
          createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (dbErr) {
        const mockIdx = mockInquiries.findIndex((i) => i.id === id || i.trackingId === id);
        if (mockIdx !== -1) {
          mockInquiries[mockIdx].workflowStatus = "ARCHIVED";
          mockInquiries[mockIdx].updatedAt = new Date().toISOString();
          updatedInquiry = mockInquiries[mockIdx];
        }
      }

      if (!updatedInquiry) {
        throw new AppError("Inquiry submission not found", 404);
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedInquiry,
        message: "Inquiry archived successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Superadmin: Delete inquiry
   */
  static async deleteInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      try {
        await (prisma as any).inquirySubmission.delete({
          where: { id }
        });
      } catch (dbErr) {
        mockInquiries = mockInquiries.filter((i) => i.id !== id && i.trackingId !== id);
      }

      mockInquiries = mockInquiries.filter((i) => i.id !== id && i.trackingId !== id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Inquiry submission deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
