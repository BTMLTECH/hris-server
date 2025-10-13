/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebounce } from "../payroll/useDebounce";

// ✅ Simplified reusable RTK Query hook types
type UseBaseQuery<TData, TParams> = (
  params?: TParams,
  options?: any
) => {
  data?: { data?: { data: TData[]; pagination?: any } };
  isLoading?: boolean;
  refetch?: () => void;
};

type UseLazyQuery<TData, TParams> = () => [
  (params?: TParams) => any,
  {
    data?: { data?: { data: TData[]; pagination?: any } };
    isFetching?: boolean;
  }
];

interface PaginationState {
  page?: number;
  limit?: number;
  pages?: number;
}

interface SmartPaginatedResourceProps<T, Params> {
  // RTK Query hooks
  useBaseQuery: UseBaseQuery<T, Params>;
  useLazyQuery: any;

  // Redux state + actions
  cache: Record<number, T[]>;
  pagination: PaginationState;
  setPagination: (val: PaginationState) => any;
  setCache: (val: { page: number; data: T[] }) => any;

  // Search & Filters
  searchTerm?: string;
  filtersApplied?: boolean;
  filterFn: (item: T, search: string) => boolean;

  // Optional dynamic params (month, year, department, etc.)
  buildParams?: (
    page: number,
    limit: number,
    filters?: { statusFilter?: string; filterDepartment?: string }
  ) => Params;
  statusFilter?: string;
  filterDepartment?: string;

  skip?: boolean;
}

export function useSmartPaginatedResource<T, Params = any>({
  useBaseQuery,
  useLazyQuery,
  cache,
  pagination,
  setPagination,
  setCache,
  searchTerm = "",
  filtersApplied,
  filterFn,
  buildParams,
  statusFilter,
  filterDepartment,
  skip = false,
}: SmartPaginatedResourceProps<T, Params>) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const shouldSkip = skip || !isAuthenticated || !user;
  const currentPage = pagination?.page ?? 1;
  const pageSize = pagination?.limit || 20;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- Cache ---
  const cachedPage = cache[currentPage] ?? [];
  const allCached = Object.values(cache).flat();
  const isCacheAvailable = cachedPage.length > 0;

  // --- Params ---
  // const params = buildParams
  //   ? buildParams(currentPage, pageSize)
  //   : ({ page: currentPage, limit: pageSize } as Params);

  const params = buildParams
    ? buildParams(currentPage, pageSize, { statusFilter, filterDepartment })
    : ({ page: currentPage, limit: pageSize } as Params);

  // --- Base Query ---
  const {
    data: baseData,
    isLoading: isBaseLoading,
    refetch: refetchBase,
  } = useBaseQuery(params, {
    skip: shouldSkip,
    refetchOnMountOrArgChange: false,
  });

  // --- Lazy Query ---
  const [triggerServerSearch, { data: serverResult, isFetching: isSearching }] =
    useLazyQuery();

  // --- Search Logic ---
  const isValidSearch = debouncedSearch.trim().length >= 2;
  const shouldSearch = filtersApplied && isValidSearch;
  // 🔹 shouldSearch now includes *any filter*, not just text search
  // const shouldSearch = filtersApplied && (isValidSearch || filtersApplied);

  const localFiltered = allCached.filter((i: T) =>
    filterFn(i, debouncedSearch)
  );
  const hasLocalMatches = localFiltered.length > 0;

  // --- Paginate locally ---
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLocal = localFiltered.slice(startIndex, startIndex + pageSize);

  // --- Skeleton State ---
  const isSearchingBackend = shouldSearch && !hasLocalMatches && isSearching;
  const isLoadingInitial = !shouldSearch && !isCacheAvailable && isBaseLoading;
  const shouldShowSkeleton = isSearchingBackend || isLoadingInitial;

  // --- Trigger server search ---
  // useEffect(() => {
  //   if (!shouldSearch) return;
  //   if (hasLocalMatches) {
  //     if (currentPage !== 1)
  //       dispatch(setPagination({ ...pagination, page: 1 }));
  //     return;
  //   }

  //   const searchParams: any = {
  //     page: 1,
  //     limit: pageSize,
  //     search: debouncedSearch.trim(),
  //   };

  //   triggerServerSearch(searchParams);
  // }, [debouncedSearch, shouldSearch, hasLocalMatches]);
  // --- Trigger backend fetch when searchTerm OR filters change ---

  useEffect(() => {
    // Don’t do anything if skipping or unauthenticated
    if (shouldSkip) return;

    // ✅ Define when we should search (any active filter OR search term)
    const hasActiveFilters =
      !!searchTerm?.trim() ||
      (filterDepartment && filterDepartment !== "all") ||
      !!statusFilter;

    if (!hasActiveFilters) return;

    // ✅ Only search backend if no cached results match
    if (hasLocalMatches) {
      // If you filtered and already have local matches, reset to first page
      if (currentPage !== 1) {
        dispatch(setPagination({ ...pagination, page: 1 }));
      }
      return;
    }

    // ✅ Build search params dynamically
    const searchParams: any = buildParams
      ? buildParams(currentPage, pageSize, { statusFilter, filterDepartment })
      : {
          page: 1,
          limit: pageSize,
          search: debouncedSearch.trim(),
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(filterDepartment && filterDepartment !== "all"
            ? { department: filterDepartment }
            : {}),
        };

    console.log("🔹 Fetching backend (no local matches)", searchParams);

    triggerServerSearch(searchParams);
  }, [
    debouncedSearch,
    filterDepartment,
    statusFilter,
    hasLocalMatches,
    shouldSkip,
    currentPage,
    pageSize,
  ]);

  // useEffect(() => {
  //   // Don't fetch if unauthenticated or skipping
  //   if (!shouldSearch) return;
  //   if (hasLocalMatches) {
  //     if (currentPage !== 1)
  //       dispatch(setPagination({ ...pagination, page: 1 }));
  //     return;
  //   }

  //   const searchParams: any = buildParams
  //     ? buildParams(currentPage, pageSize)
  //     : {
  //         page: currentPage,
  //         limit: pageSize,
  //         search: debouncedSearch.trim(),
  //       };

  //   // Always hit backend when filters are applied
  //   if (filtersApplied) {
  //     triggerServerSearch(searchParams);
  //   }
  // }, [debouncedSearch, filtersApplied, statusFilter, filterDepartment]);

  // --- Cache results ---
  useEffect(() => {
    if (!serverResult?.data) return;
    const { pagination: pg, data: results } = serverResult.data;
    if (pg) dispatch(setPagination(pg));
    if (Array.isArray(results) && pg?.page) {
      dispatch(setCache({ page: pg.page, data: results }));
    }
  }, [serverResult]);

  useEffect(() => {
    if (!baseData?.data || shouldSearch) return;
    const { pagination: pg, data: results } = baseData.data;
    if (pg) dispatch(setPagination(pg));
    if (Array.isArray(results) && pg?.page) {
      dispatch(setCache({ page: pg.page, data: results }));
    }
  }, [baseData, shouldSearch]);

  // --- Final Computed Data ---
  const finalData = useMemo(() => {
    if (shouldSearch) {
      if (hasLocalMatches) return paginatedLocal;
      if (isSearching) return [];
      if (serverResult?.data) return serverResult.data.data ?? [];
      return [];
    }

    if (isCacheAvailable) return cachedPage;
    return baseData?.data?.data ?? [];
  }, [
    shouldSearch,
    hasLocalMatches,
    paginatedLocal,
    isSearching,
    serverResult,
    isCacheAvailable,
    cachedPage,
    baseData,
  ]);

  const totalPages = useMemo(() => {
    if (shouldSearch) return Math.ceil(localFiltered.length / pageSize);
    return pagination?.pages || baseData?.data?.pagination?.pages || 1;
  }, [shouldSearch, localFiltered, pageSize, pagination, baseData]);

  return {
    finalData,
    totalPages,
    isSearching,
    isBaseLoading,
    refetchBase,
    shouldSkip,
    baseData,
    shouldSearch,
    shouldShowSkeleton,
  };
}
