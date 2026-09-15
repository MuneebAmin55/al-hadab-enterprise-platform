import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { CompanyController } from "../controllers/company.controller";
import { ProjectsController } from "../controllers/projects.controller";
import { CapabilitiesController } from "../controllers/capabilities.controller";
import { InquiriesController } from "../controllers/inquiries.controller";
import { PrequalController } from "../controllers/prequal.controller";
import { VendorsController } from "../controllers/vendors.controller";
import { ClientsController } from "../controllers/clients.controller";
import { WorkforceController } from "../controllers/workforce.controller";
import { NewsController } from "../controllers/news.controller";
import { CareersController } from "../controllers/careers.controller";
import { DashboardController } from "../controllers/dashboard.controller";
import { UsersController } from "../controllers/users.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

export const apiRouter = Router();

// 1. Corporate Identity & Client Routes
apiRouter.get("/company/profile", CompanyController.getProfile);
apiRouter.patch("/company/profile", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CompanyController.updateProfile);

// Clients Routes
apiRouter.get("/company/clients", ClientsController.list);
apiRouter.get("/clients", ClientsController.list);
apiRouter.get("/clients/admin", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.getAdminList);
apiRouter.get("/clients/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.getById);
apiRouter.post("/clients", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.create);
apiRouter.patch("/clients/reorder", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.reorder);
apiRouter.patch("/clients/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.update);
apiRouter.delete("/clients/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.delete);
apiRouter.patch("/clients/:id/toggle-active", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.toggleActive);
apiRouter.patch("/clients/:id/toggle-featured", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ClientsController.toggleFeatured);

// 2. Authentication Routes
apiRouter.post("/auth/login", AuthController.login);
apiRouter.get("/auth/me", requireAuth, AuthController.me);
apiRouter.post("/auth/logout", AuthController.logout);

// 3. Projects Showcase & Management Routes
apiRouter.get("/projects", ProjectsController.list);
apiRouter.get("/projects/admin", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.getAdminList);
apiRouter.get("/projects/id/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.getById);
apiRouter.get("/projects/:slug", ProjectsController.getBySlug);
apiRouter.post("/projects", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.create);
apiRouter.patch("/projects/reorder", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.reorder);
apiRouter.patch("/projects/:id/publish", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.togglePublish);
apiRouter.patch("/projects/:id/featured", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.toggleFeatured);
apiRouter.patch("/projects/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.update);
apiRouter.delete("/projects/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), ProjectsController.delete);

// 4. Capability Verticals Routes
apiRouter.get("/capabilities", CapabilitiesController.list);
apiRouter.get("/capabilities/admin", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.getAdminList);
apiRouter.get("/capabilities/:id", CapabilitiesController.getById);
apiRouter.post("/capabilities", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.create);
apiRouter.patch("/capabilities/reorder", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.reorder);
apiRouter.patch("/capabilities/:id/toggle-active", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.toggleActive);
apiRouter.patch("/capabilities/:id/toggle-featured", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.toggleFeatured);
apiRouter.patch("/capabilities/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.update);
apiRouter.delete("/capabilities/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CapabilitiesController.delete);

// 5. Scoped Inquiries & Lead Ingestion
apiRouter.post("/inquiries", InquiriesController.submit);
apiRouter.get("/inquiries", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.list);
apiRouter.get("/inquiries/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.getById);
apiRouter.patch("/inquiries/:id/status", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.updateStatus);
apiRouter.patch("/inquiries/:id/notes", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.updateNotes);
apiRouter.patch("/inquiries/:id/read", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.toggleRead);
apiRouter.patch("/inquiries/:id/archive", requireAuth, requireRole(["SUPERADMIN", "EDITOR", "ESTIMATOR"]), InquiriesController.archive);
apiRouter.delete("/inquiries/:id", requireAuth, requireRole(["SUPERADMIN"]), InquiriesController.deleteInquiry);

// 6. Instant Prequalification Vault
apiRouter.post("/prequal/request", PrequalController.requestPack);

// 7. Subcontractor & Vendor Hub
apiRouter.post("/vendors/register", VendorsController.register);
apiRouter.get("/vendors/check-cr/:cr", VendorsController.checkCr);
apiRouter.get("/vendors", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), VendorsController.list);
apiRouter.patch("/vendors/:id/status", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), VendorsController.updateStatus);

// 8. Human Capital & Workforce Management
apiRouter.get("/workforce", WorkforceController.getPublicWorkforce);
apiRouter.get("/workforce/admin", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.getAdminWorkforce);
apiRouter.post("/workforce", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.createCategory);
apiRouter.patch("/workforce/reorder", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.reorderCategories);
apiRouter.patch("/workforce/counts", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.updateEmployeeCounts);
apiRouter.patch("/workforce/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.updateCategory);
apiRouter.delete("/workforce/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), WorkforceController.deleteCategory);

// 9. Corporate News & Media Center
apiRouter.get("/news", NewsController.list);
apiRouter.get("/news/admin", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.getAdminList);
apiRouter.get("/news/id/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.getById);
apiRouter.get("/news/:slug", NewsController.getBySlug);
apiRouter.post("/news", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.create);
apiRouter.patch("/news/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.update);
apiRouter.delete("/news/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.delete);
apiRouter.patch("/news/:id/toggle-publish", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.togglePublish);
apiRouter.patch("/news/:id/toggle-featured", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), NewsController.toggleFeatured);

// 10. Careers & Recruitment Hub
apiRouter.get("/careers/jobs", CareersController.listPublicJobs);
apiRouter.get("/careers/jobs/:id", CareersController.getPublicJob);
apiRouter.post("/careers/apply", CareersController.submitApplication);

// Careers Admin Endpoints
apiRouter.get("/careers/admin/jobs", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.listAdminJobs);
apiRouter.post("/careers/admin/jobs", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.createAdminJob);
apiRouter.get("/careers/admin/jobs/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.getAdminJob);
apiRouter.patch("/careers/admin/jobs/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.updateAdminJob);
apiRouter.delete("/careers/admin/jobs/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.deleteAdminJob);
apiRouter.patch("/careers/admin/jobs/:id/toggle-publish", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.togglePublishAdminJob);

// Applications Admin Endpoints
apiRouter.get("/careers/admin/applications", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.listAdminApplications);
apiRouter.get("/careers/admin/applications/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.getAdminApplication);
apiRouter.patch("/careers/admin/applications/:id/status", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.updateApplicationStatus);
apiRouter.patch("/careers/admin/applications/:id/notes", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.updateApplicationNotes);
apiRouter.delete("/careers/admin/applications/:id", requireAuth, requireRole(["SUPERADMIN", "EDITOR"]), CareersController.deleteApplication);

// 11. Dashboard Overview Aggregations
apiRouter.get("/admin/overview-stats", requireAuth, DashboardController.getOverviewStats);

// 12. Admin Users & Roles Governance (SUPERADMIN Only)
apiRouter.get("/users", requireAuth, requireRole(["SUPERADMIN"]), UsersController.list);
apiRouter.post("/users", requireAuth, requireRole(["SUPERADMIN"]), UsersController.create);
apiRouter.patch("/users/:id", requireAuth, requireRole(["SUPERADMIN"]), UsersController.update);
apiRouter.delete("/users/:id", requireAuth, requireRole(["SUPERADMIN"]), UsersController.delete);
