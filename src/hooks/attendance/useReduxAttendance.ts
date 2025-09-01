/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useBiometryCheckInMutation,
  useBiometryCheckOutMutation,
  useManualCheckInMutation,
  useManualCheckOutMutation,
  useGetMyAttendanceHistoryQuery,
  useAdminAttendanceReportQuery,
  // useGetMyAttendanceStatsQuery,
  useGetCompanyAttendanceSummaryQuery,
  useExportAttendanceExcelQuery,
} from "@/store/slices/attendance/attendanceApi";
import { toast } from "../use-toast";
import { AttendanceContextType } from "@/types/attendance";
import { setAttendancePagination, setCachedAttendance, setLoading, setRecords } from "@/store/slices/attendance/attendanceSlice";
import { useEffect } from "react";
import { normalizeAttendanceRecord } from "@/utils/normalize";

export const useReduxAttendance = (): AttendanceContextType => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { attendanceCache, attendancePagination } = useAppSelector((state) => state.attendance);
  const page = attendancePagination?.page;  
  const cachedRecords = attendanceCache[page] ?? [];
  const shouldUseCache = attendanceCache.hasOwnProperty(page);

  const { data: attendanceRecords, isLoading: historyLoading, error: historyError, refetch: refetchAttendanceHistory }  
  = useGetMyAttendanceHistoryQuery({ page, limit:attendancePagination.limit },  { skip: false });



  const { data: companyAttendanceSummary, isLoading: summaryLoading, error: summaryError, refetch: refetchCompanySummary } = useGetCompanyAttendanceSummaryQuery(undefined, {
    skip: !user, 
  });


  const { data: adminAttendanceReport, isLoading: adminReportLoading, error: adminReportError } = useAdminAttendanceReportQuery(undefined, {
    skip: !user || !user.role || user.role !== "admin", 
  });

  const { data: exportedAttendanceData, isLoading: exportLoading, error: exportError } = useExportAttendanceExcelQuery(undefined, {
    skip: !user || !user.role || user.role !== "admin", 
  });


  const [biometryCheckIn, { isLoading: biometryCheckInLoading }] = useBiometryCheckInMutation();
  const [biometryCheckOut, { isLoading: biometryCheckOutLoading }] = useBiometryCheckOutMutation();
  const [manualCheckIn, { isLoading: manualCheckInLoading }] = useManualCheckInMutation();
  const [manualCheckOut, { isLoading: manualCheckOutLoading }] = useManualCheckOutMutation();

  const handleBiometryCheckIn = async (data: any): Promise<boolean> => {
    try {
      await biometryCheckIn(data).unwrap();
      toast({ title: "Biometry Check-In Successful" });
      return true;
    } catch (error: any) {
      toast({
        title: "Biometry Check-In Error",
        description: error?.message || "Failed to check-in via biometry",
        variant: "destructive",
      });
      return false; 
    }
  };

  const handleBiometryCheckOut = async (data: any): Promise<boolean> => {
    try {
      await biometryCheckOut(data).unwrap();
      toast({ title: "Biometry Check-Out Successful" });
      return true; // Return true if successful
    } catch (error: any) {
      toast({
        title: "Biometry Check-Out Error",
        description: error?.message || "Failed to check-out via biometry",
        variant: "destructive",
      });
      return false; 
    }
  };

  const handleManualCheckIn = async (data: any): Promise<boolean> => {

    dispatch(setLoading(false))
    try {
     const success = await manualCheckIn(data).unwrap();
     if(success){

       toast({ title: "Manual Check-In Successful" });
       refetchAttendanceHistory();
     }
      return true; 
    } catch (error: any) {
      toast({
        title: "Manual Check-In Error",
        description: error?.message || "Failed to check-in manually",
        variant: "destructive",
      });
      return false; 
    }finally{
      dispatch(setLoading(false))
    }
  };

  const handleManualCheckOut = async (data: any): Promise<boolean> => {
    dispatch(setLoading(false))
    try {
      await manualCheckOut(data).unwrap();
      toast({ title: "Manual Check-Out Successful" });
      return true; 
    } catch (error: any) {
      toast({
        title: "Manual Check-Out Error",
        description: error?.message || "Failed to check-out manually",
        variant: "destructive",
      });
      return false; 
    }finally{
     dispatch(setLoading(false))
    }
  };

 
  const handleExportAttendance = async (): Promise<boolean> => {
    try {
      await exportedAttendanceData?.unwrap();
      toast({ title: "Attendance data exported successfully!" });
      return true; 
    } catch (error: any) {
      toast({
        title: "Export Error",
        description: error?.message || "Failed to export attendance data",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (cachedRecords.length) {
      dispatch(setRecords(cachedRecords));
    }
  }, [cachedRecords, dispatch]);

  return {
    attendanceRecords,
    cachedRecords,
    companyAttendanceSummary,
    adminAttendanceReport,
    exportedAttendanceData,
    isLoading: {
      historyLoading,
      summaryLoading,
      adminReportLoading,
      exportLoading,
      biometryCheckInLoading,
      biometryCheckOutLoading,
      manualCheckInLoading,
      manualCheckOutLoading,
    },
    error: {
      historyError,
      summaryError,
      adminReportError,
      exportError,
    },
    handleBiometryCheckIn,
    handleBiometryCheckOut,
    handleManualCheckIn,
    handleManualCheckOut,
    handleExportAttendance,
    refetchAttendanceHistory,
  };
};
