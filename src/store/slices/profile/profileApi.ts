/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { PaginatedProfilesResponse, ProfileFormData } from "@/types/user";
import { apiSlice } from "../auth/apiSlice";



export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    editProfile: builder.mutation({
      query: (data) => {
        const { _id, ...bodyData } = data; 
        return {
          url: `user/${_id}`,
          method: 'PUT',
          body: bodyData, 
          credentials: 'include' as const,
        };
      },
      invalidatesTags: ['Profiles'],
    }),

    uploadProfile: builder.mutation({
      query: (file:FormData) => ({
        url: 'user/upload',
        method: 'PUT',
        body: file,
        credentials: 'include' as const,
         headers: {
        },
        invalidatesTags: ['Profiles'],

      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: 'user/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Profiles' }] : [],
    }),

    
    getDepartments: builder.query({
      query: () => ({
        url: 'departments/get-all',
        method: 'GET',
        credentials: 'include' as const,
      }),
      
    }),


        // Calculate Class
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


    getClassLevel: builder.query({
      query: () => ({
        url: 'levels/get-all',
        method: 'GET',
        credentials: 'include' as const,
      }),      
    }),

    getAnalytics: builder.query({
      query: () => ({
        url: 'user/analytics',
        method: 'GET',
        credentials: 'include' as const,
      }),      
    }),

    getAllProfile: builder.query<PaginatedProfilesResponse, { page: number; limit: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `user/users?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ _id }) => ({ type: 'Profiles' as const, _id })),
              { type: 'Profiles', id: 'LIST' },
            ]
          : [{ type: 'Profiles', id: 'LIST' }],
    }),

    
    getLastStaffId: builder.query({
     query: () => ({
        url: 'auth/last-staffId',
        method: 'GET',
        credentials: 'include' as const,
        }),
          
      }),
   

    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Profiles'],
    }),

    terminateProfile: builder.mutation({
      query: (id) => ({
        url: `user/${id}/terminate`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
        invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),

    activateProfile: builder.mutation({
      query: (id) => ({
        url: `user/${id}/activate`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
        invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),
    
  }),
});

export const {
useEditProfileMutation,
useUploadProfileMutation,
useGetProfileQuery,
useDeleteProfileMutation,
useGetAllProfileQuery,
useGetDepartmentsQuery,
useGetClassLevelQuery,
useGetLastStaffIdQuery,
useTerminateProfileMutation,
useActivateProfileMutation,
useGetAnalyticsQuery
} = profileApi;
