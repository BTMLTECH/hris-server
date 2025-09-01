/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { appraisalApi } from './appraisalApi';
import { Appraisal, AppraisalObjective } from '@/types/appraisal';
import { AppraisalTarget } from '@/data/appraisalTargets';

interface AppraisalFormData {
  title: string;
  period: string;
  dueDate: Date | null;
}

interface AppraisalState {
  appraisalRequests: Appraisal[];
  selectedAppraisal: Appraisal | null;
  isDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isLoading: boolean;
  error: string | null;
  step: 'basic' | 'targets' | 'preview';
  formData: AppraisalFormData;
  selectedTargets: AppraisalTarget[];
  availableTargets: AppraisalTarget[];
  objectives: AppraisalObjective[];
  activityPagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  activityFilter: string;
   activityCache: {
    all: Record<number, Appraisal[]>;
    approved: Record<number, Appraisal[]>;
    rejected: Record<number, Appraisal[]>;
  };
 
}

const initialState: AppraisalState = {
  appraisalRequests: [],
  isDialogOpen: false,
  isCreateDialogOpen: false,
  isLoading: false,
  error: null,
  step: 'basic',
  formData: {
    title: '',
    period: 'monthly',
    dueDate: null,
  },
  selectedTargets: [],
  availableTargets: [],
  selectedAppraisal: null,
  objectives: [],  
  activityPagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  activityFilter: 'all',  
  activityCache: {
    all: {},
    approved: {},
    rejected: {},
  },

};

const appraisalSlice = createSlice({
  name: 'appraisal',
  initialState,
  reducers: {
    
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setIsCreateDialogOpen(state, action: PayloadAction<boolean>) {
      state.isCreateDialogOpen = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setStep(state, action: PayloadAction<AppraisalState['step']>) {
      state.step = action.payload;
    },
    setFormData(state, action: PayloadAction<Partial<AppraisalFormData>>) {
      state.formData = { ...state.formData, ...action.payload };
    },
    setAvailableTargets(state, action: PayloadAction<AppraisalTarget[]>) {
      state.availableTargets = action.payload;
    },
    setSelectedTargets(state, action: PayloadAction<AppraisalTarget[]>) {
      state.selectedTargets = action.payload;
    },
    setSelectedAppraisal(state, action: PayloadAction<Appraisal | null>) {
      state.selectedAppraisal = action.payload;
    },
   
    updateAppraisalInState(
      state,
      action: PayloadAction<{
        appraisal: Appraisal;
        actionType:
          | 'pending'
          | 'approved'
          | 'rejected'
          | 'completed'
          | 'sent_to_employee'
          | 'needs_revision'
          | 'submitted'
          | 'update';
      }>
    ) {
      const { appraisal, actionType } = action.payload;
      const index = state.appraisalRequests.findIndex(a => a.id === appraisal.id);

      if (index !== -1) {
        let status = appraisal.status;

        switch (actionType) {
          case 'pending':
            status = 'pending';
            break;
          case 'approved':
            status = 'approved';
            break;
          case 'rejected':
            status = 'rejected';
            break;
          case 'sent_to_employee':
            status = 'sent_to_employee';
            break;
          case 'needs_revision':
            status = 'needs_revision';
            break;
          case 'submitted':
            status = 'submitted';
            break;
          default:
            status = appraisal.status; 
        }

        state.appraisalRequests[index] = {
          ...appraisal,
          status,
        };
      }

      state.selectedAppraisal = null;
    },
    setActivityPagination(state, action: PayloadAction<AppraisalState['activityPagination']>) {
      state.activityPagination = action.payload;
    },
    setActivityFilter(state, action: PayloadAction<string>) {
      state.activityFilter = action.payload;
    },
    setActivityCache(state, action: PayloadAction<{ status: string; page: number; data: Appraisal[] }>) {
      const { status, page, data } = action.payload;
      if (!state.activityCache[status]) {
        state.activityCache[status] = {};
      }
      state.activityCache[status][page] = data;
    },


    setAppraisalRequests(state, action: PayloadAction<Appraisal[]>) {
      state.appraisalRequests = action.payload;
    },
    clearActivityCache(state) {
    state.activityCache = {
      all: {},
      approved: {},
      rejected: {},
    };
      state.appraisalRequests = [];
    },

   setAppraisalObjectives(
      state,
      action: PayloadAction<{ appraisalId: string; objectives: AppraisalObjective[] }>
    ) {
      const { appraisalId, objectives } = action.payload;

      // Update objectives inside the list
      const appraisal = state.appraisalRequests.find(a => a.id === appraisalId);
      if (appraisal) {
        appraisal.objectives = objectives;
      }

      // Also update the currently selected appraisal
      if (state.selectedAppraisal?.id === appraisalId) {
        state.selectedAppraisal.objectives = objectives;
      }
      state.objectives = objectives;
    },


    toggleTarget(state, action: PayloadAction<AppraisalTarget>) {
      const exists = state.selectedTargets.find(t => t.id === action.payload.id);
      if (exists) {
        state.selectedTargets = state.selectedTargets.filter(t => t.id !== action.payload.id);
      } else {
        state.selectedTargets.push(action.payload);
      }
    },
    resetAppraisalForm: () => initialState,
  },

  extraReducers: (builder) => {
    // // === GET: Appraisal Approval Queue ===
    // builder.addMatcher(
    //   appraisalApi.endpoints.getAppraisalApprovalQueue.matchFulfilled,
    //   (state, action) => {
    //     state.appraisalRequests = action.payload.data;
    //   }
    // );

    // === POST: Create Appraisal ===
    builder.addMatcher(
      appraisalApi.endpoints.createAppraisalRequest.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      appraisalApi.endpoints.createAppraisalRequest.matchFulfilled,
         (state, action) => {
        const updated = action.payload.data;
        const normalized = {
          ...updated,
          employeeId: updated.user?._id,
          employeeName: updated.user?.firstName,
          employeeLastName: updated.user?.lastName,
        };

        state.appraisalRequests = state.appraisalRequests.map(appraisal =>
          appraisal.id === normalized.id ? normalized : appraisal
        );

        state.isLoading = false;
      }
    );
   builder.addMatcher(
      appraisalApi.endpoints.createAppraisalRequest.matchFulfilled,
      (state, action) => {
        const newAppraisal = action.payload.data;
        const normalized = {
          ...newAppraisal,
          employeeId: newAppraisal.user?._id,
          employeeName: newAppraisal.user?.name,
        };

        state.appraisalRequests.push(normalized);
        state.isLoading = false;
      }
    );


    // === PATCH: Update Appraisal ===
    builder.addMatcher(
      appraisalApi.endpoints.updateAppraisalRequest.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      appraisalApi.endpoints.updateAppraisalRequest.matchFulfilled,
      (state, action) => {
        const updated = action.payload.data;
        const normalized = {
          ...updated,
          employeeId: updated.user?._id,
          employeeName: updated.user?.firstName,
          employeeLastName: updated.user?.lastName,
        };

        state.appraisalRequests = state.appraisalRequests.map(appraisal =>
          appraisal.id === normalized.id ? normalized : appraisal
        );

        state.isLoading = false;
      }
    );

    builder.addMatcher(
      appraisalApi.endpoints.updateAppraisalRequest.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update appraisal';
      }
    );

    // === POST: Approve Appraisal ===
    builder.addMatcher(
      appraisalApi.endpoints.approveAppraisalRequest.matchFulfilled,
      (state, action) => {
        const approved = action.payload.data;
        state.appraisalRequests = state.appraisalRequests.map(appraisal =>
          appraisal.id === approved.id ? approved : appraisal
        );
      }
    );

    // === POST: Reject Appraisal ===
    builder.addMatcher(
      appraisalApi.endpoints.rejectAppraisalRequest.matchFulfilled,
      (state, action) => {
        const rejected = action.payload.data;
        state.appraisalRequests = state.appraisalRequests.map(appraisal =>
          appraisal.id === rejected.id ? rejected : appraisal
        );
      }
    );

    // GET: Get appraisal activity
    // builder.addMatcher(
    //   appraisalApi.endpoints.getAppraisalActivity.matchFulfilled,
    //   (state, action) => {
    //      state.appraisalRequests = Array.isArray(action.payload.data)
    //   ? action.payload.data.map((appraisal:any) => ({
    //       ...appraisal,
    //       employeeId: appraisal.user?._id, 
    //       employeeName: appraisal.user?.firstName,
    //       employeeLastName: appraisal.user?.lastName,
    //     }))
    //   : []
    //   }
    // );

    builder.addMatcher(
      appraisalApi.endpoints.getAppraisalActivity.matchFulfilled,
      (state, action) => {
        const status = state.activityFilter;
        const page = action.payload.pagination.page;

        const mappedData = Array.isArray(action.payload.data)
          ? action.payload.data.map((appraisal: any) => ({
              ...appraisal,
              employeeId: appraisal.user?._id,
              employeeName: appraisal.user?.firstName,
              employeeLastName: appraisal.user?.lastName,
            }))
          : [];

        if (!state.activityCache[status]) state.activityCache[status] = {};
        state.activityCache[status][page] = mappedData;

        // This should only affect current view
        state.appraisalRequests = mappedData;
      }
    );



  },
});

export const {
  setIsDialogOpen,
  setIsCreateDialogOpen,
  setIsLoading,
  setError,
  setFormData,
  setStep,
  setAvailableTargets,
  toggleTarget,
  setSelectedTargets,
  setSelectedAppraisal,
  setAppraisalObjectives, 
  updateAppraisalInState,
  setActivityPagination,
  setActivityFilter,
  setActivityCache,
  setAppraisalRequests,
  clearActivityCache,
  resetAppraisalForm,
} = appraisalSlice.actions;

export default appraisalSlice.reducer;
