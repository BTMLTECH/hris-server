/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
} from "@/store/slices/payroll/payrollApi";
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
} from "@/store/slices/payroll/payrollSlice";
import { extractErrorMessage } from "@/utils/errorHandler";
import { toast } from "@/hooks/use-toast";
import {
  extractPayrollArray,
  IPayroll,
  PayrollContextType,
} from "@/types/payroll";
import { useDebounce } from "./useDebounce";

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
  const [deletePayrollMutation] = useDeletePayrollMutation();
  const [processSinglePayrollMutation] = useProcessSinglePayrollMutation();
  const [reverseSinglePayrollMutation] = useReverseSinglePayrollMutation();
  const [markPayrollAsDraft] = useMarkPayrollAsDraftMutation();
  const [markPayrollAsPaid] = useMarkPayrollAsPaidMutation();
  const [processBulkPayrollMutation] = useProcessBulkPayrollMutation();
  const [reverseBulkPayrollMutation] = useReverseBulkPayrollMutation();
  const [markPayrollsAsDraftBulk] = useMarkPayrollsAsDraftBulkMutation();
  const [payrollsAsPaidBulk] = usePayrollsAsPaidBulkMutation();

  const currentPage = payrollPagination?.page;
  const cachedPayrolls = payrollCache[currentPage];
  const debouncedSearch = useDebounce(searchTerm, 500);

  const isCacheAvailable =
    Array.isArray(cachedPayrolls) && cachedPayrolls.length > 0;
  const isValidSearch = debouncedSearch.trim().length >= 2;
  const shouldSearch = filtersApplied && isValidSearch;
  const shouldFetchFromApi = !isCacheAvailable || !shouldSearch;

  const queryParams: {
    page: number;
    limit: number;
    month?: string;
    year?: string;
    search?: string;
  } = {
    page: currentPage,
    limit: payrollPagination?.limit || 20,
  };

  if (filtersApplied && selectedMonth) queryParams.month = selectedMonth;
  if (filtersApplied && selectedYear) queryParams.year = selectedYear;
  if (filtersApplied && debouncedSearch.trim().length >= 2)
    queryParams.search = debouncedSearch.trim();

  const {
    data: payrollRecords,
    isLoading: isFetchingPayrolls,
    refetch: refetchPayrolls,
  } = useGetAllPayrollsQuery(queryParams, {
    // skip: false,
    skip: !shouldFetchFromApi,
  });

  const baseRecords = extractPayrollArray(
    Array.isArray(cachedPayrolls) && cachedPayrolls.length > 0
      ? cachedPayrolls
      : payrollRecords
  );

  const searchLower = debouncedSearch ? debouncedSearch.toLowerCase() : "";

  const locallyFiltered = baseRecords.filter((r) => {
    const matchesName =
      !searchLower ||
      r.user?.firstName?.toLowerCase().includes(searchLower) ||
      r.user?.lastName?.toLowerCase().includes(searchLower);

    const matchesMonth = selectedMonth ? r.month === selectedMonth : true;
    const matchesYear = selectedYear ? r.year === selectedYear : true;

    return matchesName && matchesMonth && matchesYear;
  });

  // If no local results and filters are applied → fallback to API results
  const finalRecords =
    locallyFiltered.length > 0 || !filtersApplied
      ? locallyFiltered
      : extractPayrollArray(payrollRecords);

  useEffect(() => {
    if (!filtersApplied) {
      const cachedInitial = initialPayrollRecords;
      const ONE_MINUTE = 60 * 1000;
      const cacheAge = cachedInitial?.timestamp
        ? Date.now() - cachedInitial.timestamp
        : null;
      if (
        cachedInitial &&
        cachedInitial.data.length > 0 &&
        cacheAge !== null &&
        cacheAge < ONE_MINUTE
      ) {
        dispatch(restorePayrollFromCache(cachedInitial));
      } else {
        refetchPayrolls();
      }
    }

    if (payrollRecords?.data) {
      const { pagination, data: users } = payrollRecords.data;

      if (pagination) {
        dispatch(setPayrollPagination(pagination));
      }

      if (users && !payrollCache[pagination.page]) {
        dispatch(setPayrollCache({ page: pagination.page, data: users }));
      }
    }
  }, [payrollRecords, dispatch, filtersApplied]);

  const deletePayroll = async (id: string): Promise<boolean> => {
    try {
      await deletePayrollMutation(id).unwrap();
      toast({ title: "Payroll Deleted" });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to delete payroll"
      );
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
      const errorMessage = extractErrorMessage(
        error,
        "Failed to process payroll"
      );
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
      const errorMessage = extractErrorMessage(
        error,
        "Failed to draft payroll"
      );
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
      const errorMessage = extractErrorMessage(
        error,
        "Failed to draft payroll"
      );
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
      const errorMessage = extractErrorMessage(
        error,
        "Failed to reverse payroll"
      );
      toast({
        title: "Reverse Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const processBulkPayroll = async (
    month: string | number,
    year: string | number
  ): Promise<boolean> => {
    try {
      await processBulkPayrollMutation({ month, year }).unwrap();
      toast({ title: `Payrolls Processed Successfully` });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to process payrolls"
      );
      toast({
        title: "Bulk Process Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const reverseBulkPayroll = async (
    month: string | number,
    year: string | number
  ): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await reverseBulkPayrollMutation({ month, year }).unwrap();
      toast({ title: ` Payrolls Reversed Successfully` });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to reverse payrolls"
      );
      toast({
        title: "Bulk Reverse Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const payrollsAsDraftBulk = async (
    month: string | number,
    year: string | number
  ): Promise<boolean> => {
    try {
      await markPayrollsAsDraftBulk({ month, year }).unwrap();
      toast({ title: `Payrolls Drafted Successfully` });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to draft payrolls"
      );
      toast({
        title: "Bulk Drafted  Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const payrollAsPayBulk = async (
    month: string | number,
    year: string | number
  ): Promise<boolean> => {
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
    isLoading: isFetchingPayrolls,
    error: error ?? null,
    cachedPayrolls: finalRecords,
    payrollPagination,
    selectedPayroll,
    isDialogOpen,
    isDeleteDialogOpen,
    selectedDeleteId,
    // cachedPayrollData,
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
    setIsDeleteDialogOpen: (open: boolean) =>
      dispatch(setIsDeleteDialogOpen(open)),
    setSelectedPayroll: (payroll: IPayroll | null) =>
      dispatch(setSelectedPayroll(payroll)),
    setSelectedDeleteId: (id: string | null) =>
      dispatch(setSelectedDeleteId(id)),
    refetchPayrolls,
    clearPayrollCache: () => dispatch(clearPayrollCache()),
  };
};
