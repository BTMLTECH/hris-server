import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handoverApi } from "./handoverApi";

export interface HandoverReport {
  _id?: string;
  user: string;
  teamlead: string;
  date: string;
  shift: "day" | "night";
  summary: string;
  pdfFile?: string;
  status: "pending" | "approved" | "rejected" | "submitted" | "reviewed";
  note?: string;
  employeename?: string;
  createdAt: string;
}

interface HandoverFormData {
  date: string;
  shift: "day" | "night";
  summary: string;
  achievements: string;
  challenges: string;
  nextDayPlan: string;
  teamleadId: string;
}

interface HandoverUIState {
  isDialogOpen: boolean;
  isRejectDialogOpen: boolean;
  // selectedFile: File | null;
  rejectionNote: string;
  formData: HandoverFormData;
  isDeleteDialogOpen: boolean;
  selectedDeleteId: string | null;
}

interface HandoverState {
  isLoading: boolean;
  error: string | null;
  reports: HandoverReport[];
  selectedReport: HandoverReport | null;
  ui: HandoverUIState;
}

const initialState: HandoverState = {
  isLoading: false,
  error: null,
  reports: [],
  selectedReport: null,

  ui: {
    isDialogOpen: false,
    isRejectDialogOpen: false,
    // selectedFile: null,
    rejectionNote: "",
    formData: {
      date: new Date().toISOString().split("T")[0],
      shift: "day",
      summary: "",
      achievements: "",
      challenges: "",
      nextDayPlan: "",
      teamleadId: "",
    },
    isDeleteDialogOpen: false,
    selectedDeleteId: "",
  },
};

const handoverSlice = createSlice({
  name: "handover",
  initialState,
  reducers: {
    setSelectedReport(state, action: PayloadAction<HandoverReport | null>) {
      state.selectedReport = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.ui.isDialogOpen = action.payload;
    },
    setIsRejectDialogOpen(state, action: PayloadAction<boolean>) {
      state.ui.isRejectDialogOpen = action.payload;
    },
    // setSelectedFile(state, action: PayloadAction<File | null>) {
    //   state.ui.selectedFile = action.payload;
    // },
    setRejectionNote(state, action: PayloadAction<string>) {
      state.ui.rejectionNote = action.payload;
    },
    setIsDeleteDialogOpen(state, action: PayloadAction<boolean>) {
      state.ui.isDeleteDialogOpen = action.payload;
    },
    setSelectedDeleteId(state, action: PayloadAction<string | null>) {
      state.ui.selectedDeleteId = action.payload;
    },

    // addReport(state, action: PayloadAction<HandoverReport>) {
    //   console.log("first");
    //   state.reports.unshift(action.payload);
    // },

    updateReportStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: HandoverReport["status"];
        note?: string;
      }>
    ) {
      const report = state.reports.find((r) => r._id === action.payload.id);
      if (report) {
        report.status = action.payload.status;
        if (action.payload.note) {
          report.note = action.payload.note;
        }
      }
    },

    setFormData(state, action: PayloadAction<Partial<HandoverFormData>>) {
      state.ui.formData = {
        ...state.ui.formData,
        ...action.payload,
      };
    },
    resetFormData(state) {
      state.ui.formData = {
        date: new Date().toISOString().split("T")[0],
        shift: "day",
        summary: "",
        achievements: "",
        challenges: "",
        nextDayPlan: "",
        teamleadId: "",
      };
      // state.ui.selectedFile = null;
    },
    clearHandoverState(state) {
      state.selectedReport = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Handover
    builder
      .addMatcher(
        handoverApi.endpoints.createHandover.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        handoverApi.endpoints.createHandover.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
        }
      )

      .addMatcher(
        handoverApi.endpoints.createHandover.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to create handover report";
        }
      );

    // Get My Reports
    builder
      .addMatcher(
        handoverApi.endpoints.getMyHandoverReport.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        handoverApi.endpoints.getMyHandoverReport.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.reports = action.payload.data.data;
        }
      )
      .addMatcher(
        handoverApi.endpoints.getMyHandoverReport.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to fetch my handover reports";
        }
      );

    // Get Team Reports (by department)
    builder
      .addMatcher(
        handoverApi.endpoints.teamGetHandoverReportByDepartment.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        handoverApi.endpoints.teamGetHandoverReportByDepartment.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.reports = action.payload.data.data;
        }
      )
      .addMatcher(
        handoverApi.endpoints.teamGetHandoverReportByDepartment.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to fetch team handover reports";
        }
      );

    // Delete Handover
    builder
      .addMatcher(
        handoverApi.endpoints.deleteHandoverById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        handoverApi.endpoints.deleteHandoverById.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const id = action.meta.arg.originalArgs;
          state.reports = state.reports.filter((report) => report._id !== id);
        }
      )
      .addMatcher(
        handoverApi.endpoints.deleteHandoverById.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to delete report";
        }
      );
  },
});

export const {
  setSelectedReport,
  setIsLoading,
  clearHandoverState,
  setFormData,
  setIsDialogOpen,
  // setSelectedFile,
  setIsRejectDialogOpen,
  setRejectionNote,
  resetFormData,
  // addReport,
  updateReportStatus,
  setIsDeleteDialogOpen,
  setSelectedDeleteId,
} = handoverSlice.actions;
export default handoverSlice.reducer;
