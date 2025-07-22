/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiSlice } from "@/store/slices/auth/apiSlice";



export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit leave request
    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: 'leaves/request',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),

    // Approve leave request
    approveLeaveRequest: builder.mutation({
      query: (id: string) => ({
        url: `leaves/${id}/approve`,
        method: 'POST',
        credentials: 'include' as const,
      }),
    }),

    // Reject leave request
    rejectLeaveRequest: builder.mutation({
      query: ({id, note}) => ({
        url: `leaves/${id}/reject`,
        method: 'POST',
        body: {note},
        credentials: 'include' as const,
      }),
    }),

    // Get approval queue
    getLeaveApprovalQueue: builder.query({
      query: () => ({
        url: 'leaves/leave-queue',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    // Get leave activity feed
    getLeaveActivityFeed: builder.query({
      query: () => ({
        url: 'leaves/activity-feed',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    getTeamLead: builder.query({
      query: () => ({
        url: 'leaves/teamlead',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),

    getStatOverview: builder.query({
      query: () => ({
        url: 'leaves/status-overview',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useGetLeaveApprovalQueueQuery,
  useGetLeaveActivityFeedQuery,
  useGetTeamLeadQuery,
  useGetStatOverviewQuery
} = leaveApi;
