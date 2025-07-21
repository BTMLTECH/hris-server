/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useCreateHandoverMutation,
  useDeleteHandoverByIdMutation,
  useGetMyHandoverReportQuery,
  useTeamGetHandoverReportByDepartmentQuery,

} from "@/store/slices/handover/handoverApi";

import { toast } from "../use-toast";

import {
  clearHandoverState,
  setIsLoading,
} from "@/store/slices/handover/handoverSlice";

import { HandoverContextType } from "@/types/handover";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export const useReduxHandover = (): HandoverContextType => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [createHandoverMutation, { isLoading: createLoading }] =
    useCreateHandoverMutation();

const [deleteHandoverById, { isLoading: deleteLoading }] =   useDeleteHandoverByIdMutation();

  const {
    data: myReports,
    isLoading: myReportsLoading,
    error: myReportsError,
    refetch: refetchMyReports,
  } = useGetMyHandoverReportQuery(undefined, {
    skip: !user || user?.role !== "employee",
  });

  const {
    data: teamReports,
    isLoading: teamReportsLoading,
    error: teamReportsError,
    refetch: refetchTeamReports,
  } = useTeamGetHandoverReportByDepartmentQuery(undefined, {
    skip: !user || user?.role !== "teamlead",
  });

  const createHandover = async (formData: any): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await createHandoverMutation(formData).unwrap();
      toast({
        title: "Report submitted successfully",
        description: "Your handover report has been created.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Submit Error",
        description: error?.data?.message || "Failed to submit handover report",
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };


const deleteHandover = async (id: string): Promise<boolean> => {
  dispatch(setIsLoading(true));
  try {
    await deleteHandoverById(id).unwrap();
    toast({
      title: 'Deleted',
      description: 'Handover report deleted successfully.',
    });
    return true;
  } catch (error: any) {
    toast({
      title: 'Delete Error',
      description: error?.data?.message || 'Failed to delete handover report',
      variant: 'destructive',
    });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};


  return {
    createHandover,
    deleteHandover,
    myReports,
    myReportsLoading,
    teamReports,
    teamReportsLoading,
    refetchMyReports,
    refetchTeamReports,
    clearHandoverState: () => dispatch(clearHandoverState()),
  };
};
