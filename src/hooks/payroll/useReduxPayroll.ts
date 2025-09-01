/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 

  useDeletePayrollMutation, 
  useGetAllPayrollsQuery,
  useMarkPayrollAsDraftMutation,
  useMarkPayrollAsPaidMutation,
  useMarkPayrollsAsDraftBulkMutation,
  usePayrollsAsPaidBulkMutation,
  useProcessBulkPayrollMutation,
  useProcessSinglePayrollMutation,
  useReverseBulkPayrollMutation,
  useReverseSinglePayrollMutation,
} from '@/store/slices/payroll/payrollApi';
import {
  clearPayrollCache,
  setIsDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedPayroll,
  setSelectedDeleteId,
  setPayrollCache,
  setPayrollPagination,
  setIsLoading,
  // restoreInitialPayrollRecords,
  restorePayrollFromCache,
  setIsProcessingBulkUpload,
} from '@/store/slices/payroll/payrollSlice';
import { extractErrorMessage } from '@/utils/errorHandler';
import { toast } from '@/hooks/use-toast';
import { IPayroll, PayrollContextType } from '@/types/payroll';
import { useDebounce } from './useDebounce';
import { useBulkDeleteClassLevelsByYearMutation } from '@/store/slices/class/classApi';

export const useReduxPayroll = (): PayrollContextType => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    payrollPagination,
    payrollCache,
    isDialogOpen,
    isDeleteDialogOpen,
    selectedPayroll,
    selectedDeleteId,
    error,
    selectedMonth,
    selectedYear,
    filtersApplied,
    initialPayrollRecords,
    searchTerm,
  } = useAppSelector((state) => state.payroll);
  const currentPage = payrollPagination?.page;
 const cacheKey = `${currentPage}_${selectedMonth || 'all'}_${selectedYear || 'all'}`;
  const cachedPayrollData = payrollCache[cacheKey];
  const cachedPayrolls = cachedPayrollData?.data ?? [];
  const debouncedSearch = useDebounce(searchTerm, 500);


  const queryParams: {
    page: number;
    limit: number;
    month?: string;
    year?: string;
    search?:string
  } = {
    page: currentPage,
    limit: payrollPagination?.limit || 10,
  };

  if (filtersApplied && selectedMonth) queryParams.month = selectedMonth;
  if (filtersApplied && selectedYear) queryParams.year = selectedYear;
  if (filtersApplied && debouncedSearch.trim().length >= 2) queryParams.search = debouncedSearch.trim();

const {
  isLoading: isFetchingPayrolls,
  refetch: refetchPayrolls,
} = useGetAllPayrollsQuery(queryParams, {
  skip: false,
});



  const [deletePayrollMutation] = useDeletePayrollMutation();
  const [processSinglePayrollMutation] = useProcessSinglePayrollMutation();
  const [reverseSinglePayrollMutation] = useReverseSinglePayrollMutation();
  const [markPayrollAsDraft] = useMarkPayrollAsDraftMutation();
  const [markPayrollAsPaid] = useMarkPayrollAsPaidMutation();
  const [processBulkPayrollMutation] = useProcessBulkPayrollMutation();
  const [reverseBulkPayrollMutation] = useReverseBulkPayrollMutation();
  const [markPayrollsAsDraftBulk] = useMarkPayrollsAsDraftBulkMutation()
  const [payrollsAsPaidBulk] = usePayrollsAsPaidBulkMutation();
  




    useEffect(() => {
      if (!filtersApplied) {
        const cachedInitial = initialPayrollRecords;
        const ONE_MINUTE = 60 * 1000;
        const cacheAge = cachedInitial?.timestamp ? Date.now() - cachedInitial.timestamp : null;
        if (cachedInitial && cachedInitial.data.length > 0 && cacheAge !== null && cacheAge < ONE_MINUTE) {
          dispatch(restorePayrollFromCache(cachedInitial));
        } else {
          refetchPayrolls();
        }
        dispatch(setPayrollPagination({ page: 1, limit: 10, total: 0, pages: 0 }));
      }
    }, [filtersApplied, dispatch]);


    const deletePayroll = async (id: string): Promise<boolean> => {
        try {
          await deletePayrollMutation(id).unwrap();
          toast({ title: "Payroll Deleted" });
          return true;
        } catch (error: any) {
          const errorMessage = extractErrorMessage(error, "Failed to delete payroll");
          toast({
            title: "Delete Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return false;
        } 
       
      };

    const processSinglePayroll = async (payrollId: string): Promise<boolean> => {
      try {
        await processSinglePayrollMutation(payrollId).unwrap();
        toast({ title: "Payroll Processed Successfully" });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to process payroll");
        toast({
          title: "Process Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
     
    };

    const draftPayroll = async (payrollId: string): Promise<boolean> => {
      try {
        await markPayrollAsDraft(payrollId).unwrap();
        toast({ title: "Payroll Drafted Successfully" });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to draft payroll");
        toast({
          title: "Draft Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
 
    };

    const paidPayroll = async (payrollId: string): Promise<boolean> => {
      try {
        await markPayrollAsPaid(payrollId).unwrap();
        toast({ title: "Payroll Paid Successfully" });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to draft payroll");
        toast({
          title: "Paid Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
 
    };

    const reverseSinglePayroll = async (payrollId: string): Promise<boolean> => {
      try {
        await reverseSinglePayrollMutation(payrollId).unwrap();
        toast({ title: "Payroll Reversed Successfully" });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to reverse payroll");
        toast({
          title: "Reverse Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
    
    };

    const processBulkPayroll = async (month: string | number, year: string | number): Promise<boolean> => {
      try {
        await processBulkPayrollMutation({ month, year }).unwrap();
        toast({ title: `Payrolls Processed Successfully` });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to process payrolls");
        toast({
          title: "Bulk Process Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
     
    };

    const reverseBulkPayroll = async (month: string | number, year: string | number): Promise<boolean> => {
      dispatch(setIsLoading(true));
      try {
        await reverseBulkPayrollMutation({ month, year }).unwrap();
        toast({ title: ` Payrolls Reversed Successfully` });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to reverse payrolls");
        toast({
          title: "Bulk Reverse Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
      finally {
        dispatch(setIsLoading(false));
      }
    };

    const payrollsAsDraftBulk = async (month: string | number, year: string | number): Promise<boolean> => {
      try {
        await markPayrollsAsDraftBulk({ month, year }).unwrap();
        toast({ title: `Payrolls Drafted Successfully` });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to draft payrolls");
        toast({
          title: "Bulk Drafted  Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
    };

    const payrollAsPayBulk = async (month: string | number, year: string | number): Promise<boolean> => {
      try {
        await payrollsAsPaidBulk({ month, year }).unwrap();
        toast({ title: `Payroll Paid Successfully` });
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Failed to pay payrolls");
        toast({
          title: "Bulk Pay Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } 
    };


return {
  isLoading: isLoading || isFetchingPayrolls,
  error: error ?? null,
  cachedPayrolls,
  payrollPagination,
  selectedPayroll,
  isDialogOpen,
  isDeleteDialogOpen,
  selectedDeleteId,
  cachedPayrollData,
  deletePayroll,
  draftPayroll,
  processSinglePayroll,
  reverseSinglePayroll,
  processBulkPayroll,
  reverseBulkPayroll,
  payrollAsPayBulk,
  paidPayroll,
  payrollsAsDraftBulk,
  setIsDialogOpen: (open: boolean) => dispatch(setIsDialogOpen(open)),
  setIsDeleteDialogOpen: (open: boolean) => dispatch(setIsDeleteDialogOpen(open)),
  setSelectedPayroll: (payroll: IPayroll | null) => dispatch(setSelectedPayroll(payroll)),
  setSelectedDeleteId: (id: string | null) => dispatch(setSelectedDeleteId(id)),
  refetchPayrolls,
  clearPayrollCache: () => dispatch(clearPayrollCache()),

};

};
