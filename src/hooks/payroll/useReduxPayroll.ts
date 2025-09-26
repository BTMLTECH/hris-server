/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  payrollApi,
  useDeletePayrollMutation,
  useGetAllPayrollsQuery,
  useLazyGetAllPayrollsQuery,
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
  const { user } = useAppSelector((state) => state.auth);
  const [deletePayrollMutation] = useDeletePayrollMutation();
  const [processSinglePayrollMutation] = useProcessSinglePayrollMutation();
  const [reverseSinglePayrollMutation] = useReverseSinglePayrollMutation();
  const [markPayrollAsDraft] = useMarkPayrollAsDraftMutation();
  const [markPayrollAsPaid] = useMarkPayrollAsPaidMutation();
  const [processBulkPayrollMutation] = useProcessBulkPayrollMutation();
  const [reverseBulkPayrollMutation] = useReverseBulkPayrollMutation();
  const [markPayrollsAsDraftBulk] = useMarkPayrollsAsDraftBulkMutation();
  const [payrollsAsPaidBulk] = usePayrollsAsPaidBulkMutation();

  // const currentPage = payrollPagination?.page ?? 1;
  // const debouncedSearch = useDebounce(searchTerm, 500);

  // // Grab cache for the current page
  // const cachedPayrolls = payrollCache[currentPage];
  // const isCacheAvailable =
  //   Array.isArray(cachedPayrolls) && cachedPayrolls.length > 0;

  // // Search handling
  // const isValidSearch = debouncedSearch.trim().length >= 2;
  // const shouldSearch = filtersApplied && isValidSearch;

  // // Query params for backend
  // const queryParams: {
  //   page: number;
  //   limit: number;
  //   month?: string;
  //   year?: string;
  //   search?: string;
  // } = {
  //   page: currentPage,
  //   limit: payrollPagination?.limit || 20,
  // };

  // if (filtersApplied && selectedMonth) queryParams.month = selectedMonth;
  // if (filtersApplied && selectedYear) queryParams.year = selectedYear;
  // if (shouldSearch) queryParams.search = debouncedSearch.trim();

  // // Flatten all cached pages safely
  // const allData = Array.isArray(Object.values(payrollCache).flat())
  //   ? Object.values(payrollCache).flat()
  //   : [];

  // // Decide if we need API fetch
  // const shouldFetchFromApi =
  //   !isCacheAvailable ||
  //   (filtersApplied &&
  //     !allData.some((r) => {
  //       const matchesName =
  //         !debouncedSearch ||
  //         r.user?.firstName
  //           ?.toLowerCase()
  //           .includes(debouncedSearch.toLowerCase()) ||
  //         r.user?.lastName
  //           ?.toLowerCase()
  //           .includes(debouncedSearch.toLowerCase());

  //       const monthNum = Number(r.month);
  //       const matchesMonth = selectedMonth
  //         ? monthNum ===
  //           (isNaN(Number(selectedMonth))
  //             ? months.indexOf(selectedMonth) + 1
  //             : Number(selectedMonth))
  //         : true;

  //       const matchesYear = selectedYear
  //         ? Number(r.year) === Number(selectedYear)
  //         : true;

  //       return matchesName && matchesMonth && matchesYear;
  //     }));

  // // RTK Query
  // const {
  //   data: payrollRecords,
  //   isLoading: isFetchingPayrolls,
  //   refetch: refetchPayrolls,
  // } = useGetAllPayrollsQuery(queryParams, {
  //   skip: !shouldFetchFromApi,
  // });

  // // Build base records safely
  // const baseRecords = extractPayrollArray(
  //   filtersApplied || shouldSearch
  //     ? allData
  //     : isCacheAvailable
  //     ? cachedPayrolls
  //     : payrollRecords
  // );

  // // Local filtering
  // const searchLower = debouncedSearch?.toLowerCase() || "";
  // const locallyFiltered = baseRecords.filter((r) => {
  //   const matchesName =
  //     !searchLower ||
  //     r.user?.firstName?.toLowerCase().includes(searchLower) ||
  //     r.user?.lastName?.toLowerCase().includes(searchLower);

  //   const monthNum = Number(r.month);
  //   const matchesMonth = selectedMonth
  //     ? monthNum ===
  //       (isNaN(Number(selectedMonth))
  //         ? months.indexOf(selectedMonth) + 1
  //         : Number(selectedMonth))
  //     : true;

  //   const matchesYear = selectedYear
  //     ? Number(r.year) === Number(selectedYear)
  //     : true;

  //   return matchesName && matchesMonth && matchesYear;
  // });

  // // Hybrid final records (always array-safe)
  // const finalRecords =
  //   locallyFiltered.length > 0 || !filtersApplied
  //     ? locallyFiltered
  //     : extractPayrollArray(payrollRecords);

  // // Effects
  // useEffect(() => {
  //   if (!filtersApplied && initialPayrollRecords?.data?.length > 0) {
  //     dispatch(restorePayrollFromCache(initialPayrollRecords));
  //   } else if (!filtersApplied) {
  //     refetchPayrolls();
  //   }

  //   if (payrollRecords?.data) {
  //     const { pagination, data: users } = payrollRecords.data;

  //     if (pagination) {
  //       dispatch(setPayrollPagination(pagination));
  //     }

  //     if (Array.isArray(users) && pagination?.page) {
  //       dispatch(setPayrollCache({ page: pagination.page, data: users }));
  //     }
  //   }
  // }, [payrollRecords, dispatch, filtersApplied, refetchPayrolls]);

  // // ⏳ Auto-refresh every 1 minute ONLY when filtering/searching
  // useEffect(() => {
  //   if (!(filtersApplied || shouldSearch) || !shouldFetchFromApi) return;

  //   const interval = setInterval(() => {
  //     refetchPayrolls();
  //   }, 60 * 1000);

  //   return () => clearInterval(interval);
  // }, [
  //   filtersApplied,
  //   shouldSearch,
  //   shouldFetchFromApi,
  //   refetchPayrolls,
  //   debouncedSearch,
  //   selectedMonth,
  //   selectedYear,
  //   payrollPagination?.page,
  // ]);

  // --- assumptions: your RTK Query slice exposes both:
  //    useGetAllPayrollsQuery(...)    (regular hook)
  //    useLazyGetAllPayrollsQuery()   (lazy hook)
  // --- and you still keep your useDebounce(searchTerm, 500)

  const currentPage = payrollPagination?.page ?? 1;
  const pageSize = payrollPagination?.limit || 20;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Cached payroll helpers
  const cachedPayrolls = payrollCache[currentPage] ?? [];
  const allCachedPayrolls = Object.values(payrollCache).flatMap((page: any) =>
    Array.isArray(page) ? page : []
  );
  const isCacheAvailable = cachedPayrolls.length > 0;

  // Search handling
  const isValidSearch = debouncedSearch.trim().length >= 2;
  const shouldSearch = filtersApplied && isValidSearch;

  // Base query params
  const baseQueryParams: any = {
    page: currentPage,
    limit: pageSize,
  };
  if (selectedMonth) baseQueryParams.month = selectedMonth;
  if (selectedYear) baseQueryParams.year = selectedYear;

  // Base query for payroll
  const {
    data: payrollRecords,
    isLoading: isFetchingPayrolls,
    refetch: refetchPayrolls,
  } = useGetAllPayrollsQuery(baseQueryParams, { skip: !user });

  // Lazy server search query
  const [
    triggerServerSearch,
    { data: serverSearchResult, isFetching: isSearching },
  ] = useLazyGetAllPayrollsQuery();

  // Helper: check if a record matches search/filters
  const matchesRecord = (r: any, searchText?: string) => {
    const searchLower = (searchText || "").toLowerCase();
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
  };

  // Local filtering
  const locallyFilteredAll = allCachedPayrolls.filter((r) =>
    matchesRecord(r, debouncedSearch)
  );
  const hasLocalMatches = locallyFilteredAll.length > 0;

  // Paginate local results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFilteredPayrolls = locallyFilteredAll.slice(
    startIndex,
    endIndex
  );

  // Trigger server search if cache misses
  useEffect(() => {
    if (!shouldSearch) return;
    if (hasLocalMatches) return;

    // Reset page for new search
    dispatch(setPayrollPagination({ ...payrollPagination, page: 1 }));

    const serverParams: any = {
      page: 1,
      limit: pageSize,
      search: debouncedSearch.trim(),
    };
    if (selectedMonth) serverParams.month = selectedMonth;
    if (selectedYear) serverParams.year = selectedYear;

    triggerServerSearch(serverParams);
  }, [
    debouncedSearch,
    selectedMonth,
    selectedYear,
    shouldSearch,
    hasLocalMatches,
  ]);

  // Cache server search results
  useEffect(() => {
    if (!serverSearchResult?.data) return;

    const { pagination, data: users } = serverSearchResult.data;
    if (pagination) dispatch(setPayrollPagination(pagination));
    if (Array.isArray(users) && pagination?.page) {
      dispatch(setPayrollCache({ page: pagination.page, data: users }));
    }
  }, [serverSearchResult]);

  // Build final records
  const finalRecords = (() => {
    if (shouldSearch) {
      if (hasLocalMatches)
        return extractPayrollArray(paginatedFilteredPayrolls);
      if (isSearching) return [];
      if (serverSearchResult?.data)
        return extractPayrollArray(serverSearchResult);
      return [];
    }

    if (isCacheAvailable) return extractPayrollArray(cachedPayrolls);
    return extractPayrollArray(payrollRecords);
  })();

  // Sync cache and pagination for base query
  useEffect(() => {
    if (!filtersApplied && initialPayrollRecords?.data?.length > 0) {
      dispatch(restorePayrollFromCache(initialPayrollRecords));
    }
    // else if (!filtersApplied) {
    //   refetchPayrolls();
    // }

    if (payrollRecords?.data) {
      const { pagination, data: users } = payrollRecords.data;
      if (pagination) dispatch(setPayrollPagination(pagination));
      if (Array.isArray(users) && pagination?.page) {
        dispatch(setPayrollCache({ page: pagination.page, data: users }));
      }
    }
  }, [payrollRecords, filtersApplied, initialPayrollRecords]);

  // Compute total pages
  const totalPages = Math.ceil(
    (shouldSearch ? locallyFilteredAll.length : allCachedPayrolls.length) /
      pageSize
  );

  // const currentPage = payrollPagination?.page ?? 1;
  // const debouncedSearch = useDebounce(searchTerm, 500);

  // // Per-page cached items and flattened cache
  // const cachedPayrolls = payrollCache[currentPage] ?? [];
  // const isCacheAvailable =
  //   Array.isArray(cachedPayrolls) && cachedPayrolls.length > 0;

  // const allData = Array.isArray(Object.values(payrollCache).flat?.())
  //   ? Object.values(payrollCache).flat()
  //   : Object.values(payrollCache).reduce(
  //       (acc: any[], v: any) => acc.concat(v || []),
  //       []
  //     );

  // // Search handling
  // const isValidSearch = debouncedSearch.trim().length >= 2;
  // const shouldSearch = filtersApplied && isValidSearch;

  // // BASE query params (no `search`!)
  // const baseQueryParams = {
  //   page: currentPage,
  //   limit: payrollPagination?.limit || 20,
  // };

  // // Always subscribe to base list (so invalidation & refetch works)
  // const {
  //   data: payrollRecords,
  //   isLoading: isFetchingPayrolls,
  //   refetch: refetchPayrolls,
  // } = useGetAllPayrollsQuery(baseQueryParams, { skip: !user });

  // // Lazy trigger for server-side search (only used when cache misses)
  // const [
  //   triggerServerSearch,
  //   { data: serverSearchResult, isFetching: isSearching },
  // ] = useLazyGetAllPayrollsQuery();

  // // local matcher (reuse the logic you already have)
  // const matchesRecord = (r: any, searchText: string | undefined) => {
  //   const name = (r.user?.firstName || "") + " " + (r.user?.lastName || "");
  //   const searchLower = (searchText || "").toLowerCase();

  //   const matchesName =
  //     !searchLower ||
  //     r.user?.firstName?.toLowerCase().includes(searchLower) ||
  //     r.user?.lastName?.toLowerCase().includes(searchLower);

  //   const monthNum = Number(r.month);
  //   const matchesMonth = selectedMonth
  //     ? monthNum ===
  //       (isNaN(Number(selectedMonth))
  //         ? months.indexOf(selectedMonth) + 1
  //         : Number(selectedMonth))
  //     : true;

  //   const matchesYear = selectedYear
  //     ? Number(r.year) === Number(selectedYear)
  //     : true;

  //   return matchesName && matchesMonth && matchesYear;
  // };

  // // local filtering across the entire cache (fast, no network)
  // const locallyFilteredAll = allData.filter((r) =>
  //   matchesRecord(r, debouncedSearch)
  // );
  // const hasLocalMatches = locallyFilteredAll.length > 0;

  // // When to kick off a server search:
  // // - user is searching (shouldSearch)
  // // - AND cache does not contain matches (hasLocalMatches === false)
  // useEffect(() => {
  //   if (!shouldSearch) return;

  //   if (hasLocalMatches) {
  //     // cache already satisfies search -> do nothing (avoid network)
  //     return;
  //   }

  //   // prepare server search params (page=1 is common for search)
  //   const serverParams: any = {
  //     page: 1,
  //     limit: payrollPagination?.limit || 20,
  //     search: debouncedSearch.trim(),
  //   };
  //   if (selectedMonth) serverParams.month = selectedMonth;
  //   if (selectedYear) serverParams.year = selectedYear;

  //   // trigger the lazy search (debouncedSearch is already debounced)
  //   triggerServerSearch(serverParams);
  // }, [
  //   shouldSearch,
  //   debouncedSearch,
  //   hasLocalMatches,
  //   selectedMonth,
  //   selectedYear,
  //   triggerServerSearch,
  // ]);

  // // Build finalRecords to render:
  // //  - If user is searching:
  // //      -> use local matches if present
  // //      -> else use serverSearchResult if available (or show loading)
  // //  - If not searching:
  // //      -> prefer current-page cache if available
  // //      -> else use base query results
  // const finalRecords = (() => {
  //   if (shouldSearch) {
  //     if (hasLocalMatches) {
  //       return extractPayrollArray(locallyFilteredAll);
  //     }

  //     // we don't have local matches: prefer serverSearchResult (if any)
  //     if (isSearching) {
  //       return []; // or show skeleton/loading
  //     }
  //     if (serverSearchResult?.data) {
  //       return extractPayrollArray(serverSearchResult);
  //     }
  //     // no local and no server result yet -> empty
  //     return [];
  //   }

  //   // not searching: prefer page cache, otherwise server response
  //   if (isCacheAvailable) return extractPayrollArray(cachedPayrolls);
  //   return extractPayrollArray(payrollRecords);
  // })();

  // // keep your existing effect to store server page results into your cache/pagination
  // useEffect(() => {
  //   if (!filtersApplied && initialPayrollRecords?.data?.length > 0) {
  //     dispatch(restorePayrollFromCache(initialPayrollRecords));
  //   } else if (!filtersApplied) {
  //     // ensure base list stays fresh
  //     refetchPayrolls();
  //   }

  //   if (payrollRecords?.data) {
  //     const { pagination, data: users } = payrollRecords.data;
  //     if (pagination) dispatch(setPayrollPagination(pagination));
  //     if (Array.isArray(users) && pagination?.page) {
  //       dispatch(setPayrollCache({ page: pagination.page, data: users }));
  //     }
  //   }
  // }, [payrollRecords, dispatch, filtersApplied, refetchPayrolls]);

  const deletePayroll = async (id: string): Promise<boolean> => {
    try {
      await deletePayrollMutation(id).unwrap();
      toast({ title: "Payroll Deleted" });
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);
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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
      // refreshEndpoint(payrollApi.endpoints.getAllPayrolls, queryParams);

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
    totalPages,
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
