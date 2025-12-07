/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { reportApi } from "./reportApi";
import {
  IComms,
  initialPagination,
  IOperationReport,
  IQualityAssurance,
  IReport,
  PaginatedCache,
  PaginatedResponse,
  ReportUIState,
} from "@/types/report";
import { Pagination } from "@/types/user";

interface ReportState extends ReportUIState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  operationsCache: PaginatedCache<IOperationReport>;
  commsCache: PaginatedCache<IComms>;
  qualityCache: PaginatedCache<IQualityAssurance>;
  searchTerm: string;
  itReportCache: PaginatedCache<IReport>;
  operationsPagination: Pagination;
  commsPagination: Pagination;
  qualityPagination: Pagination;
  itReportPagination: Pagination;
  activeTab: "quality" | "operations" | "comms" | "it";
  reportType: "quality" | "operations" | "comms" | "it";
  selectedDate: Date | null;
  qualityForm: Partial<IQualityAssurance>;
  operationsForm: Partial<IOperationReport>;
  commsForm: Partial<IComms>;
  itForm: Partial<IReport>;  
  createLinkReport: string;
  reportIsLoading: boolean;
}



const initialState: ReportState = {
  reportTitles: [
    "Select Report",
    "Employee Summary Report",
    "Department Analysis",
    "Attendance Report",
    "Payroll Summary",
    "Performance Metrics",
  ],
  selectedReport: undefined,
  dateRange: undefined,
  department: "all",
  isGenerating: false,
  reportIsLoading: false,
  showCustomDatePicker: false,
  customStartDate: null,
  customEndDate: null,
  exportFormat: "excel",
  data: null,
  isLoading: false,
  error: null,
  company: "",
  operationsCache: {},
  commsCache: {},
  qualityCache: {},
  itReportCache: {},
  operationsPagination: initialPagination,
  commsPagination: initialPagination,
  qualityPagination: initialPagination,
  itReportPagination: initialPagination,
  searchTerm: "",
  // ✅ Default tab and date
  activeTab: "quality",
  selectedDate: new Date(),
  qualityForm: {
    agentName: "",
    week: 1,
    score: 0,
    remarks: "",
    evaluatedBy: "",
    company: "",
  },
  operationsForm: {
    consultantName: "",
    shift: "day",
    clientName: "",
    PNR: "",
    ticketNumber: "",
    details: "",
    company: "",
  },
  commsForm: {
    sender: "",
    receiver: "",
    subject: "",
    message: "",
    status: "sent",
    company: "",
  },
  itForm: {
    name: "",
    week: 1,
    task: "",
    company: "",
  },
  reportType: 'quality',
  createLinkReport: "",
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setSelectedReport(
      state,
      action: PayloadAction<ReportState["selectedReport"]>
    ) {
      state.selectedReport = action.payload;
    },
    setExportFormat(state, action: PayloadAction<ReportState["exportFormat"]>) {
      state.exportFormat = action.payload;
    },
    setDateRange(state, action: PayloadAction<ReportState["dateRange"]>) {
      state.dateRange = action.payload;
      if (action.payload === "custom") {
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
    setReportIsLoading(state, action: PayloadAction<boolean>) {
      state.reportIsLoading = action.payload;
    },
    setCustomStartDate(state, action: PayloadAction<string | null>) {
      state.customStartDate = action.payload;
    },
    setCustomEndDate(state, action: PayloadAction<string | null>) {
      state.customEndDate = action.payload;
    },
    // ✅ Add new reducers
    setActiveTab(state, action: PayloadAction<ReportState["activeTab"]>) {
      state.activeTab = action.payload;
    },
    setReportType(state, action: PayloadAction<ReportState["reportType"]>) {
      state.reportType = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<Date | null>) {
      state.selectedDate = action.payload;
    },
    setQualityForm(state, action: PayloadAction<Partial<IQualityAssurance>>) {
      state.qualityForm = { ...state.qualityForm, ...action.payload };
    },
    setOperationsForm(state, action: PayloadAction<Partial<IOperationReport>>) {
      state.operationsForm = { ...state.operationsForm, ...action.payload };
    },
    setCommsForm(state, action: PayloadAction<Partial<IComms>>) {
      state.commsForm = { ...state.commsForm, ...action.payload };
    },
    setITForm(state, action: PayloadAction<Partial<IReport>>) {
      state.itForm = { ...state.itForm, ...action.payload };
    },

    // optional: resetters
    resetQualityForm(state) {
      state.qualityForm = initialState.qualityForm;
    },
    resetOperationsForm(state) {
      state.operationsForm = initialState.operationsForm;
    },
    resetCommsForm(state) {
      state.commsForm = initialState.commsForm;
    },
    resetITForm(state) {
      state.itForm = initialState.itForm;
    },
    clearReport(state) {
      state.data = null;
      state.error = null;
      state.isLoading = false;
      state.isGenerating = false;
    },

    setCreateReportLink(state, action: PayloadAction<string>) {
      state.createLinkReport = action.payload;
    },

    // ----- Quality Assurance -----

    setQualityCache: (
      state,
      action: PayloadAction<{ page: number; data: IQualityAssurance[] }>
    ) => {
      state.qualityCache[action.payload.page] = action.payload.data;
    },

    clearQualityCache(state) {
      state.qualityCache = {};
      state.qualityPagination = initialPagination;
    },

    // ----- Operations -----
    setOperationsCache: (
      state,
      action: PayloadAction<{ page: number; data: IOperationReport[] }>
    ) => {
      state.operationsCache[action.payload.page] = action.payload.data;
    },

    clearOperationsCache(state) {
      state.operationsCache = {};
      state.operationsPagination = initialPagination;
    },

    // ----- Comms -----
    setCommsCache: (
      state,
      action: PayloadAction<{ page: number; data: IComms[] }>
    ) => {
      state.commsCache[action.payload.page] = action.payload.data;
    },

    clearCommsCache(state) {
      state.commsCache = {};
      state.commsPagination = initialPagination;
    },

    // ----- IT Reports -----
    setITReportCache: (
      state,
      action: PayloadAction<{ page: number; data: IReport[] }>
    ) => {
      state.itReportCache[action.payload.page] = action.payload.data;
    },

    clearITReportCache(state) {
      state.itReportCache = {};
      state.itReportPagination = initialPagination;
    },

    setQualityPagination: (state, action: PayloadAction<Pagination>) => {
      state.qualityPagination = action.payload;
    },
    setOperationsPagination: (state, action: PayloadAction<Pagination>) => {
      state.operationsPagination = action.payload;
    },
    setCommsPagination: (state, action: PayloadAction<Pagination>) => {
      state.commsPagination = action.payload;
    },
    setITReportPagination: (state, action: PayloadAction<Pagination>) => {
      state.itReportPagination = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
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

    builder.addMatcher(
      reportApi.endpoints.getAllQuality.matchFulfilled,
      (state, action) => {
        const response = action.payload as PaginatedResponse<IQualityAssurance>;
        // Destructure safely
        const { pagination, data } = response.data;
        if (pagination) {
          state.qualityCache[pagination.page] = data;
          state.qualityPagination = pagination;
        }
      }
    );



    // ✅ Create Report Link
    builder.addMatcher(
      reportApi.endpoints.createReportLink.matchPending,
      (state) => {
        state.isLoading = true; 
        state.error = null;
      }
    );
    
    builder.addMatcher(
      reportApi.endpoints.createReportLink.matchFulfilled,
      (state, action) => {
        const response = action.payload;
        state.createLinkReport = response.data as string;

        state.isLoading = false;
      }
    );

    builder.addMatcher(
      reportApi.endpoints.createReportLink.matchRejected,
      (state, action) => {
        state.isLoading = false;     
        state.error = action.error?.message || "Failed to generate linl report";
      }
    );

    builder.addMatcher(
      reportApi.endpoints.getAllQuality.matchFulfilled,
      (state, action) => {
        const response = action.payload as PaginatedResponse<IQualityAssurance>;
        const { pagination, data } = response.data;

        if (pagination) {
          state.qualityCache[pagination.page] = data;
          state.qualityPagination = pagination;
        }
      }
    );
    
    // ✅ OPERATIONS REPORT
    builder.addMatcher(
      reportApi.endpoints.getAllOperations.matchFulfilled,
      (state, action) => {
        const response = action.payload as PaginatedResponse<IOperationReport>;
        const { pagination, data } = response.data;

        if (pagination) {
          state.operationsCache[pagination.page] = data;
          state.operationsPagination = pagination;
        }
      }
    );

    // ✅ COMMS REPORT
    builder.addMatcher(
      reportApi.endpoints.getAllComms.matchFulfilled,
      (state, action) => {
        const response = action.payload as PaginatedResponse<IComms>;
        const { pagination, data } = response.data;

        if (pagination) {
          state.commsCache[pagination.page] = data;
          state.commsPagination = pagination;
        }
      }
    );

    // ✅ IT REPORT
    builder.addMatcher(
      reportApi.endpoints.getAllITReports.matchFulfilled,
      (state, action) => {
        const response = action.payload as PaginatedResponse<IReport>;
        const { pagination, data } = response.data;

        if (pagination) {
          state.itReportCache[pagination.page] = data;
          state.itReportPagination = pagination;
        }
      }
    );

    // ❌ HANDLE REPORT GENERATION ERRORS
    builder.addMatcher(
      reportApi.endpoints.generateEmploymentSummary.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.isGenerating = false;
        state.error =
          action.error?.message ||
          "Failed to generate employment summary report";
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
  setActiveTab,
  setReportType,
  setSelectedDate,

  setCommsCache,
  setITReportCache,
  setOperationsCache,
  setQualityCache,

  clearCommsCache,
  clearQualityCache,
  clearITReportCache,
  clearOperationsCache,

  setCommsPagination,
  setITReportPagination,
  setOperationsPagination,
  setQualityPagination,
  setCreateReportLink,
  setSearchTerm,
  resetCommsForm,
  resetITForm,
  resetOperationsForm,
  resetQualityForm,
  setCommsForm,
  setITForm,
  setOperationsForm,
  setQualityForm,
  setReportIsLoading
} = reportSlice.actions;

export default reportSlice.reducer;
