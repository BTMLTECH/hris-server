/* eslint-disable no-empty-pattern */
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
  useUpdateLeaveBalanceMutation,
} from "@/store/slices/leave/leaveApi";

import { toast } from "../use-toast";
import {
  setActivityCache,
  setActivityFeedPagination,
  setAllApprovedCache,
  setAllLeavePagination,
  setLoading,
  updateLeaveActivityFeed,
} from "@/store/slices/leave/leaveSlice";
import { UpdateLeaveBalanceBody, UseReduxLeaveReturnType } from "@/types/leave";
import { extractErrorMessage } from "@/utils/errorHandler";
import { useEffect } from "react";
import { connectNotificationSocket } from "../auth/useReduxAuth";
import { normalizeLeaveRequest } from "@/utils/normalize";

export const useReduxLeave = (): UseReduxLeaveReturnType => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const isAuthorized =
    !user ||
    (user.role !== "teamlead" &&
      user.role !== "hr" &&
      user.role !== "employee");
  const { allApprovedPagination, allApprovedCache, activityFeedCache } =
    useAppSelector((state) => state.leave);

  const currentLeavePage = allApprovedPagination?.page ?? 1;
  const cachedApprovedLeave = allApprovedCache?.[currentLeavePage] ?? [];

  const [createLeaveRequest, { isLoading: creatingLeave }] =
    useCreateLeaveRequestMutation();
  const [approveLeaveRequest, { isLoading: approvingLeave }] =
    useApproveLeaveRequestMutation();
  const [rejectLeaveRequest, { isLoading: rejectingLeave }] =
    useRejectLeaveRequestMutation();
  const [updateLeaveBalance] = useUpdateLeaveBalanceMutation();

  const {
    data: leaveApprovalQueue = [],
    isLoading: approvalQueueLoading,
    error: approvalQueueError,
    refetch: refetchApprovalQueue,
  } = useGetLeaveApprovalQueueQuery(undefined, {
    skip: isAuthorized,
  });

  const {
    data: leaveActivityFeedResponse,
    isLoading: activityFeedLoading,
    error: activityFeedError,
  } = useGetLeaveActivityFeedQuery(
    { page: currentLeavePage, limit: allApprovedPagination?.limit ?? 20 },
    {
      skip: !user,
    }
  );

  const {
    data: teamlead = [],
    isLoading: teamleadLoading,
    error: teamleadError,
    refetch: refetchTeamlead,
  } = useGetTeamLeadQuery(undefined, {
    skip: isAuthorized,
  });

  const {} = useGetStatOverviewQuery(undefined, {
    skip: !user,
  });

  useEffect(() => {
    if (!leaveActivityFeedResponse) return;

    if (leaveActivityFeedResponse.allApproved) {
      const pagination = leaveActivityFeedResponse.pagination.allApproved;

      dispatch(setAllLeavePagination(pagination));

      if (!allApprovedCache[pagination.page]) {
        dispatch(
          setAllApprovedCache({
            page: pagination.page,
            data: leaveActivityFeedResponse.allApproved,
          })
        );
      }
    }

    if (leaveActivityFeedResponse.myRequests) {
      const pagination = leaveActivityFeedResponse.pagination.myRequests;

      dispatch(setActivityFeedPagination(pagination));

      if (!activityFeedCache[pagination.page]) {
        dispatch(
          setActivityCache({
            page: pagination.page,
            data: leaveActivityFeedResponse.myRequests,
          })
        );
      }
    }
  }, [
    leaveActivityFeedResponse,
    dispatch,
    allApprovedCache,
    activityFeedCache,
  ]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = connectNotificationSocket(user._id.toString());

    socket.on("leave:update", (rawPayload: any) => {
      const normalized = normalizeLeaveRequest(rawPayload);
      dispatch(updateLeaveActivityFeed(normalized));
    });

    return () => {
      socket.off("leave:update");
    };
  }, [user?._id, dispatch]);

  const handleCreateLeaveRequest = async (data: any): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await createLeaveRequest(data).unwrap();
      toast({ title: "Leave Request Submitted" });

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Leave Request Failed");

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

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Approval Failed");

      toast({
        title: "Approval Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRejectLeaveRequest = async (
    id: string,
    note: string
  ): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await rejectLeaveRequest({ id, note }).unwrap();
      toast({ title: "Leave Rejected" });

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Rejection Failed");

      toast({
        title: "Rejection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateLeaveBalance = async (
    id: string,
    body: UpdateLeaveBalanceBody
  ): Promise<boolean> => {
    dispatch(setLoading(true));

    try {
      await updateLeaveBalance({ id, body }).unwrap();
      toast({ title: "Leave Approved" });

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Approval Failed");

      toast({
        title: "Approval Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    leaveApprovalQueue,
    // leaveActivityFeed,
    cachedApprovedLeave,
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
    handleUpdateLeaveBalance,
    refetchTeamlead,
  };
};
