/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  useCreateTrainingMutation,
  useSubmitFeedbackMutation,
  useGetAllTrainingsQuery,
} from "@/store/slices/training/trainingApi";
import { toast } from "../use-toast";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { extractErrorMessage } from "@/utils/errorHandler";
import {
  setLoading,
  setTrainingCache,
  setTrainingPagination,
} from "@/store/slices/training/trainingSlice";
import { TrainingContextType, Training, FeedbackAnswer } from "@/types/training";

export const useReduxTraining = (): TrainingContextType => {
  const dispatch = useAppDispatch();
  const { isLoading, error, trainingPagination, trainingCache, myTrainings } =
    useAppSelector((state) => state.training);

  const [createTrainingMutation] = useCreateTrainingMutation();
  const [submitFeedbackMutation] = useSubmitFeedbackMutation();

  const { data: allTrainingsData, isLoading: allTrainingsLoading } =
    useGetAllTrainingsQuery({
      page: trainingPagination.page,
      limit: trainingPagination.limit,
    });


  useEffect(() => {
    if (allTrainingsData?.data?.data) {
      const trainings: Training[] = allTrainingsData.data.data;
      const pagination = allTrainingsData.data.pagination;
      const page = pagination.page;

      dispatch(setTrainingCache({ page, data: trainings }));
      dispatch(setTrainingPagination(pagination));
    }
  }, [allTrainingsData, dispatch]);


  const createTraining = async (training: Partial<Training>): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await createTrainingMutation(training).unwrap();
      toast({ title: "Training created successfully" });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Failed to create training");
      toast({
        title: "Create Training Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const submitFeedback = async (
    id: string,
    answers: FeedbackAnswer[],
    additionalComments?: string
  ): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await submitFeedbackMutation({ id, answers, additionalComments }).unwrap();
      toast({ title: "Feedback submitted successfully" });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Failed to submit feedback");
      toast({
        title: "Feedback Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    isTrainingLoading: isLoading || allTrainingsLoading ,
    trainingError: error,
    trainingCache,
    trainingPagination,
    myTrainings,
    createTraining,
    submitFeedback,
  };
};
