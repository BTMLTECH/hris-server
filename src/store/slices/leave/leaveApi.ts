import { apiSlice } from "@/store/slices/auth/apiSlice";
import {
  LeaveActivityFeedResponse,
  UpdateLeaveBalanceBody,
} from "@/types/leave";

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: "leaves/request",
        method: "POST",
        body: data,
        credentials: "include" as const,
        headers: {},
      }),
      invalidatesTags: ["LeaveActivityFeed", "LeaveApprovalQueue","Profiles"],

    }),

    // Approve leave request
    approveLeaveRequest: builder.mutation({
      query: (id: string) => ({
        url: `leaves/${id}/approve`,
        method: "POST",
        credentials: "include" as const,
      }),
      invalidatesTags: ["LeaveActivityFeed", "LeaveApprovalQueue"],
    }),

    updateLeaveBalance: builder.mutation({
      query: ({ id, body }: { id: string; body: UpdateLeaveBalanceBody }) => ({
        url: `leaves/${id}/balance`,
        method: "PUT",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Profiles"],
    }),

    // Reject leave request
    rejectLeaveRequest: builder.mutation({
      query: ({ id, note }) => ({
        url: `leaves/${id}/reject`,
        method: "POST",
        body: { note },
        credentials: "include" as const,
      }),
      invalidatesTags: ["LeaveActivityFeed", "LeaveApprovalQueue"],
    }),


    // delete leave request
    deleteLeaveRequest: builder.mutation({
      query: ({ id }) => ({
        url: `leaves/${id}/delete`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["LeaveActivityFeed", "LeaveApprovalQueue", "Profiles"],
    }),

    // Get approval queue
    getLeaveApprovalQueue: builder.query({
      query: () => ({
        url: "leaves/leave-queue",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (result) =>
        result ? [{ type: "LeaveApprovalQueue" }] : [],
    }),

    getLeaveActivityFeed: builder.query<
      LeaveActivityFeedResponse,
      { page: number; limit: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: `leaves/activity-feed?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "LeaveActivityFeed", id: "LIST" }]
          : [{ type: "LeaveActivityFeed", id: "LIST" }],
    }),

    getTeamLead: builder.query({
      query: () => ({
        url: "leaves/teamlead",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // getStatOverview: builder.query({
    //   query: () => ({
    //     url: "leaves/status-overview",
    //     method: "GET",
    //     credentials: "include" as const,
    //   }),
    // }),
  }),
});

export const {
  useCreateLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useGetLeaveApprovalQueueQuery,
  useGetLeaveActivityFeedQuery,
  useGetTeamLeadQuery,
  // useGetStatOverviewQuery,
  useUpdateLeaveBalanceMutation,
  useDeleteLeaveRequestMutation,
  useLazyGetLeaveActivityFeedQuery
} = leaveApi;
