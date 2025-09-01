/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { reportApi } from "./reportApi";

export interface ReportUIState {
  reportTitles: Array<string>;
  selectedReport: 'employee_summary' | 'department_analysis' | 'attendance_report' | 'payroll_summary' | 'performance_metrics'; 
  dateRange: 'daily' | 'last_7_days' | 'last_30_days' | 'last_quarter' | 'last_year' | 'custom';
  department: string;
  isGenerating: boolean;
  showCustomDatePicker: boolean;
  customStartDate: string | null;
  customEndDate: string | null;
  exportFormat: 'pdf' | 'excel' | 'csv';
  company: string;
}

interface ReportState extends ReportUIState {
  data: any | null;  
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
    reportTitles: [
    "Select Report",
    "Employee Summary Report",
    "Department Analysis",
    "Attendance Report",
    "Payroll Summary",
    "Performance Metrics"
  ],
  selectedReport: undefined, 
  dateRange: undefined, 
  department: "all",
  isGenerating: false,
  showCustomDatePicker: false,
  customStartDate: null,
  customEndDate: null,
  exportFormat: "excel",
  data: null,
  isLoading: false,
  error: null,
  company: ''
};

const reportSlice = createSlice({
  name: "report",
  initialState,
reducers: {
  setSelectedReport(state, action: PayloadAction<ReportState['selectedReport']>) {
    state.selectedReport = action.payload;
  },
   setExportFormat(state, action: PayloadAction<ReportState['exportFormat']>) {
      state.exportFormat = action.payload;
    },
  setDateRange(state, action: PayloadAction<ReportState['dateRange']>) {
    state.dateRange = action.payload;
    if (action.payload === 'custom') {
      state.showCustomDatePicker = true;
    } else {
      state.showCustomDatePicker = false;
      state.customStartDate = null;
      state.customEndDate = null;
    }
  },
  setDepartment(state, action: PayloadAction<string>) {
    state.department = action.payload;
  },
  setIsGenerating(state, action: PayloadAction<boolean>) {
    state.isGenerating = action.payload;
  },
  setCustomStartDate(state, action: PayloadAction<string | null>) {
    state.customStartDate = action.payload;
  },
  setCustomEndDate(state, action: PayloadAction<string | null>) {
    state.customEndDate = action.payload;
  },
  clearReport(state) {
    state.data = null;
    state.error = null;
    state.isLoading = false;
    state.isGenerating = false;
  },
},
  extraReducers: (builder) => {
    builder.addMatcher(
      reportApi.endpoints.generateEmploymentSummary.matchPending,
      (state) => {
        state.isLoading = true;
        state.isGenerating = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      reportApi.endpoints.generateEmploymentSummary.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.data = action.payload;
        state.error = null;
      }
    );
    builder.addMatcher(
      reportApi.endpoints.generateEmploymentSummary.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.error = action.error?.message || "Failed to generate report";
      }
    );
  },
});

export const {
  setSelectedReport,
  setDateRange,
  setDepartment,
  setIsGenerating,
  setCustomStartDate,
  setCustomEndDate,
  setExportFormat,
  clearReport,
} = reportSlice.actions;

export default reportSlice.reducer;
