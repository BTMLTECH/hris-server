/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { apiSlice } from "../auth/apiSlice";

export const classApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({ 
    calculateClass: builder.mutation({
      query: (body) => ({
        url: "levels/class",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    // Create single class
    createClassLevel: builder.mutation({
      query: (body) => ({
        url: "levels/single",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
       invalidatesTags: ['Profiles'],
    }),

 
    bulkCreateClassLevels: builder.mutation({
      query: (body) => ({
        url: "levels/bulk",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
       invalidatesTags: ['Profiles'],
    }),

    // Update a class level by ID
    updateClassLevel: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `levels/${id}`,
        method: "PUT",
        body,
        credentials: "include" as const,
      }),
       invalidatesTags: ['Profiles'],
    }),

    bulkDeleteClassLevelsByYear: builder.mutation({
      query: (year) => ({
        url: 'levels/bulk-delete',
        method: "DELETE",
        body: year,
        credentials: "include" as const,
      }),
       invalidatesTags: ['Profiles'],
    }),


    getClassLevel: builder.query({
      query: () => ({
        url: 'levels/get-all',
        method: 'GET',
        credentials: 'include' as const,
      }),      
    }),

    
  }),
});

export const {
useBulkCreateClassLevelsMutation,
useCalculateClassMutation,
useCreateClassLevelMutation,
useGetClassLevelQuery,
useUpdateClassLevelMutation,
useBulkDeleteClassLevelsByYearMutation
} = classApi;
