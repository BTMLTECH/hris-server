/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  payrollApi,
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
import { months } from "@/utils/normalize";
import { store } from "@/store/store";
import { refreshEndpoint } from "@/utils/refreshUtils";

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

  const currentPage = payrollPagination?.page ?? 1;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Grab cache for the current page
  const cachedPayrolls = payrollCache[currentPage];
  const isCacheAvailable =
    Array.isArray(cachedPayrolls) && cachedPayrolls.length > 0;

  // Search handling
  const isValidSearch = debouncedSearch.trim().length >= 2;
  const shouldSearch = filtersApplied && isValidSearch;

  // Query params for backend
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
  if (shouldSearch) queryParams.search = debouncedSearch.trim();

  // Flatten all cached pages safely
  const allData = Array.isArray(Object.values(payrollCache).flat())
    ? Object.values(payrollCache).flat()
    : [];

  // Decide if we need API fetch
  const shouldFetchFromApi =
    !isCacheAvailable ||
    (filtersApplied &&
      !allData.some((r) => {
        const matchesName =
          !debouncedSearch ||
          r.user?.firstName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          r.user?.lastName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase());

        const monthNum = Number(r.month);
        const matchesMonth = selectedMonth
          ? monthNum ===
            (isNaN(Number(selectedMonth))
              ? months.indexOf(selectedMonth) + 1
              : Number(selectedMonth))
          : true;

        const matchesYear = selectedYear
          ? Number(r.year) === Number(selectedYear)
          : true;

        return matchesName && matchesMonth && matchesYear;
      }));

  // RTK Query
  const {
    data: payrollRecords,
    isLoading: isFetchingPayrolls,
    refetch: refetchPayrolls,
  } = useGetAllPayrollsQuery(queryParams, {
    skip: !shouldFetchFromApi,
  });

  // Build base records safely
  const baseRecords = extractPayrollArray(
    filtersApplied || shouldSearch
      ? allData
      : isCacheAvailable
      ? cachedPayrolls
      : payrollRecords
  );

  // Local filtering
  const searchLower = debouncedSearch?.toLowerCase() || "";
  const locallyFiltered = baseRecords.filter((r) => {
    const matchesName =
      !searchLower ||
      r.user?.firstName?.toLowerCase().includes(searchLower) ||
      r.user?.lastName?.toLowerCase().includes(searchLower);

    const monthNum = Number(r.month);
    const matchesMonth = selectedMonth
      ? monthNum ===
        (isNaN(Number(selectedMonth))
          ? months.indexOf(selectedMonth) + 1
          : Number(selectedMonth))
      : true;

    const matchesYear = selectedYear
      ? Number(r.year) === Number(selectedYear)
      : true;

    return matchesName && matchesMonth && matchesYear;
  });

  // Hybrid final records (always array-safe)
  const finalRecords =
    locallyFiltered.length > 0 || !filtersApplied
      ? locallyFiltered
      : extractPayrollArray(payrollRecords);

  // Effects
  useEffect(() => {
    if (!filtersApplied && initialPayrollRecords?.data?.length > 0) {
      dispatch(restorePayrollFromCache(initialPayrollRecords));
    } else if (!filtersApplied) {
      refetchPayrolls();
    }

    if (payrollRecords?.data) {
      const { pagination, data: users } = payrollRecords.data;

      if (pagination) {
        dispatch(setPayrollPagination(pagination));
      }

      if (Array.isArray(users) && pagination?.page) {
        dispatch(setPayrollCache({ page: pagination.page, data: users }));
      }
    }
  }, [payrollRecords, dispatch, filtersApplied, refetchPayrolls]);

  // ⏳ Auto-refresh every 1 minute ONLY when filtering/searching
  useEffect(() => {
    if (!(filtersApplied || shouldSearch) || !shouldFetchFromApi) return;

    const interval = setInterval(() => {
      refetchPayrolls();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [
    filtersApplied,
    shouldSearch,
    shouldFetchFromApi,
    refetchPayrolls,
    debouncedSearch,
    selectedMonth,
    selectedYear,
    payrollPagination?.page,
  ]);

  const deletePayroll = async (id: string): Promise<boolean> => {
    try {
      await deletePayrollMutation(id).unwrap();
      toast({ title: "Payroll Deleted" });
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);
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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
