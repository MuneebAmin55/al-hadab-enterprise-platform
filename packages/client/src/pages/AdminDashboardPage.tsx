import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateWorkforceCategorySchema,
  CreateWorkforceCategoryInput,
  WorkforceCategoryEntity,
  CreateProjectSchema,
  CreateProjectInput,
  ProjectCaseStudy,
  ProjectMetric,
  CapabilityVertical,
  CreateCapabilityInput,
  CreateCapabilitySchema,
  ClientEntity,
  CreateClientInput,
  CreateClientSchema,
  NewsArticleEntity,
  CreateNewsArticleInput,
  CreateNewsArticleSchema,
  JobOpeningEntity,
  JobApplicationEntity,
  JobApplicationStatus,
  CreateJobOpeningSchema,
  CreateJobOpeningInput,
  InquiryEntity,
  InquiryStatus
} from "@alhadab/shared";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials, logout } from "../app/authSlice";
import {
  useLoginMutation,
  useGetInquiriesQuery,
  useUpdateInquiryStatusMutation,
  useUpdateInquiryNotesMutation,
  useToggleInquiryReadMutation,
  useArchiveInquiryMutation,
  useDeleteInquiryMutation,
  useGetVendorsQuery,
  useUpdateVendorStatusMutation,
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useGetAdminWorkforceQuery,
  useCreateWorkforceCategoryMutation,
  useUpdateWorkforceCategoryMutation,
  useDeleteWorkforceCategoryMutation,
  useReorderWorkforceCategoriesMutation,
  useUpdateWorkforceCountsMutation,
  useGetAdminProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleProjectPublishMutation,
  useToggleProjectFeaturedMutation,
  useReorderProjectsMutation,
  useGetClientsQuery,
  useGetCapabilitiesQuery,
  useGetAdminCapabilitiesQuery,
  useCreateCapabilityMutation,
  useUpdateCapabilityMutation,
  useDeleteCapabilityMutation,
  useToggleCapabilityActiveMutation,
  useToggleCapabilityFeaturedMutation,
  useReorderCapabilitiesMutation,
  useGetAdminClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useToggleClientActiveMutation,
  useToggleClientFeaturedMutation,
  useReorderClientsMutation,
  useGetAdminNewsListQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useToggleNewsPublishMutation,
  useToggleNewsFeaturedMutation,
  useGetAdminJobOpeningsQuery,
  useCreateJobOpeningMutation,
  useUpdateJobOpeningMutation,
  useDeleteJobOpeningMutation,
  useToggleJobOpeningPublishMutation,
  useGetAdminJobApplicationsQuery,
  useUpdateJobApplicationStatusMutation,
  useUpdateJobApplicationNotesMutation,
  useDeleteJobApplicationMutation,
  useGetAdminUsersQuery
} from "../services/apiSlice";
import { toggleLanguage } from "../app/uiSlice";
import { AdminSidebar, AdminTab } from "../components/admin/AdminSidebar";
import { DashboardOverviewTab } from "../components/admin/DashboardOverviewTab";
import { AdminUsersTab } from "../components/admin/AdminUsersTab";
import { Button, Badge, SEOHead, ModalDialog } from "../components/ui";
import {
  Lock,
  Mail,
  MailOpen,
  MailCheck,
  LogOut,
  FileCheck,
  ShieldCheck,
  Users,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Phone,
  Edit3,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  FileText,
  Save,
  Globe,
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  FolderKanban,
  Star,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Search,
  Newspaper,
  Briefcase,
  UserCheck,
  Download,
  Archive,
  Filter,
  RotateCcw,
  ChevronDown,
  InboxIcon,
  Menu
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector((state) => state.ui);
  const isAr = language === "ar";
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Users query for Superadmin
  const { data: adminUsersData } = useGetAdminUsersQuery(undefined, {
    skip: !isAuthenticated || user?.role !== "SUPERADMIN"
  });

  // Auth Mutations & State
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [loginEmail, setLoginEmail] = useState("admin@alhadab.com.sa");
  const [loginPassword, setLoginPassword] = useState("Alhadab@2026!Secure");
  const [loginError, setLoginError] = useState("");

  // Inquiries — Filters
  const [inqSearch, setInqSearch] = useState("");
  const [inqStatusFilter, setInqStatusFilter] = useState("ALL");
  const [inqIntentFilter, setInqIntentFilter] = useState("ALL");
  const [inqStartDate, setInqStartDate] = useState("");
  const [inqEndDate, setInqEndDate] = useState("");

  // Inquiries Query & Mutations
  const { data: inquiriesResponse, isLoading: isLoadingInquiries, refetch: refetchInquiries } = useGetInquiriesQuery(
    { status: inqStatusFilter, search: inqSearch, intentType: inqIntentFilter, startDate: inqStartDate, endDate: inqEndDate },
    { skip: !isAuthenticated }
  );
  const inquiries = inquiriesResponse?.data ?? [];
  const inquiriesMeta = inquiriesResponse?.meta;

  const [updateInquiryStatus, { isLoading: isUpdatingInquiry }] = useUpdateInquiryStatusMutation();
  const [updateInquiryNotes, { isLoading: isSavingInqNotes }] = useUpdateInquiryNotesMutation();
  const [toggleInquiryRead] = useToggleInquiryReadMutation();
  const [archiveInquiry, { isLoading: isArchivingInquiry }] = useArchiveInquiryMutation();
  const [deleteInquiry, { isLoading: isDeletingInquiry }] = useDeleteInquiryMutation();

  // Vendors Query & Mutation
  const { data: vendors, isLoading: isLoadingVendors } = useGetVendorsQuery(undefined, {
    skip: !isAuthenticated
  });
  const [updateVendorStatus, { isLoading: isUpdatingVendor }] = useUpdateVendorStatusMutation();

  // Company Profile Query & Mutation
  const { data: companyProfile } = useGetCompanyProfileQuery();
  const [updateCompanyProfile, { isLoading: isSavingProfile }] = useUpdateCompanyProfileMutation();
  const [profileSaveMsg, setProfileSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Company Profile Form State — mirrors UpdateCompanyProfileInput flat shape
  const [profileForm, setProfileForm] = useState({
    nameAr: "", nameEn: "",
    legalEntityAr: "", legalEntityEn: "",
    foundingYearHijri: 0, foundingYearGregorian: 0,
    headquartersAr: "", headquartersEn: "",
    addressAr: "", addressEn: "",
    phonePrimary: "", phoneSecondary: "", whatsapp: "",
    emailOfficial: "", emailTenders: "",
    contractorClassification: "", crNumber: "", vatNumber: "",
    statsYearsOfExperience: 0, statsActiveWorkforce: 0,
    statsHeavyEquipmentUnits: 0, statsSafeManHoursLogged: 0,
    statsNationalPartnersCount: 0, statsCompletedProjectsCount: 0,
    shortDescAr: "", shortDescEn: "",
    fullDescAr: "", fullDescEn: "",
    founderMessageAr: "", founderMessageEn: "",
    visionAr: "", visionEn: "",
    missionAr: "", missionEn: "",
    mainImageUrl: "",
    seoTitleAr: "", seoTitleEn: "",
    seoDescAr: "", seoDescEn: "",
    isPublished: true
  });

  // Sync form from fetched profile
  useEffect(() => {
    if (!companyProfile) return;
    setProfileForm({
      nameAr: companyProfile.nameAr ?? "",
      nameEn: companyProfile.nameEn ?? "",
      legalEntityAr: companyProfile.legalEntityAr ?? "",
      legalEntityEn: companyProfile.legalEntityEn ?? "",
      foundingYearHijri: companyProfile.foundingYearHijri ?? 0,
      foundingYearGregorian: companyProfile.foundingYearGregorian ?? 0,
      headquartersAr: companyProfile.headquartersAr ?? "",
      headquartersEn: companyProfile.headquartersEn ?? "",
      addressAr: companyProfile.addressAr ?? "",
      addressEn: companyProfile.addressEn ?? "",
      phonePrimary: companyProfile.phonePrimary ?? "",
      phoneSecondary: companyProfile.phoneSecondary ?? "",
      whatsapp: companyProfile.whatsapp ?? "",
      emailOfficial: companyProfile.emailOfficial ?? "",
      emailTenders: companyProfile.emailTenders ?? "",
      contractorClassification: companyProfile.contractorClassification ?? "",
      crNumber: companyProfile.crNumber ?? "",
      vatNumber: companyProfile.vatNumber ?? "",
      statsYearsOfExperience: companyProfile.stats?.yearsOfExperience ?? 0,
      statsActiveWorkforce: companyProfile.stats?.activeWorkforce ?? 0,
      statsHeavyEquipmentUnits: companyProfile.stats?.heavyEquipmentUnits ?? 0,
      statsSafeManHoursLogged: companyProfile.stats?.safeManHoursLogged ?? 0,
      statsNationalPartnersCount: companyProfile.stats?.nationalPartnersCount ?? 0,
      statsCompletedProjectsCount: companyProfile.stats?.completedProjectsCount ?? 0,
      shortDescAr: companyProfile.shortDescAr ?? "",
      shortDescEn: companyProfile.shortDescEn ?? "",
      fullDescAr: companyProfile.fullDescAr ?? "",
      fullDescEn: companyProfile.fullDescEn ?? "",
      founderMessageAr: companyProfile.founderMessageAr ?? "",
      founderMessageEn: companyProfile.founderMessageEn ?? "",
      visionAr: companyProfile.visionAr ?? "",
      visionEn: companyProfile.visionEn ?? "",
      missionAr: companyProfile.missionAr ?? "",
      missionEn: companyProfile.missionEn ?? "",
      mainImageUrl: companyProfile.mainImageUrl ?? "",
      seoTitleAr: companyProfile.seoTitleAr ?? "",
      seoTitleEn: companyProfile.seoTitleEn ?? "",
      seoDescAr: companyProfile.seoDescAr ?? "",
      seoDescEn: companyProfile.seoDescEn ?? "",
      isPublished: companyProfile.isPublished ?? true
    });
  }, [companyProfile]);

  // Selected Inquiry for Modal
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiryNewStatus, setInquiryNewStatus] = useState<string>("NEW");
  const [inquiryNotes, setInquiryNotes] = useState<string>("");

  // Selected Vendor for Detail Modal
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await login({ email: loginEmail, password: loginPassword }).unwrap();
      dispatch(setCredentials(response));
    } catch (err: any) {
      setLoginError(err?.data?.error?.message || "Login failed. Please check credentials.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const openInquiryModal = (inq: InquiryEntity) => {
    setSelectedInquiry(inq);
    setInquiryNewStatus(inq.workflowStatus || "NEW");
    setInquiryNotes(inq.internalNotes || "");
    // Auto-mark as read when opened
    if (!inq.isRead) {
      toggleInquiryRead({ id: inq.id, isRead: true }).catch(() => {});
    }
  };

  const handleSaveInquiryStatus = async () => {
    if (!selectedInquiry) return;
    try {
      await updateInquiryStatus({
        id: selectedInquiry.id,
        status: inquiryNewStatus
      }).unwrap();
      // Save notes separately if changed
      if (inquiryNotes !== (selectedInquiry.internalNotes || "")) {
        await updateInquiryNotes({ id: selectedInquiry.id, internalNotes: inquiryNotes }).unwrap();
      }
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to update inquiry status");
    }
  };

  const handleArchiveInquiry = async () => {
    if (!selectedInquiry) return;
    if (!confirm(isAr ? "هل تريد أرشفة هذا الطلب؟" : "Archive this inquiry?")) return;
    try {
      await archiveInquiry(selectedInquiry.id).unwrap();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to archive inquiry");
    }
  };

  const handleDeleteInquiry = async () => {
    if (!selectedInquiry) return;
    if (!confirm(isAr ? "هل تريد حذف هذا الطلب نهائياً؟ لا يمكن التراجع." : "Permanently delete this inquiry? This cannot be undone.")) return;
    try {
      await deleteInquiry(selectedInquiry.id).unwrap();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to delete inquiry");
    }
  };

  const handleToggleInquiryRead = async (inq: InquiryEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleInquiryRead({ id: inq.id, isRead: !inq.isRead }).unwrap();
    } catch {}
  };

  const handleVendorStatusChange = async (vendorId: string, status: string) => {
    try {
      await updateVendorStatus({ id: vendorId, status }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to update vendor status");
    }
  };

  const pf = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfileForm((prev) => ({ ...prev, [key]: e.target.value }));

  const pfNum = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMsg(null);
    try {
      await updateCompanyProfile(profileForm).unwrap();
      setProfileSaveMsg({ type: "success", text: isAr ? "تم حفظ ملف الشركة بنجاح." : "Company profile saved successfully." });
    } catch (err: any) {
      setProfileSaveMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "حدث خطأ أثناء الحفظ." : "Save failed. Please try again.")
      });
    }
    setTimeout(() => setProfileSaveMsg(null), 5000);
  };

  // Workforce Management Queries & Mutations
  const { data: workforceData, isLoading: isLoadingWorkforce } = useGetAdminWorkforceQuery(undefined, {
    skip: !isAuthenticated
  });
  const [createWorkforceCategory, { isLoading: isCreatingCat }] = useCreateWorkforceCategoryMutation();
  const [updateWorkforceCategory, { isLoading: isUpdatingCat }] = useUpdateWorkforceCategoryMutation();
  const [deleteWorkforceCategory, { isLoading: isDeletingCat }] = useDeleteWorkforceCategoryMutation();
  const [reorderWorkforceCategories, { isLoading: isReorderingCat }] = useReorderWorkforceCategoriesMutation();
  const [updateWorkforceCounts, { isLoading: isUpdatingCounts }] = useUpdateWorkforceCountsMutation();

  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    category?: WorkforceCategoryEntity | null;
  }>({
    isOpen: false,
    mode: "create",
    category: null
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    category?: WorkforceCategoryEntity | null;
  }>({
    isOpen: false,
    category: null
  });

  const [quickCounts, setQuickCounts] = useState<Record<string, number>>({});
  const [workforceActionMsg, setWorkforceActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // React Hook Form for Category Add/Edit
  const {
    register: registerCat,
    handleSubmit: handleCatSubmit,
    reset: resetCatForm,
    setValue: setCatValue,
    formState: { errors: catErrors, isSubmitting: isSubmittingCat }
  } = useForm<CreateWorkforceCategoryInput>({
    resolver: zodResolver(CreateWorkforceCategorySchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      employeeCount: 0,
      descriptionEn: "",
      descriptionAr: "",
      displayOrder: 0,
      isActive: true
    }
  });

  const openCreateCategoryModal = () => {
    resetCatForm({
      nameEn: "",
      nameAr: "",
      employeeCount: 0,
      descriptionEn: "",
      descriptionAr: "",
      displayOrder: (workforceData?.categories?.length ?? 0) + 1,
      isActive: true
    });
    setCategoryModal({ isOpen: true, mode: "create", category: null });
  };

  const openEditCategoryModal = (cat: WorkforceCategoryEntity) => {
    resetCatForm({
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      employeeCount: cat.employeeCount,
      descriptionEn: cat.descriptionEn ?? "",
      descriptionAr: cat.descriptionAr ?? "",
      displayOrder: cat.displayOrder,
      isActive: cat.isActive
    });
    setCategoryModal({ isOpen: true, mode: "edit", category: cat });
  };

  const onSaveCategory = async (data: CreateWorkforceCategoryInput) => {
    setWorkforceActionMsg(null);
    try {
      if (categoryModal.mode === "create") {
        await createWorkforceCategory(data).unwrap();
        setWorkforceActionMsg({
          type: "success",
          text: isAr ? "تمت إضافة فئة القوى العاملة بنجاح." : "Workforce category created successfully."
        });
      } else if (categoryModal.category) {
        await updateWorkforceCategory({ id: categoryModal.category.id, ...data }).unwrap();
        setWorkforceActionMsg({
          type: "success",
          text: isAr ? "تم تحديث فئة القوى العاملة بنجاح." : "Workforce category updated successfully."
        });
      }
      setCategoryModal({ isOpen: false, mode: "create", category: null });
    } catch (err: any) {
      setWorkforceActionMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "فشل حفظ الفئة." : "Failed to save category.")
      });
    }
    setTimeout(() => setWorkforceActionMsg(null), 5000);
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirmModal.category) return;
    setWorkforceActionMsg(null);
    try {
      await deleteWorkforceCategory(deleteConfirmModal.category.id).unwrap();
      setWorkforceActionMsg({
        type: "success",
        text: isAr ? "تم حذف فئة القوى العاملة بنجاح." : "Workforce category deleted successfully."
      });
      setDeleteConfirmModal({ isOpen: false, category: null });
    } catch (err: any) {
      setWorkforceActionMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "فشل حذف الفئة." : "Failed to delete category.")
      });
    }
    setTimeout(() => setWorkforceActionMsg(null), 5000);
  };

  const handleToggleCategoryActive = async (cat: WorkforceCategoryEntity) => {
    try {
      await updateWorkforceCategory({ id: cat.id, isActive: !cat.isActive }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to toggle status");
    }
  };

  const handleMoveCategory = async (currentIndex: number, direction: "up" | "down") => {
    if (!workforceData?.categories) return;
    const items = [...workforceData.categories];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Swap items
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;

    // Assign sequential display orders
    const reorderPayload = items.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1
    }));

    try {
      await reorderWorkforceCategories({ items: reorderPayload }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to reorder categories");
    }
  };

  const handleQuickCountChange = (id: string, count: number) => {
    setQuickCounts((prev) => ({ ...prev, [id]: Math.max(0, count) }));
  };

  const handleSaveAllCounts = async () => {
    const updates = Object.entries(quickCounts).map(([id, employeeCount]) => ({
      id,
      employeeCount
    }));
    if (updates.length === 0) return;

    setWorkforceActionMsg(null);
    try {
      await updateWorkforceCounts({ updates }).unwrap();
      setQuickCounts({});
      setWorkforceActionMsg({
        type: "success",
        text: isAr ? "تم تحديث أعداد القوى العاملة بنجاح." : "Workforce employee counts saved successfully."
      });
    } catch (err: any) {
      setWorkforceActionMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "فشل حفظ الأعداد." : "Failed to save employee counts.")
      });
    }
  };

  // Clients & Capabilities Query (for Project Form dropdowns)
  const { data: clientsList } = useGetClientsQuery();
  const { data: capabilitiesList } = useGetCapabilitiesQuery();

  // Project Filter States
  const [projectSearch, setProjectSearch] = useState("");
  const [projectVerticalFilter, setProjectVerticalFilter] = useState("");
  const [projectRegionFilter, setProjectRegionFilter] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("");
  const [projectPublishFilter, setProjectPublishFilter] = useState("");

  // Projects Query & Mutations
  const { data: adminProjectsData, isLoading: isLoadingAdminProjects } = useGetAdminProjectsQuery(
    {
      searchQuery: projectSearch || undefined,
      vertical: projectVerticalFilter || undefined,
      region: projectRegionFilter || undefined,
      status: projectStatusFilter || undefined,
      isPublished: projectPublishFilter === "" ? undefined : projectPublishFilter === "true"
    },
    { skip: !isAuthenticated }
  );

  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
  const [togglePublish, { isLoading: isTogglingPublish }] = useToggleProjectPublishMutation();
  const [toggleFeatured, { isLoading: isTogglingFeatured }] = useToggleProjectFeaturedMutation();
  const [reorderProjects, { isLoading: isReorderingProjects }] = useReorderProjectsMutation();

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    project?: ProjectCaseStudy | null;
  }>({
    isOpen: false,
    mode: "create",
    project: null
  });

  const [deleteProjectModal, setDeleteProjectModal] = useState<{
    isOpen: boolean;
    project?: ProjectCaseStudy | null;
  }>({
    isOpen: false,
    project: null
  });

  const [projectActionMsg, setProjectActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // React Hook Form for Project Add / Edit
  const {
    register: registerProj,
    handleSubmit: handleProjSubmit,
    reset: resetProjForm,
    setValue: setProjValue,
    watch: watchProj,
    formState: { errors: projErrors, isSubmitting: isSubmittingProj }
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      titleAr: "",
      titleEn: "",
      slug: "",
      clientId: "",
      verticalId: "",
      region: "CENTRAL",
      cityAr: "الرياض",
      cityEn: "Riyadh",
      lat: 24.7136,
      lng: 46.6753,
      executionStatus: "COMPLETED",
      yearHijri: 1445,
      yearGregorian: 2024,
      summaryAr: "",
      summaryEn: "",
      challengeAr: "",
      challengeEn: "",
      solutionAr: "",
      solutionEn: "",
      heroImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: [],
      metrics: [],
      fleetUnits: [],
      isFlagship: false,
      displayOrder: 0,
      isPublished: true
    }
  });

  const openCreateProjectModal = () => {
    resetProjForm({
      titleAr: "",
      titleEn: "",
      slug: "",
      clientId: clientsList?.[0]?.id || "",
      verticalId: capabilitiesList?.[0]?.id || "",
      region: "CENTRAL",
      cityAr: "الرياض",
      cityEn: "Riyadh",
      lat: 24.7136,
      lng: 46.6753,
      executionStatus: "COMPLETED",
      yearHijri: 1445,
      yearGregorian: 2024,
      summaryAr: "",
      summaryEn: "",
      challengeAr: "",
      challengeEn: "",
      solutionAr: "",
      solutionEn: "",
      heroImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: [],
      metrics: [
        { labelAr: "الطول الإجمالي للشبكة", labelEn: "Total Line Length", value: "45", unitAr: "كم", unitEn: "km" },
        { labelAr: "القدرة الاستيعابية", labelEn: "Design Capacity", value: "120,000", unitAr: "م³/يوم", unitEn: "m³/day" }
      ],
      fleetUnits: ["CAT 349 Excavator", "Vögele Super 2100", "Hamm HD 120 Roller"],
      isFlagship: false,
      displayOrder: (adminProjectsData?.data?.length ?? 0) + 1,
      isPublished: true
    });
    setProjectModal({ isOpen: true, mode: "create", project: null });
  };

  const openEditProjectModal = (proj: ProjectCaseStudy) => {
    resetProjForm({
      titleAr: proj.titleAr,
      titleEn: proj.titleEn,
      slug: proj.slug,
      clientId: proj.clientId,
      verticalId: proj.verticalId,
      region: proj.region as any,
      cityAr: proj.cityAr,
      cityEn: proj.cityEn,
      lat: proj.coordinates?.lat ?? 24.7136,
      lng: proj.coordinates?.lng ?? 46.6753,
      executionStatus: proj.executionStatus as any,
      yearHijri: proj.yearHijri,
      yearGregorian: proj.yearGregorian,
      summaryAr: proj.summaryAr,
      summaryEn: proj.summaryEn,
      challengeAr: proj.challengeAr || "",
      challengeEn: proj.challengeEn || "",
      solutionAr: proj.solutionAr || "",
      solutionEn: proj.solutionEn || "",
      heroImageUrl: proj.heroImageUrl,
      galleryUrls: proj.galleryUrls || [],
      metrics: proj.metrics || [],
      fleetUnits: proj.fleetUnitsDeployed || [],
      isFlagship: proj.isFlagship,
      displayOrder: proj.displayOrder ?? 0,
      isPublished: proj.isPublished ?? true
    });
    setProjectModal({ isOpen: true, mode: "edit", project: proj });
  };

  const onSaveProject = async (data: CreateProjectInput) => {
    setProjectActionMsg(null);
    try {
      if (projectModal.mode === "create") {
        await createProject(data).unwrap();
        setProjectActionMsg({
          type: "success",
          text: isAr ? "تم إنشاء دراسة حالة المشروع بنجاح." : "Project case study created successfully."
        });
      } else if (projectModal.project) {
        await updateProject({ id: projectModal.project.id, ...data }).unwrap();
        setProjectActionMsg({
          type: "success",
          text: isAr ? "تم حفظ تعديلات المشروع بنجاح." : "Project case study updated successfully."
        });
      }
      setProjectModal({ isOpen: false, mode: "create", project: null });
    } catch (err: any) {
      setProjectActionMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "حدث خطأ أثناء حفظ المشروع." : "Failed to save project.")
      });
    }
    setTimeout(() => setProjectActionMsg(null), 5000);
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectModal.project) return;
    setProjectActionMsg(null);
    try {
      await deleteProject(deleteProjectModal.project.id).unwrap();
      setProjectActionMsg({
        type: "success",
        text: isAr ? "تم حذف المشروع بنجاح." : "Project deleted successfully."
      });
      setDeleteProjectModal({ isOpen: false, project: null });
    } catch (err: any) {
      setProjectActionMsg({
        type: "error",
        text: err?.data?.error?.message || (isAr ? "فشل حذف المشروع." : "Failed to delete project.")
      });
    }
    setTimeout(() => setProjectActionMsg(null), 5000);
  };

  const handleToggleProjectFeatured = async (proj: ProjectCaseStudy) => {
    try {
      await toggleFeatured({ id: proj.id, isFlagship: !proj.isFlagship }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to toggle flagship status");
    }
  };

  const handleToggleProjectPublish = async (proj: ProjectCaseStudy) => {
    try {
      await togglePublish({ id: proj.id, isPublished: !proj.isPublished }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to toggle publish status");
    }
  };

  const handleMoveProject = async (currentIndex: number, direction: "up" | "down") => {
    if (!adminProjectsData?.data) return;
    const items = [...adminProjectsData.data];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;

    const reorderPayload = items.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1
    }));

    try {
      await reorderProjects({ items: reorderPayload }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to reorder projects");
    }
  };

  // Capabilities Admin Queries & Mutations
  const { data: adminCapabilitiesData, isLoading: isLoadingAdminCaps } = useGetAdminCapabilitiesQuery(undefined, {
    skip: !isAuthenticated
  });
  const [createCapability, { isLoading: isCreatingCap }] = useCreateCapabilityMutation();
  const [updateCapability, { isLoading: isUpdatingCap }] = useUpdateCapabilityMutation();
  const [deleteCapability, { isLoading: isDeletingCap }] = useDeleteCapabilityMutation();
  const [toggleCapabilityActive] = useToggleCapabilityActiveMutation();
  const [toggleCapabilityFeatured] = useToggleCapabilityFeaturedMutation();
  const [reorderCapabilities] = useReorderCapabilitiesMutation();

  const [capabilityModal, setCapabilityModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    capability?: CapabilityVertical | null;
  }>({
    isOpen: false,
    mode: "create",
    capability: null
  });

  const [deleteCapabilityModal, setDeleteCapabilityModal] = useState<{
    isOpen: boolean;
    capability?: CapabilityVertical | null;
  }>({
    isOpen: false,
    capability: null
  });

  const [capabilityActionMsg, setCapabilityActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register: registerCap,
    handleSubmit: handleCapSubmit,
    reset: resetCapForm,
    setValue: setCapValue,
    formState: { errors: capErrors, isSubmitting: isSubmittingCap }
  } = useForm<CreateCapabilityInput>({
    resolver: zodResolver(CreateCapabilitySchema),
    defaultValues: {
      id: "",
      code: "",
      titleAr: "",
      titleEn: "",
      shortDescAr: "",
      shortDescEn: "",
      fullDescAr: "",
      fullDescEn: "",
      iconName: "Layers",
      imageUrl: "",
      subServicesAr: [],
      subServicesEn: [],
      equipmentDeployed: [],
      standards: [],
      displayOrder: 0,
      isFeatured: false,
      isActive: true
    }
  });

  const openCreateCapabilityModal = () => {
    resetCapForm({
      id: "",
      code: "",
      titleAr: "",
      titleEn: "",
      shortDescAr: "",
      shortDescEn: "",
      fullDescAr: "",
      fullDescEn: "",
      iconName: "Layers",
      imageUrl: "",
      subServicesAr: [],
      subServicesEn: [],
      equipmentDeployed: [],
      standards: [],
      displayOrder: (adminCapabilitiesData?.data?.length ?? 0) + 1,
      isFeatured: false,
      isActive: true
    });
    setCapabilityModal({ isOpen: true, mode: "create", capability: null });
  };

  const openEditCapabilityModal = (cap: CapabilityVertical) => {
    resetCapForm({
      id: cap.id,
      code: cap.code,
      titleAr: cap.titleAr,
      titleEn: cap.titleEn,
      shortDescAr: cap.shortDescAr,
      shortDescEn: cap.shortDescEn,
      fullDescAr: cap.fullDescAr,
      fullDescEn: cap.fullDescEn,
      iconName: cap.iconName,
      imageUrl: cap.imageUrl ?? "",
      subServicesAr: cap.subServicesAr ?? [],
      subServicesEn: cap.subServicesEn ?? [],
      equipmentDeployed: cap.equipmentDeployed ?? [],
      standards: cap.standards ?? [],
      displayOrder: cap.displayOrder ?? 0,
      isFeatured: cap.isFeatured ?? false,
      isActive: cap.isActive ?? true
    });
    setCapabilityModal({ isOpen: true, mode: "edit", capability: cap });
  };

  const onSaveCapability = async (data: CreateCapabilityInput) => {
    setCapabilityActionMsg(null);
    try {
      if (capabilityModal.mode === "create") {
        await createCapability(data).unwrap();
        setCapabilityActionMsg({ type: "success", text: isAr ? "تمت إضافة الخدمة بنجاح." : "Service created successfully." });
      } else if (capabilityModal.capability) {
        await updateCapability({ ...data, id: capabilityModal.capability.id }).unwrap();
        setCapabilityActionMsg({ type: "success", text: isAr ? "تم تحديث الخدمة بنجاح." : "Service updated successfully." });
      }
      setCapabilityModal({ isOpen: false, mode: "create", capability: null });
    } catch (err: any) {
      setCapabilityActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حفظ الخدمة." : "Failed to save service.") });
    }
    setTimeout(() => setCapabilityActionMsg(null), 5000);
  };

  const handleDeleteCapability = async () => {
    if (!deleteCapabilityModal.capability) return;
    setCapabilityActionMsg(null);
    try {
      await deleteCapability(deleteCapabilityModal.capability.id).unwrap();
      setCapabilityActionMsg({ type: "success", text: isAr ? "تم حذف الخدمة بنجاح." : "Service deleted successfully." });
      setDeleteCapabilityModal({ isOpen: false, capability: null });
    } catch (err: any) {
      setCapabilityActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حذف الخدمة." : "Failed to delete service.") });
    }
    setTimeout(() => setCapabilityActionMsg(null), 5000);
  };

  const handleToggleCapabilityActive = async (cap: CapabilityVertical) => {
    try { await toggleCapabilityActive(cap.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle status"); }
  };

  const handleToggleCapabilityFeatured = async (cap: CapabilityVertical) => {
    try { await toggleCapabilityFeatured(cap.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle featured"); }
  };

  const handleMoveCapability = async (currentIndex: number, direction: "up" | "down") => {
    if (!adminCapabilitiesData?.data) return;
    const items = [...adminCapabilitiesData.data];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;
    const payload = items.map((item, idx) => ({ id: item.id, displayOrder: idx + 1 }));
    try { await reorderCapabilities({ items: payload }).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to reorder"); }
  };

  // ── Clients Queries & Mutations ──────────────────────────────────────────
  const { data: adminClientsData, isLoading: isLoadingClients } = useGetAdminClientsQuery();
  const [createClient, { isLoading: isCreatingClient }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdatingClient }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeletingClient }] = useDeleteClientMutation();
  const [toggleClientActive] = useToggleClientActiveMutation();
  const [toggleClientFeatured] = useToggleClientFeaturedMutation();
  const [reorderClients] = useReorderClientsMutation();

  // Client Admin UI State
  const [clientSearch, setClientSearch] = useState("");
  const [clientCategoryFilter, setClientCategoryFilter] = useState<string>("ALL");
  const [clientActionMsg, setClientActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [clientModal, setClientModal] = useState<{ isOpen: boolean; mode: "create" | "edit"; client: ClientEntity | null }>({
    isOpen: false,
    mode: "create",
    client: null
  });
  const [deleteClientModal, setDeleteClientModal] = useState<{ isOpen: boolean; client: ClientEntity | null }>({
    isOpen: false,
    client: null
  });

  // Client React Hook Form
  const {
    register: registerClient,
    handleSubmit: handleClientSubmit,
    reset: resetClientForm,
    watch: watchClient,
    formState: { errors: clientErrors, isSubmitting: isSubmittingClient }
  } = useForm<CreateClientInput>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      id: "",
      slug: "",
      nameAr: "",
      nameEn: "",
      category: "MINISTRY",
      monogram: "",
      logoUrl: "",
      websiteUrl: "",
      descriptionAr: "",
      descriptionEn: "",
      displayOrder: 0,
      isFeatured: true,
      isActive: true
    }
  });

  const watchClientLogoUrl = watchClient("logoUrl");

  const openCreateClient = () => {
    const nextOrder = (adminClientsData?.data?.length || 0) + 1;
    resetClientForm({
      id: "",
      slug: "",
      nameAr: "",
      nameEn: "",
      category: "MINISTRY",
      monogram: "",
      logoUrl: "",
      websiteUrl: "",
      descriptionAr: "",
      descriptionEn: "",
      displayOrder: nextOrder,
      isFeatured: true,
      isActive: true
    });
    setClientModal({ isOpen: true, mode: "create", client: null });
  };

  const openEditClient = (client: ClientEntity) => {
    resetClientForm({
      id: client.id,
      slug: client.slug,
      nameAr: client.nameAr,
      nameEn: client.nameEn,
      category: client.category,
      monogram: client.monogram || "",
      logoUrl: client.logoUrl || "",
      websiteUrl: client.websiteUrl || "",
      descriptionAr: client.descriptionAr || "",
      descriptionEn: client.descriptionEn || "",
      displayOrder: client.displayOrder ?? 0,
      isFeatured: client.isFeatured ?? true,
      isActive: client.isActive ?? true
    });
    setClientModal({ isOpen: true, mode: "edit", client });
  };

  const onSaveClient = async (data: CreateClientInput) => {
    setClientActionMsg(null);
    try {
      if (clientModal.mode === "create") {
        await createClient(data).unwrap();
        setClientActionMsg({ type: "success", text: isAr ? "تمت إضافة العميل بنجاح." : "Client created successfully." });
      } else if (clientModal.client) {
        await updateClient({ ...data, id: clientModal.client.id }).unwrap();
        setClientActionMsg({ type: "success", text: isAr ? "تم تحديث بيانات العميل بنجاح." : "Client updated successfully." });
      }
      setClientModal({ isOpen: false, mode: "create", client: null });
    } catch (err: any) {
      setClientActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حفظ بيانات العميل." : "Failed to save client.") });
    }
    setTimeout(() => setClientActionMsg(null), 5000);
  };

  const handleDeleteClient = async () => {
    if (!deleteClientModal.client) return;
    setClientActionMsg(null);
    try {
      await deleteClient(deleteClientModal.client.id).unwrap();
      setClientActionMsg({ type: "success", text: isAr ? "تم حذف العميل بنجاح." : "Client deleted successfully." });
      setDeleteClientModal({ isOpen: false, client: null });
    } catch (err: any) {
      setClientActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حذف العميل." : "Failed to delete client.") });
    }
    setTimeout(() => setClientActionMsg(null), 5000);
  };

  const handleToggleClientActive = async (client: ClientEntity) => {
    try { await toggleClientActive(client.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle status"); }
  };

  const handleToggleClientFeatured = async (client: ClientEntity) => {
    try { await toggleClientFeatured(client.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle featured"); }
  };

  const handleMoveClient = async (currentIndex: number, direction: "up" | "down") => {
    if (!adminClientsData?.data) return;
    const items = [...adminClientsData.data];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;
    const payload = items.map((item, idx) => ({ id: item.id, displayOrder: idx + 1 }));
    try { await reorderClients({ items: payload }).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to reorder"); }
  };

  const getClientCategoryBadge = (category: string) => {
    switch (category) {
      case "MINISTRY":
        return <Badge variant="copper">{isAr ? "وزارة سيادية" : "Ministry"}</Badge>;
      case "AMANAT":
        return <Badge variant="success">{isAr ? "أمانة كبرى" : "Amanat"}</Badge>;
      case "PIF_GIGA":
        return <Badge variant="basalt">{isAr ? "صندوق الاستثمارات (PIF)" : "PIF Giga"}</Badge>;
      case "SEMI_GOV":
        return <Badge variant="slate">{isAr ? "شبه حكومي" : "Semi-Gov"}</Badge>;
      case "AUTHORITY":
        return <Badge variant="warning">{isAr ? "هيئة وطنية" : "Authority"}</Badge>;
      case "PRIVATE":
        return <Badge variant="outline">{isAr ? "قطاع خاص" : "Private"}</Badge>;
      default:
        return <Badge variant="slate">{category}</Badge>;
    }
  };

  // ── News Queries & Mutations ─────────────────────────────────────────────
  const { data: adminNewsData, isLoading: isLoadingNews } = useGetAdminNewsListQuery();
  const [createNews, { isLoading: isCreatingNews }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdatingNews }] = useUpdateNewsMutation();
  const [deleteNews, { isLoading: isDeletingNews }] = useDeleteNewsMutation();
  const [toggleNewsPublish] = useToggleNewsPublishMutation();
  const [toggleNewsFeatured] = useToggleNewsFeaturedMutation();

  // News Admin UI State
  const [newsSearch, setNewsSearch] = useState("");
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>("ALL");
  const [newsStatusFilter, setNewsStatusFilter] = useState<string>("ALL");
  const [newsActionMsg, setNewsActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newsModal, setNewsModal] = useState<{ isOpen: boolean; mode: "create" | "edit"; article: NewsArticleEntity | null }>({
    isOpen: false,
    mode: "create",
    article: null
  });
  const [deleteNewsModal, setDeleteNewsModal] = useState<{ isOpen: boolean; article: NewsArticleEntity | null }>({
    isOpen: false,
    article: null
  });

  // News React Hook Form
  const {
    register: registerNews,
    handleSubmit: handleNewsSubmit,
    reset: resetNewsForm,
    watch: watchNews,
    setValue: setNewsValue,
    formState: { errors: newsErrors, isSubmitting: isSubmittingNews }
  } = useForm<CreateNewsArticleInput>({
    resolver: zodResolver(CreateNewsArticleSchema),
    defaultValues: {
      slug: "",
      titleAr: "",
      titleEn: "",
      summaryAr: "",
      summaryEn: "",
      contentAr: "",
      contentEn: "",
      featuredImageUrl: "",
      author: "AL-HADAB Media Center",
      publishedAt: new Date().toISOString().slice(0, 10),
      category: "CORPORATE",
      isFeatured: false,
      isPublished: true,
      seoTitleAr: "",
      seoTitleEn: "",
      seoDescAr: "",
      seoDescEn: ""
    }
  });

  const watchNewsImageUrl = watchNews("featuredImageUrl");

  const openCreateNews = () => {
    resetNewsForm({
      slug: "",
      titleAr: "",
      titleEn: "",
      summaryAr: "",
      summaryEn: "",
      contentAr: "",
      contentEn: "",
      featuredImageUrl: "",
      author: "AL-HADAB Media Center",
      publishedAt: new Date().toISOString().slice(0, 10),
      category: "CORPORATE",
      isFeatured: false,
      isPublished: true,
      seoTitleAr: "",
      seoTitleEn: "",
      seoDescAr: "",
      seoDescEn: ""
    });
    setNewsModal({ isOpen: true, mode: "create", article: null });
  };

  const openEditNews = (article: NewsArticleEntity) => {
    resetNewsForm({
      id: article.id,
      slug: article.slug,
      titleAr: article.titleAr,
      titleEn: article.titleEn,
      summaryAr: article.summaryAr,
      summaryEn: article.summaryEn,
      contentAr: article.contentAr,
      contentEn: article.contentEn,
      featuredImageUrl: article.featuredImageUrl || "",
      author: article.author || "AL-HADAB Media Center",
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      category: article.category as any,
      isFeatured: article.isFeatured ?? false,
      isPublished: article.isPublished ?? true,
      seoTitleAr: article.seoTitleAr || "",
      seoTitleEn: article.seoTitleEn || "",
      seoDescAr: article.seoDescAr || "",
      seoDescEn: article.seoDescEn || ""
    });
    setNewsModal({ isOpen: true, mode: "edit", article });
  };

  const onSaveNews = async (data: CreateNewsArticleInput) => {
    setNewsActionMsg(null);
    try {
      if (newsModal.mode === "create") {
        await createNews(data).unwrap();
        setNewsActionMsg({ type: "success", text: isAr ? "تم نشر الخبر بنجاح." : "News article created successfully." });
      } else if (newsModal.article) {
        await updateNews({ ...data, id: newsModal.article.id }).unwrap();
        setNewsActionMsg({ type: "success", text: isAr ? "تم تحديث الخبر بنجاح." : "News article updated successfully." });
      }
      setNewsModal({ isOpen: false, mode: "create", article: null });
    } catch (err: any) {
      setNewsActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حفظ الخبر." : "Failed to save article.") });
    }
    setTimeout(() => setNewsActionMsg(null), 5000);
  };

  const handleDeleteNews = async () => {
    if (!deleteNewsModal.article) return;
    setNewsActionMsg(null);
    try {
      await deleteNews(deleteNewsModal.article.id).unwrap();
      setNewsActionMsg({ type: "success", text: isAr ? "تم حذف الخبر بنجاح." : "Article deleted successfully." });
      setDeleteNewsModal({ isOpen: false, article: null });
    } catch (err: any) {
      setNewsActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حذف الخبر." : "Failed to delete article.") });
    }
    setTimeout(() => setNewsActionMsg(null), 5000);
  };

  const handleToggleNewsPublish = async (article: NewsArticleEntity) => {
    try { await toggleNewsPublish(article.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle status"); }
  };

  const handleToggleNewsFeatured = async (article: NewsArticleEntity) => {
    try { await toggleNewsFeatured(article.id).unwrap(); } catch (err: any) { alert(err?.data?.error?.message || "Failed to toggle featured"); }
  };

  const getNewsCategoryBadge = (cat: string) => {
    switch (cat) {
      case "PROJECT_MILESTONE":
        return <Badge variant="copper">{isAr ? "إنجاز مشروع" : "Milestone"}</Badge>;
      case "PRESS_RELEASE":
        return <Badge variant="basalt">{isAr ? "بيان صحفي" : "Press Release"}</Badge>;
      case "AWARDS":
        return <Badge variant="success">{isAr ? "اعتماد / سلامة" : "Award / HSE"}</Badge>;
      case "PARTNERSHIP":
        return <Badge variant="warning">{isAr ? "شراكة استراتيجية" : "Partnership"}</Badge>;
      case "COMMUNITY":
        return <Badge variant="outline">{isAr ? "مسؤولية مجتمعية" : "Community"}</Badge>;
      default:
        return <Badge variant="slate">{isAr ? "أخبار عامة" : "Corporate"}</Badge>;
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="copper">{isAr ? "جديد" : "New"}</Badge>;
      case "IN_REVIEW":
        return <Badge variant="warning">{isAr ? "قيد التدقيق" : "In Review"}</Badge>;
      case "RESPONDED":
      case "APPROVED":
        return <Badge variant="success">{isAr ? "معتمد / تم الرد" : "Approved / Responded"}</Badge>;
      case "ARCHIVED":
        return <Badge variant="slate">{isAr ? "مؤرشف" : "Archived"}</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">{isAr ? "مرفوض" : "Rejected"}</Badge>;
      case "PENDING":
        return <Badge variant="warning">{isAr ? "قيد الانتظار" : "Pending"}</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  // ── Careers & Recruitment Admin State ──────────────────────────────────────
  const { data: adminJobsData, isLoading: isLoadingAdminJobs } = useGetAdminJobOpeningsQuery(undefined, {
    skip: !isAuthenticated
  });
  const [createJobOpening, { isLoading: isCreatingJob }] = useCreateJobOpeningMutation();
  const [updateJobOpening, { isLoading: isUpdatingJob }] = useUpdateJobOpeningMutation();
  const [deleteJobOpening, { isLoading: isDeletingJob }] = useDeleteJobOpeningMutation();
  const [toggleJobOpeningPublish] = useToggleJobOpeningPublishMutation();

  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [jobDeptFilter, setJobDeptFilter] = useState("ALL");
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL");
  const [jobModal, setJobModal] = useState<{ isOpen: boolean; mode: "create" | "edit"; job: JobOpeningEntity | null }>({
    isOpen: false,
    mode: "create",
    job: null
  });
  const [deleteJobModal, setDeleteJobModal] = useState<{ isOpen: boolean; job: JobOpeningEntity | null }>({
    isOpen: false,
    job: null
  });
  const [jobActionMsg, setJobActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register: registerJob,
    handleSubmit: handleJobSubmit,
    reset: resetJobForm,
    formState: { errors: jobErrors, isSubmitting: isSubmittingJob }
  } = useForm<CreateJobOpeningInput>({
    resolver: zodResolver(CreateJobOpeningSchema),
    defaultValues: {
      titleAr: "",
      titleEn: "",
      department: "",
      location: "",
      employmentType: "FULL_TIME",
      descriptionAr: "",
      descriptionEn: "",
      requirementsAr: "",
      requirementsEn: "",
      applicationDeadline: "",
      isPublished: true
    }
  });

  const openCreateJob = () => {
    resetJobForm({
      titleAr: "",
      titleEn: "",
      department: "",
      location: "",
      employmentType: "FULL_TIME",
      descriptionAr: "",
      descriptionEn: "",
      requirementsAr: "",
      requirementsEn: "",
      applicationDeadline: "",
      isPublished: true
    });
    setJobModal({ isOpen: true, mode: "create", job: null });
  };

  const openEditJob = (job: JobOpeningEntity) => {
    resetJobForm({
      titleAr: job.titleAr,
      titleEn: job.titleEn,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      descriptionAr: job.descriptionAr,
      descriptionEn: job.descriptionEn,
      requirementsAr: job.requirementsAr,
      requirementsEn: job.requirementsEn,
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : "",
      isPublished: job.isPublished
    });
    setJobModal({ isOpen: true, mode: "edit", job });
  };

  const onSaveJob = async (data: CreateJobOpeningInput) => {
    setJobActionMsg(null);
    try {
      if (jobModal.mode === "create") {
        await createJobOpening(data).unwrap();
        setJobActionMsg({ type: "success", text: isAr ? "تم إنشاء فرصة العمل بنجاح." : "Job opening created successfully." });
      } else if (jobModal.job) {
        await updateJobOpening({ id: jobModal.job.id, ...data }).unwrap();
        setJobActionMsg({ type: "success", text: isAr ? "تم تحديث فرصة العمل بنجاح." : "Job opening updated successfully." });
      }
      setJobModal({ isOpen: false, mode: "create", job: null });
    } catch (err: any) {
      setJobActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حفظ فرصة العمل." : "Failed to save job opening.") });
    }
    setTimeout(() => setJobActionMsg(null), 5000);
  };

  const handleDeleteJob = async () => {
    if (!deleteJobModal.job) return;
    setJobActionMsg(null);
    try {
      await deleteJobOpening(deleteJobModal.job.id).unwrap();
      setJobActionMsg({ type: "success", text: isAr ? "تم حذف فرصة العمل بنجاح." : "Job opening deleted successfully." });
      setDeleteJobModal({ isOpen: false, job: null });
    } catch (err: any) {
      setJobActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حذف فرصة العمل." : "Failed to delete job opening.") });
    }
    setTimeout(() => setJobActionMsg(null), 5000);
  };

  const handleToggleJobPublish = async (job: JobOpeningEntity) => {
    try {
      await toggleJobOpeningPublish(job.id).unwrap();
    } catch (err: any) {
      alert(err?.data?.error?.message || "Failed to toggle job publication status");
    }
  };

  // ── Applications Admin State ────────────────────────────────────────────────
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appJobFilter, setAppJobFilter] = useState("ALL");
  const { data: adminAppsData, isLoading: isLoadingAdminApps } = useGetAdminJobApplicationsQuery(
    { status: appStatusFilter, jobOpeningId: appJobFilter, search: appSearchQuery },
    { skip: !isAuthenticated }
  );
  const [updateApplicationStatus, { isLoading: isUpdatingAppStatus }] = useUpdateJobApplicationStatusMutation();
  const [updateApplicationNotes, { isLoading: isUpdatingAppNotes }] = useUpdateJobApplicationNotesMutation();
  const [deleteJobApplication, { isLoading: isDeletingApp }] = useDeleteJobApplicationMutation();

  const [selectedApplication, setSelectedApplication] = useState<JobApplicationEntity | null>(null);
  const [appNotesInput, setAppNotesInput] = useState("");
  const [deleteAppModal, setDeleteAppModal] = useState<{ isOpen: boolean; app: JobApplicationEntity | null }>({
    isOpen: false,
    app: null
  });
  const [appActionMsg, setAppActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const openAppDetails = (app: JobApplicationEntity) => {
    setSelectedApplication(app);
    setAppNotesInput(app.adminNotes || "");
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: JobApplicationStatus) => {
    setAppActionMsg(null);
    try {
      await updateApplicationStatus({ id: appId, status: newStatus }).unwrap();
      if (selectedApplication?.id === appId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
      setAppActionMsg({ type: "success", text: isAr ? `تم تحديث حالة الطلب إلى ${newStatus}.` : `Application status updated to ${newStatus}.` });
    } catch (err: any) {
      setAppActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل تحديث حالة الطلب." : "Failed to update application status.") });
    }
    setTimeout(() => setAppActionMsg(null), 5000);
  };

  const handleSaveAppNotes = async (appId: string) => {
    setAppActionMsg(null);
    try {
      await updateApplicationNotes({ id: appId, adminNotes: appNotesInput }).unwrap();
      if (selectedApplication?.id === appId) {
        setSelectedApplication({ ...selectedApplication, adminNotes: appNotesInput });
      }
      setAppActionMsg({ type: "success", text: isAr ? "تم حفظ الملاحظات الإدارية." : "Admin notes saved successfully." });
    } catch (err: any) {
      setAppActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حفظ الملاحظات." : "Failed to save notes.") });
    }
    setTimeout(() => setAppActionMsg(null), 5000);
  };

  const handleDeleteApp = async () => {
    if (!deleteAppModal.app) return;
    setAppActionMsg(null);
    try {
      await deleteJobApplication(deleteAppModal.app.id).unwrap();
      if (selectedApplication?.id === deleteAppModal.app.id) {
        setSelectedApplication(null);
      }
      setAppActionMsg({ type: "success", text: isAr ? "تم حذف طلب التوظيف بنجاح." : "Application deleted successfully." });
      setDeleteAppModal({ isOpen: false, app: null });
    } catch (err: any) {
      setAppActionMsg({ type: "error", text: err?.data?.error?.message || (isAr ? "فشل حذف طلب التوظيف." : "Failed to delete application.") });
    }
    setTimeout(() => setAppActionMsg(null), 5000);
  };

  const getAppStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="copper">{isAr ? "طلب جديد" : "New"}</Badge>;
      case "REVIEWING":
        return <Badge variant="warning">{isAr ? "قيد المراجعة" : "Reviewing"}</Badge>;
      case "SHORTLISTED":
        return <Badge variant="default">{isAr ? "قائمة مختصرة" : "Shortlisted"}</Badge>;
      case "INTERVIEW":
        return <Badge variant="basalt">{isAr ? "مقابلة شخصية" : "Interview"}</Badge>;
      case "HIRED":
        return <Badge variant="success">{isAr ? "تم التوظيف" : "Hired"}</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">{isAr ? "مرفوض" : "Rejected"}</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <SEOHead
          titleAr="بوابة الإدارة الداخلية"
          titleEn="Internal Administration Portal"
          descriptionAr="بوابة الإدارة الداخلية والرقابة لشركة الهضب للتجارة والمقاولات."
          descriptionEn="Internal administration portal for AL-HADAB Trading & Contracting Co."
          canonicalPath="/admin"
        />
        <div className="bg-white border border-sand-300 rounded-[8px] p-8 shadow-elevation-2 space-y-6 text-start">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-basalt-950 text-copper-500 flex items-center justify-center mx-auto">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-basalt-950">
              {isAr ? "بوابة الإدارة الداخلية والرقابة" : "Internal Administration Desk"}
            </h2>
            <p className="text-xs text-basalt-500">
              {isAr ? "تسجيل الدخول للمصرح لهم بمراجعة المناقصات والموردين" : "Authorized personnel access for tender & vendor management"}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "البريد الإلكتروني *" : "Email Address *"}
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "كلمة المرور *" : "Password *"}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoggingIn}
            >
              {isAr ? "دخول النظام" : "Sign In to Admin Workspace"}
            </Button>
          </form>

          <p className="text-[11px] text-basalt-400 text-center">
            {isAr ? "جلسة مشفرة متوافقة مع ضوابط الأمن السيبراني NCA" : "Encrypted session compliant with NCA ECC controls"}
          </p>
        </div>
      </div>
    );
  }

  // RBAC Access Guard
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const role = user.role;
    if (role === "ESTIMATOR" && !["OVERVIEW", "INQUIRIES", "VENDORS"].includes(activeTab)) {
      setActiveTab("OVERVIEW");
    } else if (["EDITOR", "AUDITOR"].includes(role) && activeTab === "USERS") {
      setActiveTab("OVERVIEW");
    }
  }, [user, isAuthenticated, activeTab]);

  const handleOverviewNavigate = (tab: AdminTab, action?: string) => {
    setActiveTab(tab);
    if (action === "CREATE") {
      setTimeout(() => {
        if (tab === "PROJECTS") openCreateProjectModal();
        else if (tab === "CAREERS") openCreateJob();
        else if (tab === "NEWS") openCreateNews();
        else if (tab === "CLIENTS") openCreateClient();
      }, 50);
    }
  };

  const getModuleBreadcrumb = () => {
    switch (activeTab) {
      case "OVERVIEW":
        return isAr ? "لوحة التحكم والمؤشرات" : "Dashboard Overview";
      case "COMPANY":
        return isAr ? "ملف وبيانات الشركة المؤسسية" : "Company Profile";
      case "WORKFORCE":
        return isAr ? "القوى العاملة والكوادر الميدانية" : "Workforce & Labor Management";
      case "PROJECTS":
        return isAr ? "المشاريع وسجل الأعمال" : "Projects Portfolio";
      case "CAPABILITIES":
        return isAr ? "القطاعات والخدمات الهندسية" : "Services & Capabilities";
      case "CLIENTS":
        return isAr ? "العملاء والشركاء الاستراتيجيين" : "Clients & Partners";
      case "VENDORS":
        return isAr ? "الموردون ومقاولو الباطن" : "Subcontractors & Vendors";
      case "NEWS":
        return isAr ? "المركز الإعلامي والأخبار" : "News & Media";
      case "CAREERS":
        return isAr ? "الوظائف والفرص الهندسية" : "Careers & Jobs";
      case "APPLICATIONS":
        return isAr ? "طلبات التوظيف والسير الذاتية" : "Job Applications";
      case "INQUIRIES":
        return isAr ? "طلبات المناقصات والاستفسارات" : "Tenders & Inquiries";
      case "USERS":
        return isAr ? "إدارة المستخدمين والصلاحيات" : "Admin Users & Roles";
      default:
        return activeTab;
    }
  };

  return (
    <div className="min-h-screen bg-sand-50/50 flex flex-col text-start">
      <SEOHead
        titleAr="منصة الإدارة والتحكم المؤسسي | شركة الهضب للتجارة والمقاولات"
        titleEn="Enterprise CMS Command Desk | AL-HADAB Contracting"
        descriptionAr="لوحة تحكم وإدارة المحتوى والعمليات لشركة الهضب"
        descriptionEn="Enterprise CMS and operations command desk for AL-HADAB"
        canonicalPath="/admin"
      />

      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-sand-100 text-basalt-700 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-copper-600 text-white font-black text-xs flex items-center justify-center">
              H
            </div>
            <span className="font-bold text-xs text-basalt-950">AL-HADAB CMS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="copper">{user?.role || "SUPERADMIN"}</Badge>
          <Button
            variant="tectonic"
            size="sm"
            onClick={handleLogout}
            iconStart={<LogOut className="h-3.5 w-3.5" />}
          >
            {isAr ? "خروج" : "Logout"}
          </Button>
        </div>
      </div>

      {/* Main CMS Layout with Sidebar */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          user={user}
          counts={{
            inquiries: inquiries?.length,
            unreadInquiries: inquiriesMeta?.unreadCount,
            projects: adminProjectsData?.meta?.total,
            capabilities: adminCapabilitiesData?.meta?.totalCount,
            clients: adminClientsData?.meta?.totalCount,
            workforce: workforceData?.totalEmployees,
            vendors: vendors?.length,
            news: adminNewsData?.meta?.totalCount,
            jobs: adminJobsData?.meta?.totalCount ?? adminJobsData?.data?.length,
            applications: adminAppsData?.meta?.totalCount ?? adminAppsData?.data?.length,
            users: adminUsersData?.length
          }}
          isAr={isAr}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onToggleLanguage={() => dispatch(toggleLanguage())}
          onLogout={handleLogout}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumb & Quick Info Bar */}
          <div className="bg-white border border-sand-200 rounded-[10px] px-5 py-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-basalt-400 font-medium">CMS</span>
              <span className="text-sand-400">/</span>
              <span className="font-bold text-basalt-900">{getModuleBreadcrumb()}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-basalt-500">
              <div className="hidden md:flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] text-basalt-600">
                  {user?.fullName} ({user?.role})
                </span>
              </div>
            </div>
          </div>

          {/* TAB 0: Executive Dashboard Overview */}
          {activeTab === "OVERVIEW" && (
            <DashboardOverviewTab
              onNavigateTab={handleOverviewNavigate}
              isAr={isAr}
              user={user}
            />
          )}

          {/* TAB 11: Admin Users & Roles (SUPERADMIN Only) */}
          {activeTab === "USERS" && user?.role === "SUPERADMIN" && (
            <AdminUsersTab isAr={isAr} currentUserId={user?.id} />
          )}

      {/* TAB 1: Inquiries Management Desk */}
      {activeTab === "INQUIRIES" && (
        <div className="space-y-5">
          {/* KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: isAr ? "إجمالي الطلبات" : "Total Inquiries",
                value: inquiriesMeta?.totalCount ?? inquiries.length,
                icon: <InboxIcon className="h-5 w-5" />,
                color: "text-basalt-700",
                bg: "bg-sand-50"
              },
              {
                label: isAr ? "غير مقروء" : "Unread",
                value: inquiriesMeta?.unreadCount ?? inquiries.filter((i) => !i.isRead).length,
                icon: <MailOpen className="h-5 w-5" />,
                color: "text-amber-600",
                bg: "bg-amber-50"
              },
              {
                label: isAr ? "قيد المعالجة" : "In Progress",
                value: inquiriesMeta?.countsByStatus?.["IN_PROGRESS"] ?? inquiries.filter((i) => i.workflowStatus === "IN_PROGRESS").length,
                icon: <RefreshCw className="h-5 w-5" />,
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                label: isAr ? "مؤرشف" : "Archived",
                value: inquiriesMeta?.archivedCount ?? inquiries.filter((i) => i.workflowStatus === "ARCHIVED").length,
                icon: <Archive className="h-5 w-5" />,
                color: "text-basalt-500",
                bg: "bg-sand-100"
              }
            ].map((kpi, idx) => (
              <div key={idx} className={`${kpi.bg} border border-sand-200 rounded-[8px] p-4 flex items-center gap-3`}>
                <div className={`${kpi.color} opacity-80`}>{kpi.icon}</div>
                <div>
                  <p className="text-[11px] text-basalt-500 font-medium">{kpi.label}</p>
                  <p className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-sand-200 rounded-[8px] p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-basalt-400" />
                <input
                  type="text"
                  placeholder={isAr ? "ابحث باسم الجهة أو المقدم أو رقم المتابعة..." : "Search by org, contact, or tracking ID..."}
                  value={inqSearch}
                  onChange={(e) => setInqSearch(e.target.value)}
                  className="w-full h-9 ps-8 pe-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
                />
              </div>

              {/* Status Filter */}
              <select
                value={inqStatusFilter}
                onChange={(e) => setInqStatusFilter(e.target.value)}
                className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
              >
                <option value="ALL">{isAr ? "كل الحالات" : "All Statuses"}</option>
                <option value="NEW">{isAr ? "جديد" : "New"}</option>
                <option value="IN_PROGRESS">{isAr ? "قيد المعالجة" : "In Progress"}</option>
                <option value="IN_REVIEW">{isAr ? "قيد المراجعة" : "In Review"}</option>
                <option value="CONTACTED">{isAr ? "تم التواصل" : "Contacted"}</option>
                <option value="RESPONDED">{isAr ? "تم الرد" : "Responded"}</option>
                <option value="COMPLETED">{isAr ? "مكتمل" : "Completed"}</option>
                <option value="ARCHIVED">{isAr ? "مؤرشف" : "Archived"}</option>
              </select>

              {/* Intent Filter */}
              <select
                value={inqIntentFilter}
                onChange={(e) => setInqIntentFilter(e.target.value)}
                className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
              >
                <option value="ALL">{isAr ? "كل الأنواع" : "All Types"}</option>
                <option value="GOVERNMENT_TENDER">{isAr ? "مناقصة حكومية" : "Government Tender"}</option>
                <option value="ENTERPRISE_RFP">{isAr ? "طلب عرض سعر" : "Enterprise RFP"}</option>
                <option value="SUBCONTRACTOR_ONBOARD">{isAr ? "تأهيل مقاول باطن" : "Subcontractor Onboard"}</option>
                <option value="TECHNICAL_RFI">{isAr ? "استفسار تقني" : "Technical RFI"}</option>
                <option value="CAREER_APPLICATION">{isAr ? "طلب توظيف" : "Career Application"}</option>
              </select>

              {/* Date Range */}
              <input
                type="date"
                value={inqStartDate}
                onChange={(e) => setInqStartDate(e.target.value)}
                className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
                title={isAr ? "من تاريخ" : "From date"}
              />
              <input
                type="date"
                value={inqEndDate}
                onChange={(e) => setInqEndDate(e.target.value)}
                className="h-9 px-3 bg-sand-50 border border-sand-300 rounded-[6px] text-xs focus-ring"
                title={isAr ? "إلى تاريخ" : "To date"}
              />

              {/* Reset */}
              <Button
                variant="tectonic"
                size="sm"
                iconStart={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={() => {
                  setInqSearch("");
                  setInqStatusFilter("ALL");
                  setInqIntentFilter("ALL");
                  setInqStartDate("");
                  setInqEndDate("");
                }}
              >
                {isAr ? "إعادة تعيين" : "Reset"}
              </Button>

              <Button
                variant="tectonic"
                size="sm"
                iconStart={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => refetchInquiries()}
              >
                {isAr ? "تحديث" : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-sand-200 rounded-[8px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-sand-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-basalt-950">
                {isAr ? "سجل الطلبات الواردة" : "Inquiry Queue"}
              </h2>
              <span className="text-xs text-basalt-500 font-mono">
                {isAr ? `${inquiries.length} نتيجة` : `${inquiries.length} results`}
              </span>
            </div>

            {isLoadingInquiries ? (
              <div className="py-12 text-center text-xs text-basalt-500">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-basalt-400" />
                {isAr ? "جاري تحميل الطلبات..." : "Loading inquiries..."}
              </div>
            ) : inquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-600">
                    <tr>
                      <th className="p-3 font-semibold w-6"></th>
                      <th className="p-3 font-semibold">{isAr ? "رقم المتابعة" : "Tracking ID"}</th>
                      <th className="p-3 font-semibold">{isAr ? "الجهة / المنشأة" : "Organization"}</th>
                      <th className="p-3 font-semibold">{isAr ? "مقدم الطلب" : "Contact"}</th>
                      <th className="p-3 font-semibold">{isAr ? "نوع الطلب" : "Type"}</th>
                      <th className="p-3 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-3 font-semibold">{isAr ? "التاريخ" : "Date"}</th>
                      <th className="p-3 font-semibold text-center">{isAr ? "إجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {inquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        className={`hover:bg-sand-50 cursor-pointer transition-colors ${
                          !inq.isRead ? "bg-amber-50/40" : ""
                        }`}
                        onClick={() => openInquiryModal(inq)}
                      >
                        {/* Read indicator */}
                        <td className="p-3">
                          <button
                            title={inq.isRead ? (isAr ? "وضع علامة غير مقروء" : "Mark unread") : (isAr ? "وضع علامة مقروء" : "Mark read")}
                            onClick={(e) => handleToggleInquiryRead(inq, e)}
                            className="text-basalt-400 hover:text-copper-600 transition-colors"
                          >
                            {inq.isRead
                              ? <MailCheck className="h-3.5 w-3.5 text-basalt-300" />
                              : <MailOpen className="h-3.5 w-3.5 text-amber-500" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-copper-600">{inq.trackingId}</span>
                        </td>
                        <td className="p-3 font-semibold text-basalt-900 max-w-[160px] truncate">{inq.organization}</td>
                        <td className="p-3">
                          <p className="font-medium text-basalt-800">{inq.fullName}</p>
                          <p className="text-[11px] text-basalt-500 truncate max-w-[140px]">{inq.email}</p>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                            inq.intentType === "GOVERNMENT_TENDER" ? "bg-blue-100 text-blue-700" :
                            inq.intentType === "ENTERPRISE_RFP" ? "bg-purple-100 text-purple-700" :
                            inq.intentType === "SUBCONTRACTOR_ONBOARD" ? "bg-green-100 text-green-700" :
                            inq.intentType === "TECHNICAL_RFI" ? "bg-orange-100 text-orange-700" :
                            "bg-sand-100 text-basalt-700"
                          }`}>
                            {inq.intentType === "GOVERNMENT_TENDER" ? (isAr ? "مناقصة" : "Tender") :
                             inq.intentType === "ENTERPRISE_RFP" ? "RFP" :
                             inq.intentType === "SUBCONTRACTOR_ONBOARD" ? (isAr ? "مقاول باطن" : "Sub-con") :
                             inq.intentType === "TECHNICAL_RFI" ? "RFI" :
                             (isAr ? "توظيف" : "Career")}
                          </span>
                        </td>
                        <td className="p-3">{getStatusBadge(inq.workflowStatus)}</td>
                        <td className="p-3 text-basalt-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="tectonic"
                            size="sm"
                            iconStart={<Eye className="h-3 w-3" />}
                            onClick={(e) => { e.stopPropagation(); openInquiryModal(inq); }}
                          >
                            {isAr ? "مراجعة" : "Review"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <InboxIcon className="h-10 w-10 text-basalt-300 mx-auto" />
                <p className="text-sm font-semibold text-basalt-600">
                  {isAr ? "لا توجد طلبات مطابقة للتصفيات المختارة" : "No inquiries match the selected filters"}
                </p>
                <p className="text-xs text-basalt-400">
                  {isAr ? "حاول تعديل معايير البحث أو إعادة التعيين" : "Try adjusting your search criteria or reset filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Subcontractors & Vendors Desk */}
      {activeTab === "VENDORS" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-basalt-950">
                {isAr ? "سجل تأهيل الموردين والمقاولين من الباطن" : "Registered Subcontractors & Vendor Directory"}
              </h2>
              <p className="text-xs text-basalt-500">
                {isAr ? "تدقيق السجلات التجارية، نسب التوطين، ونطاقات التخصص المعتمدة" : "Verify Commercial Registrations, Nitaqat ratings, and trade accreditations"}
              </p>
            </div>
            <Badge variant="slate">
              {isAr ? `الإجمالي: ${vendors?.length || 0}` : `Total Vendors: ${vendors?.length || 0}`}
            </Badge>
          </div>

          {isLoadingVendors ? (
            <p className="text-xs text-basalt-500 py-6 text-center">{isAr ? "جاري تحميل سجلات الموردين..." : "Loading registered vendors..."}</p>
          ) : vendors && vendors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-700">
                  <tr>
                    <th className="p-3 font-semibold">{isAr ? "رقم المتابعة" : "Tracking ID"}</th>
                    <th className="p-3 font-semibold">{isAr ? "اسم المنشأة" : "Company Name"}</th>
                    <th className="p-3 font-semibold">{isAr ? "السجل / الضريبي" : "CR / VAT"}</th>
                    <th className="p-3 font-semibold">{isAr ? "المفوض بالتوقيع" : "Authorized Person"}</th>
                    <th className="p-3 font-semibold">{isAr ? "نطاقات" : "Nitaqat"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-3 font-semibold text-center">{isAr ? "تحديث الحالة" : "Review Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {vendors.map((ven: any) => (
                    <tr key={ven.id} className="hover:bg-sand-50/60">
                      <td className="p-3 font-mono font-bold text-copper-600">{ven.trackingId}</td>
                      <td className="p-3">
                        <p className="font-semibold text-basalt-900">{isAr ? ven.companyNameAr : ven.companyNameEn}</p>
                        <p className="text-[11px] text-basalt-500">{ven.headOfficeCity}</p>
                      </td>
                      <td className="p-3 font-mono">
                        <p className="font-semibold text-basalt-800">CR: {ven.crNumber}</p>
                        <p className="text-[11px] text-basalt-500">VAT: {ven.vatNumber}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-basalt-800">{ven.signatoryName}</p>
                        <p className="text-[11px] text-basalt-500">{ven.officialEmail} • {ven.authorizedMobile}</p>
                      </td>
                      <td className="p-3">
                        <span className="font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] border border-emerald-200">
                          {ven.nitaqatRating}
                        </span>
                      </td>
                      <td className="p-3">{getStatusBadge(ven.reviewStatus)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {ven.reviewStatus !== "APPROVED" && (
                            <button
                              onClick={() => handleVendorStatusChange(ven.id, "APPROVED")}
                              disabled={isUpdatingVendor}
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-semibold flex items-center gap-1"
                              title={isAr ? "اعتماد المورد" : "Approve"}
                            >
                              <Check className="h-3 w-3" />
                              <span>{isAr ? "اعتماد" : "Approve"}</span>
                            </button>
                          )}
                          {ven.reviewStatus !== "REJECTED" && (
                            <button
                              onClick={() => handleVendorStatusChange(ven.id, "REJECTED")}
                              disabled={isUpdatingVendor}
                              className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 text-[11px] font-semibold flex items-center gap-1"
                              title={isAr ? "رفض الطلب" : "Reject"}
                            >
                              <X className="h-3 w-3" />
                              <span>{isAr ? "رفض" : "Reject"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-basalt-500 bg-sand-50 rounded">
              {isAr ? "لا توجد ملفات موردين مسجلة حتى الآن." : "No registered vendors on file."}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Company Profile CMS */}
      {activeTab === "COMPANY" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-basalt-950">
                {isAr ? "إدارة محتوى ملف الشركة" : "Company Profile Content Management"}
              </h2>
              <p className="text-xs text-basalt-500">
                {isAr ? "تحديث بيانات الشركة، المحتوى ثنائي اللغة، الإحصائيات وإعدادات SEO" : "Update company data, bilingual content, statistics and SEO settings"}
              </p>
            </div>
            {companyProfile?.updatedAt && (
              <p className="text-[11px] text-basalt-400 font-mono">
                {isAr ? "آخر تحديث:" : "Last saved:"} {new Date(companyProfile.updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          {profileSaveMsg && (
            <div className={`px-4 py-3 rounded-[6px] text-xs font-semibold border ${
              profileSaveMsg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}>
              {profileSaveMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-8">

            {/* Section 1: Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-basalt-700 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-copper-500" />
                {isAr ? "هوية الشركة والموقع" : "Company Identity & Location"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { key: "nameAr", labelAr: "اسم الشركة (عربي)", labelEn: "Company Name (Arabic)" },
                  { key: "nameEn", labelAr: "اسم الشركة (إنجليزي)", labelEn: "Company Name (English)" },
                  { key: "legalEntityAr", labelAr: "الكيان القانوني (عربي)", labelEn: "Legal Entity (Arabic)" },
                  { key: "legalEntityEn", labelAr: "الكيان القانوني (إنجليزي)", labelEn: "Legal Entity (English)" },
                  { key: "crNumber", labelAr: "رقم السجل التجاري", labelEn: "Commercial Registration No." },
                  { key: "vatNumber", labelAr: "الرقم الضريبي", labelEn: "VAT Number" },
                  { key: "contractorClassification", labelAr: "تصنيف المقاول", labelEn: "Contractor Classification" },
                  { key: "headquartersAr", labelAr: "المقر الرئيسي (عربي)", labelEn: "Headquarters (Arabic)" },
                  { key: "headquartersEn", labelAr: "المقر الرئيسي (إنجليزي)", labelEn: "Headquarters (English)" },
                  { key: "addressAr", labelAr: "العنوان التفصيلي (عربي)", labelEn: "Full Address (Arabic)" },
                  { key: "addressEn", labelAr: "العنوان التفصيلي (إنجليزي)", labelEn: "Full Address (English)" },
                  { key: "phonePrimary", labelAr: "الهاتف الرئيسي", labelEn: "Primary Phone" },
                  { key: "phoneSecondary", labelAr: "الهاتف الثانوي", labelEn: "Secondary Phone" },
                  { key: "whatsapp", labelAr: "واتساب", labelEn: "WhatsApp" },
                  { key: "emailOfficial", labelAr: "البريد الرسمي", labelEn: "Official Email" },
                  { key: "emailTenders", labelAr: "بريد المناقصات", labelEn: "Tenders Email" }
                ] as {key: string; labelAr: string; labelEn: string}[]).map(({ key, labelAr, labelEn }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <input type="text" value={(profileForm as any)[key]} onChange={pf(key)}
                      className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring" />
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? "سنة التأسيس (هجري)" : "Founding Year (Hijri)"}</label>
                  <input type="number" value={profileForm.foundingYearHijri} onChange={pfNum("foundingYearHijri")}
                    className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? "سنة التأسيس (ميلادي)" : "Founding Year (Gregorian)"}</label>
                  <input type="number" value={profileForm.foundingYearGregorian} onChange={pfNum("foundingYearGregorian")}
                    className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono" />
                </div>
              </div>
            </div>

            {/* Section 2: Statistics */}
            <div className="space-y-4 pt-4 border-t border-sand-200">
              <h3 className="text-xs font-bold text-basalt-700 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-copper-500" />
                {isAr ? "الإحصائيات والأرقام" : "Statistics & Key Figures"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {([
                  { key: "statsYearsOfExperience", labelAr: "سنوات الخبرة", labelEn: "Years of Experience" },
                  { key: "statsActiveWorkforce", labelAr: "القوى العاملة", labelEn: "Active Workforce" },
                  { key: "statsHeavyEquipmentUnits", labelAr: "المعدات الثقيلة", labelEn: "Heavy Equipment Units" },
                  { key: "statsSafeManHoursLogged", labelAr: "ساعات العمل الآمنة", labelEn: "Safe Man-Hours" },
                  { key: "statsNationalPartnersCount", labelAr: "الشركاء الوطنيون", labelEn: "National Partners" },
                  { key: "statsCompletedProjectsCount", labelAr: "المشاريع المنجزة", labelEn: "Completed Projects" }
                ] as {key: string; labelAr: string; labelEn: string}[]).map(({ key, labelAr, labelEn }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <input type="number" min={0} value={(profileForm as any)[key]} onChange={pfNum(key)}
                      className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Bilingual Content */}
            <div className="space-y-4 pt-4 border-t border-sand-200">
              <h3 className="text-xs font-bold text-basalt-700 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-copper-500" />
                {isAr ? "المحتوى ثنائي اللغة" : "Bilingual Content"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { key: "shortDescAr", labelAr: "الوصف المختصر (عربي)", labelEn: "Short Description (Arabic)" },
                  { key: "shortDescEn", labelAr: "الوصف المختصر (إنجليزي)", labelEn: "Short Description (English)" }
                ] as {key: string; labelAr: string; labelEn: string}[]).map(({ key, labelAr, labelEn }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <input type="text" value={(profileForm as any)[key]} onChange={pf(key)}
                      className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { key: "fullDescAr", labelAr: "الوصف الكامل (عربي)", labelEn: "Full Description (Arabic)", rows: 5 },
                  { key: "fullDescEn", labelAr: "الوصف الكامل (إنجليزي)", labelEn: "Full Description (English)", rows: 5 },
                  { key: "founderMessageAr", labelAr: "رسالة المؤسس (عربي)", labelEn: "Founder's Message (Arabic)", rows: 4 },
                  { key: "founderMessageEn", labelAr: "رسالة المؤسس (إنجليزي)", labelEn: "Founder's Message (English)", rows: 4 },
                  { key: "visionAr", labelAr: "الرؤية (عربي)", labelEn: "Vision (Arabic)", rows: 2 },
                  { key: "visionEn", labelAr: "الرؤية (إنجليزي)", labelEn: "Vision (English)", rows: 2 },
                  { key: "missionAr", labelAr: "الرسالة (عربي)", labelEn: "Mission (Arabic)", rows: 3 },
                  { key: "missionEn", labelAr: "الرسالة (إنجليزي)", labelEn: "Mission (English)", rows: 3 }
                ] as {key: string; labelAr: string; labelEn: string; rows: number}[]).map(({ key, labelAr, labelEn, rows }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <textarea rows={rows} value={(profileForm as any)[key]} onChange={pf(key)}
                      className="w-full p-2.5 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring resize-y" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: SEO */}
            <div className="space-y-4 pt-4 border-t border-sand-200">
              <h3 className="text-xs font-bold text-basalt-700 uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-copper-500" />
                {isAr ? "بيانات محركات البحث (SEO)" : "Search Engine Metadata (SEO)"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { key: "seoTitleAr", labelAr: "عنوان SEO (عربي)", labelEn: "SEO Title (Arabic)" },
                  { key: "seoTitleEn", labelAr: "عنوان SEO (إنجليزي)", labelEn: "SEO Title (English)" }
                ] as {key: string; labelAr: string; labelEn: string}[]).map(({ key, labelAr, labelEn }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <input type="text" value={(profileForm as any)[key]} onChange={pf(key)}
                      className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring" />
                  </div>
                ))}
                {([
                  { key: "seoDescAr", labelAr: "وصف SEO (عربي)", labelEn: "SEO Description (Arabic)" },
                  { key: "seoDescEn", labelAr: "وصف SEO (إنجليزي)", labelEn: "SEO Description (English)" }
                ] as {key: string; labelAr: string; labelEn: string}[]).map(({ key, labelAr, labelEn }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-basalt-700 mb-1">{isAr ? labelAr : labelEn}</label>
                    <textarea rows={2} value={(profileForm as any)[key]} onChange={pf(key)}
                      className="w-full p-2.5 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring resize-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Media */}
            <div className="space-y-3 pt-4 border-t border-sand-200">
              <h3 className="text-xs font-bold text-basalt-700 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-copper-500" />
                {isAr ? "الصورة الرئيسية / الشعار (رابط)" : "Main Image / Logo URL"}
              </h3>
              <input type="url" value={profileForm.mainImageUrl} onChange={pf("mainImageUrl")}
                placeholder="https://cdn.example.com/logo.png"
                className="w-full h-9 px-3 text-xs bg-sand-50/50 border border-sand-300 rounded-[6px] focus-ring font-mono" />
            </div>

            {/* Section 6: Publishing & Save */}
            <div className="flex items-center justify-between pt-4 border-t border-sand-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.isPublished}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-sand-400 text-copper-600 focus-ring"
                />
                <span className="text-xs font-semibold text-basalt-800">
                  {isAr ? "نشر الملف (مرئي للعموم)" : "Publish Profile (visible to public)"}
                </span>
              </label>
              <Button type="submit" variant="primary" size="sm" iconStart={<Save className="h-4 w-4" />} isLoading={isSavingProfile}>
                {isAr ? "حفظ جميع التغييرات" : "Save All Changes"}
              </Button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 4: Workforce Management CMS */}
      {activeTab === "WORKFORCE" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          {/* Action Notification Banner */}
          {workforceActionMsg && (
            <div
              className={`p-3.5 rounded-[6px] text-xs font-semibold flex items-center gap-2 ${
                workforceActionMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {workforceActionMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              )}
              <span>{workforceActionMsg.text}</span>
            </div>
          )}

          {/* Section Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-copper-600" />
                <h2 className="text-lg font-bold text-basalt-950">
                  {isAr ? "إدارة القوى العاملة والكوادر التخصصية" : "Workforce & Human Capital Management"}
                </h2>
              </div>
              <p className="text-xs text-basalt-500 mt-0.5">
                {isAr
                  ? "إدارة تصنيفات الكوادر الفنية والميدانية والإدارية، وتحديث أعداد الموظفين المعروضة في المنصة"
                  : "Manage engineering, field, and administrative labor categories and live workforce metrics"}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {Object.keys(quickCounts).length > 0 && (
                <Button
                  variant="tectonic"
                  size="sm"
                  onClick={handleSaveAllCounts}
                  isLoading={isUpdatingCounts}
                  iconStart={<Save className="h-3.5 w-3.5 text-copper-600" />}
                >
                  {isAr ? `حفظ الأعداد المعدلة (${Object.keys(quickCounts).length})` : `Save Headcounts (${Object.keys(quickCounts).length})`}
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={openCreateCategoryModal}
                iconStart={<Plus className="h-3.5 w-3.5" />}
              >
                {isAr ? "إضافة فئة جديدة" : "Add New Category"}
              </Button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "إجمالي القوى العاملة النشطة" : "Total Active Workforce"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-copper-600">
                  {workforceData?.totalEmployees?.toLocaleString() ?? "0"}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "موظف وكادر" : "personnel"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "الفئات النشطة المعروضة" : "Active Categories"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-700">
                  {workforceData?.activeCount ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "فئة معتمدة" : "active"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "الفئات المعطلة / المسودة" : "Inactive Categories"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-basalt-600">
                  {workforceData?.inactiveCount ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "غير معروضة" : "hidden"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "إجمالي التصنيفات" : "Total Disciplines"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-basalt-900">
                  {workforceData?.totalCategories ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "تصنيف مسجل" : "registered"}</span>
              </div>
            </div>
          </div>

          {/* Categories Management Table */}
          {isLoadingWorkforce ? (
            <div className="py-12 text-center text-xs text-basalt-500 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-copper-600" />
              <span>{isAr ? "جاري تحميل بيانات القوى العاملة..." : "Loading workforce disciplines..."}</span>
            </div>
          ) : workforceData?.categories && workforceData.categories.length > 0 ? (
            <div className="overflow-x-auto border border-sand-200 rounded-[8px]">
              <table className="w-full text-xs text-start">
                <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-700">
                  <tr>
                    <th className="p-3 font-semibold text-center w-16">{isAr ? "الترتيب" : "Order"}</th>
                    <th className="p-3 font-semibold">{isAr ? "المسمى (عربي / إنجليزي)" : "Category (AR / EN)"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الوصف التخصصي" : "Specialization Description"}</th>
                    <th className="p-3 font-semibold text-center w-36">{isAr ? "عدد الكوادر" : "Headcount"}</th>
                    <th className="p-3 font-semibold text-center w-28">{isAr ? "النسبة" : "Share %"}</th>
                    <th className="p-3 font-semibold text-center w-28">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-3 font-semibold text-center w-28">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200 bg-white">
                  {workforceData.categories.map((cat, idx) => {
                    const currentCount = quickCounts[cat.id] !== undefined ? quickCounts[cat.id] : cat.employeeCount;
                    const totalActive = workforceData.totalEmployees || 1;
                    const sharePct = ((cat.employeeCount / totalActive) * 100).toFixed(1);
                    const isFirst = idx === 0;
                    const isLast = idx === workforceData.categories.length - 1;

                    return (
                      <tr key={cat.id} className="hover:bg-sand-50/50 transition-colors">
                        {/* Display Order & Reorder Controls */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono font-bold text-basalt-500 text-xs w-4">{cat.displayOrder}</span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={isFirst || isReorderingCat}
                                onClick={() => handleMoveCategory(idx, "up")}
                                className="p-0.5 text-basalt-400 hover:text-copper-600 disabled:opacity-20 disabled:hover:text-basalt-400 transition-colors rounded"
                                title={isAr ? "تحريك لأعلى" : "Move Up"}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast || isReorderingCat}
                                onClick={() => handleMoveCategory(idx, "down")}
                                className="p-0.5 text-basalt-400 hover:text-copper-600 disabled:opacity-20 disabled:hover:text-basalt-400 transition-colors rounded"
                                title={isAr ? "تحريك لأسفل" : "Move Down"}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Names (AR & EN) */}
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <p className="font-bold text-basalt-950 text-xs">{cat.nameAr}</p>
                            <p className="font-mono text-[11px] text-basalt-500">{cat.nameEn}</p>
                          </div>
                        </td>

                        {/* Description Preview */}
                        <td className="p-3 max-w-xs">
                          <p className="text-basalt-700 text-[11px] line-clamp-1">
                            {isAr ? cat.descriptionAr || "—" : cat.descriptionEn || "—"}
                          </p>
                        </td>

                        {/* Headcount Input */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              value={currentCount}
                              onChange={(e) => handleQuickCountChange(cat.id, parseInt(e.target.value) || 0)}
                              className={`w-20 h-8 px-2 text-center text-xs font-mono font-bold rounded-[6px] border ${
                                quickCounts[cat.id] !== undefined && quickCounts[cat.id] !== cat.employeeCount
                                  ? "border-copper-500 bg-copper-50/50 text-copper-900 ring-1 ring-copper-500/20"
                                  : "border-sand-300 bg-white text-basalt-900 focus-ring"
                              }`}
                            />
                          </div>
                        </td>

                        {/* Share % */}
                        <td className="p-3 text-center">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-copper-600">{sharePct}%</span>
                            <div className="w-16 mx-auto bg-sand-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-copper-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.max(0, Number(sharePct)))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryActive(cat)}
                            className="inline-block transition-transform hover:scale-105"
                            title={isAr ? "انقر للتبديل بين التفعيل والإخفاء" : "Click to toggle active status"}
                          >
                            {cat.isActive ? (
                              <Badge variant="success" className="cursor-pointer">
                                {isAr ? "نشط" : "Active"}
                              </Badge>
                            ) : (
                              <Badge variant="slate" className="cursor-pointer">
                                {isAr ? "معطل" : "Inactive"}
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-1.5 text-basalt-500 hover:text-copper-600 hover:bg-sand-100 rounded-[6px] transition-colors"
                              title={isAr ? "تعديل الفئة" : "Edit Category"}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmModal({ isOpen: true, category: cat })}
                              className="p-1.5 text-basalt-500 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                              title={isAr ? "حذف الفئة" : "Delete Category"}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-sand-300 rounded-[8px] space-y-3">
              <Users className="h-8 w-8 text-basalt-400 mx-auto" />
              <p className="text-xs text-basalt-600 font-semibold">
                {isAr ? "لا توجد فئات قوى عاملة مسجلة حالياً." : "No workforce categories registered yet."}
              </p>
              <Button size="sm" variant="primary" onClick={openCreateCategoryModal}>
                {isAr ? "إضافة الفئة الأولى" : "Add First Category"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Projects Management CMS */}
      {activeTab === "PROJECTS" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          {/* Action Notification Banner */}
          {projectActionMsg && (
            <div
              className={`p-3.5 rounded-[6px] text-xs font-semibold flex items-center gap-2 ${
                projectActionMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {projectActionMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              )}
              <span>{projectActionMsg.text}</span>
            </div>
          )}

          {/* Section Header & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-copper-600" />
                <h2 className="text-lg font-bold text-basalt-950">
                  {isAr ? "إدارة المشاريع ودراسات الحالة الإنشائية" : "Project Case Studies & Showcase Management"}
                </h2>
              </div>
              <p className="text-xs text-basalt-500 mt-0.5">
                {isAr
                  ? "إضافة وتعديل وأرشفة مشاريع البنية التحتية، وتحديد المشاريع الاستراتيجية المعروضة في المنصة"
                  : "Add, edit, and organize infrastructure project dossiers, flagship milestones, and public visibility"}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateProjectModal}
              iconStart={<Plus className="h-3.5 w-3.5" />}
            >
              {isAr ? "إضافة مشروع جديد" : "Add New Project"}
            </Button>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "إجمالي المشاريع المسجلة" : "Total Projects"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-basalt-900">
                  {adminProjectsData?.meta.total ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "مشروع" : "projects"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "المشاريع المنشورة للعموم" : "Published Live"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-700">
                  {adminProjectsData?.meta.publishedCount ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "مرئي" : "live"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "المشاريع الاستراتيجية (Flagship)" : "Flagship Projects"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-copper-600">
                  {adminProjectsData?.meta.flagshipCount ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "مميز" : "featured"}</span>
              </div>
            </div>

            <div className="bg-sand-50/80 border border-sand-200 rounded-[8px] p-4 text-start">
              <span className="text-[11px] font-semibold text-basalt-500 uppercase tracking-wider block">
                {isAr ? "المسودات والمشاريع المؤرشفة" : "Drafts / Hidden"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-basalt-500">
                  {adminProjectsData?.meta.draftCount ?? 0}
                </span>
                <span className="text-xs text-basalt-500 font-semibold">{isAr ? "مخفي" : "draft"}</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-sand-50/60 border border-sand-200 rounded-[8px] p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute start-2.5 top-2.5 h-3.5 w-3.5 text-basalt-400" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder={isAr ? "بحث بالعنوان أو المدينة..." : "Search title or city..."}
                className="w-full h-8 ps-8 pe-3 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring"
              />
            </div>

            {/* Sector / Vertical Filter */}
            <select
              value={projectVerticalFilter}
              onChange={(e) => setProjectVerticalFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring text-basalt-800"
            >
              <option value="">{isAr ? "كافة القطاعات التخصصية" : "All Sectors"}</option>
              {capabilitiesList?.map((v) => (
                <option key={v.id} value={v.id}>
                  {isAr ? v.titleAr : v.titleEn}
                </option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              value={projectRegionFilter}
              onChange={(e) => setProjectRegionFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring text-basalt-800"
            >
              <option value="">{isAr ? "كافة المناطق" : "All Regions"}</option>
              <option value="CENTRAL">{isAr ? "الوسطى (الرياض)" : "Central"}</option>
              <option value="WESTERN">{isAr ? "الغربية (مكة وجدة)" : "Western"}</option>
              <option value="EASTERN">{isAr ? "الشرقية" : "Eastern"}</option>
              <option value="SOUTHERN">{isAr ? "الجنوبية" : "Southern"}</option>
              <option value="NORTHERN">{isAr ? "الشمالية" : "Northern"}</option>
            </select>

            {/* Execution Status Filter */}
            <select
              value={projectStatusFilter}
              onChange={(e) => setProjectStatusFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring text-basalt-800"
            >
              <option value="">{isAr ? "حالة التنفيذ (الكل)" : "All Execution Statuses"}</option>
              <option value="COMPLETED">{isAr ? "منجز ومسلّم (COMPLETED)" : "Completed"}</option>
              <option value="ACTIVE_EXECUTION">{isAr ? "قيد التنفيذ (ACTIVE)" : "Active Execution"}</option>
            </select>

            {/* Publish Status Filter */}
            <select
              value={projectPublishFilter}
              onChange={(e) => setProjectPublishFilter(e.target.value)}
              className="h-8 px-2.5 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring text-basalt-800"
            >
              <option value="">{isAr ? "حالة النشر (الكل)" : "All Visibility"}</option>
              <option value="true">{isAr ? "المنشورة فقط" : "Published Only"}</option>
              <option value="false">{isAr ? "المسودات / المخفية" : "Drafts Only"}</option>
            </select>
          </div>

          {/* Projects Data Table */}
          {isLoadingAdminProjects ? (
            <div className="py-12 text-center text-xs text-basalt-500 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-copper-600" />
              <span>{isAr ? "جاري تحميل سجل المشاريع..." : "Loading project dossiers..."}</span>
            </div>
          ) : adminProjectsData?.data && adminProjectsData.data.length > 0 ? (
            <div className="overflow-x-auto border border-sand-200 rounded-[8px]">
              <table className="w-full text-xs text-start">
                <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-700">
                  <tr>
                    <th className="p-3 font-semibold text-center w-14">{isAr ? "الترتيب" : "Order"}</th>
                    <th className="p-3 font-semibold">{isAr ? "المشروع والصورة" : "Project & Visual"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الجهة المالكة والقطاع" : "Client & Sector"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الموقع والسنة" : "Location & Year"}</th>
                    <th className="p-3 font-semibold text-center w-28">{isAr ? "حالة التنفيذ" : "Status"}</th>
                    <th className="p-3 font-semibold text-center w-20">{isAr ? "استراتيجي" : "Flagship"}</th>
                    <th className="p-3 font-semibold text-center w-24">{isAr ? "حالة النشر" : "Publish"}</th>
                    <th className="p-3 font-semibold text-center w-24">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200 bg-white">
                  {adminProjectsData.data.map((proj, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === adminProjectsData.data.length - 1;

                    return (
                      <tr key={proj.id} className="hover:bg-sand-50/50 transition-colors">
                        {/* Order & Reorder Controls */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono font-bold text-basalt-500 text-xs w-4">
                              {proj.displayOrder ?? idx + 1}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={isFirst || isReorderingProjects}
                                onClick={() => handleMoveProject(idx, "up")}
                                className="p-0.5 text-basalt-400 hover:text-copper-600 disabled:opacity-20 transition-colors rounded"
                                title={isAr ? "تحريك لأعلى" : "Move Up"}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast || isReorderingProjects}
                                onClick={() => handleMoveProject(idx, "down")}
                                className="p-0.5 text-basalt-400 hover:text-copper-600 disabled:opacity-20 transition-colors rounded"
                                title={isAr ? "تحريك لأسفل" : "Move Down"}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Project Visual & Title */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.heroImageUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=200&q=80"}
                              alt={proj.titleEn}
                              className="w-12 h-10 object-cover rounded-[4px] border border-sand-300 flex-shrink-0 bg-sand-100"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-basalt-950 text-xs truncate max-w-xs">{proj.titleAr}</p>
                                <a
                                  href={`/projects/${proj.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-basalt-400 hover:text-copper-600"
                                  title={isAr ? "معاينة الصفحة العامة للمشروع" : "Preview Public Case Study"}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              <p className="font-mono text-[11px] text-basalt-500 truncate max-w-xs">{proj.titleEn}</p>
                              <span className="font-mono text-[10px] text-copper-600 bg-copper-50 px-1 rounded">
                                /{proj.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Client & Sector */}
                        <td className="p-3">
                          <div className="space-y-1">
                            <p className="font-semibold text-basalt-900 text-xs">
                              {isAr ? proj.clientNameAr || proj.clientId : proj.clientNameEn || proj.clientId}
                            </p>
                            <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-sand-100 text-basalt-700 border border-sand-200">
                              {isAr ? proj.verticalTitleAr || proj.verticalId : proj.verticalTitleEn || proj.verticalId}
                            </span>
                          </div>
                        </td>

                        {/* Location & Year */}
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-basalt-800">
                              <MapPin className="h-3 w-3 text-copper-600 flex-shrink-0" />
                              <span>{isAr ? proj.cityAr : proj.cityEn}</span>
                            </div>
                            <p className="font-mono text-[11px] text-basalt-500 ps-4">
                              {proj.yearGregorian}م ({proj.yearHijri}هـ)
                            </p>
                          </div>
                        </td>

                        {/* Execution Status */}
                        <td className="p-3 text-center">
                          {proj.executionStatus === "COMPLETED" ? (
                            <Badge variant="success">{isAr ? "منجز" : "Completed"}</Badge>
                          ) : (
                            <Badge variant="warning">{isAr ? "قيد التنفيذ" : "Active"}</Badge>
                          )}
                        </td>

                        {/* Flagship Toggle */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProjectFeatured(proj)}
                            disabled={isTogglingFeatured}
                            className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                              proj.isFlagship
                                ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                                : "text-basalt-300 hover:text-amber-500 hover:bg-sand-100"
                            }`}
                            title={isAr ? "تبديل حالة التمييز كمشروع استراتيجي" : "Toggle Flagship Milestone"}
                          >
                            <Star className={`h-4 w-4 ${proj.isFlagship ? "fill-amber-400" : ""}`} />
                          </button>
                        </td>

                        {/* Publish Status Toggle */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProjectPublish(proj)}
                            disabled={isTogglingPublish}
                            className="inline-block transition-transform hover:scale-105"
                            title={isAr ? "انقر لتبديل حالة النشر" : "Click to toggle publish status"}
                          >
                            {proj.isPublished ? (
                              <Badge variant="success" className="cursor-pointer">
                                {isAr ? "منشور" : "Published"}
                              </Badge>
                            ) : (
                              <Badge variant="slate" className="cursor-pointer">
                                {isAr ? "مسودة" : "Draft"}
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditProjectModal(proj)}
                              className="p-1.5 text-basalt-500 hover:text-copper-600 hover:bg-sand-100 rounded-[6px] transition-colors"
                              title={isAr ? "تعديل دراسة الحالة" : "Edit Case Study"}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteProjectModal({ isOpen: true, project: proj })}
                              className="p-1.5 text-basalt-500 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                              title={isAr ? "حذف المشروع" : "Delete Project"}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-sand-300 rounded-[8px] space-y-3">
              <FolderKanban className="h-8 w-8 text-basalt-400 mx-auto" />
              <p className="text-xs text-basalt-600 font-semibold">
                {isAr ? "لم يتم العثور على مشاريع مطابقة للتصفيات المختارة." : "No projects matched the selected filters."}
              </p>
              <Button size="sm" variant="primary" onClick={openCreateProjectModal}>
                {isAr ? "إضافة مشروع جديد" : "Add New Project"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Dossier Modal */}
      {selectedInquiry && (
        <ModalDialog
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={
            isAr
              ? `مراجعة طلب الاستفسار — ${selectedInquiry.trackingId}`
              : `Inquiry Dossier — ${selectedInquiry.trackingId}`
          }
          subtitle={selectedInquiry.organization}
          maxWidth="lg"
        >
          <div className="space-y-4 text-start text-xs">
            {/* Header Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(selectedInquiry.workflowStatus)}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
                selectedInquiry.intentType === "GOVERNMENT_TENDER" ? "bg-blue-100 text-blue-700" :
                selectedInquiry.intentType === "ENTERPRISE_RFP" ? "bg-purple-100 text-purple-700" :
                selectedInquiry.intentType === "SUBCONTRACTOR_ONBOARD" ? "bg-green-100 text-green-700" :
                selectedInquiry.intentType === "TECHNICAL_RFI" ? "bg-orange-100 text-orange-700" :
                "bg-sand-100 text-basalt-700"
              }`}>
                {selectedInquiry.intentType}
              </span>
              {selectedInquiry.isRead
                ? <span className="inline-flex items-center gap-1 text-[10px] font-medium text-basalt-400"><MailCheck className="h-3 w-3" />{isAr ? "مقروء" : "Read"}</span>
                : <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600"><MailOpen className="h-3 w-3" />{isAr ? "غير مقروء" : "Unread"}</span>}
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-3 bg-sand-50 p-4 rounded-[8px] border border-sand-200">
              <div>
                <p className="text-[10px] text-basalt-500 mb-0.5">{isAr ? "اسم مقدم الطلب" : "Contact Name"}</p>
                <p className="font-bold text-basalt-900">{selectedInquiry.fullName}</p>
              </div>
              <div>
                <p className="text-[10px] text-basalt-500 mb-0.5">{isAr ? "الجهة / المنشأة" : "Organization"}</p>
                <p className="font-bold text-basalt-900">{selectedInquiry.organization}</p>
              </div>
              <div>
                <p className="text-[10px] text-basalt-500 mb-0.5">{isAr ? "البريد الإلكتروني" : "Email"}</p>
                <a href={`mailto:${selectedInquiry.email}`} className="font-mono text-copper-600 hover:underline">{selectedInquiry.email}</a>
              </div>
              <div>
                <p className="text-[10px] text-basalt-500 mb-0.5">{isAr ? "الهاتف" : "Phone"}</p>
                <a href={`tel:${selectedInquiry.phone}`} className="font-mono text-basalt-800 hover:underline">{selectedInquiry.phone}</a>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-basalt-500 mb-0.5">{isAr ? "تاريخ الاستلام" : "Received"}</p>
                <p className="font-mono text-basalt-700">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Scoped Data */}
            {selectedInquiry.scopedData && Object.keys(selectedInquiry.scopedData).length > 0 && (
              <div>
                <p className="font-semibold text-basalt-800 mb-2">{isAr ? "البيانات التفصيلية للطلب:" : "Scoped Form Data:"}</p>
                <div className="bg-sand-50 p-3 rounded-[6px] border border-sand-200 max-h-52 overflow-y-auto divide-y divide-sand-100">
                  {Object.entries(selectedInquiry.scopedData).map(([key, val]) =>
                    val ? (
                      <div key={key} className="flex justify-between gap-3 py-1.5">
                        <span className="text-basalt-500 font-mono text-[10px] shrink-0">{key}</span>
                        <span className="font-medium text-basalt-900 text-end">{String(val)}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div className="p-4 bg-sand-50/60 border border-sand-200 rounded-[8px] space-y-3">
              <p className="font-semibold text-basalt-800">{isAr ? "تحديث حالة الطلب" : "Update Workflow Status"}</p>
              <select
                value={inquiryNewStatus}
                onChange={(e) => setInquiryNewStatus(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
              >
                <option value="NEW">{isAr ? "جديد" : "New"}</option>
                <option value="IN_PROGRESS">{isAr ? "قيد المعالجة" : "In Progress"}</option>
                <option value="IN_REVIEW">{isAr ? "قيد المراجعة والتسعير" : "In Review"}</option>
                <option value="CONTACTED">{isAr ? "تم التواصل" : "Contacted"}</option>
                <option value="RESPONDED">{isAr ? "تم الرد وإرسال العرض" : "Responded"}</option>
                <option value="COMPLETED">{isAr ? "مكتمل" : "Completed"}</option>
                <option value="ARCHIVED">{isAr ? "مؤرشف" : "Archived"}</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block font-semibold text-basalt-800 mb-1.5">
                {isAr ? "ملاحظات داخلية" : "Internal Notes"}
              </label>
              <textarea
                rows={4}
                value={inquiryNotes}
                onChange={(e) => setInquiryNotes(e.target.value)}
                placeholder={isAr ? "دوّن ملاحظات التقدير، أرقام المناقصة، أو سجل التواصل..." : "Add estimator notes, tender references, or communication log entries..."}
                className="w-full p-3 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-sand-200">
              {/* Danger zone */}
              <div className="flex items-center gap-2">
                <Button
                  variant="tectonic"
                  size="sm"
                  iconStart={<Archive className="h-3.5 w-3.5" />}
                  isLoading={isArchivingInquiry}
                  onClick={handleArchiveInquiry}
                >
                  {isAr ? "أرشفة" : "Archive"}
                </Button>
                <Button
                  variant="tectonic"
                  size="sm"
                  iconStart={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                  isLoading={isDeletingInquiry}
                  onClick={handleDeleteInquiry}
                  className="!text-red-600 hover:!bg-red-50"
                >
                  {isAr ? "حذف" : "Delete"}
                </Button>
              </div>
              {/* Primary actions */}
              <div className="flex items-center gap-2">
                <Button variant="tectonic" size="sm" onClick={() => setSelectedInquiry(null)}>
                  {isAr ? "إغلاق" : "Close"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUpdatingInquiry || isSavingInqNotes}
                  iconStart={<Save className="h-3.5 w-3.5" />}
                  onClick={handleSaveInquiryStatus}
                >
                  {isAr ? "حفظ التحديثات" : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* Workforce Category Create / Edit Modal Dialog */}
      {categoryModal.isOpen && (
        <ModalDialog
          isOpen={categoryModal.isOpen}
          onClose={() => setCategoryModal({ isOpen: false, mode: "create", category: null })}
          title={
            categoryModal.mode === "create"
              ? isAr
                ? "إضافة فئة قوى عاملة جديدة"
                : "Add New Workforce Category"
              : isAr
              ? "تعديل فئة القوى العاملة"
              : "Edit Workforce Category"
          }
          subtitle={
            isAr
              ? "حدد المسمى المهني باللغتين العربية والإنجليزية وأعداد الكوادر والوصف التخصصي"
              : "Define the discipline titles in Arabic and English, current headcount, and operational scope"
          }
          maxWidth="lg"
        >
          <form onSubmit={handleCatSubmit(onSaveCategory)} className="space-y-4 text-start text-xs">
            {/* Bilingual Category Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "مسمى الفئة (بالعربية) *" : "Category Name (Arabic) *"}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: المهندسون"
                  {...registerCat("nameAr")}
                  className={`w-full h-9 px-3 bg-sand-50/50 border rounded-[6px] text-xs focus-ring ${
                    catErrors.nameAr ? "border-red-400 bg-red-50/20" : "border-sand-300"
                  }`}
                />
                {catErrors.nameAr && (
                  <p className="text-[11px] text-red-600 mt-1">{catErrors.nameAr.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "مسمى الفئة (بالإنجليزية) *" : "Category Name (English) *"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="e.g. Engineers"
                  {...registerCat("nameEn")}
                  className={`w-full h-9 px-3 bg-sand-50/50 border rounded-[6px] text-xs focus-ring ${
                    catErrors.nameEn ? "border-red-400 bg-red-50/20" : "border-sand-300"
                  }`}
                />
                {catErrors.nameEn && (
                  <p className="text-[11px] text-red-600 mt-1">{catErrors.nameEn.message}</p>
                )}
              </div>
            </div>

            {/* Employee Count & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "عدد الكوادر والموظفين *" : "Employee Headcount *"}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...registerCat("employeeCount", { valueAsNumber: true })}
                  className={`w-full h-9 px-3 bg-sand-50/50 border rounded-[6px] text-xs font-mono font-bold focus-ring ${
                    catErrors.employeeCount ? "border-red-400 bg-red-50/20" : "border-sand-300"
                  }`}
                />
                {catErrors.employeeCount && (
                  <p className="text-[11px] text-red-600 mt-1">{catErrors.employeeCount.message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "ترتيب العرض في الموقع" : "Display Order"}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="1"
                  {...registerCat("displayOrder", { valueAsNumber: true })}
                  className="w-full h-9 px-3 bg-sand-50/50 border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                />
              </div>
            </div>

            {/* Bilingual Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف التخصصي (بالعربية)" : "Description (Arabic)"}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  placeholder="مهندسو المشاريع المدنية والهيدروليكية والإنشائية..."
                  {...registerCat("descriptionAr")}
                  className="w-full p-2.5 bg-sand-50/50 border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                />
              </div>

              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف التخصصي (بالإنجليزية)" : "Description (English)"}
                </label>
                <textarea
                  rows={2}
                  dir="ltr"
                  placeholder="Civil, hydraulic, structural, and electrical project engineers..."
                  {...registerCat("descriptionEn")}
                  className="w-full p-2.5 bg-sand-50/50 border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                />
              </div>
            </div>

            {/* Active Status Checkbox */}
            <div className="pt-2 border-t border-sand-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...registerCat("isActive")}
                  className="h-4 w-4 rounded border-sand-400 text-copper-600 focus-ring"
                />
                <span className="text-xs font-semibold text-basalt-800">
                  {isAr ? "تفعيل الفئة وعرضها في الموقع العام" : "Active Category (visible on public website)"}
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setCategoryModal({ isOpen: false, mode: "create", category: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isCreatingCat || isUpdatingCat || isSubmittingCat}
                iconStart={<Save className="h-3.5 w-3.5" />}
              >
                {categoryModal.mode === "create"
                  ? isAr ? "إضافة الفئة" : "Create Category"
                  : isAr ? "حفظ التعديلات" : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* Delete Category Confirmation Dialog */}
      {deleteConfirmModal.isOpen && deleteConfirmModal.category && (
        <ModalDialog
          isOpen={deleteConfirmModal.isOpen}
          onClose={() => setDeleteConfirmModal({ isOpen: false, category: null })}
          title={isAr ? "تأكيد حذف فئة القوى العاملة" : "Confirm Category Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4 text-start text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] flex items-start gap-2.5 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isAr ? "هل أنت متأكد من رغبتك في حذف هذه الفئة؟" : "Are you sure you want to delete this category?"}
                </p>
                <p className="mt-1 text-[11px] text-red-700">
                  {isAr
                    ? `سيتم حذف فئة "${deleteConfirmModal.category.nameAr}" (${deleteConfirmModal.category.nameEn}) والتي تضم ${deleteConfirmModal.category.employeeCount} موظفاً. سيؤثر ذلك على إجمالي القوى العاملة المحسوبة في الموقع العام.`
                    : `This will permanently delete "${deleteConfirmModal.category.nameEn}" (${deleteConfirmModal.category.nameAr}) with ${deleteConfirmModal.category.employeeCount} personnel. Live public website statistics will update immediately.`}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteConfirmModal({ isOpen: false, category: null })}
              >
                {isAr ? "إلغاء التراجع" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingCat}
                onClick={handleDeleteCategory}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف النهائي" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* Project Case Study Create / Edit Modal Dialog */}
      {projectModal.isOpen && (
        <ModalDialog
          isOpen={projectModal.isOpen}
          onClose={() => setProjectModal({ isOpen: false, mode: "create", project: null })}
          title={
            projectModal.mode === "create"
              ? isAr
                ? "إضافة دراسة حالة مشروع جديد"
                : "Create New Project Case Study"
              : isAr
              ? "تعديل دراسة حالة المشروع"
              : "Edit Project Case Study"
          }
          subtitle={
            isAr
              ? "إدارة بيانات المشاريع، المواقع الجغرافية، مؤشرات الأداء، والمعدات المشاركة"
              : "Manage project profile, engineering metadata, client relations, and fleet telemetry"
          }
          maxWidth="xl"
        >
          <form onSubmit={handleProjSubmit(onSaveProject)} className="space-y-6 text-start text-xs max-h-[80vh] overflow-y-auto pr-1">
            {/* Section 1: Basic Information & Client/Vertical */}
            <div className="space-y-3 bg-sand-50/70 p-4 rounded-[8px] border border-sand-200">
              <h3 className="font-bold text-basalt-900 text-sm flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-copper-600" />
                <span>{isAr ? "1. البيانات الأساسية وتصنيف المشروع" : "1. Project Identity & Classification"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "عنوان المشروع (بالعربية) *" : "Project Title (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: تطوير شبكات مياه الشرب بالرياض"
                    {...registerProj("titleAr")}
                    className={`w-full h-9 px-3 bg-white border rounded-[6px] text-xs focus-ring ${
                      projErrors.titleAr ? "border-red-400 bg-red-50/20" : "border-sand-300"
                    }`}
                  />
                  {projErrors.titleAr && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.titleAr.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "عنوان المشروع (بالإنجليزية) *" : "Project Title (English) *"}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. Riyadh Potable Water Transmission Network"
                    {...registerProj("titleEn", {
                      onChange: (e) => {
                        // Automatically suggest slug if creating new
                        if (projectModal.mode === "create") {
                          const slugCandidate = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          setProjValue("slug", slugCandidate, { shouldValidate: true });
                        }
                      }
                    })}
                    className={`w-full h-9 px-3 bg-white border rounded-[6px] text-xs focus-ring ${
                      projErrors.titleEn ? "border-red-400 bg-red-50/20" : "border-sand-300"
                    }`}
                  />
                  {projErrors.titleEn && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.titleEn.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الرابط الدائم (Slug) *" : "SEO Slug *"}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="riyadh-water-transmission-network"
                    {...registerProj("slug")}
                    className={`w-full h-9 px-3 bg-white border rounded-[6px] font-mono text-xs focus-ring ${
                      projErrors.slug ? "border-red-400 bg-red-50/20" : "border-sand-300"
                    }`}
                  />
                  {projErrors.slug && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الجهة المالكة / العميل *" : "Client / Owner *"}
                  </label>
                  <select
                    {...registerProj("clientId")}
                    className={`w-full h-9 px-2 bg-white border rounded-[6px] text-xs focus-ring ${
                      projErrors.clientId ? "border-red-400" : "border-sand-300"
                    }`}
                  >
                    <option value="">{isAr ? "-- اختر العميل --" : "-- Select Client --"}</option>
                    {clientsList?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                  </select>
                  {projErrors.clientId && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.clientId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "القطاع / المجال التخصصي *" : "Sector / Capability *"}
                  </label>
                  <select
                    {...registerProj("verticalId")}
                    className={`w-full h-9 px-2 bg-white border rounded-[6px] text-xs focus-ring ${
                      projErrors.verticalId ? "border-red-400" : "border-sand-300"
                    }`}
                  >
                    <option value="">{isAr ? "-- اختر القطاع --" : "-- Select Sector --"}</option>
                    {capabilitiesList?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {isAr ? v.titleAr : v.titleEn}
                      </option>
                    ))}
                  </select>
                  {projErrors.verticalId && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.verticalId.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Location, Timeline & Execution Status */}
            <div className="space-y-3 bg-sand-50/70 p-4 rounded-[8px] border border-sand-200">
              <h3 className="font-bold text-basalt-900 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-copper-600" />
                <span>{isAr ? "2. الموقع الجغرافي والجدول الزمني" : "2. Geography & Execution Status"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "المنطقة الجغرافية *" : "Geographical Region *"}
                  </label>
                  <select
                    {...registerProj("region")}
                    className="w-full h-9 px-2 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring"
                  >
                    <option value="CENTRAL">{isAr ? "المنطقة الوسطى" : "Central Region"}</option>
                    <option value="EASTERN">{isAr ? "المنطقة الشرقية" : "Eastern Region"}</option>
                    <option value="WESTERN">{isAr ? "المنطقة الغربية" : "Western Region"}</option>
                    <option value="SOUTHERN">{isAr ? "المنطقة الجنوبية" : "Southern Region"}</option>
                    <option value="NORTHERN">{isAr ? "المنطقة الشمالية" : "Northern Region"}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "المدينة (بالعربية) *" : "City (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="الرياض"
                    {...registerProj("cityAr")}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "المدينة (بالإنجليزية) *" : "City (English) *"}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Riyadh"
                    {...registerProj("cityEn")}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "حالة التنفيذ *" : "Execution Status *"}
                  </label>
                  <select
                    {...registerProj("executionStatus")}
                    className="w-full h-9 px-2 bg-white border border-sand-300 rounded-[6px] text-xs font-semibold focus-ring"
                  >
                    <option value="COMPLETED">{isAr ? "مكتمل (COMPLETED)" : "COMPLETED"}</option>
                    <option value="ONGOING">{isAr ? "قيد التنفيذ (ONGOING)" : "ONGOING"}</option>
                    <option value="CONTRACTED">{isAr ? "تم التعاقد (CONTRACTED)" : "CONTRACTED"}</option>
                    <option value="PLANNING">{isAr ? "مرحلة التخطيط (PLANNING)" : "PLANNING"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "سنة الإنجاز (ميلادي) *" : "Completion Year (AD) *"}
                  </label>
                  <input
                    type="number"
                    min={1980}
                    max={2050}
                    {...registerProj("yearGregorian", { valueAsNumber: true })}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "سنة الإنجاز (هجري) *" : "Completion Year (AH) *"}
                  </label>
                  <input
                    type="number"
                    min={1400}
                    max={1500}
                    {...registerProj("yearHijri", { valueAsNumber: true })}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "خط العرض (Latitude)" : "Latitude"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...registerProj("lat", { valueAsNumber: true })}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "خط الطول (Longitude)" : "Longitude"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...registerProj("lng", { valueAsNumber: true })}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Narrative & Case Study Content */}
            <div className="space-y-3 bg-sand-50/70 p-4 rounded-[8px] border border-sand-200">
              <h3 className="font-bold text-basalt-900 text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-copper-600" />
                <span>{isAr ? "3. الملخص الهندسي ودراسة الحالة" : "3. Technical Narrative & Case Study"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الملخص التنفيذي (بالعربية) *" : "Executive Summary (Arabic) *"}
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    placeholder="نبذة موجزة وشاملة عن نطاق أعمال المشروع وأهدافه..."
                    {...registerProj("summaryAr")}
                    className={`w-full p-2.5 bg-white border rounded-[6px] text-xs resize-none focus-ring ${
                      projErrors.summaryAr ? "border-red-400 bg-red-50/20" : "border-sand-300"
                    }`}
                  />
                  {projErrors.summaryAr && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.summaryAr.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الملخص التنفيذي (بالإنجليزية) *" : "Executive Summary (English) *"}
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    placeholder="Comprehensive executive summary detailing the scope of work and deliverables..."
                    {...registerProj("summaryEn")}
                    className={`w-full p-2.5 bg-white border rounded-[6px] text-xs resize-none focus-ring ${
                      projErrors.summaryEn ? "border-red-400 bg-red-50/20" : "border-sand-300"
                    }`}
                  />
                  {projErrors.summaryEn && (
                    <p className="text-[11px] text-red-600 mt-1">{projErrors.summaryEn.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "التحدي الهندسي (بالعربية)" : "Engineering Challenge (Arabic)"}
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="التحديات التضاريسية والجيوتقنية أو ضيق الجداول الزمنية..."
                    {...registerProj("challengeAr")}
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "التحدي الهندسي (بالإنجليزية)" : "Engineering Challenge (English)"}
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    placeholder="Geotechnical, logistical, or tight timeframe constraints encountered..."
                    {...registerProj("challengeEn")}
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الحل الفني والمنهجية (بالعربية)" : "Technical Solution (Arabic)"}
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="الحلول المبتكرة واستخدام التقنيات الحديثة وفرق العمل المتخصصة..."
                    {...registerProj("solutionAr")}
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "الحل الفني والمنهجية (بالإنجليزية)" : "Technical Solution (English)"}
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    placeholder="Methodologies, advanced equipment, and specialized workflows deployed..."
                    {...registerProj("solutionEn")}
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-[6px] text-xs resize-none focus-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Media & Image Gallery */}
            <div className="space-y-3 bg-sand-50/70 p-4 rounded-[8px] border border-sand-200">
              <h3 className="font-bold text-basalt-900 text-sm flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-copper-600" />
                <span>{isAr ? "4. الوسائط والصورة الرئيسية" : "4. Imagery & Media Gallery"}</span>
              </h3>

              <div>
                <label className="block font-semibold text-basalt-800 mb-1">
                  {isAr ? "رابط الصورة الرئيسية (Hero Image URL) *" : "Hero Image URL *"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://images.unsplash.com/photo-..."
                    {...registerProj("heroImageUrl")}
                    className={`w-full h-9 px-3 bg-white border rounded-[6px] font-mono text-xs focus-ring ${
                      projErrors.heroImageUrl ? "border-red-400" : "border-sand-300"
                    }`}
                  />
                </div>
                {projErrors.heroImageUrl && (
                  <p className="text-[11px] text-red-600 mt-1">{projErrors.heroImageUrl.message}</p>
                )}

                {/* Hero Image Live Preview */}
                {watchProj("heroImageUrl") && (
                  <div className="mt-2 relative h-32 w-full max-w-sm rounded-[6px] overflow-hidden border border-sand-300 bg-sand-100">
                    <img
                      src={watchProj("heroImageUrl")}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Visibility, Flagship & Display Order */}
            <div className="space-y-3 bg-sand-50/70 p-4 rounded-[8px] border border-sand-200">
              <h3 className="font-bold text-basalt-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-copper-600" />
                <span>{isAr ? "5. حالة النشر والتمييز وترتيب الظهور" : "5. Visibility, Flagship & Order"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block font-semibold text-basalt-800 mb-1">
                    {isAr ? "ترتيب العرض في القائمة" : "Display Order"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="1"
                    {...registerProj("displayOrder", { valueAsNumber: true })}
                    className="w-full h-9 px-3 bg-white border border-sand-300 rounded-[6px] text-xs font-mono focus-ring"
                  />
                </div>

                <div className="sm:pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-[6px] border border-sand-200 hover:border-sand-300">
                    <input
                      type="checkbox"
                      {...registerProj("isFlagship")}
                      className="h-4 w-4 rounded border-sand-400 text-amber-500 focus-ring"
                    />
                    <div className="flex items-center gap-1 text-xs font-semibold text-basalt-800">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{isAr ? "مشروع رائد مميز (Flagship)" : "Featured Flagship"}</span>
                    </div>
                  </label>
                </div>

                <div className="sm:pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-[6px] border border-sand-200 hover:border-sand-300">
                    <input
                      type="checkbox"
                      {...registerProj("isPublished")}
                      className="h-4 w-4 rounded border-sand-400 text-copper-600 focus-ring"
                    />
                    <div className="flex items-center gap-1 text-xs font-semibold text-basalt-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{isAr ? "نشر في الموقع العام (Published)" : "Publish on Live Site"}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setProjectModal({ isOpen: false, mode: "create", project: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isCreatingProject || isUpdatingProject || isSubmittingProj}
                iconStart={<Save className="h-3.5 w-3.5" />}
              >
                {projectModal.mode === "create"
                  ? isAr ? "إنشاء دراسة الحالة" : "Create Case Study"
                  : isAr ? "حفظ التعديلات" : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* Delete Project Confirmation Dialog */}
      {deleteProjectModal.isOpen && deleteProjectModal.project && (
        <ModalDialog
          isOpen={deleteProjectModal.isOpen}
          onClose={() => setDeleteProjectModal({ isOpen: false, project: null })}
          title={isAr ? "تأكيد حذف دراسة حالة المشروع" : "Confirm Project Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4 text-start text-xs">
            <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] flex items-start gap-2.5 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isAr ? "هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً؟" : "Are you sure you want to permanently delete this project?"}
                </p>
                <p className="mt-1 text-[11px] text-red-700">
                  {isAr
                    ? `سيتم إزالة مشروع "${deleteProjectModal.project.titleAr}" (${deleteProjectModal.project.titleEn}) بشكل كامل من قاعدة البيانات والموقع العام.`
                    : `This will permanently delete "${deleteProjectModal.project.titleEn}" (${deleteProjectModal.project.titleAr}) from the database and remove it from the public showcase.`}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteProjectModal({ isOpen: false, project: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingProject}
                onClick={handleDeleteProject}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف النهائي" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* TAB: Capabilities / Services Management */}
      {activeTab === "CAPABILITIES" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-basalt-950">
                {isAr ? "إدارة الخدمات والكفاءات" : "Services & Capabilities Management"}
              </h2>
              <p className="text-xs text-basalt-500">
                {isAr ? "أضف أو عدّل أو رتّب خدمات الشركة المعروضة على الموقع" : "Add, edit, and reorder company service verticals displayed on the website"}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              iconStart={<Plus className="h-4 w-4" />}
              onClick={openCreateCapabilityModal}
            >
              {isAr ? "إضافة خدمة جديدة" : "Add Service"}
            </Button>
          </div>

          {/* Action Message */}
          {capabilityActionMsg && (
            <div className={`p-3 rounded text-xs border ${
              capabilityActionMsg.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {capabilityActionMsg.text}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-sand-50 border border-sand-200 rounded-[6px] p-4 text-center">
              <p className="text-2xl font-bold text-basalt-950">{adminCapabilitiesData?.meta?.totalCount ?? 0}</p>
              <p className="text-xs text-basalt-500 mt-1">{isAr ? "إجمالي الخدمات" : "Total Services"}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-[6px] p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{adminCapabilitiesData?.meta?.activeCount ?? 0}</p>
              <p className="text-xs text-emerald-600 mt-1">{isAr ? "خدمات مفعّلة" : "Active Services"}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-[6px] p-4 text-center">
              <p className="text-2xl font-bold text-amber-700">{adminCapabilitiesData?.meta?.featuredCount ?? 0}</p>
              <p className="text-xs text-amber-600 mt-1">{isAr ? "خدمات مميّزة" : "Featured Services"}</p>
            </div>
          </div>

          {/* Services Table */}
          {isLoadingAdminCaps ? (
            <p className="text-xs text-basalt-500 py-6 text-center">{isAr ? "جاري تحميل الخدمات..." : "Loading services..."}</p>
          ) : adminCapabilitiesData?.data && adminCapabilitiesData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-sand-100/70 border-b border-sand-200 text-basalt-700">
                  <tr>
                    <th className="p-3 font-semibold w-16">{isAr ? "الترتيب" : "Order"}</th>
                    <th className="p-3 font-semibold">{isAr ? "المعرف" : "ID / Code"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الاسم" : "Title"}</th>
                    <th className="p-3 font-semibold">{isAr ? "الوصف" : "Short Description"}</th>
                    <th className="p-3 font-semibold text-center">{isAr ? "مميّز" : "Featured"}</th>
                    <th className="p-3 font-semibold text-center">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-3 font-semibold text-center">{isAr ? "إجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {adminCapabilitiesData.data.map((cap, idx) => (
                    <tr key={cap.id} className="hover:bg-sand-50/60">
                      <td className="p-3">
                        <div className="flex flex-col gap-1 items-center">
                          <button
                            onClick={() => handleMoveCapability(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-sand-200 disabled:opacity-30"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-[11px] text-basalt-600">{cap.displayOrder ?? idx + 1}</span>
                          <button
                            onClick={() => handleMoveCapability(idx, "down")}
                            disabled={idx === adminCapabilitiesData.data.length - 1}
                            className="p-1 rounded hover:bg-sand-200 disabled:opacity-30"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-mono font-bold text-basalt-900 text-[11px]">{cap.id}</p>
                        <p className="font-mono text-basalt-500 text-[10px]">{cap.code}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-basalt-900">{isAr ? cap.titleAr : cap.titleEn}</p>
                        <p className="text-basalt-500 text-[11px]">{isAr ? cap.titleEn : cap.titleAr}</p>
                      </td>
                      <td className="p-3 max-w-[220px]">
                        <p className="text-basalt-600 line-clamp-2">{isAr ? cap.shortDescAr : cap.shortDescEn}</p>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleCapabilityFeatured(cap)}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                            cap.isFeatured ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "bg-sand-100 text-basalt-400 hover:bg-sand-200"
                          }`}
                          title={cap.isFeatured ? "Remove featured" : "Mark as featured"}
                        >
                          <Star className="h-3.5 w-3.5" fill={cap.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleCapabilityActive(cap)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            cap.isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {cap.isActive ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {cap.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "معطّل" : "Inactive")}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditCapabilityModal(cap)}
                            className="p-1.5 rounded hover:bg-sand-100 text-basalt-600 hover:text-basalt-950"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCapabilityModal({ isOpen: true, capability: cap })}
                            className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <Layers className="h-12 w-12 text-basalt-300 mx-auto mb-3" />
              <p className="text-sm text-basalt-500">{isAr ? "لا توجد خدمات بعد. أضف أول خدمة." : "No services yet. Add your first service."}</p>
              <Button variant="primary" size="sm" className="mt-4" iconStart={<Plus className="h-4 w-4" />} onClick={openCreateCapabilityModal}>
                {isAr ? "إضافة خدمة" : "Add Service"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Capability Create/Edit Modal */}
      {capabilityModal.isOpen && (
        <ModalDialog
          isOpen={capabilityModal.isOpen}
          onClose={() => setCapabilityModal({ isOpen: false, mode: "create", capability: null })}
          title={capabilityModal.mode === "create"
            ? (isAr ? "إضافة خدمة جديدة" : "Add New Service")
            : (isAr ? "تعديل الخدمة" : "Edit Service")}
          maxWidth="xl"
        >
          <form onSubmit={handleCapSubmit(onSaveCapability)} className="space-y-5 text-start" noValidate>
            {/* ID & Code - create only */}
            {capabilityModal.mode === "create" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">ID (slug) *</label>
                  <input {...registerCap("id")} placeholder="e.g. water-networks" className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
                  {capErrors.id && <p className="text-red-500 text-[11px] mt-1">{capErrors.id.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-basalt-800 mb-1">Code (UPPER_SNAKE) *</label>
                  <input {...registerCap("code")} placeholder="e.g. WATER_NETWORKS" className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
                  {capErrors.code && <p className="text-red-500 text-[11px] mt-1">{capErrors.code.message}</p>}
                </div>
              </div>
            )}

            {/* Bilingual Titles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "العنوان بالعربي *" : "Title (Arabic) *"}</label>
                <input {...registerCap("titleAr")} dir="rtl" className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
                {capErrors.titleAr && <p className="text-red-500 text-[11px] mt-1">{capErrors.titleAr.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "العنوان بالإنجليزي *" : "Title (English) *"}</label>
                <input {...registerCap("titleEn")} className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
                {capErrors.titleEn && <p className="text-red-500 text-[11px] mt-1">{capErrors.titleEn.message}</p>}
              </div>
            </div>

            {/* Short Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "الوصف المختصر بالعربي *" : "Short Description (Arabic) *"}</label>
                <textarea {...registerCap("shortDescAr")} rows={2} dir="rtl" className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none" />
                {capErrors.shortDescAr && <p className="text-red-500 text-[11px] mt-1">{capErrors.shortDescAr.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "الوصف المختصر بالإنجليزي *" : "Short Description (English) *"}</label>
                <textarea {...registerCap("shortDescEn")} rows={2} className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none" />
                {capErrors.shortDescEn && <p className="text-red-500 text-[11px] mt-1">{capErrors.shortDescEn.message}</p>}
              </div>
            </div>

            {/* Full Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "الوصف الكامل بالعربي *" : "Full Description (Arabic) *"}</label>
                <textarea {...registerCap("fullDescAr")} rows={4} dir="rtl" className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none" />
                {capErrors.fullDescAr && <p className="text-red-500 text-[11px] mt-1">{capErrors.fullDescAr.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "الوصف الكامل بالإنجليزي *" : "Full Description (English) *"}</label>
                <textarea {...registerCap("fullDescEn")} rows={4} className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none" />
                {capErrors.fullDescEn && <p className="text-red-500 text-[11px] mt-1">{capErrors.fullDescEn.message}</p>}
              </div>
            </div>

            {/* Icon, Image URL, Order */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "اسم الأيقونة *" : "Icon Name *"}</label>
                <input {...registerCap("iconName")} placeholder="e.g. Layers" className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "رابط الصورة" : "Image URL"}</label>
                <input {...registerCap("imageUrl")} className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">{isAr ? "ترتيب العرض" : "Display Order"}</label>
                <input type="number" {...registerCap("displayOrder", { valueAsNumber: true })} className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50" />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerCap("isActive")} className="rounded" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "خدمة مفعّلة" : "Active"}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerCap("isFeatured")} className="rounded" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "خدمة مميّزة" : "Featured"}</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button type="button" variant="tectonic" size="sm" onClick={() => setCapabilityModal({ isOpen: false, mode: "create", capability: null })}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingCap || isCreatingCap || isUpdatingCap} iconStart={<Save className="h-3.5 w-3.5" />}>
                {capabilityModal.mode === "create" ? (isAr ? "إنشاء الخدمة" : "Create Service") : (isAr ? "حفظ التعديلات" : "Save Changes")}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* Capability Delete Confirm Modal */}
      {deleteCapabilityModal.isOpen && (
        <ModalDialog
          isOpen={deleteCapabilityModal.isOpen}
          onClose={() => setDeleteCapabilityModal({ isOpen: false, capability: null })}
          title={isAr ? "تأكيد حذف الخدمة" : "Confirm Service Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-basalt-700">
              {isAr
                ? `هل أنت متأكد من حذف الخدمة "${deleteCapabilityModal.capability?.titleAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete the service "${deleteCapabilityModal.capability?.titleEn}"? This action cannot be undone.`
              }
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button type="button" variant="tectonic" size="sm" onClick={() => setDeleteCapabilityModal({ isOpen: false, capability: null })}>
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="button" variant="primary" size="sm" className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white" isLoading={isDeletingCap} onClick={handleDeleteCapability} iconStart={<Trash2 className="h-3.5 w-3.5" />}>
                {isAr ? "تأكيد الحذف" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* ── TAB 7: Clients Management ──────────────────────────────────── */}
      {activeTab === "CLIENTS" && (
        <div className="space-y-6">
          {/* Action Notification Message */}
          {clientActionMsg && (
            <div className={`p-4 rounded-[6px] text-sm flex items-center gap-3 ${
              clientActionMsg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {clientActionMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
              <span>{clientActionMsg.text}</span>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "إجمالي الجهات والعملاء" : "Total Clients"}</span>
                <Building2 className="h-4 w-4 text-copper-500" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-950 font-mono">
                {adminClientsData?.meta?.totalCount ?? adminClientsData?.data?.length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "شريك وطني معتمد" : "Registered national partners"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "الجهات النشطة" : "Active Clients"}</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-extrabold text-green-600 font-mono">
                {adminClientsData?.meta?.activeCount ?? adminClientsData?.data?.filter((c) => c.isActive !== false).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "معروضة على الموقع العام" : "Displayed publicly"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "الجهات المميّزة" : "Featured Clients"}</span>
                <Star className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">
                {adminClientsData?.meta?.featuredCount ?? adminClientsData?.data?.filter((c) => c.isFeatured !== false).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "بارزة في مقدمة الصفحة" : "Featured in front grid"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "ترتيب العنصر القادم" : "Next Order Index"}</span>
                <SlidersHorizontal className="h-4 w-4 text-copper-500" />
              </div>
              <div className="text-2xl font-extrabold text-copper-600 font-mono">
                {(adminClientsData?.data?.length || 0) + 1}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "تخصيص تسلسلي تلقائي" : "Auto sequential index"}</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white border border-sand-200 rounded-[8px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                <input
                  type="text"
                  placeholder={isAr ? "بحث بالاسم أو المعرّف..." : "Search by name or slug..."}
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full h-9 ps-9 pe-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
                />
              </div>

              <select
                value={clientCategoryFilter}
                onChange={(e) => setClientCategoryFilter(e.target.value)}
                className="w-full sm:w-48 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "جميع التصنيفات" : "All Categories"}</option>
                <option value="MINISTRY">{isAr ? "وزارة سيادية" : "Ministry"}</option>
                <option value="AMANAT">{isAr ? "أمانة كبرى" : "Amanat"}</option>
                <option value="PIF_GIGA">{isAr ? "صندوق الاستثمارات (PIF)" : "PIF Giga"}</option>
                <option value="SEMI_GOV">{isAr ? "شبه حكومي" : "Semi-Gov"}</option>
                <option value="AUTHORITY">{isAr ? "هيئة وطنية" : "Authority"}</option>
                <option value="PRIVATE">{isAr ? "قطاع خاص" : "Private"}</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={openCreateClient}
              iconStart={<Plus className="h-4 w-4" />}
            >
              {isAr ? "إضافة عميل / شريك جديد" : "Add New Client"}
            </Button>
          </div>

          {/* Clients Table */}
          <div className="bg-white border border-sand-200 rounded-[8px] shadow-sm overflow-hidden">
            {isLoadingClients ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-copper-500" />
                {isAr ? "جاري تحميل قائمة العملاء..." : "Loading clients list..."}
              </div>
            ) : !adminClientsData?.data || adminClientsData.data.length === 0 ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-sand-400" />
                {isAr ? "لا توجد جهات مسجلة حالياً." : "No clients recorded yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-sand-50/80 border-b border-sand-200 text-basalt-600 font-semibold">
                      <th className="py-3 px-3 w-16 text-center">{isAr ? "الترتيب" : "Order"}</th>
                      <th className="py-3 px-3 w-16 text-center">{isAr ? "الشعار" : "Logo"}</th>
                      <th className="py-3 px-4">{isAr ? "اسم العميل (عربي / إنجليزي)" : "Client Name (AR / EN)"}</th>
                      <th className="py-3 px-3">{isAr ? "القطاع / التصنيف" : "Sector / Category"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "الموقع الإلكتروني" : "Website"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "نشط" : "Active"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "مميّز" : "Featured"}</th>
                      <th className="py-3 px-4 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {adminClientsData.data
                      .filter((c) => {
                        const matchesSearch =
                          !clientSearch ||
                          c.nameAr.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.nameEn.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.slug.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          c.monogram.toLowerCase().includes(clientSearch.toLowerCase());
                        const matchesCat = clientCategoryFilter === "ALL" || c.category === clientCategoryFilter;
                        return matchesSearch && matchesCat;
                      })
                      .map((client, idx, arr) => (
                        <tr key={client.id} className="hover:bg-sand-50/50 transition-colors">
                          {/* Reorder Arrows & Display Order */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono font-bold text-basalt-700 w-5">
                                {client.displayOrder ?? idx + 1}
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleMoveClient(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-0.5 rounded text-basalt-400 hover:text-copper-600 disabled:opacity-20 hover:bg-sand-200/50"
                                  title={isAr ? "تحريك لأعلى" : "Move up"}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveClient(idx, "down")}
                                  disabled={idx === arr.length - 1}
                                  className="p-0.5 rounded text-basalt-400 hover:text-copper-600 disabled:opacity-20 hover:bg-sand-200/50"
                                  title={isAr ? "تحريك لأسفل" : "Move down"}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Logo / Monogram Thumbnail */}
                          <td className="py-3 px-3 text-center">
                            <div className="h-9 w-9 mx-auto rounded-[6px] bg-sand-100 border border-sand-200 flex items-center justify-center overflow-hidden p-1">
                              {client.logoUrl ? (
                                <img
                                  src={client.logoUrl}
                                  alt={client.nameEn}
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : client.monogram ? (
                                <span className="font-mono font-bold text-[10px] text-basalt-700">
                                  {client.monogram.slice(0, 4)}
                                </span>
                              ) : (
                                <Building2 className="h-4 w-4 text-basalt-400" />
                              )}
                            </div>
                          </td>

                          {/* Bilingual Name & Slug */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-basalt-950 text-sm">{client.nameAr}</div>
                            <div className="text-basalt-500 text-xs font-medium">{client.nameEn}</div>
                            <div className="text-[10px] font-mono text-basalt-400 flex items-center gap-2 mt-0.5">
                              <span>slug: {client.slug}</span>
                              {client.monogram && <span className="text-copper-600 font-bold">({client.monogram})</span>}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            {getClientCategoryBadge(client.category)}
                          </td>

                          {/* Website Link */}
                          <td className="py-3 px-3 text-center">
                            {client.websiteUrl ? (
                              <a
                                href={client.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-1.5 rounded text-copper-600 hover:text-copper-700 hover:bg-sand-100 transition-colors"
                                title={client.websiteUrl}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <span className="text-basalt-300 font-mono">—</span>
                            )}
                          </td>

                          {/* Active Toggle Switch */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleClientActive(client)}
                              className={`p-1 rounded-full transition-colors ${
                                client.isActive !== false ? "text-green-600 hover:bg-green-50" : "text-basalt-300 hover:bg-sand-100"
                              }`}
                              title={client.isActive !== false ? (isAr ? "نشط - انقر للتعطيل" : "Active - Click to disable") : (isAr ? "معطل - انقر للتفعيل" : "Disabled - Click to enable")}
                            >
                              {client.isActive !== false ? (
                                <CheckCircle2 className="h-5 w-5 fill-green-100" />
                              ) : (
                                <AlertCircle className="h-5 w-5" />
                              )}
                            </button>
                          </td>

                          {/* Featured Toggle Star */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleClientFeatured(client)}
                              className={`p-1 rounded-full transition-colors ${
                                client.isFeatured !== false ? "text-amber-500 hover:bg-amber-50" : "text-basalt-300 hover:bg-sand-100"
                              }`}
                              title={client.isFeatured !== false ? (isAr ? "مميّز" : "Featured") : (isAr ? "غير مميّز" : "Not featured")}
                            >
                              <Star className={`h-5 w-5 ${client.isFeatured !== false ? "fill-amber-400" : ""}`} />
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-end">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="tectonic"
                                size="sm"
                                onClick={() => openEditClient(client)}
                                iconStart={<Edit3 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "تعديل" : "Edit"}
                              </Button>
                              <Button
                                variant="tectonic"
                                size="sm"
                                className="!text-red-600 hover:!bg-red-50 hover:!border-red-200"
                                onClick={() => setDeleteClientModal({ isOpen: true, client })}
                                iconStart={<Trash2 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "حذف" : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Client Create / Edit Modal ─────────────────────────────────── */}
      {clientModal.isOpen && (
        <ModalDialog
          isOpen={clientModal.isOpen}
          onClose={() => setClientModal({ isOpen: false, mode: "create", client: null })}
          title={
            clientModal.mode === "create"
              ? (isAr ? "إضافة عميل / شريك جديد" : "Add New Client / Partner")
              : (isAr ? "تعديل بيانات العميل" : "Edit Client / Partner")
          }
          maxWidth="xl"
        >
          <form onSubmit={handleClientSubmit(onSaveClient)} className="space-y-5 text-start" noValidate>
            {/* ID & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "معرّف الكيان (ID) *" : "Entity ID *"}
                </label>
                <input
                  {...registerClient("id")}
                  disabled={clientModal.mode === "edit"}
                  placeholder="e.g. c-aramco"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 disabled:opacity-60 disabled:bg-sand-100 font-mono"
                />
                {clientErrors.id && <p className="text-red-500 text-[11px] mt-1">{clientErrors.id.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الاسم اللطيف (Slug) *" : "URL Slug *"}
                </label>
                <input
                  {...registerClient("slug")}
                  placeholder="e.g. saudi-aramco"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono"
                />
                {clientErrors.slug && <p className="text-red-500 text-[11px] mt-1">{clientErrors.slug.message}</p>}
              </div>
            </div>

            {/* Bilingual Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "اسم العميل بالعربي *" : "Client Name (Arabic) *"}
                </label>
                <input
                  {...registerClient("nameAr")}
                  dir="rtl"
                  placeholder="مثال: أرامكو السعودية"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {clientErrors.nameAr && <p className="text-red-500 text-[11px] mt-1">{clientErrors.nameAr.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "اسم العميل بالإنجليزي *" : "Client Name (English) *"}
                </label>
                <input
                  {...registerClient("nameEn")}
                  placeholder="e.g. Saudi Aramco"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {clientErrors.nameEn && <p className="text-red-500 text-[11px] mt-1">{clientErrors.nameEn.message}</p>}
              </div>
            </div>

            {/* Category & Monogram */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "القطاع / التصنيف *" : "Category / Sector *"}
                </label>
                <select
                  {...registerClient("category")}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                >
                  <option value="MINISTRY">{isAr ? "وزارة سيادية (MINISTRY)" : "Sovereign Ministry"}</option>
                  <option value="AMANAT">{isAr ? "أمانة كبرى (AMANAT)" : "Major Amanat / Municipality"}</option>
                  <option value="PIF_GIGA">{isAr ? "صندوق الاستثمارات العامة (PIF_GIGA)" : "PIF Giga Developer"}</option>
                  <option value="SEMI_GOV">{isAr ? "شبه حكومي (SEMI_GOV)" : "Semi-Government Corporation"}</option>
                  <option value="AUTHORITY">{isAr ? "هيئة وطنية (AUTHORITY)" : "National Authority"}</option>
                  <option value="PRIVATE">{isAr ? "قطاع خاص (PRIVATE)" : "Private Sector Enterprise"}</option>
                </select>
                {clientErrors.category && <p className="text-red-500 text-[11px] mt-1">{clientErrors.category.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الرمز المختصر (Monogram)" : "Monogram Code"}
                </label>
                <input
                  {...registerClient("monogram")}
                  placeholder="e.g. SEC, STC, MOMRAH"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono uppercase"
                />
              </div>
            </div>

            {/* Logo URL & Live Preview */}
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "رابط الشعار (Logo URL)" : "Client Logo Image URL"}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  {...registerClient("logoUrl")}
                  placeholder="https://example.com/logo.svg"
                  className="flex-1 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono text-xs"
                />
                {/* Live Preview Box */}
                <div className="h-12 w-20 rounded-[6px] bg-sand-100 border border-sand-300 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  {watchClientLogoUrl ? (
                    <img
                      src={watchClientLogoUrl}
                      alt="Logo Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-[10px] text-basalt-400 font-mono">{isAr ? "معاينة" : "Preview"}</span>
                  )}
                </div>
              </div>
              {clientErrors.logoUrl && <p className="text-red-500 text-[11px] mt-1">{clientErrors.logoUrl.message}</p>}
            </div>

            {/* Website URL & Display Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "رابط الموقع الرسمي" : "Official Website URL"}
                </label>
                <input
                  {...registerClient("websiteUrl")}
                  placeholder="https://example.gov.sa"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono text-xs"
                />
                {clientErrors.websiteUrl && <p className="text-red-500 text-[11px] mt-1">{clientErrors.websiteUrl.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "ترتيب العرض" : "Display Order"}
                </label>
                <input
                  type="number"
                  {...registerClient("displayOrder", { valueAsNumber: true })}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono"
                />
                {clientErrors.displayOrder && <p className="text-red-500 text-[11px] mt-1">{clientErrors.displayOrder.message}</p>}
              </div>
            </div>

            {/* Bilingual Descriptions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف بالعربي" : "Description (Arabic)"}
                </label>
                <textarea
                  {...registerClient("descriptionAr")}
                  rows={3}
                  dir="rtl"
                  placeholder="نبذة عن نطاق التعاون والمشاريع المنفذة..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف بالإنجليزي" : "Description (English)"}
                </label>
                <textarea
                  {...registerClient("descriptionEn")}
                  rows={3}
                  placeholder="Summary of contracting and delivery scope..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerClient("isActive")} className="rounded text-copper-600 focus:ring-copper-500" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "عرض العميل على الموقع (نشط)" : "Active on Website"}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerClient("isFeatured")} className="rounded text-copper-600 focus:ring-copper-500" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "عميل مميّز في الصفحة الرئيسية" : "Featured in Homepage Grid"}</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setClientModal({ isOpen: false, mode: "create", client: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingClient || isCreatingClient || isUpdatingClient}
                iconStart={<Save className="h-3.5 w-3.5" />}
              >
                {clientModal.mode === "create" ? (isAr ? "إضافة العميل" : "Add Client") : (isAr ? "حفظ التعديلات" : "Save Changes")}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* ── Client Delete Confirm Modal ─────────────────────────────────── */}
      {deleteClientModal.isOpen && (
        <ModalDialog
          isOpen={deleteClientModal.isOpen}
          onClose={() => setDeleteClientModal({ isOpen: false, client: null })}
          title={isAr ? "تأكيد حذف العميل" : "Confirm Client Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-basalt-700">
              {isAr
                ? `هل أنت متأكد من حذف جهة العميل "${deleteClientModal.client?.nameAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete client "${deleteClientModal.client?.nameEn}"? This action cannot be undone.`
              }
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteClientModal({ isOpen: false, client: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingClient}
                onClick={handleDeleteClient}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* ── TAB 8: Corporate News & Media Center ───────────────────────── */}
      {activeTab === "NEWS" && (
        <div className="space-y-6">
          {/* Action Notification Message */}
          {newsActionMsg && (
            <div className={`p-4 rounded-[6px] text-sm flex items-center gap-3 ${
              newsActionMsg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {newsActionMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
              <span>{newsActionMsg.text}</span>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "إجمالي الأخبار والبيانات" : "Total Articles"}</span>
                <Newspaper className="h-4 w-4 text-copper-500" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-950 font-mono">
                {adminNewsData?.meta?.totalCount ?? adminNewsData?.data?.length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "مادة إعلامية مسجلة" : "All recorded updates"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "الأخبار المنشورة" : "Published Articles"}</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-extrabold text-green-600 font-mono">
                {adminNewsData?.meta?.publishedCount ?? adminNewsData?.data?.filter((a) => a.isPublished !== false).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "منشورة ومتاحة للجمهور" : "Live on public portal"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "المسودات" : "Drafts"}</span>
                <Clock className="h-4 w-4 text-basalt-400" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-700 font-mono">
                {adminNewsData?.meta?.draftCount ?? adminNewsData?.data?.filter((a) => a.isPublished === false).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "مسودة قيد المراجعة" : "Under review"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "الأخبار البارزة" : "Featured Spotlight"}</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">
                {adminNewsData?.meta?.featuredCount ?? adminNewsData?.data?.filter((a) => a.isFeatured === true).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "في واجهة المركز الإعلامي" : "Featured headlines"}</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white border border-sand-200 rounded-[8px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                <input
                  type="text"
                  placeholder={isAr ? "بحث في العنوان أو النص..." : "Search title or content..."}
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full h-9 ps-9 pe-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
                />
              </div>

              <select
                value={newsCategoryFilter}
                onChange={(e) => setNewsCategoryFilter(e.target.value)}
                className="w-full sm:w-44 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "جميع التصنيفات" : "All Categories"}</option>
                <option value="PROJECT_MILESTONE">{isAr ? "إنجازات المشاريع" : "Milestones"}</option>
                <option value="PRESS_RELEASE">{isAr ? "بيانات صحفية" : "Press Releases"}</option>
                <option value="PARTNERSHIP">{isAr ? "اتفاقيات وشراكات" : "Partnerships"}</option>
                <option value="AWARDS">{isAr ? "جوائز واعتمادات" : "Awards & HSE"}</option>
                <option value="CORPORATE">{isAr ? "أخبار الشركة" : "Corporate News"}</option>
                <option value="COMMUNITY">{isAr ? "مسؤولية مجتمعية" : "Community"}</option>
              </select>

              <select
                value={newsStatusFilter}
                onChange={(e) => setNewsStatusFilter(e.target.value)}
                className="w-full sm:w-36 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "كافة الحالات" : "All Status"}</option>
                <option value="PUBLISHED">{isAr ? "منشور" : "Published"}</option>
                <option value="DRAFT">{isAr ? "مسودة" : "Draft"}</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={openCreateNews}
              iconStart={<Plus className="h-4 w-4" />}
            >
              {isAr ? "إضافة خبر / بيان جديد" : "Create News Article"}
            </Button>
          </div>

          {/* News Table */}
          <div className="bg-white border border-sand-200 rounded-[8px] shadow-sm overflow-hidden">
            {isLoadingNews ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-copper-500" />
                {isAr ? "جاري تحميل الأخبار والبيانات..." : "Loading news articles..."}
              </div>
            ) : !adminNewsData?.data || adminNewsData.data.length === 0 ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <Newspaper className="h-8 w-8 mx-auto mb-2 text-sand-400" />
                {isAr ? "لا توجد أخبار مسجلة حالياً." : "No news articles recorded yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-sand-50/80 border-b border-sand-200 text-basalt-600 font-semibold">
                      <th className="py-3 px-3 w-16 text-center">{isAr ? "الصورة" : "Image"}</th>
                      <th className="py-3 px-4">{isAr ? "عنوان الخبر (عربي / إنجليزي)" : "Article Title (AR / EN)"}</th>
                      <th className="py-3 px-3">{isAr ? "التصنيف" : "Category"}</th>
                      <th className="py-3 px-3">{isAr ? "تاريخ النشر" : "Published Date"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "الحالة" : "Status"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "بارز" : "Featured"}</th>
                      <th className="py-3 px-4 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {adminNewsData.data
                      .filter((a) => {
                        const matchesSearch =
                          !newsSearch ||
                          a.titleAr.toLowerCase().includes(newsSearch.toLowerCase()) ||
                          a.titleEn.toLowerCase().includes(newsSearch.toLowerCase()) ||
                          a.slug.toLowerCase().includes(newsSearch.toLowerCase());
                        const matchesCat = newsCategoryFilter === "ALL" || a.category === newsCategoryFilter;
                        const matchesStatus =
                          newsStatusFilter === "ALL" ||
                          (newsStatusFilter === "PUBLISHED" && a.isPublished !== false) ||
                          (newsStatusFilter === "DRAFT" && a.isPublished === false);
                        return matchesSearch && matchesCat && matchesStatus;
                      })
                      .map((article) => (
                        <tr key={article.id} className="hover:bg-sand-50/50 transition-colors">
                          {/* Featured Image Thumbnail */}
                          <td className="py-3 px-3 text-center">
                            <div className="h-10 w-14 mx-auto rounded-[6px] bg-sand-100 border border-sand-200 overflow-hidden">
                              {article.featuredImageUrl ? (
                                <img
                                  src={article.featuredImageUrl}
                                  alt={article.titleEn}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-basalt-400">
                                  <ImageIcon className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Titles & Slug */}
                          <td className="py-3 px-4 max-w-xs sm:max-w-md">
                            <div className="font-bold text-basalt-950 text-sm line-clamp-1">{article.titleAr}</div>
                            <div className="text-basalt-500 text-xs font-medium line-clamp-1">{article.titleEn}</div>
                            <div className="text-[10px] font-mono text-basalt-400 flex items-center gap-2 mt-0.5">
                              <span>slug: {article.slug}</span>
                              <span className="text-copper-600 font-medium">({article.author})</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            {getNewsCategoryBadge(article.category)}
                          </td>

                          {/* Published Date */}
                          <td className="py-3 px-3 font-mono text-[11px] text-basalt-600">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "—"}
                          </td>

                          {/* Published / Draft Toggle */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleNewsPublish(article)}
                              className={`p-1 rounded-full transition-colors ${
                                article.isPublished !== false ? "text-green-600 hover:bg-green-50" : "text-amber-500 hover:bg-amber-50"
                              }`}
                              title={article.isPublished !== false ? (isAr ? "منشور - انقر للتحويل لمسودة" : "Published - Click to draft") : (isAr ? "مسودة - انقر للنشر" : "Draft - Click to publish")}
                            >
                              {article.isPublished !== false ? (
                                <Badge variant="success">{isAr ? "منشور" : "Published"}</Badge>
                              ) : (
                                <Badge variant="slate">{isAr ? "مسودة" : "Draft"}</Badge>
                              )}
                            </button>
                          </td>

                          {/* Featured Star */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleNewsFeatured(article)}
                              className={`p-1 rounded-full transition-colors ${
                                article.isFeatured ? "text-amber-500 hover:bg-amber-50" : "text-basalt-300 hover:bg-sand-100"
                              }`}
                              title={article.isFeatured ? (isAr ? "خبر بارز" : "Featured") : (isAr ? "غير بارز" : "Not featured")}
                            >
                              <Star className={`h-5 w-5 ${article.isFeatured ? "fill-amber-400" : ""}`} />
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-end">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`/news/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded text-basalt-400 hover:text-copper-600 hover:bg-sand-100 transition-colors"
                                title={isAr ? "معاينة على الموقع" : "Preview on site"}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <Button
                                variant="tectonic"
                                size="sm"
                                onClick={() => openEditNews(article)}
                                iconStart={<Edit3 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "تعديل" : "Edit"}
                              </Button>
                              <Button
                                variant="tectonic"
                                size="sm"
                                className="!text-red-600 hover:!bg-red-50 hover:!border-red-200"
                                onClick={() => setDeleteNewsModal({ isOpen: true, article })}
                                iconStart={<Trash2 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "حذف" : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Careers & Job Openings */}
      {activeTab === "CAREERS" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-basalt-950">
                {isAr ? "إدارة الشواغر الوظيفية والاستقطاب" : "Career Openings & Recruitment Desk"}
              </h2>
              <p className="text-xs text-basalt-500">
                {isAr ? "نشر وإدارة الوظائف الشاغرة والتحكم بظهورها واستقبال طلبات الكفاءات الهندسية والإدارية" : "Publish, manage, and monitor job vacancies for engineering and operational talent"}
              </p>
            </div>
            <Badge variant="copper">
              {isAr ? `إجمالي الشواغر: ${adminJobsData?.meta?.totalCount ?? adminJobsData?.data?.length ?? 0}` : `Total Vacancies: ${adminJobsData?.meta?.totalCount ?? adminJobsData?.data?.length ?? 0}`}
            </Badge>
          </div>

          {/* Action Notification */}
          {jobActionMsg && (
            <div className={`p-4 rounded-[6px] text-sm flex items-center gap-3 ${
              jobActionMsg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {jobActionMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
              <span>{jobActionMsg.text}</span>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "إجمالي الوظائف" : "Total Openings"}</span>
                <Briefcase className="h-4 w-4 text-copper-500" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-950 font-mono">
                {adminJobsData?.meta?.totalCount ?? adminJobsData?.data?.length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "جميع الشواغر المسجلة" : "All recorded jobs"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "الوظائف النشطة" : "Active / Live"}</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-extrabold text-green-600 font-mono">
                {adminJobsData?.meta?.publishedCount ?? adminJobsData?.data?.filter((j) => j.isPublished).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "منشورة وتستقبل الطلبات" : "Accepting candidates"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "المسودات / مغلقة" : "Draft / Paused"}</span>
                <Clock className="h-4 w-4 text-basalt-400" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-700 font-mono">
                {adminJobsData?.meta?.draftCount ?? adminJobsData?.data?.filter((j) => !j.isPublished).length ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "غير معروضة للعامة" : "Hidden from public"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "إجمالي المتقدمين" : "Applications"}</span>
                <Users className="h-4 w-4 text-copper-600" />
              </div>
              <div className="text-2xl font-extrabold text-copper-600 font-mono">
                {adminJobsData?.meta?.totalApplications ?? adminAppsData?.meta?.totalCount ?? 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "ملف سيرة ذاتية وارد" : "CVs submitted"}</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white border border-sand-200 rounded-[8px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                <input
                  type="text"
                  placeholder={isAr ? "بحث في المسمى أو القسم أو الموقع..." : "Search title, department, location..."}
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full h-9 ps-9 pe-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
                />
              </div>

              <select
                value={jobDeptFilter}
                onChange={(e) => setJobDeptFilter(e.target.value)}
                className="w-full sm:w-48 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "كافة الإدارات" : "All Departments"}</option>
                <option value="Hydraulic Infrastructure Division">{isAr ? "البنية التحتية الهيدروليكية" : "Hydraulic Infrastructure"}</option>
                <option value="Electro-Mechanical (MEP) Division">{isAr ? "الكهروميكانيك MEP" : "Electro-Mechanical MEP"}</option>
                <option value="Quality Assurance & QHSE">{isAr ? "الجودة والسلامة QHSE" : "QA & QHSE"}</option>
                <option value="Executive Management & Operations">{isAr ? "الإدارة والعمليات" : "Management & Operations"}</option>
              </select>

              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="w-full sm:w-36 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "كافة الحالات" : "All Status"}</option>
                <option value="PUBLISHED">{isAr ? "نشط ومتاح" : "Live / Active"}</option>
                <option value="DRAFT">{isAr ? "مسودة" : "Draft"}</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={openCreateJob}
              iconStart={<Plus className="h-4 w-4" />}
            >
              {isAr ? "إضافة وظيفة جديدة" : "Post New Opening"}
            </Button>
          </div>

          {/* Jobs Table */}
          <div className="bg-white border border-sand-200 rounded-[8px] shadow-sm overflow-hidden">
            {isLoadingAdminJobs ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-copper-500" />
                {isAr ? "جاري تحميل الشواغر الوظيفية..." : "Loading job vacancies..."}
              </div>
            ) : !adminJobsData?.data || adminJobsData.data.length === 0 ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-sand-400" />
                {isAr ? "لا توجد شواغر مسجلة حالياً." : "No job openings found."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-sand-50/80 border-b border-sand-200 text-basalt-600 font-semibold">
                      <th className="py-3 px-4">{isAr ? "المسمى الوظيفي (عربي / إنجليزي)" : "Job Title (AR / EN)"}</th>
                      <th className="py-3 px-3">{isAr ? "الإدارة" : "Department"}</th>
                      <th className="py-3 px-3">{isAr ? "الموقع" : "Location"}</th>
                      <th className="py-3 px-3">{isAr ? "نوع التوظيف" : "Type"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "المتقدمين" : "Applications"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "الحالة" : "Status"}</th>
                      <th className="py-3 px-4 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {adminJobsData.data
                      .filter((j) => {
                        const matchesSearch =
                          !jobSearchQuery ||
                          j.titleAr.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                          j.titleEn.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                          j.department.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                          j.location.toLowerCase().includes(jobSearchQuery.toLowerCase());
                        const matchesDept = jobDeptFilter === "ALL" || j.department === jobDeptFilter;
                        const matchesStatus =
                          jobStatusFilter === "ALL" ||
                          (jobStatusFilter === "PUBLISHED" && j.isPublished) ||
                          (jobStatusFilter === "DRAFT" && !j.isPublished);
                        return matchesSearch && matchesDept && matchesStatus;
                      })
                      .map((job) => (
                        <tr key={job.id} className="hover:bg-sand-50/50 transition-colors">
                          <td className="py-3 px-4 max-w-xs sm:max-w-md">
                            <div className="font-bold text-basalt-950 text-sm line-clamp-1">{job.titleAr}</div>
                            <div className="text-basalt-500 text-xs font-medium line-clamp-1">{job.titleEn}</div>
                            {job.applicationDeadline && (
                              <div className="text-[10px] text-basalt-400 mt-0.5">
                                {isAr ? "الموعد النهائي: " : "Deadline: "}
                                <span className="font-mono">{new Date(job.applicationDeadline).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-medium text-basalt-700">{job.department}</td>
                          <td className="py-3 px-3 text-basalt-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-sand-400 shrink-0" />
                              <span>{job.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-basalt-600">
                            {job.employmentType}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setAppJobFilter(job.id);
                                setActiveTab("APPLICATIONS");
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-100 hover:bg-copper-50 text-copper-700 font-mono text-xs font-bold transition-colors"
                              title={isAr ? "عرض طلبات هذه الوظيفة" : "Filter applications for this job"}
                            >
                              <Users className="h-3 w-3" />
                              <span>{job.applicationCount || 0}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleJobPublish(job)}
                              className={`p-1 rounded-full transition-colors ${
                                job.isPublished ? "text-green-600 hover:bg-green-50" : "text-amber-500 hover:bg-amber-50"
                              }`}
                              title={job.isPublished ? (isAr ? "نشط - انقر للتعليق" : "Live - Click to pause") : (isAr ? "معلق - انقر للتفعيل" : "Paused - Click to publish")}
                            >
                              {job.isPublished ? (
                                <Badge variant="success">{isAr ? "نشط" : "Live"}</Badge>
                              ) : (
                                <Badge variant="slate">{isAr ? "مسودة" : "Draft"}</Badge>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-end">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`/careers/${job.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded text-basalt-400 hover:text-copper-600 hover:bg-sand-100 transition-colors"
                                title={isAr ? "معاينة الوظيفة على الموقع" : "Preview job on website"}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <Button
                                variant="tectonic"
                                size="sm"
                                onClick={() => openEditJob(job)}
                                iconStart={<Edit3 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "تعديل" : "Edit"}
                              </Button>
                              <Button
                                variant="tectonic"
                                size="sm"
                                className="!text-red-600 hover:!bg-red-50 hover:!border-red-200"
                                onClick={() => setDeleteJobModal({ isOpen: true, job })}
                                iconStart={<Trash2 className="h-3.5 w-3.5" />}
                              >
                                {isAr ? "حذف" : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Applications Review Desk */}
      {activeTab === "APPLICATIONS" && (
        <div className="bg-white border border-sand-200 rounded-[8px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-basalt-950">
                {isAr ? "مكتب فحص ومراجعة طلبات التوظيف" : "Candidate Applications Review Desk"}
              </h2>
              <p className="text-xs text-basalt-500">
                {isAr ? "فرز السير الذاتية ومتابعة مراحل التقييم والمقابلات وتدوين الملاحظات الإدارية" : "Evaluate submitted CVs, triage pipeline stages, and manage internal hiring notes"}
              </p>
            </div>
            <Badge variant="copper">
              {isAr ? `إجمالي المتقدمين: ${adminAppsData?.meta?.totalCount || 0}` : `Total Candidates: ${adminAppsData?.meta?.totalCount || 0}`}
            </Badge>
          </div>

          {/* Action Notification */}
          {appActionMsg && (
            <div className={`p-4 rounded-[6px] text-sm flex items-center gap-3 ${
              appActionMsg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {appActionMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
              <span>{appActionMsg.text}</span>
            </div>
          )}

          {/* KPI Cards for Applications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "إجمالي الطلبات" : "Total Submissions"}</span>
                <Users className="h-4 w-4 text-copper-500" />
              </div>
              <div className="text-2xl font-extrabold text-basalt-950 font-mono">
                {adminAppsData?.meta?.totalCount || 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "كافة السير الذاتية" : "All received CVs"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "طلبات جديدة" : "New / Unreviewed"}</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">
                {adminAppsData?.meta?.countsByStatus?.NEW || 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "بانتظار الفرز المبدئي" : "Awaiting triage"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "قيد التدقيق / المقابلات" : "Active Pipeline"}</span>
                <FileCheck className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono">
                {(adminAppsData?.meta?.countsByStatus?.REVIEWING || 0) +
                 (adminAppsData?.meta?.countsByStatus?.SHORTLISTED || 0) +
                 (adminAppsData?.meta?.countsByStatus?.INTERVIEW || 0)}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "مراجعة / قائمة قصيرة / مقابلة" : "Review / Shortlist / Interview"}</div>
            </div>

            <div className="bg-white border border-sand-200 rounded-[8px] p-5 shadow-sm">
              <div className="flex items-center justify-between text-basalt-500 mb-2">
                <span className="text-xs font-semibold">{isAr ? "تم التوظيف" : "Hired"}</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-extrabold text-green-600 font-mono">
                {adminAppsData?.meta?.countsByStatus?.HIRED || 0}
              </div>
              <div className="text-[11px] text-basalt-500 mt-1">{isAr ? "عروض مقبولة وموظفين جدد" : "Accepted offers"}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-sand-200 rounded-[8px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute start-3 top-2.5 h-4 w-4 text-basalt-400" />
                <input
                  type="text"
                  placeholder={isAr ? "بحث بالاسم، الإيميل أو الجوال..." : "Search name, email, phone..."}
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                  className="w-full h-9 ps-9 pe-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
                />
              </div>

              <select
                value={appJobFilter}
                onChange={(e) => setAppJobFilter(e.target.value)}
                className="w-full sm:w-60 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "جميع الوظائف" : "All Job Openings"}</option>
                {adminJobsData?.data?.map((j) => (
                  <option key={j.id} value={j.id}>
                    {isAr ? j.titleAr : j.titleEn}
                  </option>
                ))}
              </select>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="w-full sm:w-44 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50/50"
              >
                <option value="ALL">{isAr ? "كافة الحالات" : "All Stages"}</option>
                <option value="NEW">{isAr ? "جديد (NEW)" : "New"}</option>
                <option value="REVIEWING">{isAr ? "قيد المراجعة (REVIEWING)" : "Reviewing"}</option>
                <option value="SHORTLISTED">{isAr ? "قائمة مختصرة (SHORTLISTED)" : "Shortlisted"}</option>
                <option value="INTERVIEW">{isAr ? "مقابلة شخصية (INTERVIEW)" : "Interview"}</option>
                <option value="HIRED">{isAr ? "تم التوظيف (HIRED)" : "Hired"}</option>
                <option value="REJECTED">{isAr ? "مرفوض (REJECTED)" : "Rejected"}</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white border border-sand-200 rounded-[8px] shadow-sm overflow-hidden">
            {isLoadingAdminApps ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-copper-500" />
                {isAr ? "جاري تحميل طلبات التوظيف..." : "Loading candidate applications..."}
              </div>
            ) : !adminAppsData?.data || adminAppsData.data.length === 0 ? (
              <div className="p-12 text-center text-basalt-500 text-sm">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-sand-400" />
                {isAr ? "لا توجد طلبات توظيف تطابق المعايير المحددة." : "No job applications match your filters."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-sand-50/80 border-b border-sand-200 text-basalt-600 font-semibold">
                      <th className="py-3 px-4">{isAr ? "المترشح" : "Candidate"}</th>
                      <th className="py-3 px-3">{isAr ? "الوظيفة المتقدم لها" : "Applied Role"}</th>
                      <th className="py-3 px-3">{isAr ? "تاريخ التقديم" : "Applied Date"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "السيرة الذاتية" : "Resume / CV"}</th>
                      <th className="py-3 px-3 text-center">{isAr ? "مرحلة التوظيف" : "Stage"}</th>
                      <th className="py-3 px-4 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {adminAppsData.data.map((app) => (
                      <tr key={app.id} className="hover:bg-sand-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-basalt-950 text-sm">{app.applicantName}</div>
                          <div className="text-basalt-500 text-xs flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{app.email}</span>
                            <span>•</span>
                            <span className="font-mono">{app.phone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-basalt-900 line-clamp-1">
                            {isAr ? app.jobOpening?.titleAr : app.jobOpening?.titleEn}
                          </div>
                          <div className="text-[11px] text-basalt-400">{app.jobOpening?.department}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-basalt-600">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "—"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sand-100 hover:bg-sand-200 text-basalt-800 text-[11px] font-medium transition-colors"
                              title={app.resumeFileName || "Resume"}
                            >
                              <Download className="h-3 w-3 text-copper-600" />
                              <span className="max-w-[100px] truncate">{app.resumeFileName || (isAr ? "الملف" : "CV")}</span>
                            </a>
                          ) : (
                            <span className="text-basalt-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {getAppStatusBadge(app.status)}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => openAppDetails(app)}
                              iconStart={<Eye className="h-3.5 w-3.5" />}
                            >
                              {isAr ? "فحص وتقييم" : "Review"}
                            </Button>
                            <Button
                              variant="tectonic"
                              size="sm"
                              className="!text-red-600 hover:!bg-red-50 hover:!border-red-200"
                              onClick={() => setDeleteAppModal({ isOpen: true, app })}
                              iconStart={<Trash2 className="h-3.5 w-3.5" />}
                            >
                              {isAr ? "حذف" : "Delete"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── News Create / Edit Modal ───────────────────────────────────── */}
      {newsModal.isOpen && (
        <ModalDialog
          isOpen={newsModal.isOpen}
          onClose={() => setNewsModal({ isOpen: false, mode: "create", article: null })}
          title={
            newsModal.mode === "create"
              ? (isAr ? "إضافة خبر / بيان صحفي جديد" : "Create News Article")
              : (isAr ? "تعديل الخبر / البيان" : "Edit News Article")
          }
          maxWidth="2xl"
        >
          <form onSubmit={handleNewsSubmit(onSaveNews)} className="space-y-5 text-start" noValidate>
            {/* Bilingual Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "عنوان الخبر بالعربي *" : "Headline (Arabic) *"}
                </label>
                <input
                  {...registerNews("titleAr")}
                  dir="rtl"
                  placeholder="مثال: الهضب توقع عقد تنفيذ حزمة البنية التحتية..."
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {newsErrors.titleAr && <p className="text-red-500 text-[11px] mt-1">{newsErrors.titleAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "عنوان الخبر بالإنجليزي *" : "Headline (English) *"}
                </label>
                <input
                  {...registerNews("titleEn")}
                  placeholder="e.g. AL-HADAB Signs Strategic Infrastructure Package..."
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {newsErrors.titleEn && <p className="text-red-500 text-[11px] mt-1">{newsErrors.titleEn.message}</p>}
              </div>
            </div>

            {/* Slug, Category, Author, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الاسم اللطيف (Slug) *" : "URL Slug *"}
                </label>
                <input
                  {...registerNews("slug")}
                  placeholder="e.g. alhadab-signs-amaala-package"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono text-xs"
                />
                {newsErrors.slug && <p className="text-red-500 text-[11px] mt-1">{newsErrors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "التصنيف *" : "Category *"}
                </label>
                <select
                  {...registerNews("category")}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                >
                  <option value="PROJECT_MILESTONE">{isAr ? "إنجاز مشروع (MILESTONE)" : "Project Milestone"}</option>
                  <option value="PRESS_RELEASE">{isAr ? "بيان صحفي (PRESS_RELEASE)" : "Press Release"}</option>
                  <option value="PARTNERSHIP">{isAr ? "شراكة (PARTNERSHIP)" : "Partnership"}</option>
                  <option value="AWARDS">{isAr ? "جوائز / سلامة (AWARDS)" : "Awards & HSE"}</option>
                  <option value="CORPORATE">{isAr ? "أخبار الشركة (CORPORATE)" : "Corporate News"}</option>
                  <option value="COMMUNITY">{isAr ? "مسؤولية مجتمعية (COMMUNITY)" : "Community"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المؤلف / المصدر" : "Author / Department"}
                </label>
                <input
                  {...registerNews("author")}
                  placeholder="e.g. AL-HADAB Media Center"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "تاريخ النشر" : "Publish Date"}
                </label>
                <input
                  type="date"
                  {...registerNews("publishedAt")}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
              </div>
            </div>

            {/* Featured Image URL & Preview */}
            <div>
              <label className="block text-xs font-semibold text-basalt-800 mb-1">
                {isAr ? "رابط الصورة البارزة (Featured Image URL)" : "Featured Image URL"}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  {...registerNews("featuredImageUrl")}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50 font-mono text-xs"
                />
                <div className="h-12 w-20 rounded-[6px] bg-sand-100 border border-sand-300 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  {watchNewsImageUrl ? (
                    <img
                      src={watchNewsImageUrl}
                      alt="Preview"
                      className="max-h-full max-w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-[10px] text-basalt-400 font-mono">{isAr ? "معاينة" : "Preview"}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bilingual Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الملخص بالعربي *" : "Summary (Arabic) *"}
                </label>
                <textarea
                  {...registerNews("summaryAr")}
                  rows={2}
                  dir="rtl"
                  placeholder="ملخص تنفيذي موجز عن محتوى الخبر..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none"
                />
                {newsErrors.summaryAr && <p className="text-red-500 text-[11px] mt-1">{newsErrors.summaryAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الملخص بالإنجليزي *" : "Summary (English) *"}
                </label>
                <textarea
                  {...registerNews("summaryEn")}
                  rows={2}
                  placeholder="Concise executive overview of the article..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-none"
                />
                {newsErrors.summaryEn && <p className="text-red-500 text-[11px] mt-1">{newsErrors.summaryEn.message}</p>}
              </div>
            </div>

            {/* Bilingual Full Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المحتوى الكامل بالعربي *" : "Full Content (Arabic) *"}
                </label>
                <textarea
                  {...registerNews("contentAr")}
                  rows={6}
                  dir="rtl"
                  placeholder="نص الخبر بالتفصيل..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {newsErrors.contentAr && <p className="text-red-500 text-[11px] mt-1">{newsErrors.contentAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المحتوى الكامل بالإنجليزي *" : "Full Content (English) *"}
                </label>
                <textarea
                  {...registerNews("contentEn")}
                  rows={6}
                  placeholder="Full detailed article text..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {newsErrors.contentEn && <p className="text-red-500 text-[11px] mt-1">{newsErrors.contentEn.message}</p>}
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="p-4 rounded-[6px] bg-sand-100/50 border border-sand-200 space-y-3">
              <div className="text-xs font-bold text-basalt-900 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-copper-600" />
                <span>{isAr ? "بيانات محركات البحث (SEO Metadata)" : "SEO Metadata Settings"}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-basalt-700 mb-1">{isAr ? "عنوان SEO بالعربي" : "SEO Title (AR)"}</label>
                  <input {...registerNews("seoTitleAr")} dir="rtl" className="w-full h-8 px-2.5 text-xs border border-sand-300 rounded-[4px] bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-basalt-700 mb-1">{isAr ? "عنوان SEO بالإنجليزي" : "SEO Title (EN)"}</label>
                  <input {...registerNews("seoTitleEn")} className="w-full h-8 px-2.5 text-xs border border-sand-300 rounded-[4px] bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-basalt-700 mb-1">{isAr ? "وصف SEO بالعربي" : "SEO Description (AR)"}</label>
                  <input {...registerNews("seoDescAr")} dir="rtl" className="w-full h-8 px-2.5 text-xs border border-sand-300 rounded-[4px] bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-basalt-700 mb-1">{isAr ? "وصف SEO بالإنجليزي" : "SEO Description (EN)"}</label>
                  <input {...registerNews("seoDescEn")} className="w-full h-8 px-2.5 text-xs border border-sand-300 rounded-[4px] bg-white" />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerNews("isPublished")} className="rounded text-copper-600 focus:ring-copper-500" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "نشر الخبر مباشرة للجمهور (نشط)" : "Publish Article (Live)"}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerNews("isFeatured")} className="rounded text-copper-600 focus:ring-copper-500" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "تثبيت كخبر بارز (Headline Spotlight)" : "Mark as Featured Headline"}</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setNewsModal({ isOpen: false, mode: "create", article: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingNews || isCreatingNews || isUpdatingNews}
                iconStart={<Save className="h-3.5 w-3.5" />}
              >
                {newsModal.mode === "create" ? (isAr ? "نشر الخبر" : "Publish Article") : (isAr ? "حفظ التعديلات" : "Save Changes")}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* ── News Delete Confirm Modal ───────────────────────────────────── */}
      {deleteNewsModal.isOpen && (
        <ModalDialog
          isOpen={deleteNewsModal.isOpen}
          onClose={() => setDeleteNewsModal({ isOpen: false, article: null })}
          title={isAr ? "تأكيد حذف الخبر" : "Confirm Article Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-basalt-700">
              {isAr
                ? `هل أنت متأكد من حذف الخبر "${deleteNewsModal.article?.titleAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete article "${deleteNewsModal.article?.titleEn}"? This action cannot be undone.`
              }
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteNewsModal({ isOpen: false, article: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingNews}
                onClick={handleDeleteNews}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* ── Job Create / Edit Modal ───────────────────────────────────── */}
      {jobModal.isOpen && (
        <ModalDialog
          isOpen={jobModal.isOpen}
          onClose={() => setJobModal({ isOpen: false, mode: "create", job: null })}
          title={
            jobModal.mode === "create"
              ? (isAr ? "إضافة شاغر وظيفي جديد" : "Post New Job Opening")
              : (isAr ? "تعديل الشاغر الوظيفي" : "Edit Job Opening")
          }
          maxWidth="2xl"
        >
          <form onSubmit={handleJobSubmit(onSaveJob)} className="space-y-5 text-start" noValidate>
            {/* Bilingual Job Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المسمى الوظيفي بالعربي *" : "Job Title (Arabic) *"}
                </label>
                <input
                  {...registerJob("titleAr")}
                  dir="rtl"
                  placeholder="مثال: مهندس موقع أول - مشاريع المياه"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {jobErrors.titleAr && <p className="text-red-500 text-[11px] mt-1">{jobErrors.titleAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المسمى الوظيفي بالإنجليزي *" : "Job Title (English) *"}
                </label>
                <input
                  {...registerJob("titleEn")}
                  placeholder="e.g. Senior Site Engineer - Water Projects"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {jobErrors.titleEn && <p className="text-red-500 text-[11px] mt-1">{jobErrors.titleEn.message}</p>}
              </div>
            </div>

            {/* Department, Location, Type, Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الإدارة / القسم *" : "Department *"}
                </label>
                <input
                  {...registerJob("department")}
                  placeholder="e.g. Hydraulic Infrastructure"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {jobErrors.department && <p className="text-red-500 text-[11px] mt-1">{jobErrors.department.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الموقع / المدينة *" : "Location *"}
                </label>
                <input
                  {...registerJob("location")}
                  placeholder="e.g. Makkah / مكة المكرمة"
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
                {jobErrors.location && <p className="text-red-500 text-[11px] mt-1">{jobErrors.location.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "نوع التوظيف *" : "Employment Type *"}
                </label>
                <select
                  {...registerJob("employmentType")}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                >
                  <option value="FULL_TIME">{isAr ? "دوام كامل (Full Time)" : "Full Time"}</option>
                  <option value="PART_TIME">{isAr ? "دوام جزئي (Part Time)" : "Part Time"}</option>
                  <option value="CONTRACT">{isAr ? "عقد مشروع (Contract)" : "Contract"}</option>
                  <option value="INTERNSHIP">{isAr ? "تدريب تعاوني (Internship)" : "Internship"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الموعد النهائي للتقديم" : "Application Deadline"}
                </label>
                <input
                  type="date"
                  {...registerJob("applicationDeadline")}
                  className="w-full h-9 px-3 text-sm border border-sand-300 rounded-[6px] bg-sand-50"
                />
              </div>
            </div>

            {/* Bilingual Job Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف الوظيفي بالعربي *" : "Description (Arabic) *"}
                </label>
                <textarea
                  {...registerJob("descriptionAr")}
                  rows={4}
                  dir="rtl"
                  placeholder="الوصف التفصيلي للمهام والمسؤوليات اليومية..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {jobErrors.descriptionAr && <p className="text-red-500 text-[11px] mt-1">{jobErrors.descriptionAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "الوصف الوظيفي بالإنجليزي *" : "Description (English) *"}
                </label>
                <textarea
                  {...registerJob("descriptionEn")}
                  rows={4}
                  placeholder="Detailed responsibilities and scope of work..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {jobErrors.descriptionEn && <p className="text-red-500 text-[11px] mt-1">{jobErrors.descriptionEn.message}</p>}
              </div>
            </div>

            {/* Bilingual Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المتطلبات والمؤهلات بالعربي *" : "Requirements (Arabic) *"}
                </label>
                <textarea
                  {...registerJob("requirementsAr")}
                  rows={4}
                  dir="rtl"
                  placeholder="المؤهلات العلمية، سنوات الخبرة، الشهادات المهنية (SCE)..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {jobErrors.requirementsAr && <p className="text-red-500 text-[11px] mt-1">{jobErrors.requirementsAr.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-basalt-800 mb-1">
                  {isAr ? "المتطلبات والمؤهلات بالإنجليزي *" : "Requirements (English) *"}
                </label>
                <textarea
                  {...registerJob("requirementsEn")}
                  rows={4}
                  placeholder="Qualifications, years of experience, professional certifications..."
                  className="w-full px-3 py-2 text-sm border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
                />
                {jobErrors.requirementsEn && <p className="text-red-500 text-[11px] mt-1">{jobErrors.requirementsEn.message}</p>}
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...registerJob("isPublished")} className="rounded text-copper-600 focus:ring-copper-500" />
                <span className="text-sm font-medium text-basalt-800">{isAr ? "نشر الشاغر مباشرة واستقبال المتقدمين (نشط)" : "Publish Job Opening (Live)"}</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setJobModal({ isOpen: false, mode: "create", job: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingJob || isCreatingJob || isUpdatingJob}
                iconStart={<Save className="h-3.5 w-3.5" />}
              >
                {jobModal.mode === "create" ? (isAr ? "نشر الوظيفة" : "Post Opening") : (isAr ? "حفظ التعديلات" : "Save Changes")}
              </Button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* ── Job Delete Confirm Modal ───────────────────────────────────── */}
      {deleteJobModal.isOpen && (
        <ModalDialog
          isOpen={deleteJobModal.isOpen}
          onClose={() => setDeleteJobModal({ isOpen: false, job: null })}
          title={isAr ? "تأكيد حذف الوظيفة" : "Confirm Job Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-basalt-700">
              {isAr
                ? `هل أنت متأكد من حذف الشاغر "${deleteJobModal.job?.titleAr}"؟ سيتم حذف جميع طلبات التقديم المرتبطة بهذا الشاغر نهائياً.`
                : `Are you sure you want to delete job vacancy "${deleteJobModal.job?.titleEn}"? All associated applications will also be deleted.`
              }
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteJobModal({ isOpen: false, job: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingJob}
                onClick={handleDeleteJob}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* ── Candidate Application Review Modal ──────────────────────────── */}
      {selectedApplication && (
        <ModalDialog
          isOpen={Boolean(selectedApplication)}
          onClose={() => setSelectedApplication(null)}
          title={isAr ? "فحص وتقييم طلب التوظيف" : "Candidate Application Dossier"}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-start">
            {/* Candidate Header Card */}
            <div className="p-4 rounded-[6px] bg-sand-50 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-basalt-950">{selectedApplication.applicantName}</h3>
                <p className="text-xs text-copper-700 font-semibold mt-0.5">
                  {isAr ? selectedApplication.jobOpening?.titleAr : selectedApplication.jobOpening?.titleEn}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-basalt-500 mt-2 font-mono">
                  <span>{selectedApplication.email}</span>
                  <span>•</span>
                  <span>{selectedApplication.phone}</span>
                  <span>•</span>
                  <span>{new Date(selectedApplication.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>
                </div>
              </div>
              <div className="shrink-0">
                {getAppStatusBadge(selectedApplication.status)}
              </div>
            </div>

            {/* CV Download / Link Card */}
            <div className="p-4 rounded-[6px] bg-white border border-sand-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-copper-50 text-copper-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-basalt-900">
                    {selectedApplication.resumeFileName || (isAr ? "السيرة الذاتية المرفقة" : "Candidate Resume / CV")}
                  </div>
                  <div className="text-[11px] text-basalt-500">
                    {isAr ? "انقر لتحميل أو استعراض وثيقة الـ CV" : "Click to view or download full PDF"}
                  </div>
                </div>
              </div>

              {selectedApplication.resumeUrl && (
                <a
                  href={selectedApplication.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selectedApplication.resumeFileName || "candidate-resume.pdf"}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-copper-600 hover:bg-copper-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isAr ? "تحميل السيرة الذاتية" : "Download CV"}</span>
                </a>
              )}
            </div>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-basalt-800">
                  {isAr ? "خطاب التقديم (Cover Letter):" : "Cover Letter:"}
                </label>
                <div className="p-3.5 rounded-[6px] bg-sand-50/70 border border-sand-200 text-xs text-basalt-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            )}

            {/* Hiring Stage / Status Changer */}
            <div className="space-y-2 p-4 rounded-[6px] bg-sand-100/50 border border-sand-200">
              <label className="block text-xs font-bold text-basalt-900">
                {isAr ? "تغيير مرحلة التوظيف:" : "Update Recruitment Stage:"}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED"] as JobApplicationStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateAppStatus(selectedApplication.id, st)}
                    disabled={isUpdatingAppStatus}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-all ${
                      selectedApplication.status === st
                        ? "bg-basalt-950 text-white border-basalt-950 shadow-sm"
                        : "bg-white text-basalt-700 border-sand-300 hover:border-copper-500 hover:text-copper-600"
                    }`}
                  >
                    {st === "NEW" && (isAr ? "جديد" : "New")}
                    {st === "REVIEWING" && (isAr ? "قيد المراجعة" : "Reviewing")}
                    {st === "SHORTLISTED" && (isAr ? "قائمة مختصرة" : "Shortlisted")}
                    {st === "INTERVIEW" && (isAr ? "مقابلة" : "Interview")}
                    {st === "HIRED" && (isAr ? "تم التوظيف" : "Hired")}
                    {st === "REJECTED" && (isAr ? "مرفوض" : "Rejected")}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-basalt-800">
                {isAr ? "ملاحظات إدارية داخلية (سرية):" : "Internal Hiring Notes (Confidential):"}
              </label>
              <textarea
                value={appNotesInput}
                onChange={(e) => setAppNotesInput(e.target.value)}
                rows={3}
                placeholder={isAr ? "سجل ملاحظات المقابلة، التقييم الفني، الراتب المتوقع..." : "Record interview notes, technical rating, expected compensation..."}
                className="w-full px-3 py-2 text-xs border border-sand-300 rounded-[6px] bg-sand-50 resize-y"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="tectonic"
                  size="sm"
                  onClick={() => handleSaveAppNotes(selectedApplication.id)}
                  isLoading={isUpdatingAppNotes}
                  iconStart={<Save className="h-3.5 w-3.5" />}
                >
                  {isAr ? "حفظ الملاحظات" : "Save Notes"}
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setSelectedApplication(null)}
              >
                {isAr ? "إغلاق" : "Close"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* ── Candidate Application Delete Confirm Modal ─────────────────── */}
      {deleteAppModal.isOpen && (
        <ModalDialog
          isOpen={deleteAppModal.isOpen}
          onClose={() => setDeleteAppModal({ isOpen: false, app: null })}
          title={isAr ? "تأكيد حذف طلب التوظيف" : "Confirm Application Deletion"}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-basalt-700">
              {isAr
                ? `هل أنت متأكد من حذف طلب التوظيف للمترشح "${deleteAppModal.app?.applicantName}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete application from "${deleteAppModal.app?.applicantName}"? This action cannot be undone.`
              }
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
              <Button
                type="button"
                variant="tectonic"
                size="sm"
                onClick={() => setDeleteAppModal({ isOpen: false, app: null })}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="!bg-red-600 hover:!bg-red-700 !border-red-600 text-white"
                isLoading={isDeletingApp}
                onClick={handleDeleteApp}
                iconStart={<Trash2 className="h-3.5 w-3.5" />}
              >
                {isAr ? "تأكيد الحذف" : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
        </main>
      </div>
    </div>
  );
};


