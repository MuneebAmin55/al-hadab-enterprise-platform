import { z } from "zod";

export const InquiryIntentEnum = z.enum([
  "GOVERNMENT_TENDER",
  "ENTERPRISE_RFP",
  "SUBCONTRACTOR_ONBOARD",
  "TECHNICAL_RFI",
  "CAREER_APPLICATION"
]);

export type InquiryIntent = z.infer<typeof InquiryIntentEnum>;

export const ScopedInquirySchema = z.object({
  intentType: InquiryIntentEnum,
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  organization: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Invalid official email address"),
  phone: z.string().min(9, "Phone number must be at least 9 digits").regex(/^(\+?966|0)?[5]\d{8}$/, "Must be a valid Saudi mobile number (+966 5X XXX XXXX)"),
  
  // Scoped fields based on intent
  governmentDepartment: z.string().optional(),
  etimadReferenceNumber: z.string().optional(),
  projectEstimatedBudget: z.enum(["BELOW_10M", "10M_50M", "50M_200M", "ABOVE_200M"]).optional(),
  executionTimelineMonths: z.number().int().positive().optional(),
  verticalOfInterest: z.string().optional(),
  
  // Subcontractor specifics
  crNumber: z.string().regex(/^\d{10}$/, "Saudi Commercial Registration must be exactly 10 digits").optional(),
  vatNumber: z.string().regex(/^3\d{13}3$/, "Saudi VAT number must be 15 digits starting and ending with 3").optional(),
  tradeCategory: z.string().optional(),

  // Candidate specifics
  sceAccreditationNumber: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),

  // Free-form scope description
  messageOrScope: z.string().min(10, "Please provide at least 10 characters detailing the project scope or inquiry"),
  consentToPdplPolicy: z.literal(true, {
    errorMap: () => ({ message: "You must consent to the Saudi Personal Data Protection Law (PDPL) policy" })
  })
});

export type ScopedInquiryInput = z.infer<typeof ScopedInquirySchema>;

export const PrequalificationRequestSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  officialEmail: z.string().email("A valid corporate or government email is required"),
  entityName: z.string().min(2, "Entity name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  mobileNumber: z.string().min(9, "Mobile number is required"),
  purposeOfRequest: z.enum([
    "TENDER_PREQUALIFICATION",
    "VENDOR_REGISTRATION",
    "JOINT_VENTURE_EVALUATION",
    "BANK_CREDIT_AUDIT",
    "GOVERNMENT_VERIFICATION"
  ])
});

export type PrequalificationRequestInput = z.infer<typeof PrequalificationRequestSchema>;
