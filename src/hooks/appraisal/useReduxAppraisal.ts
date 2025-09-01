/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useCreateAppraisalRequestMutation,
  useApproveAppraisalRequestMutation,
  useRejectAppraisalRequestMutation,
  // useGetAppraisalApprovalQueueQuery,
  useGetEmployeeByDepartmentQuery,
  useUpdateAppraisalRequestMutation,
  useGetAppraisalActivityQuery,
} from "@/store/slices/appraisal/appraisalApi";

import { toast } from "../use-toast";
import { setActivityCache, setActivityPagination, setAppraisalRequests, setIsLoading } from "@/store/slices/appraisal/appraisalSlice";
import { extractErrorMessage } from "@/utils/errorHandler";
import { Appraisal, UseReduxAppraisalReturnType } from "@/types/appraisal";
import { useEffect } from "react";
import { RootState } from "@/store/store";


export const useReduxAppraisal = (): UseReduxAppraisalReturnType => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { activityPagination: pagination, activityFilter: filter , activityCache } = useAppSelector((state: RootState) => state.appraisal);
  const shouldSkip = !user;
  const cachedPageData = activityCache[filter]?.[pagination.page] ?? [];
  const { data: getEmployeeUnderTeamlead = [], isLoading: queueLoading, error: queueErro} =   useGetEmployeeByDepartmentQuery
  (undefined, {
    skip: !user || (user.role !== "teamlead"),
  })
  const {
    data: appraisalActivityResponse,
    isLoading: appraisaActivityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useGetAppraisalActivityQuery(
    {page: pagination.page, limit: pagination.limit,
      status: filter,
    },
    {
      skip: shouldSkip ,
    }
  );
  


  
  // Cache & pagination sync
 useEffect(() => {
  if (appraisalActivityResponse?.pagination) {
    dispatch(setActivityPagination(appraisalActivityResponse.pagination));
  }

  // if (
  //   appraisalActivityResponse?.data &&
  //   !activityCache[filter]?.[pagination.page]
  // ) {
  //   dispatch(
  //     setActivityCache({
  //       page: pagination.page,
  //       status: filter,
  //       data: appraisalActivityResponse.data,
  //     })
  //   );
  // }
  // filter, pagination.page, dispatch, activityCache
}, [appraisalActivityResponse, ]);


  // Update appraisals from cache (immediate UI feedback)
 useEffect(() => {
  const cachedPageData = activityCache[filter]?.[pagination.page] ?? [];
  dispatch(setAppraisalRequests(cachedPageData));
}, [filter, pagination.page, activityCache, dispatch]);

    const appraisalActivity = appraisalActivityResponse?.data ?? [];
    const activityPagination = appraisalActivityResponse?.pagination ?? {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    };


  const [createAppraisalRequest, { isLoading: creatingAppraisal }] =
    useCreateAppraisalRequestMutation();

  const [approveAppraisalRequest, { isLoading: approvingAppraisal }] =
    useApproveAppraisalRequestMutation();

  const [rejectAppraisalRequest, { isLoading: rejectingAppraisal }] =
    useRejectAppraisalRequestMutation();

    const [updateAppraisalRequest, {isLoading: updatingAppraisal}] = useUpdateAppraisalRequestMutation() 

    const handleCreateAppraisalRequest = async (
      data: Partial<Appraisal>
    ): Promise<boolean> => {
      dispatch(setIsLoading(true));
      try {
        await createAppraisalRequest(data).unwrap();
        toast({ title: "Appraisal Request Submitted" });
  
        return true;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error, "Appraisal Request Failed");
        toast({
          title: "Appraisal Request Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } finally {
        dispatch(setIsLoading(false));
      }
    };


  
      // useEffect(() => {
      //   refetchActivity();
      // }, [pagination.page]);

  const handleUpdateAppraisalRequest = async (
    id: string,
    data: Partial<Appraisal>
  ): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await updateAppraisalRequest({ id, ...data }).unwrap();
      toast({ title: "Appraisal Updated Successfully" });

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Update Failed");
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleApproveAppraisalRequest = async (id: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await approveAppraisalRequest({ id }).unwrap();
      toast({ title: "Appraisal Approved" });

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
      dispatch(setIsLoading(false));
    }
  };

  const handleRejectAppraisalRequest = async (id: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await rejectAppraisalRequest({ id }).unwrap();
      toast({ title: "Appraisal Rejected" });
    
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
      dispatch(setIsLoading(false));
    }
  };


  return {
    // appraisalApprovalQueue,
    getEmployeeUnderTeamlead,
    appraisalActivity,
    activityPagination,
    cachedPageData,
    
    
    isLoading: {
      // approvalQueueLoading,
      creatingAppraisal,
      approvingAppraisal,
      rejectingAppraisal,
      updatingAppraisal,
      appraisaActivityLoading
    },
    error: {
      // approvalQueueError,
      activityError

    },
    handleCreateAppraisalRequest,
    handleApproveAppraisalRequest,
    handleRejectAppraisalRequest,
    handleUpdateAppraisalRequest,
    // refetchApprovalQueue,
    refetchActivity
  };
};
