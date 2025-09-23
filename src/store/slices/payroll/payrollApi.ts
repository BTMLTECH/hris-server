/* eslint-disable @typescript-eslint/no-explicit-any */
import { cachedInitialType, IPayroll, PayrollResponse } from "@/types/payroll"; // adjust the import path as needed
import { apiSlice } from "../auth/apiSlice";

export const payrollApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayrolls: builder.query<
      cachedInitialType,
      {
        page?: number;
        limit?: number;
        month?: string;
        year?: string;
        search?: string;
      }
    >({
      query: ({ page = 1, limit = 50, month, year, search }) => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(month && { month }),
          ...(year && { year }),
          ...(search && { search }),
        });

        return {
          url: `payroll/get-payslips?${queryParams.toString()}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: (result) => (result ? [{ type: "getAllPayrolls" }] : []),
    }),

    markPayrollAsDraft: builder.mutation({
      query: (payrollId: string) => ({
        url: `payroll/${payrollId}/draft`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    markPayrollAsPaid: builder.mutation({
      query: (payrollId: string) => ({
        url: `payroll/${payrollId}/paid`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    processSinglePayroll: builder.mutation({
      query: (payrollId: string) => ({
        url: `payroll/${payrollId}/process`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    reverseSinglePayroll: builder.mutation({
      query: (payrollId: string) => ({
        url: `payroll/${payrollId}/reverse`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    // ⚙️ Process bulk payrolls
    processBulkPayroll: builder.mutation({
      query: ({ month, year }) => ({
        url: "payroll/process-bulk",
        method: "POST",
        body: { month, year },
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    markPayrollsAsDraftBulk: builder.mutation({
      query: ({ month, year }) => ({
        url: "payroll/bulk-draft",
        method: "POST",
        body: { month, year },
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    // ♻️ Reverse bulk payrolls
    reverseBulkPayroll: builder.mutation({
      query: ({ month, year }) => ({
        url: "payroll/reverse-bulk",
        method: "POST",
        body: { month, year },
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    payrollsAsPaidBulk: builder.mutation({
      query: ({ month, year }) => ({
        url: "payroll/bulk-pay",
        method: "POST",
        body: { month, year },
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),

    // 🗑️ Delete a payroll
    deletePayroll: builder.mutation({
      query: (payrollId: string) => ({
        url: `payroll/${payrollId}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["getAllPayrolls"],
    }),
  }),
});

export const {
  useGetAllPayrollsQuery,
  useDeletePayrollMutation,
  useProcessSinglePayrollMutation,
  useReverseSinglePayrollMutation,
  useProcessBulkPayrollMutation,
  useReverseBulkPayrollMutation,
  useMarkPayrollAsDraftMutation,
  useMarkPayrollAsPaidMutation,
  useMarkPayrollsAsDraftBulkMutation,
  usePayrollsAsPaidBulkMutation,
} = payrollApi;
