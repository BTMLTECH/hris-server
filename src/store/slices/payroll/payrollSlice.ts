import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  cachedInitialType,
  IPayroll,
  ITaxInfo,
  PayrollResponse,
} from "@/types/payroll";
import { payrollApi } from "./payrollApi";
import { blankProfileFormData } from "@/constants/blankProfileFormData";

interface PayrollState {
  isLoading: boolean;
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedPayroll: IPayroll | null;
  selectedDeleteId: string;
  isEditMode: boolean;
  isSubmitted: boolean;
  filtersApplied: boolean;
  newRecord: IPayroll;
  payrollPagination: PayrollResponse["pagination"] | null;
  // payrollCache: Record<string, PayrollResponse>;
  payrollCache: Record<number, IPayroll[]>;
  initialPayrollPagination: PayrollResponse["pagination"] | null;
  initialPayrollRecords: PayrollResponse;
  initialPayrollTimestamp: number | null;
  error: string | null;
  selectedMonth: string;
  selectedYear: string;
  searchTerm: string;
  year: string;
  selectedPayslip: IPayroll | null;
  selectedRecords: string[];
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isBulkSendDialogOpen: boolean;
  editingRecord: IPayroll | null;
  payrollRecords: IPayroll[];
  sortDirection: "desc" | "asc";
  isProcessingBulkUpload: boolean;
  isBulkUploadOpen: boolean;
  isActionDialogOpen: boolean;
  isBulkDeleteDialogOpen: boolean;
  isProcessBulkPayrollOpen: boolean;
  isReversePayrollOpen: boolean;
  IsDraftBulkOpen: boolean;
  loadingPdf: boolean;
  isDraftDialogOpen: boolean;
}

const initialState: PayrollState = {
  isLoading: false,
  isDialogOpen: false,
  isDeleteDialogOpen: false,
  isBulkDeleteDialogOpen: false,
  selectedPayroll: null,
  selectedDeleteId: "",
  isEditMode: false,
  isSubmitted: false,
  isDraftDialogOpen: false,

  payrollPagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  payrollCache: {},
  error: null,
  sortDirection: "desc",
  selectedMonth: "",
  selectedYear: "",
  year: "",
  selectedPayslip: null,
  selectedRecords: [],
  isCreateDialogOpen: false,
  filtersApplied: false,
  initialPayrollRecords: null,
  initialPayrollPagination: null,
  isEditDialogOpen: false,
  isBulkSendDialogOpen: false,
  editingRecord: null,
  searchTerm: "",
  newRecord: {
    _id: "",
    email: "",
    user: blankProfileFormData,
    month: "",
    year: "",
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    lasgAllowance: 0,
    twentyFourHoursAllowance: 0,
    healthAllowance: 0,
    totalAllowances: 0,
    deductions: 0,
    status: "pending",
  },
  payrollRecords: [],
  initialPayrollTimestamp: null,
  isProcessingBulkUpload: false,
  isBulkUploadOpen: false,
  // isDeleteDialogOpen: false,
  isActionDialogOpen: false,
  isProcessBulkPayrollOpen: false,
  isReversePayrollOpen: false,
  loadingPdf: false,
  IsDraftBulkOpen: false,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    },
    setSelectedYear(state, action: PayloadAction<string>) {
      state.selectedYear = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedPayslip(state, action: PayloadAction<IPayroll | null>) {
      state.selectedPayslip = action.payload;
    },
    setIsDraftDialogOpen: (state, action) => {
      state.isDraftDialogOpen = action.payload;
    },
    setSelectedRecords(state, action: PayloadAction<string[]>) {
      state.selectedRecords = action.payload;
    },
    setIsCreateDialogOpen(state, action: PayloadAction<boolean>) {
      state.isCreateDialogOpen = action.payload;
    },
    setFiltersApplied(state, action: PayloadAction<boolean>) {
      state.filtersApplied = action.payload;
    },
    setIsEditDialogOpen(state, action: PayloadAction<boolean>) {
      state.isEditDialogOpen = action.payload;
    },
    setIsBulkUploadOpen(state, action: PayloadAction<boolean>) {
      state.isBulkUploadOpen = action.payload;
    },
    setIsActionDialogOpen(state, action: PayloadAction<boolean>) {
      state.isActionDialogOpen = action.payload;
    },
    setIsBulkDeleteDialogOpen(state, action: PayloadAction<boolean>) {
      state.isBulkDeleteDialogOpen = action.payload;
    },
    setIsProcessBulkPayrollOpen(state, action: PayloadAction<boolean>) {
      state.isProcessBulkPayrollOpen = action.payload;
    },
    setIsDraftBulkOpen(state, action: PayloadAction<boolean>) {
      state.IsDraftBulkOpen = action.payload;
    },
    setIsReversePayrollOpen(state, action: PayloadAction<boolean>) {
      state.isReversePayrollOpen = action.payload;
    },
    setLoadingPdf(state, action: PayloadAction<boolean>) {
      state.loadingPdf = action.payload;
    },
    setYear(state, action: PayloadAction<string>) {
      state.year = action.payload;
    },
    setSubmitted(state, action: PayloadAction<boolean>) {
      state.isSubmitted = action.payload;
    },
    setSortDirection(state, action: PayloadAction<"asc" | "desc">) {
      state.sortDirection = action.payload;
    },

    setIsBulkSendDialogOpen(state, action: PayloadAction<boolean>) {
      state.isBulkSendDialogOpen = action.payload;
    },
    setEditingRecord(state, action: PayloadAction<IPayroll | null>) {
      state.editingRecord = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setIsProcessingBulkUpload(state, action: PayloadAction<boolean>) {
      state.isProcessingBulkUpload = action.payload;
    },
    setIsDeleteDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDeleteDialogOpen = action.payload;
    },
    setSelectedPayroll(state, action: PayloadAction<IPayroll | null>) {
      state.selectedPayroll = action.payload;
    },
    setSelectedDeleteId(state, action: PayloadAction<string>) {
      state.selectedDeleteId = action.payload;
    },
    setIsEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload;
    },
    clearPayrollCache(state) {
      state.payrollCache = {};
      state.selectedMonth = "";
      state.selectedYear = "";
      state.filtersApplied = false;
      state.payrollPagination = { page: 1, limit: 20, total: 0, pages: 0 };
    },
    setPayrollRecords(state, action: PayloadAction<IPayroll[]>) {
      state.payrollRecords = action.payload;
    },
    setPayrollPagination(
      state,
      action: PayloadAction<PayrollState["payrollPagination"]>
    ) {
      state.payrollPagination = action.payload;
    },
    setPayrollCache: (
      state,
      action: PayloadAction<{ page: number; data: IPayroll[] }>
    ) => {
      state.payrollCache[action.payload.page] = action.payload.data;
    },

    setNewRecord(state, action: PayloadAction<Partial<IPayroll>>) {
      state.newRecord = {
        ...state.newRecord,
        ...action.payload,
      };
    },
    restorePayrollFromCache: (
      state,
      action: PayloadAction<PayrollResponse>
    ) => {
      const { data, pagination } = action.payload;
      if (data) {
        state.payrollRecords = data;
        state.payrollPagination = pagination;
      }
    },

    resetNewRecord(state) {
      state.newRecord = {
        email: "",
        month: "",
        year: "",
        basicSalary: 0,
        housingAllowance: 0,
        transportAllowance: 0,
        lasgAllowance: 0,
        twentyFourHoursAllowance: 0,
        healthAllowance: 0,
        totalAllowances: 0,
        deductions: 0,
        status: "pending",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      payrollApi.endpoints.getAllPayrolls.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    builder
      .addMatcher(
        payrollApi.endpoints.getAllPayrolls.matchFulfilled,
        (state, action: PayloadAction<cachedInitialType>) => {
          const payroll: IPayroll[] = action.payload.data.data;
          const pagination: PayrollResponse["pagination"] =
            action.payload.data.pagination;

          if (pagination?.page === 1) {
            state.initialPayrollRecords = {
              data: payroll,
              pagination,
              count: payroll.length,
              timestamp: Date.now(),
            };
          }
          const page = pagination?.page;
          state.payrollCache[page] = payroll;
          state.payrollPagination = pagination;
        }
      )

      .addMatcher(
        payrollApi.endpoints.getAllPayrolls.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to fetch payrolls";
        }
      );

    // Create payroll
    builder
      .addMatcher(
        payrollApi.endpoints.processSinglePayroll.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        payrollApi.endpoints.processSinglePayroll.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.isDialogOpen = false;
        }
      )
      .addMatcher(
        payrollApi.endpoints.processSinglePayroll.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to create payroll";
        }
      );

    // Edit payroll
    builder
      .addMatcher(
        payrollApi.endpoints.reverseSinglePayroll.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        payrollApi.endpoints.reverseSinglePayroll.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.isDialogOpen = false;
        }
      )
      .addMatcher(
        payrollApi.endpoints.reverseSinglePayroll.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to edit payroll";
        }
      );

    // Bulk Upload Payroll
    builder
      .addMatcher(
        payrollApi.endpoints.processBulkPayroll.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        payrollApi.endpoints.processBulkPayroll.matchFulfilled,
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        payrollApi.endpoints.processBulkPayroll.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to upload payroll data";
        }
      );

    builder
      .addMatcher(
        payrollApi.endpoints.reverseBulkPayroll.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        payrollApi.endpoints.reverseBulkPayroll.matchFulfilled,
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        payrollApi.endpoints.reverseBulkPayroll.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to upload payroll data";
        }
      );

    // Delete payroll
    builder
      .addMatcher(payrollApi.endpoints.deletePayroll.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        payrollApi.endpoints.deletePayroll.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.isDeleteDialogOpen = false;
          state.selectedDeleteId = "";
        }
      )
      .addMatcher(
        payrollApi.endpoints.deletePayroll.matchRejected,
        (state, action) => {
          state.error = action.error?.message || "Failed to delete payroll";
          state.isLoading = false;
        }
      );
  },
});

export const {
  setIsLoading,
  setIsDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedPayroll,
  setSelectedDeleteId,
  setIsEditMode,
  clearPayrollCache,
  setPayrollPagination,
  setPayrollCache,
  setSelectedMonth,
  setSelectedYear,
  setSelectedPayslip,
  setSelectedRecords,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
  setIsBulkSendDialogOpen,
  setEditingRecord,
  setNewRecord,
  setPayrollRecords,
  setSubmitted,
  setFiltersApplied,
  resetNewRecord,
  setSortDirection,
  setSearchTerm,
  restorePayrollFromCache,
  setIsProcessingBulkUpload,
  setIsBulkUploadOpen,
  setIsBulkDeleteDialogOpen,
  setYear,
  setIsActionDialogOpen,
  setIsReversePayrollOpen,
  setIsProcessBulkPayrollOpen,
  setLoadingPdf,
  setIsDraftBulkOpen,
  setIsDraftDialogOpen,
} = payrollSlice.actions;

export default payrollSlice.reducer;
