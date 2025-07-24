/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useCreateLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useGetLeaveApprovalQueueQuery,
  useGetLeaveActivityFeedQuery,
  useGetTeamLeadQuery,
  useGetStatOverviewQuery,
} from "@/store/slices/leave/leaveApi";
 
import { toast } from "../use-toast";
import { setLoading } from "@/store/slices/leave/leaveSlice";
import { LeaveRequest, UseReduxLeaveReturnType } from "@/types/leave";
import { extractErrorMessage } from "@/utils/errorHandler";



export const useReduxLeave = (): UseReduxLeaveReturnType => {
  const dispatch = useAppDispatch();

  const {user }= useAppSelector((state) => state.auth); // Replace with correct path


  const {
    data: leaveApprovalQueue = [],
    isLoading: approvalQueueLoading,
    error: approvalQueueError,
    refetch: refetchApprovalQueue,
  } = useGetLeaveApprovalQueueQuery(undefined, {
      skip: !user || (user.role !== "teamlead" && user.role !== "hr"),
  });

  const {
    data: leaveActivityFeed = [],
    isLoading: activityFeedLoading,
    error: activityFeedError,
    refetch: refetchActivityFeed,
  } = useGetLeaveActivityFeedQuery(undefined, {
     skip: !user,
  });

  const {
    data: teamlead = [],
    isLoading: teamleadLoading,
    error: teamleadError,
    refetch: refetchTeamlead,
  } = useGetTeamLeadQuery(undefined, {
       skip: !user || (user.role !== "teamlead" && user.role !== "hr"),
  });

  const {
    data = {},
    isLoading: statLoading,
    error: statError,
    refetch: refetchStats,
  } = useGetStatOverviewQuery(undefined, {
     skip: !user,
  });

  const [createLeaveRequest, { isLoading: creatingLeave }] = useCreateLeaveRequestMutation();
  const [approveLeaveRequest, { isLoading: approvingLeave }] = useApproveLeaveRequestMutation();
  const [rejectLeaveRequest, { isLoading: rejectingLeave }] = useRejectLeaveRequestMutation();

  const handleCreateLeaveRequest = async (data: any): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await createLeaveRequest(data).unwrap();
      toast({ title: "Leave Request Submitted" });
      refetchActivityFeed();
      refetchApprovalQueue();
      return true;
    } catch (error: any) {
          const errorMessage = extractErrorMessage(error, 'Leave Request Failed');
      
      toast({
        title: "Leave Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleApproveLeaveRequest = async (id: string): Promise<boolean> => {
    dispatch(setLoading(true));

    try {
      await approveLeaveRequest(id).unwrap();
      toast({ title: "Leave Approved" });
      refetchApprovalQueue();
      refetchActivityFeed();
      return true;
    } catch (error: any) {
          const errorMessage = extractErrorMessage(error, 'Approval Failed');

      toast({
        title: "Approval Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }finally {
      dispatch(setLoading(false));
    }
  };

  const handleRejectLeaveRequest = async (id: string, note: string): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await rejectLeaveRequest({id, note}).unwrap();  
      toast({ title: "Leave Rejected" });
      refetchApprovalQueue();
      refetchActivityFeed();
      return true;
    } catch (error: any) {
          const errorMessage = extractErrorMessage(error, 'Rejection Failed');

      toast({
        title: "Rejection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }finally {
      dispatch(setLoading(false));
    }
  };

  return {
    leaveApprovalQueue,
    leaveActivityFeed,
    teamlead,
    isLoading: {
      approvalQueueLoading,
      activityFeedLoading,
      creatingLeave,
      approvingLeave,
      rejectingLeave,
      teamleadLoading,
    },
    error: {
      approvalQueueError,
      activityFeedError,
      teamleadError,
    },
    handleCreateLeaveRequest,
    handleApproveLeaveRequest,
    handleRejectLeaveRequest,
    refetchApprovalQueue,
    refetchActivityFeed,
    refetchTeamlead
  };
};
