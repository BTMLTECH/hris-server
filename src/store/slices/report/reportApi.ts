import {
  GenerateReportDTO,
  IComms,
  IOperationReport,
  IQualityAssurance,
  IReport,
} from "@/types/report";
import { apiSlice } from "../auth/apiSlice";
import { createPaginatedQuery } from "../createPaginatedQuery";
const isProd = import.meta.env.VITE_NODE_ENV === "production";

export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateEmploymentSummary: builder.mutation<void, GenerateReportDTO>({
      query: (reportData) => ({
        url: "reports/get-employee-summary",
        method: "POST",
        body: reportData,
        responseHandler: async (response) => {
          if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
              const errorData = await response.json();
              if (errorData?.message) errorMessage = errorData.message;
            } catch {
              if (isProd) {
                console.log("error");
              }
            }
            throw new Error(errorMessage);
          }

          const blob = await response.blob();
          const contentDisposition = response.headers.get(
            "Content-Disposition"
          );
          let fileName = "";

          // Extract from Content-Disposition if present
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match?.[1]) {
              fileName = match[1];
            }
          }

          // If no filename in headers, generate dynamically
          if (!fileName) {
            const now = new Date();
            const monthYear = now
              .toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })
              .replace(/ /g, "_");

            // Detect file extension based on backend response Content-Type
            const contentType = response.headers.get("Content-Type") || "";
            let ext = "";
            if (contentType.includes("pdf")) ext = ".pdf";
            else if (contentType.includes("spreadsheet")) ext = ".xlsx";
            else if (contentType.includes("csv")) ext = ".csv";
            else ext = "";

            fileName = `Employment_Summary_${monthYear}${ext}`;
          }

          // Download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        },
      }),
    }),

    getAllQuality: createPaginatedQuery<
      IQualityAssurance,
      {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
      }
    >(builder, {
      baseUrl: "reports/get-quality",
      tagType: "Quality",
      filterKeys: ["page", "limit", "search", "startDate"],
    }),

    getAllComms: createPaginatedQuery<
      IComms,
      {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
      }
    >(builder, {
      baseUrl: "reports/get-comms",
      tagType: "Comms",
      filterKeys: ["page", "limit", "search", "startDate"],
    }),

    getAllITReports: createPaginatedQuery<
      IReport,
      {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
      }
    >(builder, {
      baseUrl: "reports/get-itreport",
      tagType: "ITReport",
      filterKeys: ["page", "limit", "search", "startDate"],
    }),

    getAllOperations: createPaginatedQuery<
      IOperationReport,
      {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
      }
    >(builder, {
      baseUrl: "reports/get-operations",
      tagType: "Operations",
      filterKeys: ["page", "limit", "search", "startDate"],
    }),

    createQuality: builder.mutation({
      query: (body) => ({
        url: "reports/create-quality",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      // invalidatesTags: [{ type: "Quality", id: "LIST" }],
    }),

    createOperation: builder.mutation({
      query: (body) => ({
        url: "reports/create-operation",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      // invalidatesTags: [{ type: "Operations", id: "LIST" }],
    }),

    createComms: builder.mutation({
      query: (body) => ({
        url: "reports/create-comms",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      // invalidatesTags: [{ type: "Comms", id: "LIST" }],
    }),

    createITReport: builder.mutation({
      query: (body) => ({
        url: "reports/create-itreport",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      // invalidatesTags: [{ type: "ITReport", id: "LIST" }],
    }),

    createReportLink: builder.mutation({
      query: (body) => ({
        url: "reports/create-link",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGenerateEmploymentSummaryMutation,
  useGetAllQualityQuery,
  useCreateCommsMutation,
  useCreateITReportMutation,
  useGetAllCommsQuery,
  useLazyGetAllQualityQuery,
  useCreateOperationMutation,
  useCreateQualityMutation,
  useGetAllITReportsQuery,
  useLazyGetAllOperationsQuery,
  useLazyGetAllITReportsQuery,
  useGetAllOperationsQuery,
  useLazyGetAllCommsQuery,
  useCreateReportLinkMutation,
} = reportApi;
