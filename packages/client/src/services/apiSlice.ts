import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type {
  CorporateProfile,
  ClientEntity,
  CapabilityVertical,
  ProjectCaseStudy,
  ScopedInquiryInput,
  PrequalificationRequestInput,
  VendorRegistrationInput
} from "@alhadab/shared";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ["Project", "Capability", "Client", "Inquiry", "Vendor", "Auth"],
  endpoints: (builder) => ({
    getCompanyProfile: builder.query<CorporateProfile, void>({
      query: () => "/company/profile",
      transformResponse: (response: { data: CorporateProfile }) => response.data
    }),

    getClients: builder.query<ClientEntity[], void>({
      query: () => "/company/clients",
      transformResponse: (response: { data: ClientEntity[] }) => response.data,
      providesTags: ["Client"]
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

    getInquiries: builder.query<any[], void>({
      query: () => "/inquiries",
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["Inquiry"]
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
    })
  })
});

export const {
  useGetCompanyProfileQuery,
  useGetClientsQuery,
  useGetCapabilitiesQuery,
  useGetCapabilityByIdQuery,
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useSubmitInquiryMutation,
  useGetInquiriesQuery,
  useRequestPrequalMutation,
  useRegisterVendorMutation,
  useLoginMutation
} = apiSlice;
