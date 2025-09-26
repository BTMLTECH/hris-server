/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AttendanceRecord,
  PaginatedAttendanceResponse,
} from "@/types/attendance"; // Assuming your types are defined
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { attendanceApi } from "./attendanceApi";
import { normalizeAttendanceRecord } from "@/utils/normalize";
import { shiftUtils } from "@/utils/attendanceHelpers";

export interface AttendanceCache {
  [page: number]: AttendanceRecord[];
}

interface AttendanceState {
  isLoading: boolean;
  error: string | null;
  records: AttendanceRecord[];
  attendanceCache: { [page: number]: AttendanceRecord[] };
  attendancePagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  currentRecord: AttendanceRecord | null;
  stats: any;
  companySummary: any;
  activeTab: string;
  selectedShift: "day" | "night";
  isCheckedIn: boolean;
  isClocking: boolean;
  currentSession: { shift: "day" | "night"; checkInTime: string } | null;
}

const initialState: AttendanceState = {
  isLoading: false,
  error: null,
  records: [],
  currentRecord: null,
  stats: null,
  companySummary: null,
  isClocking: false,
  activeTab: "clock-in",
  selectedShift: shiftUtils.get(),
  isCheckedIn: false,
  attendanceCache: {},
  attendancePagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  currentSession: {
    shift: "day",
    checkInTime: "",
  },
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    // Set loading state
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setIsClocking(state, action: PayloadAction<boolean>) {
      state.isClocking = action.payload;
    },

    setSelectedShift(state, action: PayloadAction<"day" | "night">) {
      state.selectedShift = action.payload;
      shiftUtils.set(action.payload); // persist
    },

    setAttendancePagination(
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        pages: number;
      }>
    ) {
      state.attendancePagination = action.payload;
    },
    setCachedAttendance(
      state,
      action: PayloadAction<{ page: number; records: AttendanceRecord[] }>
    ) {
      state.attendancePagination[action.payload.page] = action.payload.records;
    },

    clearAttenadanceCache(state) {
      state.attendanceCache = {};
      state.attendancePagination = { page: 1, limit: 10, total: 0, pages: 0 };
    },

    clearSelectedShift(state) {
      state.selectedShift = "day";
      shiftUtils.clear();
    },

    // Set attendance records
    setRecords(state, action: PayloadAction<AttendanceRecord[]>) {
      state.records = action.payload;
    },
    // Set current record
    setCurrentRecord(state, action: PayloadAction<AttendanceRecord | null>) {
      state.currentRecord = action.payload;
    },
    // Set attendance stats
    setStats(state, action: PayloadAction<any>) {
      state.stats = action.payload;
    },
    // Set company attendance summary
    setCompanySummary(state, action: PayloadAction<any>) {
      state.companySummary = action.payload;
    },
    // Reset the attendance state
    resetAttendanceState(state) {
      state.records = [];
      state.currentRecord = null;
      state.isLoading = false;
      state.error = null;
      state.stats = null;
      state.companySummary = null;
      state.activeTab = "clock-in";
      state.selectedShift = "day";
      state.isCheckedIn = false;
      state.currentSession = null;
    },

    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },

    setIsCheckedIn(state, action: PayloadAction<boolean>) {
      state.isCheckedIn = action.payload;
    },

    setCurrentSession(
      state,
      action: PayloadAction<{
        shift: "day" | "night";
        checkInTime: string;
      } | null>
    ) {
      state.currentSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      attendanceApi.endpoints.getMyAttendanceHistory.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    builder
      .addMatcher(
        attendanceApi.endpoints.getMyAttendanceHistory.matchFulfilled,
        (state, action: PayloadAction<PaginatedAttendanceResponse>) => {
          const { page, limit, total, pages } = action.payload.data.pagination;
          const records = action.payload.data.data.map(
            normalizeAttendanceRecord
          );

          state.attendanceCache[page] = records;
          state.records = records;
          state.attendancePagination = { page, limit, total, pages };

          const active = records.find((r) => r.checkIn && !r.checkOut);
          state.currentRecord = active || null;
          state.isCheckedIn = !!active;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.getMyAttendanceHistory.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to fetch attendance history";
        }
      );

    builder
      .addMatcher(
        attendanceApi.endpoints.getCompanyAttendanceSummary.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.getCompanyAttendanceSummary.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.companySummary = action.payload.data.data;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.getCompanyAttendanceSummary.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message ||
            "Failed to fetch company attendance summary";
        }
      );

    // Biometry Check-In
    builder
      .addMatcher(
        attendanceApi.endpoints.biometryCheckIn.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.biometryCheckIn.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const newRecord: AttendanceRecord = action.payload.data;
          state.records.push(newRecord);
          state.currentRecord = newRecord;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.biometryCheckIn.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to check-in via biometry";
        }
      );

    // Biometry Check-Out
    builder
      .addMatcher(
        attendanceApi.endpoints.biometryCheckOut.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.biometryCheckOut.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const updatedRecord: AttendanceRecord = action.payload.data;
          const index = state.records.findIndex(
            (record) => record.id === updatedRecord.id
          );
          if (index !== -1) {
            state.records[index] = updatedRecord;
          }
          state.currentRecord = updatedRecord;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.biometryCheckOut.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to check-out via biometry";
        }
      );

    builder
      .addMatcher(
        attendanceApi.endpoints.manualCheckIn.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      .addMatcher(
        attendanceApi.endpoints.manualCheckIn.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to check-in manually";
        }
      );

    builder
      .addMatcher(
        attendanceApi.endpoints.manualCheckOut.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        attendanceApi.endpoints.manualCheckOut.matchFulfilled,
        (state, action) => {
          state.isLoading = false;

          const updatedRecord = normalizeAttendanceRecord(
            action.payload.data.data
          );

          const index = state.records.findIndex(
            (record) => record.id === updatedRecord.id
          );
          if (index !== -1) {
            state.records[index] = updatedRecord;
          } else {
            state.records.push(updatedRecord);
          }

          state.currentRecord = updatedRecord;
          state.isCheckedIn = false;
        }
      )

      .addMatcher(
        attendanceApi.endpoints.manualCheckOut.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to check-out manually";
        }
      );
  },
});

export const {
  setIsLoading,
  setError,
  setRecords,
  setCurrentRecord,
  setStats,
  setCompanySummary,
  resetAttendanceState,
  setActiveTab,
  setSelectedShift,
  setIsCheckedIn,
  setCurrentSession,
  clearSelectedShift,
  clearAttenadanceCache,
  setAttendancePagination,
  setCachedAttendance,
  setIsClocking,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
