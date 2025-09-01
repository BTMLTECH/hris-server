/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGenerateEmploymentSummaryMutation,
} from "@/store/slices/report/reportApi";
import {
  setSelectedReport,
  setDateRange,
  setDepartment,
  setIsGenerating,
  setCustomStartDate,
  setCustomEndDate,
  clearReport,
} from "@/store/slices/report/reportSlice";
import { toast } from "@/hooks/use-toast";
import { GenerateReportDTO, ReportContextType } from "@/types/report";



export const useReduxReportContext = (): ReportContextType => {
  const dispatch = useAppDispatch();
  const report = useAppSelector((state) => state.report);

  const [generateReport, { isLoading }] = useGenerateEmploymentSummaryMutation();
    const handleSetSelectedReport = (value: 'employee_summary' | 'department_analysis' | 'attendance_report' | 'payroll_summary' | 'performance_metrics') => {
    dispatch(setSelectedReport(value));
    };

    const handleSetDateRange = (value: 'last_7_days' | 'last_30_days' | 'last_quarter' | 'last_year' | 'custom') => {
    dispatch(setDateRange(value));
    };

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
    selectedReport: report.selectedReport,
    dateRange: report.dateRange,
    department: report.department,
    isGenerating: report.isGenerating,
    showCustomDatePicker: report.showCustomDatePicker,
    customStartDate: report.customStartDate,
    customEndDate: report.customEndDate,
    data: report.data,
    isLoading,
    error: report.error,
    handleSetSelectedReport,
    handleSetDateRange,
    handleSetDepartment,
    handleSetCustomStartDate,
    handleSetCustomEndDate,
    handleGenerateReport,
    handleClearReport,
  };
};
