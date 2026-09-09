import { Request, Response, NextFunction } from "express";
import { ScopedInquirySchema } from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { EmailService } from "../services/email.service";

export class InquiriesController {
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = ScopedInquirySchema.parse(req.body);
      const trackingId = `INQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const submission = await prisma.inquirySubmission.create({
        data: {
          trackingId,
          intentType: validated.intentType,
          fullName: validated.fullName,
          organization: validated.organization,
          email: validated.email.toLowerCase(),
          phone: validated.phone,
          scopedData: JSON.stringify({
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
          }),
          workflowStatus: "NEW"
        }
      });

      // Dispatch asynchronous confirmation email
      await EmailService.sendInquiryConfirmation({
        trackingId,
        recipientEmail: validated.email,
        recipientName: validated.fullName,
        organization: validated.organization,
        intentType: validated.intentType
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          trackingId: submission.trackingId,
          status: submission.workflowStatus,
          messageAr: "تم استلام طلبكم بنجاح وتم إحالته إلى الفريق المختص للمراجعة والرد خلال 24 ساعة عمل.",
          messageEn: "Your submission has been received successfully and routed to the specialized department. You will receive a response within 24 business hours."
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;

      const whereClause: Record<string, unknown> = {};
      if (status && typeof status === "string") {
        whereClause.workflowStatus = status.toUpperCase();
      }

      const submissions = await prisma.inquirySubmission.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" }
      });

      const formatted = submissions.map((s: any) => ({
        id: s.id,
        trackingId: s.trackingId,
        intentType: s.intentType,
        fullName: s.fullName,
        organization: s.organization,
        email: s.email,
        phone: s.phone,
        scopedData: JSON.parse(s.scopedData || "{}"),
        workflowStatus: s.workflowStatus,
        internalNotes: s.internalNotes,
        createdAt: s.createdAt
      }));

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updated = await prisma.inquirySubmission.update({
        where: { id },
        data: {
          workflowStatus: status,
          internalNotes: notes
        }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
