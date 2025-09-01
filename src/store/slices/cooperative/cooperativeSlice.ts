// features/cooperative/cooperativeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cooperativeApi } from "./cooperativeApi";
import { ICooperativeContributionInput, ICooperativeContribution, CooperativeCache, Pagination, IPaginatedCooperativeContributionResponse } from "@/types/cooperation";


interface CooperativeState {
  isLoading: boolean;
  error: string | null;
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isUpdateDialogOpen: boolean;
  isBulkImportOpen: boolean;
  isProcessingBulk: boolean;
  isResultDialogOpen: boolean;
  cooperativeRecord: ICooperativeContributionInput;
  contributions: ICooperativeContribution[];
  cooperativePagination: Pagination;
  cooperativeResponse: ICooperativeContribution[] | null;
  cooperativeCache: CooperativeCache;
}

const initialState: CooperativeState = {
  isLoading: false,
  error: null,
  isDialogOpen: false,
  isDeleteDialogOpen: false,
  isUpdateDialogOpen: false,
  isBulkImportOpen: false,
  isProcessingBulk: false,
  isResultDialogOpen: false,
  cooperativeResponse: null,
  cooperativeRecord: {
    user: {
      staffId: "",
      firstName: "",
      lastName: "",
      department: ""
    },
    companyId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: 0,
    email: "",
    receiptUrl: "",
    status: "REQUEST"
  },
  contributions: [],
  cooperativeCache: {},
 cooperativePagination: { total: 0, page: 1, limit: 30, pages: 0 },
};

const cooperativeSlice = createSlice({
  name: "cooperative",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setIsDeleteDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDeleteDialogOpen = action.payload;
    },
    setIsUpdateDialogOpen(state, action: PayloadAction<boolean>) {
      state.isUpdateDialogOpen = action.payload;
    },
    setContributionPagination: (state, action: PayloadAction<typeof initialState.cooperativePagination>) => {
    state.cooperativePagination = action.payload;
    },

       setCooperativeCache: (
          state,
          action: PayloadAction<{ page: number; data: ICooperativeContributionInput[] }>
        ) => {
          state.cooperativeCache[action.payload.page] = action.payload.data;
        },
    setIsBulkImportOpen(state, action: PayloadAction<boolean>) {
      state.isBulkImportOpen = action.payload;
    },
    setIsProcessingBulk(state, action: PayloadAction<boolean>) {
      state.isProcessingBulk = action.payload;
    },
    setIsResultDialogOpen(state, action: PayloadAction<boolean>) {
      state.isResultDialogOpen = action.payload;
    },

    setCooperativeRecord(state, action: PayloadAction<ICooperativeContributionInput>) {
      state.cooperativeRecord = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ✅ Create Contribution
    builder
      .addMatcher(cooperativeApi.endpoints.createCooperativeContribution.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(cooperativeApi.endpoints.createCooperativeContribution.matchFulfilled, (state, action: PayloadAction<IPaginatedCooperativeContributionResponse>) => {
        state.isLoading = false;
      })
      .addMatcher(cooperativeApi.endpoints.createCooperativeContribution.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to create contribution";
      });
   

    // ✅ Get All Contributions
    builder
      .addMatcher(cooperativeApi.endpoints.getAllCooperativeContributions.matchPending, (state) => {
        state.isLoading = true;
      })
     .addMatcher(
        cooperativeApi.endpoints.getAllCooperativeContributions.matchFulfilled,
        (state, action: PayloadAction<IPaginatedCooperativeContributionResponse>) => {

          const cooperatives = action.payload.data.data; 
          const pagination = action.payload.data.pagination; 
          const page = pagination.page;

          state.cooperativeCache[page] = cooperatives;
          state.cooperativePagination = pagination;
          state.cooperativeResponse = cooperatives;

        }
      )

      .addMatcher(cooperativeApi.endpoints.getAllCooperativeContributions.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch contributions";
      });
    },
});

export const {
  setIsLoading,
  setIsDialogOpen,
  setIsBulkImportOpen,
  setIsProcessingBulk,
  setIsResultDialogOpen,
  setCooperativeRecord,
  setIsDeleteDialogOpen,
  setContributionPagination,
  setCooperativeCache,
  setIsUpdateDialogOpen
} = cooperativeSlice.actions;

export default cooperativeSlice.reducer;
