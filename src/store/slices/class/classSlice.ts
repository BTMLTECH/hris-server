// features/class/classSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClassLevel } from "@/types/user";
import { classApi } from "./classApi";
import { ClassResponse, IClassLevelInput } from "@/types/class";


interface ClassState {
  isLoading: boolean;
  error: string | null;
  isDialogOpen: boolean;
  isBulkImportOpen: boolean;
  isProcessingBulk: boolean;
  isBand: boolean;
  isReversePayrollOpen: boolean;
  isProcessBulkPayrollOpen: boolean;
  isPaygrade: boolean;
   isResultDialogOpen: boolean;
   classResponse: ClassResponse | null;
  classRecord: IClassLevelInput;
}

const initialState: ClassState = {
  isLoading: false,
  error: null,
  isDialogOpen: false,
  isBand: false,
  isPaygrade: false,
  isBulkImportOpen: false,
  isProcessingBulk: false,
  isReversePayrollOpen: false,
  isProcessBulkPayrollOpen: false,
  isResultDialogOpen: false,
  classResponse: null,
  classRecord: {
    year: '',
    level: '',
    payGrade: '',
    band: '',
  },

};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsBand(state, action: PayloadAction<boolean>) {
      state.isBand = action.payload;
    },
    setIsReversePayrollOpen(state, action: PayloadAction<boolean>) {
      state.isReversePayrollOpen = action.payload;
    },
    setIsPaygrade(state, action: PayloadAction<boolean>) {
      state.isPaygrade = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setIsBulkImportOpen(state, action: PayloadAction<boolean>) {
      state.isBulkImportOpen = action.payload;
    },
    setIsProcessingBulk(state, action: PayloadAction<boolean>) {
      state.isProcessingBulk = action.payload;
    },
    setIsProcessBulkPayrollOpen(state, action: PayloadAction<boolean>) {
      state.isProcessBulkPayrollOpen = action.payload;
    },

    setIsResultDialogOpen(state, action: PayloadAction<boolean>) {
      state.isResultDialogOpen = action.payload;
    },
    setClassResponse(state, action: PayloadAction<ClassResponse | null>) {
      state.classResponse = action.payload;
    },
    setClassRecord(state, action: PayloadAction<IClassLevelInput>) {
      state.classRecord = action.payload;
    },
    
    
  },
  extraReducers(builder) {
          builder
            .addMatcher(classApi.endpoints.calculateClass.matchPending, (state) => { 
              state.isLoading = true;
              state.error = null;
            })
      
            builder.addMatcher(
              classApi.endpoints.calculateClass.matchFulfilled,
              (state, action) => {       
                const users: ClassResponse = action.payload.data;  
                state.classResponse = users;  
              }
            )
      
                  
            .addMatcher(classApi.endpoints.calculateClass.matchRejected, (state, action) => {
              state.isLoading = false;
              state.error = action.error?.message || 'Failed to update profile';
         
            })


            
  },
});

export const {
    setIsLoading,
    setIsBand,
  setIsDialogOpen,
  setIsBulkImportOpen,
  setIsProcessingBulk,
  setIsResultDialogOpen,
  setClassResponse,
  setClassRecord,
  setIsPaygrade
  
} = classSlice.actions;

export default classSlice.reducer;
