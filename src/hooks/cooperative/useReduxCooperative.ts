/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/hooks/use-toast";
import {
  useCreateCooperativeContributionMutation,
  useUpdateCooperativeContributionMutation,
  useDeleteCooperativeContributionMutation,
  useGetAllCooperativeContributionsQuery,
  useNotifyHrMutation,
} from "@/store/slices/cooperative/cooperativeApi";
import {
  setIsLoading,
  setCooperativeRecord,
  setContributionPagination,
  setCooperativeCache,
} from "@/store/slices/cooperative/cooperativeSlice";
import { extractErrorMessage } from "@/utils/errorHandler";
import { ContributionContextType, ICooperativeContributionInput } from "@/types/cooperation";
import { useEffect } from "react";


export const useReduxContribution = (): ContributionContextType => {
  const dispatch = useAppDispatch();
    const {
      cooperativePagination,
      cooperativeCache,
      isLoading, error, contributions 
    } = useAppSelector((state) => state.cooperative);
  const {user }= useAppSelector((state) => state.auth); 

  const currentCooperativePage = cooperativePagination?.page;
  const cachedCooperative = cooperativeCache[currentCooperativePage] ?? [];


  const [createContribution] = useCreateCooperativeContributionMutation();
  const [updateContribution] = useUpdateCooperativeContributionMutation();
  const [deleteContribution] = useDeleteCooperativeContributionMutation();
  const [notifyHr] = useNotifyHrMutation();



  const {
    data: allContributions,
    isLoading: isFetchingContributions,
    refetch,
  } = useGetAllCooperativeContributionsQuery(undefined, {
     skip: !user,
  });


      useEffect(() => {
        if (allContributions?.data) {
          const { pagination, data: users } = allContributions.data;
  
          if (pagination) {
            dispatch(setContributionPagination(pagination));
          }
  
          if (users && !cachedCooperative[pagination.page]) {
            dispatch(setCooperativeCache({ page: pagination.page, data: users }));
          }
        }
      }, [allContributions, dispatch, cachedCooperative]);
  

  const handleHrContribution = async (
     input: FormData
  ): Promise<boolean> => {
    try {
      dispatch(setIsLoading(true));
      await notifyHr(input).unwrap();
      toast({ title: "Hr has been notified successfully!" });
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(
        err,
        "Notifying Hr failed"
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  const handleCreateContribution = async (
  contributionId: string
  ): Promise<boolean> => {
    try {
      dispatch(setIsLoading(true));
      await createContribution(contributionId).unwrap();
      toast({ title: "Contribution created successfully!" });
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(
        err,
        "Contribution creation failed"
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleUpdateContribution = async (
    id: string,
    input: Partial<ICooperativeContributionInput>
  ): Promise<boolean> => {

    try {
      dispatch(setIsLoading(true));
      await updateContribution({ id, ...input }).unwrap();
      toast({ title: "Contribution updated successfully!" });
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, "Update failed");
      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleDeleteContribution = async (id: string): Promise<boolean> => {
    try {
      dispatch(setIsLoading(true));
      await deleteContribution(id).unwrap();
      toast({ title: "Contribution deleted successfully!" });
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, "Delete failed");
      toast({
        title: "Delete Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return {
    isLoading,
    isFetchingContributions,
    error,
    contributions,
    allContributions,
    refetch,
    handleHrContribution,
    handleCreateContribution,
    handleUpdateContribution,
    handleDeleteContribution,
  };
};
