/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useCreateCommsMutation,
  useCreateITReportMutation,
  useCreateOperationMutation,
  useCreateQualityMutation,
  useGenerateEmploymentSummaryMutation,
  useGetAllCommsQuery,
  useGetAllITReportsQuery,
  useGetAllOperationsQuery,
  useGetAllQualityQuery,
  useLazyGetAllCommsQuery,
  useLazyGetAllITReportsQuery,
  useLazyGetAllOperationsQuery,
  useLazyGetAllQualityQuery,
} from "@/store/slices/report/reportApi";
import {
  setSelectedReport,
  setDateRange,
  setDepartment,
  setIsGenerating,
  setCustomStartDate,
  setCustomEndDate,
  clearReport,
  setQualityCache,
  setQualityPagination,
  setCommsPagination,
  setITReportPagination,
  setOperationsPagination,
  setOperationsCache,
  setCommsCache,
  setITReportCache,
} from "@/store/slices/report/reportSlice";
import { toast } from "@/hooks/use-toast";
import {
  GenerateReportDTO,
  IComms,
  IOperationReport,
  IQualityAssurance,
  IReport,
  ReportContextType,
} from "@/types/report";
import { useSmartPaginatedResource } from "../smartPaginatedQuery/useSmartPaginatedQuery";
import { extractErrorMessage } from "@/utils/errorHandler";
import format from "date-fns/format";

export const useReduxReportContext = (): ReportContextType => {
  const dispatch = useAppDispatch();
  const {
    data: report,
    qualityPagination,
    operationsPagination,
    commsPagination,
    itReportPagination,
    qualityCache,
    searchTerm,
    operationsCache,
    commsCache,
    itReportCache,
    selectedDate,
  } = useAppSelector((state) => state.report);
  const formattedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;
  const [createQualityMutation] = useCreateQualityMutation();
  const [createOperationMutation] = useCreateOperationMutation();
  const [createCommsMutation] = useCreateCommsMutation();
  const [createITReportMutation] = useCreateITReportMutation();

  const [generateReport, { isLoading }] =
    useGenerateEmploymentSummaryMutation();
  const handleSetSelectedReport = (
    value:
      | "employee_summary"
      | "department_analysis"
      | "attendance_report"
      | "payroll_summary"
      | "performance_metrics"
  ) => {
    dispatch(setSelectedReport(value));
  };

  const handleSetDateRange = (
    value:
      | "last_7_days"
      | "last_30_days"
      | "last_quarter"
      | "last_year"
      | "custom"
  ) => {
    dispatch(setDateRange(value));
  };

  // ✅ QUALITY
  const {
    finalData: qualityReports,
    totalPages: qualityTotalPages,
    isBaseLoading: qualityLoading,
    shouldShowSkeleton: qualitySkeleton,
    shouldSearch: qualityShouldSearch,
  } = useSmartPaginatedResource({
    useBaseQuery: useGetAllQualityQuery,
    useLazyQuery: useLazyGetAllQualityQuery,
    cache: qualityCache,
    pagination: qualityPagination,
    setPagination: setQualityPagination,
    setCache: setQualityCache,
    searchTerm,
    filtersApplied: !!searchTerm || !!selectedDate,
    filterFn: (r, s) => {
      const searchLower = s.toLowerCase();
      const matchesAgent =
        !s || r.agentName.toLowerCase().includes(searchLower);
      const matchesDate = selectedDate
        ? format(new Date(r.createdAt), "yyyy-MM-dd") === formattedDate
        : true;
      return matchesAgent && matchesDate;
    },
    buildParams: (page, limit) => ({
      page,
      limit,
      search: searchTerm,
      date: formattedDate,
    }),
  });

  // ✅ OPERATIONS
  const {
    finalData: operationsReports,
    totalPages: operationsTotalPages,
    isBaseLoading: operationsLoading,
    shouldShowSkeleton: operationsSkeleton,
    shouldSearch: operationsShouldSearch,
  } = useSmartPaginatedResource({
    useBaseQuery: useGetAllOperationsQuery,
    useLazyQuery: useLazyGetAllOperationsQuery,
    cache: operationsCache,
    pagination: operationsPagination,
    setPagination: setOperationsPagination,
    setCache: setOperationsCache,
    searchTerm,
    filtersApplied: !!searchTerm || !!selectedDate,
    filterFn: (r, s) => {
      const searchLower = s.toLowerCase();
      const matchesName =
        !s || r.consultantName.toLowerCase().includes(searchLower);
      const matchesDate = selectedDate
        ? format(new Date(r.createdAt), "yyyy-MM-dd") === formattedDate
        : true;
      return matchesName && matchesDate;
    },
    buildParams: (page, limit) => ({
      page,
      limit,
      search: searchTerm,
      date: formattedDate,
    }),
  });

  // ✅ COMMS
  const {
    finalData: commsReports,
    totalPages: commsTotalPages,
    isBaseLoading: commsLoading,
    shouldShowSkeleton: commsSkeleton,
    shouldSearch: commsShouldSearch,
  } = useSmartPaginatedResource({
    useBaseQuery: useGetAllCommsQuery,
    useLazyQuery: useLazyGetAllCommsQuery,
    cache: commsCache,
    pagination: commsPagination,
    setPagination: setCommsPagination,
    setCache: setCommsCache,
    searchTerm,
    filtersApplied: !!searchTerm || !!selectedDate,
    filterFn: (r, s) => {
      const searchLower = s.toLowerCase();
      const matchesSender = !s || r.sender.toLowerCase().includes(searchLower);
      const matchesDate = selectedDate
        ? format(new Date(r.dateSent), "yyyy-MM-dd") === formattedDate
        : true;
      return matchesSender && matchesDate;
    },
    buildParams: (page, limit) => ({
      page,
      limit,
      search: searchTerm,
      date: formattedDate,
    }),
  });

  // ✅ IT REPORT
  const {
    finalData: itReports,
    totalPages: itTotalPages,
    isBaseLoading: itLoading,
    shouldShowSkeleton: itSkeleton,
    shouldSearch: itShouldSearch,
  } = useSmartPaginatedResource({
    useBaseQuery: useGetAllITReportsQuery,
    useLazyQuery: useLazyGetAllITReportsQuery,
    cache: itReportCache,
    pagination: itReportPagination,
    setPagination: setITReportPagination,
    setCache: setITReportCache,
    searchTerm,
    filtersApplied: !!searchTerm || !!selectedDate,
    filterFn: (r, s) => {
      const searchLower = s.toLowerCase();
      const matchesName = !s || r.name.toLowerCase().includes(searchLower);
      const matchesDate = selectedDate
        ? format(new Date(r.createdAt), "yyyy-MM-dd") === formattedDate
        : true;
      return matchesName && matchesDate;
    },
    buildParams: (page, limit) => ({
      page,
      limit,
      search: searchTerm,
      date: formattedDate,
    }),
  });
  const dataMap = {
    quality: qualityReports,
    operations: operationsReports,
    comms: commsReports,
    it: itReports,
  };

  const loadingMap = {
    quality: qualityLoading,
    operations: operationsLoading,
    comms: commsLoading,
    it: itLoading,
  };

  const paginationMap = {
    quality: qualityPagination,
    operations: operationsPagination,
    comms: commsPagination,
    it: itReportPagination,
  };

  const paginationSetterMap = {
    quality: setQualityPagination,
    operations: setOperationsPagination,
    comms: setCommsPagination,
    it: setITReportPagination,
  };

  const totalPagesMap = {
    quality: qualityTotalPages,
    operations: operationsTotalPages,
    comms: commsTotalPages,
    it: itTotalPages,
  };

  const skeletonMap = {
    quality: qualitySkeleton,
    operations: operationsSkeleton,
    comms: commsSkeleton,
    it: itSkeleton,
  };

  const shouldSearchMap = {
    quality: qualityShouldSearch,
    operations: operationsShouldSearch,
    comms: commsShouldSearch,
    it: itShouldSearch,
  };

  const handleCreate = async (
    mutationFn: any,
    data: any,
    label: string
  ): Promise<boolean> => {
    try {
      await mutationFn(data).unwrap();
      toast({
        title: `${label} created successfully!`,
        description: "Your record has been added to the system.",
      });
      return true;
    } catch (error) {
      const msg = extractErrorMessage(error, `Failed to create ${label}`);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      return false;
    }
  };

  // 🧩 Specific Report Create Functions
  const createQuality = (data: IQualityAssurance) =>
    handleCreate(createQualityMutation, data, "Quality");

  const createOperation = (data: IOperationReport) =>
    handleCreate(createOperationMutation, data, "Operations");

  const createComms = (data: IComms) =>
    handleCreate(createCommsMutation, data, "Comms");

  const createITReport = (data: IReport) =>
    handleCreate(createITReportMutation, data, "IT");

  const handleSetDepartment = (value: string) => {
    dispatch(setDepartment(value));
  };

  const handleSetCustomStartDate = (value: string | null) => {
    dispatch(setCustomStartDate(value));
  };

  const handleSetCustomEndDate = (value: string | null) => {
    dispatch(setCustomEndDate(value));
  };

  const handleGenerateReport = async (payload: GenerateReportDTO) => {
    try {
      dispatch(setIsGenerating(true));
      await generateReport(payload).unwrap();
      toast({
        title: "Report Generated",
        description: `Your ${payload.reportType} report is ready.`,
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Report Generation Failed",
        description: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsGenerating(false));
    }
  };

  const handleClearReport = () => {
    dispatch(clearReport());
  };

  return {
    // selectedReport: report.selectedReport,
    // dateRange: report.dateRange,
    // department: report.department,
    // isGenerating: report.isGenerating,
    // showCustomDatePicker: report.showCustomDatePicker,
    // customStartDate: report.customStartDate,
    // customEndDate: report.customEndDate,
    createQuality,
    createOperation,
    createComms,
    createITReport,
    qualityReports,
    operationsReports,
    commsReports,
    itReports,
    dataMap,
    loadingMap,
    paginationMap,
    paginationSetterMap,
    totalPagesMap,
    skeletonMap,
    shouldSearchMap,
    // isLoadingReport,
    // data: report.data,
    isLoading,
    // error: report.error,
    handleSetSelectedReport,
    handleSetDateRange,
    handleSetDepartment,
    handleSetCustomStartDate,
    handleSetCustomEndDate,
    handleGenerateReport,
    handleClearReport,
  };
};
