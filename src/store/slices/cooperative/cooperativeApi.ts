/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "../auth/apiSlice";

export const cooperativeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create cooperative contribution
    notifyHr: builder.mutation({
      query: (body) => ({
        url: "cooperative/notify",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Contribution"], 
    }),
    
    createCooperativeContribution: builder.mutation({
      query: (id) => ({
        url: `cooperative/add/${id}`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Contribution"], // adjust this tag if needed
    }),

    // ✅ Update cooperative contribution by ID
    updateCooperativeContribution: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `cooperative/${id}`,
        method: "PUT",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Contribution"],
    }),

    // ✅ Delete cooperative contribution by ID
    deleteCooperativeContribution: builder.mutation({
      query: (id) => ({
        url: `cooperative/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Contribution"],
    }),

    // ✅ Get all cooperative contributions
    getAllCooperativeContributions: builder.query({
      query: () => ({
        url: "cooperative/get-all",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Contribution"],
    }),
  }),
});

export const {
  useNotifyHrMutation,
  useCreateCooperativeContributionMutation,
  useUpdateCooperativeContributionMutation,
  useDeleteCooperativeContributionMutation,
  useGetAllCooperativeContributionsQuery,
} = cooperativeApi;
