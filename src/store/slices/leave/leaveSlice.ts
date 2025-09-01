/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LeaveRequest, LeaveBalance, TeamLeadResponse, LeaveActivityFeedItem, LeaveBalanceItem } from '@/types/leave'; // Update path if needed
import { leaveApi } from './leaveApi';
import { normalizeLeaveRequest } from '@/utils/normalize';

export type LeaveType = 'compassionate' | 'annual' | 'maternity';


export interface LeaveFormData {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  teamleadId: string;
  days: number,
  typeIdentify: string,
  allowance: 'yes' | 'no';
  relievers: string[];
}




interface LeaveState {
  isLoading: boolean;
  error: string | null;
  requests: LeaveRequest[];
  balance: LeaveBalanceItem[] | null;
  approvalQueue: LeaveRequest[];
  activityFeed: LeaveActivityFeedItem[];
  approvals: LeaveActivityFeedItem[];
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

}


const initialState: LeaveState = {
  isLoading: false,
  error: null,
  requests: [],
  balance: [],
  approvalQueue: [],
  activityFeed: [],
  approvals: [],
  isDialogOpen: false,
  createIsDialogOpen: false,
  selectedDates: [],
  formData: {
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    teamleadId: '',
    days: null,
    typeIdentify: 'leave',
    allowance: 'yes',
    relievers: []
  },
  teamLead: null,
  dateCalculation: null,
  selectedRequest: null,

  rejectionNote:'',
  statusOverview: {
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
  },
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // resetLeaveState(state) {
    //   state.isLoading = false;
    //   state.error = null;
    //   state.requests = [];
    //   state.balance = null;
    //   state.approvalQueue = [];
    //   state.activityFeed = [];
    // },

     setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
     setCreateIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.createIsDialogOpen = action.payload;
    },

     setSelectedRequest(state, action: PayloadAction<LeaveActivityFeedItem | null>) {
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
    setFormData(state, action: PayloadAction<LeaveState['formData']>) {
      state.formData = action.payload;
    },
    setDateCalculation(state, action: PayloadAction<LeaveState['dateCalculation']>) {
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
      state.dateCalculation = null; // optional
    },
     resetLeaveState: () => initialState, 
  },
extraReducers: (builder) => {
  // === GET: Leave Approval Queue ===
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
     state.approvalQueue = action.payload.data.data.map(normalizeLeaveRequest);

    }
  );
  builder.addMatcher(
    leaveApi.endpoints.getLeaveApprovalQueue.matchRejected,
    (state, action) => {
      state.isLoading = false;
      state.error = action.error?.message || 'Failed to fetch approval queue';
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

    // ✅ Normalize the full response
    const { myRequests, approvals,  summary, balance } = normalizeLeaveRequest(
      action.payload.data
    );

    // Feed is already normalized → no need to re-map
    state.activityFeed = myRequests;
    state.approvals = approvals;

    state.statusOverview = {
      pending: summary.pending,
      approved: summary.approved,
      rejected: summary.rejected,
      expired: summary.expired,
    };

    state.balance = balance;
  }
);


  builder.addMatcher(
    leaveApi.endpoints.getLeaveActivityFeed.matchRejected,
    (state, action) => {
      state.isLoading = false;
      state.error = action.error?.message || 'Failed to fetch activity feed';
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
    const exists = state.requests.some(req => req.id === newReq.id);
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
      state.error = action.error?.message || 'Failed to submit leave request';
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
      state.error = action.error?.message || 'Failed to approve leave request';
    }
  );

  // === POST: Reject Leave Request ===
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
      state.error = action.error?.message || 'Failed to reject leave request';
    }
  );

  // === GET: Team Lead Info ===
  builder.addMatcher(
    leaveApi.endpoints.getTeamLead.matchPending,
    (state) => {
      state.isLoading = true;
      state.error = null;
    }
  );
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
      state.error = action.error?.message || 'Failed to fetch team lead';
    }
  );

  // === GET: Leave Status Overview ===
builder.addMatcher(
  leaveApi.endpoints.getStatOverview.matchPending,
  (state) => {
    state.isLoading = true;
    state.error = null;
  }
);

builder.addMatcher(
  leaveApi.endpoints.getStatOverview.matchFulfilled,
  (state, action) => {
    state.isLoading = false;
    state.statusOverview = {
      pending: action.payload.data.pending,
      approved: action.payload.data.approved,
      rejected: action.payload.data.rejected,
      expired: action.payload.data.expired
    };
  }
);

builder.addMatcher(
  leaveApi.endpoints.getStatOverview.matchRejected,
  (state, action) => {
    state.isLoading = false;
    state.error = action.error?.message || 'Failed to fetch leave status overview';
  }
);

}

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
  setCreateIsDialogOpen
} = leaveSlice.actions;

export default leaveSlice.reducer;
