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
import { extractErrorMessage } from "@/utils/errorHandler";

export const useReduxHandover = (): HandoverContextType => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [createHandoverMutation] = useCreateHandoverMutation();

const [deleteHandoverById] =   useDeleteHandoverByIdMutation();

  const {
    data: myReports,
    isLoading: myReportsLoading,
    refetch: refetchMyReports,
  } = useGetMyHandoverReportQuery(undefined, {
    skip: !user || user?.role !== "employee",
  });

  const {
    data: teamReports,
    isLoading: teamReportsLoading,
    refetch: refetchTeamReports,
  } = useTeamGetHandoverReportByDepartmentQuery(undefined, {
    skip: !user,
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
      const errorMessage = extractErrorMessage(error, 'Failed to submit handover report');      
      toast({
        title: "Submit Error",
        description: errorMessage,
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
      const errorMessage = extractErrorMessage(error, 'Failed to delete handover report');      

    toast({
      title: 'Delete Error',
      description: errorMessage,
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
