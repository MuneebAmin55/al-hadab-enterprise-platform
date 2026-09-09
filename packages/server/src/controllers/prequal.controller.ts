import { Request, Response, NextFunction } from "express";
import { PrequalificationRequestSchema } from "@alhadab/shared";
import { PdfService } from "../services/pdf.service";

export class PrequalController {
  static async requestPack(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = PrequalificationRequestSchema.parse(req.body);

      // Generate watermarked corporate dossier
      const dossier = PdfService.generateWatermarkedPrequalDossier(validated);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          dossier,
          messageAr: `تم إنشاء الملف التأهيلي بنجاح وموسوم رقمياً باسم: ${validated.entityName}`,
          messageEn: `Prequalification dossier generated and cryptographically stamped for: ${validated.entityName}`
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
