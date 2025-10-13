/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FeedbackAnswer,
  PaginatedTrainingsResponse,
  Training,
} from "@/types/training";
import { apiSlice } from "../auth/apiSlice";

export const trainingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new training
    createTraining: builder.mutation<Training, Partial<Training>>({
      query: (body) => ({
        url: "training/create",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Trainings"],
    }),

    // Submit feedback for a training
    submitFeedback: builder.mutation<
      Training,
      { id: string; answers: FeedbackAnswer[]; additionalComments?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `training/${id}`,
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Trainings"],
    }),

    // Get trainings for logged-in user
    getMyTrainings: builder.query<Training[], void>({
      query: () => ({
        url: "training/get",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Trainings"],
    }),

    // Get all trainings (with pagination & optional department filter)
    getAllTrainings: builder.query<
      PaginatedTrainingsResponse,
      { page?: number; limit?: number; department?: string }
    >({
      query: ({ page = 1, limit = 30, department }) => {
        let url = `training/get-all?page=${page}&limit=${limit}`;
        if (department) url += `&department=${department}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: ["Trainings"],
    }),
  }),
});

export const {
  useCreateTrainingMutation,
  useSubmitFeedbackMutation,
  useGetMyTrainingsQuery,
  useGetAllTrainingsQuery,
} = trainingApi;
