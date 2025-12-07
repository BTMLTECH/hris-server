/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Appraisal } from "@/types/appraisal";
import { apiSlice } from "../auth/apiSlice";

export const appraisalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAppraisalRequest: builder.mutation({
      query: (data) => ({
        url: 'appraisal/request',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
       invalidatesTags: [{ type: 'getAppraisalActivity', id: 'LIST' }],
    }),

    updateAppraisalRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appraisal/update/${id}`,
        method: 'PATCH',
        body: data, 
        credentials: 'include' as const,
      }),
        invalidatesTags: [{ type: 'getAppraisalActivity', id: 'LIST' }],
    }),

    approveAppraisalRequest: builder.mutation({
      query: ({ id}) => ({
        url: `appraisal/${id}/approve`,
        method: 'POST',
        credentials: 'include' as const,
      }),
        invalidatesTags: [{ type: 'getAppraisalActivity', id: 'LIST' }],
    }),

    rejectAppraisalRequest: builder.mutation({
      query: ({ id }) => ({
        url: `appraisal/${id}/reject`,
        method: 'POST',
        credentials: 'include' as const,
      }),
       invalidatesTags: [{ type: 'getAppraisalActivity', id: 'LIST' }],
    }),

    

    getAppraisalActivity: builder.query<{
      data: Appraisal[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }, { page: number; limit: number; status?: string }>({
       query: ({ page = 1, limit = 10, status = "all" }) => ({
        url: `appraisal/activity?page=${page}&limit=${limit}&status=${status}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
        providesTags: (result) =>
    result
      ? [{ type: 'getAppraisalActivity', id: 'LIST' }]
      : [{ type: 'getAppraisalActivity', id: 'LIST' }],
}),

    getEmployeeByDepartment: builder.query({
      query: () => ({
        url: 'appraisal/get-employee',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateAppraisalRequestMutation,
  useApproveAppraisalRequestMutation,
  useRejectAppraisalRequestMutation,
  useGetEmployeeByDepartmentQuery,
  useUpdateAppraisalRequestMutation,
  useGetAppraisalActivityQuery
} = appraisalApi;
