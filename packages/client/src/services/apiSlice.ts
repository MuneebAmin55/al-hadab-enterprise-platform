import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { logout } from "../app/authSlice";
import type {
  CorporateProfile,
  ClientEntity,
  CapabilityVertical,
  ProjectCaseStudy,
  ScopedInquiryInput,
  InquiryEntity,
  InquiryStatus,
  UpdateInquiryStatusInput,
  UpdateInquiryNotesInput,
  PrequalificationRequestInput,
  VendorRegistrationInput,
  UpdateCompanyProfileInput,
  WorkforceCategoryEntity,
  WorkforceStatsSummary,
  CreateWorkforceCategoryInput,
  UpdateWorkforceCategoryInput,
  ReorderWorkforceCategoriesInput,
  UpdateEmployeeCountsInput,
  CreateProjectInput,
  UpdateProjectInput,
  ReorderProjectsInput,
  CreateCapabilityInput,
  UpdateCapabilityInput,
  ReorderCapabilitiesInput,
  CreateClientInput,
  UpdateClientInput,
  ReorderClientsInput,
  NewsArticleEntity,
  CreateNewsArticleInput,
  UpdateNewsArticleInput,
  JobOpeningEntity,
  JobApplicationEntity,
  JobApplicationStatus,
  CreateJobOpeningInput,
  UpdateJobOpeningInput,
  SubmitJobApplicationInput,
  UpdateJobApplicationStatusInput,
  UpdateJobApplicationNotesInput,
  AdminOverviewStats,
  AdminUserEntity,
  CreateAdminUserInput,
  UpdateAdminUserInput
} from "@alhadab/shared";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth?.accessToken;
    const storageToken = typeof window !== "undefined" ? localStorage.getItem("alhadab_token") : null;
    const token = stateToken || storageToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    if (
      errorData?.error?.code === "TOKEN_EXPIRED" ||
      errorData?.error?.code === "UNAUTHORIZED" ||
      (typeof errorData?.error?.message === "string" &&
        errorData.error.message.toLowerCase().includes("token"))
    ) {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  tagTypes: [
    "Project",
    "Capability",
    "Client",
    "Inquiry",
    "Vendor",
    "Auth",
    "CompanyProfile",
    "Workforce",
    "News",
    "Careers",
    "Applications",
    "AdminStats",
    "AdminUsers"
  ],
  endpoints: (builder) => ({
    getCompanyProfile: builder.query<CorporateProfile, void>({
      query: () => "/company/profile",
      transformResponse: (response: { data: CorporateProfile }) => response.data,
      providesTags: ["CompanyProfile"]
    }),

    updateCompanyProfile: builder.mutation<
      { data: CorporateProfile; messageAr: string; messageEn: string },
      UpdateCompanyProfileInput
    >({
      query: (body) => ({
        url: "/company/profile",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["CompanyProfile"]
    }),

    getClients: builder.query<ClientEntity[], void>({
      query: () => "/company/clients",
      transformResponse: (response: { data: ClientEntity[] }) => response.data,
      providesTags: ["Client"]
    }),

    // Client Admin Endpoints
    getAdminClients: builder.query<
      { data: ClientEntity[]; meta: { totalCount: number; activeCount: number; featuredCount: number } },
      void
    >({
      query: () => "/clients/admin",
      providesTags: ["Client"]
    }),

    createClient: builder.mutation<
      { data: ClientEntity; message: string },
      CreateClientInput
    >({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body
      }),
      invalidatesTags: ["Client"]
    }),

    updateClient: builder.mutation<
      { data: ClientEntity; message: string },
      { id: string } & UpdateClientInput
    >({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Client"]
    }),

    deleteClient: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Client"]
    }),

    toggleClientActive: builder.mutation<
      { data: ClientEntity; message: string },
      string
    >({
      query: (id) => ({
        url: `/clients/${id}/toggle-active`,
        method: "PATCH"
      }),
      invalidatesTags: ["Client"]
    }),

    toggleClientFeatured: builder.mutation<
      { data: ClientEntity; message: string },
      string
    >({
      query: (id) => ({
        url: `/clients/${id}/toggle-featured`,
        method: "PATCH"
      }),
      invalidatesTags: ["Client"]
    }),

    reorderClients: builder.mutation<
      { success: boolean; message: string },
      ReorderClientsInput
    >({
      query: (body) => ({
        url: "/clients/reorder",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Client"]
    }),

    // News Public & Admin Endpoints
    getNewsList: builder.query<
      { data: NewsArticleEntity[]; meta: { total: number; page: number; limit: number; totalPages: number } },
      { category?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category && params.category !== "ALL") queryParams.append("category", params.category);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        const qs = queryParams.toString();
        return `/news${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["News"]
    }),

    getNewsBySlug: builder.query<NewsArticleEntity, string>({
      query: (slug) => `/news/${slug}`,
      transformResponse: (response: { data: NewsArticleEntity }) => response.data,
      providesTags: (result, error, slug) => [{ type: "News", id: slug }]
    }),

    getAdminNewsList: builder.query<
      { data: NewsArticleEntity[]; meta: { totalCount: number; publishedCount: number; draftCount: number; featuredCount: number } },
      void
    >({
      query: () => "/news/admin",
      providesTags: ["News"]
    }),

    getNewsById: builder.query<NewsArticleEntity, string>({
      query: (id) => `/news/id/${id}`,
      transformResponse: (response: { data: NewsArticleEntity }) => response.data,
      providesTags: (result, error, id) => [{ type: "News", id }]
    }),

    createNews: builder.mutation<{ data: NewsArticleEntity; message: string }, CreateNewsArticleInput>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body
      }),
      invalidatesTags: ["News"]
    }),

    updateNews: builder.mutation<{ data: NewsArticleEntity; message: string }, { id: string } & UpdateNewsArticleInput>({
      query: ({ id, ...body }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["News"]
    }),

    deleteNews: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["News"]
    }),

    toggleNewsPublish: builder.mutation<{ data: NewsArticleEntity; message: string }, string>({
      query: (id) => ({
        url: `/news/${id}/toggle-publish`,
        method: "PATCH"
      }),
      invalidatesTags: ["News"]
    }),

    toggleNewsFeatured: builder.mutation<{ data: NewsArticleEntity; message: string }, string>({
      query: (id) => ({
        url: `/news/${id}/toggle-featured`,
        method: "PATCH"
      }),
      invalidatesTags: ["News"]
    }),

    getCapabilities: builder.query<CapabilityVertical[], void>({
      query: () => "/capabilities",
      transformResponse: (response: { data: CapabilityVertical[] }) => response.data,
      providesTags: ["Capability"]
    }),

    getCapabilityById: builder.query<CapabilityVertical, string>({
      query: (id) => `/capabilities/${id}`,
      transformResponse: (response: { data: CapabilityVertical }) => response.data,
      providesTags: (result, error, id) => [{ type: "Capability", id }]
    }),

    // Capability Admin Endpoints
    getAdminCapabilities: builder.query<
      { data: CapabilityVertical[]; meta: { totalCount: number; activeCount: number; featuredCount: number } },
      void
    >({
      query: () => "/capabilities/admin",
      providesTags: ["Capability"]
    }),

    createCapability: builder.mutation<
      { data: CapabilityVertical; message: string },
      CreateCapabilityInput
    >({
      query: (body) => ({
        url: "/capabilities",
        method: "POST",
        body
      }),
      invalidatesTags: ["Capability"]
    }),

    updateCapability: builder.mutation<
      { data: CapabilityVertical; message: string },
      { id: string } & UpdateCapabilityInput
    >({
      query: ({ id, ...body }) => ({
        url: `/capabilities/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Capability"]
    }),

    deleteCapability: builder.mutation<
      { message: string },
      string
    >({
      query: (id) => ({
        url: `/capabilities/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Capability"]
    }),

    toggleCapabilityActive: builder.mutation<
      { data: CapabilityVertical; message: string },
      string
    >({
      query: (id) => ({
        url: `/capabilities/${id}/toggle-active`,
        method: "PATCH"
      }),
      invalidatesTags: ["Capability"]
    }),

    toggleCapabilityFeatured: builder.mutation<
      { data: CapabilityVertical; message: string },
      string
    >({
      query: (id) => ({
        url: `/capabilities/${id}/toggle-featured`,
        method: "PATCH"
      }),
      invalidatesTags: ["Capability"]
    }),

    reorderCapabilities: builder.mutation<
      { message: string },
      ReorderCapabilitiesInput
    >({
      query: (body) => ({
        url: "/capabilities/reorder",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Capability"]
    }),

    getProjects: builder.query<
      ProjectCaseStudy[],
      { vertical?: string; clientCategory?: string; region?: string; status?: string; searchQuery?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.vertical) queryParams.set("vertical", params.vertical);
        if (params?.clientCategory) queryParams.set("clientCategory", params.clientCategory);
        if (params?.region) queryParams.set("region", params.region);
        if (params?.status) queryParams.set("status", params.status);
        if (params?.searchQuery) queryParams.set("searchQuery", params.searchQuery);
        return `/projects?${queryParams.toString()}`;
      },
      transformResponse: (response: { data: ProjectCaseStudy[] }) => response.data,
      providesTags: ["Project"]
    }),

    getProjectBySlug: builder.query<ProjectCaseStudy, string>({
      query: (slug) => `/projects/${slug}`,
      transformResponse: (response: { data: ProjectCaseStudy }) => response.data,
      providesTags: (result, error, slug) => [{ type: "Project", id: slug }]
    }),

    submitInquiry: builder.mutation<
      { trackingId: string; status: string; messageAr: string; messageEn: string },
      ScopedInquiryInput
    >({
      query: (body) => ({
        url: "/inquiries",
        method: "POST",
        body
      }),
      invalidatesTags: ["Inquiry"]
    }),

    getInquiries: builder.query<
      { data: InquiryEntity[]; meta: { totalCount: number; filteredCount: number; unreadCount: number; archivedCount: number; countsByStatus: Record<string, number> } },
      { status?: string; search?: string; startDate?: string; endDate?: string; intentType?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
        if (params?.intentType && params.intentType !== "ALL") queryParams.append("intentType", params.intentType);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.startDate) queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);
        const qs = queryParams.toString();
        return `/inquiries${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Inquiry"]
    }),

    getInquiryById: builder.query<InquiryEntity, string>({
      query: (id) => `/inquiries/${id}`,
      transformResponse: (response: { data: InquiryEntity }) => response.data,
      providesTags: (result, error, id) => [{ type: "Inquiry", id }]
    }),

    updateInquiryStatus: builder.mutation<
      { data: InquiryEntity; message?: string },
      { id: string; status: string; notes?: string }
    >({
      query: ({ id, status, notes }) => ({
        url: `/inquiries/${id}/status`,
        method: "PATCH",
        body: { status, notes }
      }),
      invalidatesTags: ["Inquiry"]
    }),

    updateInquiryNotes: builder.mutation<
      { data: InquiryEntity; message?: string },
      { id: string; internalNotes: string }
    >({
      query: ({ id, internalNotes }) => ({
        url: `/inquiries/${id}/notes`,
        method: "PATCH",
        body: { internalNotes }
      }),
      invalidatesTags: ["Inquiry"]
    }),

    toggleInquiryRead: builder.mutation<
      { data: InquiryEntity; message?: string },
      { id: string; isRead?: boolean }
    >({
      query: ({ id, isRead }) => ({
        url: `/inquiries/${id}/read`,
        method: "PATCH",
        body: { isRead }
      }),
      invalidatesTags: ["Inquiry"]
    }),

    archiveInquiry: builder.mutation<
      { data: InquiryEntity; message?: string },
      string
    >({
      query: (id) => ({
        url: `/inquiries/${id}/archive`,
        method: "PATCH"
      }),
      invalidatesTags: ["Inquiry"]
    }),

    deleteInquiry: builder.mutation<
      { message: string },
      string
    >({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Inquiry"]
    }),

    requestPrequal: builder.mutation<
      { dossier: any; messageAr: string; messageEn: string },
      PrequalificationRequestInput
    >({
      query: (body) => ({
        url: "/prequal/request",
        method: "POST",
        body
      })
    }),

    registerVendor: builder.mutation<
      { trackingId: string; crNumber: string; status: string; messageAr: string; messageEn: string },
      VendorRegistrationInput
    >({
      query: (body) => ({
        url: "/vendors/register",
        method: "POST",
        body
      }),
      invalidatesTags: ["Vendor"]
    }),

    getVendors: builder.query<any[], void>({
      query: () => "/vendors",
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["Vendor"]
    }),

    updateVendorStatus: builder.mutation<
      { data: any },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/vendors/${id}/status`,
        method: "PATCH",
        body: { status }
      }),
      invalidatesTags: ["Vendor"]
    }),

    // Human Capital & Workforce Endpoints
    getPublicWorkforce: builder.query<WorkforceStatsSummary, void>({
      query: () => "/workforce",
      transformResponse: (response: { data: WorkforceStatsSummary }) => response.data,
      providesTags: ["Workforce"]
    }),

    getAdminWorkforce: builder.query<
      { totalEmployees: number; totalCategories: number; activeCount: number; inactiveCount: number; categories: WorkforceCategoryEntity[] },
      void
    >({
      query: () => "/workforce/admin",
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Workforce"]
    }),

    createWorkforceCategory: builder.mutation<
      { data: WorkforceCategoryEntity; messageAr: string; messageEn: string },
      CreateWorkforceCategoryInput
    >({
      query: (body) => ({
        url: "/workforce",
        method: "POST",
        body
      }),
      invalidatesTags: ["Workforce", "CompanyProfile"]
    }),

    updateWorkforceCategory: builder.mutation<
      { data: WorkforceCategoryEntity; messageAr: string; messageEn: string },
      { id: string } & UpdateWorkforceCategoryInput
    >({
      query: ({ id, ...body }) => ({
        url: `/workforce/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Workforce", "CompanyProfile"]
    }),

    deleteWorkforceCategory: builder.mutation<
      { messageAr: string; messageEn: string },
      string
    >({
      query: (id) => ({
        url: `/workforce/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Workforce", "CompanyProfile"]
    }),

    reorderWorkforceCategories: builder.mutation<
      { data: WorkforceCategoryEntity[]; messageAr: string; messageEn: string },
      ReorderWorkforceCategoriesInput
    >({
      query: (body) => ({
        url: "/workforce/reorder",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Workforce"]
    }),

    updateWorkforceCounts: builder.mutation<
      { data: { totalEmployees: number; categories: WorkforceCategoryEntity[] }; messageAr: string; messageEn: string },
      UpdateEmployeeCountsInput
    >({
      query: (body) => ({
        url: "/workforce/counts",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Workforce", "CompanyProfile"]
    }),

    // Project Admin & CRUD Endpoints
    getAdminProjects: builder.query<
      { data: ProjectCaseStudy[]; meta: { total: number; matching: number; publishedCount: number; flagshipCount: number; draftCount: number } },
      { vertical?: string; region?: string; status?: string; searchQuery?: string; isPublished?: boolean; isFlagship?: boolean } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.vertical) queryParams.set("vertical", params.vertical);
        if (params?.region) queryParams.set("region", params.region);
        if (params?.status) queryParams.set("status", params.status);
        if (params?.searchQuery) queryParams.set("searchQuery", params.searchQuery);
        if (params?.isPublished !== undefined) queryParams.set("isPublished", String(params.isPublished));
        if (params?.isFlagship !== undefined) queryParams.set("isFlagship", String(params.isFlagship));
        return `/projects/admin?${queryParams.toString()}`;
      },
      providesTags: ["Project"]
    }),

    getProjectById: builder.query<ProjectCaseStudy, string>({
      query: (id) => `/projects/id/${id}`,
      transformResponse: (response: { data: ProjectCaseStudy }) => response.data,
      providesTags: (result, error, id) => [{ type: "Project", id }]
    }),

    createProject: builder.mutation<
      { data: ProjectCaseStudy; messageAr: string; messageEn: string },
      CreateProjectInput
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body
      }),
      invalidatesTags: ["Project"]
    }),

    updateProject: builder.mutation<
      { data: ProjectCaseStudy; messageAr: string; messageEn: string },
      { id: string } & UpdateProjectInput
    >({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Project"]
    }),

    deleteProject: builder.mutation<
      { messageAr: string; messageEn: string },
      string
    >({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Project"]
    }),

    toggleProjectPublish: builder.mutation<
      { data: ProjectCaseStudy; messageAr: string; messageEn: string },
      { id: string; isPublished?: boolean }
    >({
      query: ({ id, isPublished }) => ({
        url: `/projects/${id}/publish`,
        method: "PATCH",
        body: { isPublished }
      }),
      invalidatesTags: ["Project"]
    }),

    toggleProjectFeatured: builder.mutation<
      { data: ProjectCaseStudy; messageAr: string; messageEn: string },
      { id: string; isFlagship?: boolean }
    >({
      query: ({ id, isFlagship }) => ({
        url: `/projects/${id}/featured`,
        method: "PATCH",
        body: { isFlagship }
      }),
      invalidatesTags: ["Project"]
    }),

    reorderProjects: builder.mutation<
      { data: ProjectCaseStudy[]; messageAr: string; messageEn: string },
      ReorderProjectsInput
    >({
      query: (body) => ({
        url: "/projects/reorder",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Project"]
    }),

    login: builder.mutation<
      { accessToken: string; user: { id: string; email: string; fullName: string; role: string } },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials
      }),
      transformResponse: (response: { data: any }) => response.data
    }),

    // Careers & Recruitment Endpoints
    getJobOpenings: builder.query<
      JobOpeningEntity[],
      { department?: string; location?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.department && params.department !== "ALL") queryParams.append("department", params.department);
        if (params?.location && params.location !== "ALL") queryParams.append("location", params.location);
        if (params?.search) queryParams.append("search", params.search);
        const qs = queryParams.toString();
        return `/careers/jobs${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: { data: JobOpeningEntity[] }) => response.data,
      providesTags: ["Careers"]
    }),

    getJobOpeningById: builder.query<JobOpeningEntity, string>({
      query: (id) => `/careers/jobs/${id}`,
      transformResponse: (response: { data: JobOpeningEntity }) => response.data,
      providesTags: (result, error, id) => [{ type: "Careers", id }]
    }),

    submitJobApplication: builder.mutation<
      { data: { id: string; status: string; applicantName: string }; messageAr: string; messageEn: string },
      SubmitJobApplicationInput
    >({
      query: (body) => ({
        url: "/careers/apply",
        method: "POST",
        body
      }),
      invalidatesTags: ["Applications", "Careers"]
    }),

    getAdminJobOpenings: builder.query<
      { data: JobOpeningEntity[]; meta: { totalCount: number; publishedCount: number; draftCount: number; totalApplications: number } },
      void
    >({
      query: () => "/careers/admin/jobs",
      providesTags: ["Careers"]
    }),

    getAdminJobOpeningById: builder.query<JobOpeningEntity, string>({
      query: (id) => `/careers/admin/jobs/${id}`,
      transformResponse: (response: { data: JobOpeningEntity }) => response.data,
      providesTags: (result, error, id) => [{ type: "Careers", id }]
    }),

    createJobOpening: builder.mutation<{ data: JobOpeningEntity; message: string }, CreateJobOpeningInput>({
      query: (body) => ({
        url: "/careers/admin/jobs",
        method: "POST",
        body
      }),
      invalidatesTags: ["Careers"]
    }),

    updateJobOpening: builder.mutation<{ data: JobOpeningEntity; message: string }, { id: string } & UpdateJobOpeningInput>({
      query: ({ id, ...body }) => ({
        url: `/careers/admin/jobs/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Careers"]
    }),

    deleteJobOpening: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/careers/admin/jobs/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Careers", "Applications"]
    }),

    toggleJobOpeningPublish: builder.mutation<{ data: JobOpeningEntity; message: string }, string>({
      query: (id) => ({
        url: `/careers/admin/jobs/${id}/toggle-publish`,
        method: "PATCH"
      }),
      invalidatesTags: ["Careers"]
    }),

    getAdminJobApplications: builder.query<
      { data: JobApplicationEntity[]; meta: { totalCount: number; countsByStatus: Record<string, number> } },
      { status?: string; jobOpeningId?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== "ALL") queryParams.append("status", params.status);
        if (params?.jobOpeningId && params.jobOpeningId !== "ALL") queryParams.append("jobOpeningId", params.jobOpeningId);
        if (params?.search) queryParams.append("search", params.search);
        const qs = queryParams.toString();
        return `/careers/admin/applications${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Applications"]
    }),

    getAdminJobApplicationById: builder.query<JobApplicationEntity, string>({
      query: (id) => `/careers/admin/applications/${id}`,
      transformResponse: (response: { data: JobApplicationEntity }) => response.data,
      providesTags: (result, error, id) => [{ type: "Applications", id }]
    }),

    updateJobApplicationStatus: builder.mutation<
      { data: JobApplicationEntity; message: string },
      { id: string } & UpdateJobApplicationStatusInput
    >({
      query: ({ id, ...body }) => ({
        url: `/careers/admin/applications/${id}/status`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Applications", "Careers"]
    }),

    updateJobApplicationNotes: builder.mutation<
      { data: JobApplicationEntity; message: string },
      { id: string } & UpdateJobApplicationNotesInput
    >({
      query: ({ id, ...body }) => ({
        url: `/careers/admin/applications/${id}/notes`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Applications"]
    }),

    deleteJobApplication: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/careers/admin/applications/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Applications", "Careers"]
    }),

    // Admin Dashboard Aggregations
    getAdminOverviewStats: builder.query<AdminOverviewStats, void>({
      query: () => "/admin/overview-stats",
      transformResponse: (response: { data: AdminOverviewStats }) => response.data,
      providesTags: ["AdminStats"]
    }),

    // Admin User Governance
    getAdminUsers: builder.query<AdminUserEntity[], void>({
      query: () => "/users",
      transformResponse: (response: { data: AdminUserEntity[] }) => response.data,
      providesTags: ["AdminUsers"]
    }),

    createAdminUser: builder.mutation<AdminUserEntity, CreateAdminUserInput>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body
      }),
      transformResponse: (response: { data: AdminUserEntity }) => response.data,
      invalidatesTags: ["AdminUsers", "AdminStats"]
    }),

    updateAdminUser: builder.mutation<AdminUserEntity, { id: string } & UpdateAdminUserInput>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body
      }),
      transformResponse: (response: { data: AdminUserEntity }) => response.data,
      invalidatesTags: ["AdminUsers", "AdminStats"]
    }),

    deleteAdminUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["AdminUsers", "AdminStats"]
    })
  })
});

export const {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useGetClientsQuery,
  useGetAdminClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useToggleClientActiveMutation,
  useToggleClientFeaturedMutation,
  useReorderClientsMutation,
  useGetCapabilitiesQuery,
  useGetCapabilityByIdQuery,
  useGetAdminCapabilitiesQuery,
  useCreateCapabilityMutation,
  useUpdateCapabilityMutation,
  useDeleteCapabilityMutation,
  useToggleCapabilityActiveMutation,
  useToggleCapabilityFeaturedMutation,
  useReorderCapabilitiesMutation,
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useGetAdminProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleProjectPublishMutation,
  useToggleProjectFeaturedMutation,
  useReorderProjectsMutation,
  useSubmitInquiryMutation,
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useUpdateInquiryNotesMutation,
  useToggleInquiryReadMutation,
  useArchiveInquiryMutation,
  useDeleteInquiryMutation,
  useRequestPrequalMutation,
  useRegisterVendorMutation,
  useGetVendorsQuery,
  useUpdateVendorStatusMutation,
  useGetPublicWorkforceQuery,
  useGetAdminWorkforceQuery,
  useCreateWorkforceCategoryMutation,
  useUpdateWorkforceCategoryMutation,
  useDeleteWorkforceCategoryMutation,
  useReorderWorkforceCategoriesMutation,
  useUpdateWorkforceCountsMutation,
  useGetNewsListQuery,
  useGetNewsBySlugQuery,
  useGetAdminNewsListQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useToggleNewsPublishMutation,
  useToggleNewsFeaturedMutation,
  useLoginMutation,
  useGetJobOpeningsQuery,
  useGetJobOpeningByIdQuery,
  useSubmitJobApplicationMutation,
  useGetAdminJobOpeningsQuery,
  useGetAdminJobOpeningByIdQuery,
  useCreateJobOpeningMutation,
  useUpdateJobOpeningMutation,
  useDeleteJobOpeningMutation,
  useToggleJobOpeningPublishMutation,
  useGetAdminJobApplicationsQuery,
  useGetAdminJobApplicationByIdQuery,
  useUpdateJobApplicationStatusMutation,
  useUpdateJobApplicationNotesMutation,
  useDeleteJobApplicationMutation,
  useGetAdminOverviewStatsQuery,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation
} = apiSlice;

