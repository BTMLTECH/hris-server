/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  LeaveRequest,
  LeaveBalance,
  TeamLeadResponse,
  LeaveActivityFeedItem,
  LeaveBalanceItem,
} from "@/types/leave"; // Update path if needed
import { leaveApi } from "./leaveApi";
import { normalizeLeaveRequest, updateLeaveState } from "@/utils/normalize";

export type LeaveType = "compassionate" | "annual" | "maternity";

export interface LeaveFormData {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  teamleadId: string;
  days: number;
  typeIdentify: string;
  allowance: "yes" | "no";
  relievers: string[];
}

export interface Pagination {
  total: number;
  page?: number;
  limit: number;
  pages: number;
}

export type LeaveFeedCache = Record<number, LeaveActivityFeedItem[]>;
export type ApprovalFeedCache = Record<number, LeaveActivityFeedItem[]>;
export type AllApprovedFeedCache = Record<number, LeaveActivityFeedItem[]>;

interface LeaveState {
  isLoading: boolean;
  leaveDialog: boolean;
  error: string | null;
  requests: LeaveRequest[];
  balance: LeaveBalanceItem[] | null;
  approvalQueue: LeaveRequest[];
  activityFeed: LeaveActivityFeedItem[];
  approvals: LeaveActivityFeedItem[];
  allApproved: LeaveActivityFeedItem[];
  isDialogOpen: boolean;
  createIsDialogOpen: boolean;
  selectedRequest: LeaveActivityFeedItem | null;
  selectedDates: string[];
  formData: LeaveFormData;
  rejectionNote: string;
  dateCalculation: {
    totalDays: number;
    workingDays: number;
    holidays: any[];
  } | null;
  teamLead: TeamLeadResponse | null;

  statusOverview: {
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
  };

  selectedRequestId: LeaveActivityFeedItem | null;
  activityFeedCache: LeaveFeedCache;
  activityFeedPagination: Pagination;

  approvalsCache: ApprovalFeedCache;
  approvalsPagination: Pagination;

  allApprovedCache: AllApprovedFeedCache;
  allApprovedPagination: Pagination;
}

const initialState: LeaveState = {
  isLoading: false,
  leaveDialog: false,
  error: null,
  requests: [],
  balance: [],
  approvalQueue: [],
  activityFeed: [],
  allApproved: [],
  approvals: [],
  isDialogOpen: false,
  createIsDialogOpen: false,
  selectedDates: [],
  formData: {
    type: "annual",
    startDate: "",
    endDate: "",
    reason: "",
    teamleadId: "",
    days: null,
    typeIdentify: "leave",
    allowance: "yes",
    relievers: [],
  },
  teamLead: null,
  dateCalculation: null,
  selectedRequest: null,
  selectedRequestId: null,

  rejectionNote: "",
  statusOverview: {
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
  },
  activityFeedCache: {},
  approvalsCache: {},
  allApprovedCache: {},
  activityFeedPagination: { total: 0, page: 1, limit: 30, pages: 0 },
  allApprovedPagination: { total: 0, page: 1, limit: 30, pages: 0 },
  approvalsPagination: { total: 0, page: 1, limit: 30, pages: 0 },
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setLeaveDialog(state, action: PayloadAction<boolean>) {
      state.leaveDialog = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setCreateIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.createIsDialogOpen = action.payload;
    },

    setAllLeavePagination: (
      state,
      action: PayloadAction<typeof initialState.allApprovedPagination>
    ) => {
      state.allApprovedPagination = action.payload;
    },

    setActivityFeedPagination: (
      state,
      action: PayloadAction<typeof initialState.activityFeedPagination>
    ) => {
      state.activityFeedPagination = action.payload;
    },

    setAllApprovedCache: (
      state,
      action: PayloadAction<{ page: number; data: LeaveActivityFeedItem[] }>
    ) => {
      state.allApprovedCache[action.payload.page] = action.payload.data;
    },

    setActivityCache: (
      state,
      action: PayloadAction<{ page: number; data: LeaveActivityFeedItem[] }>
    ) => {
      state.activityFeedCache[action.payload.page] = action.payload.data;
    },

    setSelectedRequest(
      state,
      action: PayloadAction<LeaveActivityFeedItem | null>
    ) {
      state.selectedRequest = action.payload;
    },
    setRejectionNote(state, action: PayloadAction<string>) {
      state.rejectionNote = action.payload;
    },

    setRequests(state, action: PayloadAction<LeaveRequest[]>) {
      state.requests = action.payload;
    },
    setSelectedDates(state, action: PayloadAction<string[]>) {
      state.selectedDates = action.payload;
    },
    setFormData(state, action: PayloadAction<LeaveState["formData"]>) {
      state.formData = action.payload;
    },

    setSelectedRequestId(state, action: PayloadAction<LeaveActivityFeedItem>) {
      state.selectedRequestId = action.payload;
    },
    setDateCalculation(
      state,
      action: PayloadAction<LeaveState["dateCalculation"]>
    ) {
      state.dateCalculation = action.payload;
    },
    setTeamLead(state, action: PayloadAction<TeamLeadResponse>) {
      state.teamLead = action.payload;
    },
    updateStatusOverview: (
      state,
      action: PayloadAction<{ approved?: boolean; rejected?: boolean }>
    ) => {
      if (action.payload.approved) {
        state.statusOverview.approved += 1;
        state.statusOverview.pending -= 1;
      }
      if (action.payload.rejected) {
        state.statusOverview.rejected += 1;
        state.statusOverview.pending -= 1;
      }
    },
    resetFormData(state) {
      state.formData = initialState.formData;
      state.dateCalculation = null;
    },
    updateLeaveActivityFeed: (
      state,
      action: PayloadAction<ReturnType<typeof normalizeLeaveRequest>>
    ) => {
      updateLeaveState(state, action.payload);
    },

    resetLeaveState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      leaveApi.endpoints.getLeaveApprovalQueue.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      leaveApi.endpoints.getLeaveApprovalQueue.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.approvalQueue = action.payload.data.data.map(
          normalizeLeaveRequest
        );
      }
    );
    builder.addMatcher(
      leaveApi.endpoints.getLeaveApprovalQueue.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch approval queue";
      }
    );

    // === GET: Activity Feed ===
    builder.addMatcher(
      leaveApi.endpoints.getLeaveActivityFeed.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.getLeaveActivityFeed.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        updateLeaveState(state, action.payload);
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.getLeaveActivityFeed.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch activity feed";
      }
    );

    // === POST: Create Leave Request ===
    builder.addMatcher(
      leaveApi.endpoints.createLeaveRequest.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.createLeaveRequest.matchFulfilled,
      (state, action) => {
        const newReq = action.payload.data;
        const exists = state.requests.some((req) => req.id === newReq.id);
        if (!exists) {
          state.requests.push(newReq);
        }
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.createLeaveRequest.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to submit leave request";
      }
    );

    // === POST: Approve Leave Request ===
    builder.addMatcher(
      leaveApi.endpoints.approveLeaveRequest.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      leaveApi.endpoints.approveLeaveRequest.matchFulfilled,
      (state, action) => {
        state.isLoading = false;

        state.approvalQueue = state.approvalQueue.filter(
          (req) => req.id !== action.meta.arg.originalArgs
        );

        state.statusOverview.approved += 1;
        state.statusOverview.pending -= 1;
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.approveLeaveRequest.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error =
          action.error?.message || "Failed to approve leave request";
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.rejectLeaveRequest.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      leaveApi.endpoints.rejectLeaveRequest.matchFulfilled,
      (state, action) => {
        state.isLoading = false;

        state.approvalQueue = state.approvalQueue.filter(
          (req) => req.id !== action.meta.arg.originalArgs.id
        );

        state.statusOverview.rejected += 1;
        state.statusOverview.pending -= 1;
      }
    );

    builder.addMatcher(
      leaveApi.endpoints.rejectLeaveRequest.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to reject leave request";
      }
    );

    builder.addMatcher(leaveApi.endpoints.getTeamLead.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(
      leaveApi.endpoints.getTeamLead.matchFulfilled,
      (state, action) => {

        state.isLoading = false;
        state.teamLead = action.payload;
      }
    );
    builder.addMatcher(
      leaveApi.endpoints.getTeamLead.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch team lead";
      }
    );

    // builder.addMatcher(
    //   leaveApi.endpoints.getStatOverview.matchPending,
    //   (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   }
    // );

    // builder.addMatcher(
    //   leaveApi.endpoints.getStatOverview.matchFulfilled,
    //   (state, action) => {
    //     state.isLoading = false;
    //     state.statusOverview = {
    //       pending: action.payload.data.pending,
    //       approved: action.payload.data.approved,
    //       rejected: action.payload.data.rejected,
    //       expired: action.payload.data.expired,
    //     };
    //   }
    // );

    // builder.addMatcher(
    //   leaveApi.endpoints.getStatOverview.matchRejected,
    //   (state, action) => {
    //     state.isLoading = false;
    //     state.error =
    //       action.error?.message || "Failed to fetch leave status overview";
    //   }
    // );
  },
});

export const {
  setLoading,
  setError,
  resetLeaveState,
  setIsDialogOpen,
  setSelectedDates,
  setFormData,
  setDateCalculation,
  setRequests,
  updateStatusOverview,
  setSelectedRequest,
  setRejectionNote,
  resetFormData,
  setCreateIsDialogOpen,
  setAllLeavePagination,
  setActivityFeedPagination,
  setAllApprovedCache,
  setActivityCache,
  setSelectedRequestId,
  updateLeaveActivityFeed,
  setLeaveDialog,
} = leaveSlice.actions;

export default leaveSlice.reducer;
