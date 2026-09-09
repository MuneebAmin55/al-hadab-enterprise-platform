import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ProjectsController } from "../controllers/projects.controller";
import { CapabilitiesController } from "../controllers/capabilities.controller";
import { InquiriesController } from "../controllers/inquiries.controller";
import { PrequalController } from "../controllers/prequal.controller";
import { VendorsController } from "../controllers/vendors.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { ALHADAB_CORPORATE_PROFILE, VERIFIED_CLIENTS } from "@alhadab/shared";

export const apiRouter = Router();

// 1. Corporate Identity & Client Routes
apiRouter.get("/company/profile", (req, res) => {
  res.json({ success: true, statusCode: 200, data: ALHADAB_CORPORATE_PROFILE });
});

apiRouter.get("/company/clients", (req, res) => {
  res.json({ success: true, statusCode: 200, data: VERIFIED_CLIENTS });
});

// 2. Authentication Routes
apiRouter.post("/auth/login", AuthController.login);
apiRouter.get("/auth/me", requireAuth, AuthController.me);
apiRouter.post("/auth/logout", AuthController.logout);

// 3. Projects Showcase Routes
apiRouter.get("/projects", ProjectsController.list);
apiRouter.get("/projects/:slug", ProjectsController.getBySlug);

// 4. Capability Verticals Routes
apiRouter.get("/capabilities", CapabilitiesController.list);
apiRouter.get("/capabilities/:id", CapabilitiesController.getById);

// 5. Scoped Inquiries & Lead Ingestion
apiRouter.post("/inquiries", InquiriesController.submit);
apiRouter.get("/inquiries", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.list);
apiRouter.patch("/inquiries/:id/status", requireAuth, requireRole(["SUPERADMIN", "ESTIMATOR"]), InquiriesController.updateStatus);

// 6. Instant Prequalification Vault
apiRouter.post("/prequal/request", PrequalController.requestPack);

// 7. Subcontractor & Vendor Hub
apiRouter.post("/vendors/register", VendorsController.register);
apiRouter.get("/vendors/check-cr/:cr", VendorsController.checkCr);
apiRouter.get("/vendors", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), VendorsController.list);
