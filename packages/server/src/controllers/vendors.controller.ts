import { Request, Response, NextFunction } from "express";
import { VendorRegistrationSchema } from "@alhadab/shared";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";
import { EmailService } from "../services/email.service";

export class VendorsController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = VendorRegistrationSchema.parse(req.body);

      // Check for duplicate CR
      const existingVendor = await prisma.vendorRegistration.findUnique({
        where: { crNumber: validated.crNumber }
      });

      if (existingVendor) {
        throw new AppError(
          "A vendor registration is already on file for this Commercial Registration (CR) number.",
          409,
          "VENDOR_ALREADY_EXISTS"
        );
      }

      const trackingId = `VEN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const vendor = await prisma.vendorRegistration.create({
        data: {
          trackingId,
          companyNameAr: validated.companyNameAr,
          companyNameEn: validated.companyNameEn,
          crNumber: validated.crNumber,
          vatNumber: validated.vatNumber,
          gosiNumber: validated.gosiRegistrationNumber,
          nitaqatRating: validated.nitaqatRating,
          headOfficeCity: validated.headOfficeCity,
          signatoryName: validated.authorizedSignatoryName,
          authorizedMobile: validated.authorizedMobile,
          officialEmail: validated.officialEmail.toLowerCase(),
          tradeSpecialties: JSON.stringify(validated.tradeSpecialties),
          ibanNumber: validated.ibanNumber,
          reviewStatus: "PENDING"
        }
      });

      // Send confirmation email
      await EmailService.sendVendorAcknowledgment({
        trackingId,
        recipientEmail: validated.officialEmail,
        companyNameAr: validated.companyNameAr,
        crNumber: validated.crNumber
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          trackingId: vendor.trackingId,
          crNumber: vendor.crNumber,
          status: vendor.reviewStatus,
          messageAr: "تم استلام ملف التأهيل بنجاح وسيتم تدقيق المستندات من قبل لجنة المشتريات خلال 5 أيام عمل.",
          messageEn: "Your vendor prequalification has been submitted. The Procurement Committee will review documents within 5 business days."
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkCr(req: Request, res: Response, next: NextFunction) {
    try {
      const { cr } = req.params;

      const existing = await prisma.vendorRegistration.findUnique({
        where: { crNumber: cr },
        select: { trackingId: true, companyNameAr: true, reviewStatus: true, createdAt: true }
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          exists: !!existing,
          vendor: existing || null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await prisma.vendorRegistration.findMany({
        orderBy: { createdAt: "desc" }
      });

      const formatted = vendors.map((v: any) => ({
        id: v.id,
        trackingId: v.trackingId,
        companyNameAr: v.companyNameAr,
        companyNameEn: v.companyNameEn,
        crNumber: v.crNumber,
        vatNumber: v.vatNumber,
        gosiNumber: v.gosiNumber,
        nitaqatRating: v.nitaqatRating,
        headOfficeCity: v.headOfficeCity,
        signatoryName: v.signatoryName,
        authorizedMobile: v.authorizedMobile,
        officialEmail: v.officialEmail,
        tradeSpecialties: JSON.parse(v.tradeSpecialties || "[]"),
        ibanNumber: v.ibanNumber,
        reviewStatus: v.reviewStatus,
        createdAt: v.createdAt
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
      const { status } = req.body;

      const updated = await prisma.vendorRegistration.update({
        where: { id },
        data: {
          reviewStatus: status
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
