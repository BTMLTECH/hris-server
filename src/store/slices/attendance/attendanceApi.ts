/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { PaginatedAttendanceResponse } from "@/types/attendance";
import { apiSlice } from "../auth/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    biometryCheckIn: builder.mutation({
      query: (data) => ({
        url: "attendance/biometry-check-in",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    biometryCheckOut: builder.mutation({
      query: (data) => ({
        url: "attendance/biometry-check-out",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    manualCheckIn: builder.mutation({
      query: (data) => ({
        url: "attendance/check-in",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["AttendanceHistory", "CompanySummary"],
    }),

    manualCheckOut: builder.mutation({
      query: (data) => ({
        url: "attendance/check-out",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["AttendanceHistory", "CompanySummary"],
    }),

    getMyAttendanceHistory: builder.query<
      PaginatedAttendanceResponse,
      { page: number; limit: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: `attendance/my-history?page=${page}&limit=${limit}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => (result ? [{ type: "AttendanceHistory" }] : []),
    }),

    adminAttendanceReport: builder.query({
      query: () => ({
        url: "attendance/admin/report",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) => (result ? [{ type: "AttendanceHistory" }] : []),
    }),

    getCompanyAttendanceSummary: builder.query({
      query: () => ({
        url: "attendance/company-summary",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "CompanySummary" }],
    }),

    exportAttendanceExcel: builder.query({
      query: () => ({
        url: "attendance/admin/export-excel",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useBiometryCheckInMutation,
  useBiometryCheckOutMutation,
  useManualCheckInMutation,
  useManualCheckOutMutation,
  useGetMyAttendanceHistoryQuery,
  useAdminAttendanceReportQuery,
  useGetCompanyAttendanceSummaryQuery,
  useExportAttendanceExcelQuery,
} = attendanceApi;
