import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { trainingApi } from "../training/trainingApi";
import {
  FeedbackResponse,
  PaginatedTrainingsResponse,
  Training,
} from "@/types/training";

interface TrainingFormData {
  title: string;
  date: string;
  facilitators: { name: string; email?: string }[];
  department: string;
  noOfTrainees: number;
  participantEmails: string[];
}

interface TrainingState {
  isLoading: boolean;
  error: string | null;
  isDialogOpen: boolean;
  isActionDialogOpen: boolean;

  selectedTraining: Training | null;
  selectedActionId: string | null;
  selectedActionType: "delete" | "feedback" | "view" | "edit" | null;

  trainingCache: Record<number, Training[]>;
  trainingPagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };

  myTrainings: Training[];
  trainingFormData: TrainingFormData;
  feedbackAnswers: Record<string, FeedbackResponse>;
  feedbackComments: string;
}

const initialState: TrainingState = {
  isLoading: false,
  error: null,
  isDialogOpen: false,
  isActionDialogOpen: false,

  selectedTraining: null,
  selectedActionId: null,
  selectedActionType: null,

  trainingCache: {},
  trainingPagination: { total: 0, page: 1, limit: 30, pages: 0 },

  myTrainings: [],
  feedbackAnswers: {},
  feedbackComments: "",
  trainingFormData: {
    title: "",
    date: "",
    facilitators: [{ name: "", email: "" }],
    department: "",
    noOfTrainees: 0,
    participantEmails: [],
  },
};

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setIsActionDialogOpen(state, action: PayloadAction<boolean>) {
      state.isActionDialogOpen = action.payload;
    },
    setSelectedActionId(state, action: PayloadAction<string | null>) {
      state.selectedActionId = action.payload;
    },
    setSelectedActionType(
      state,
      action: PayloadAction<"delete" | "feedback" | "view" | "edit" | null>
    ) {
      state.selectedActionType = action.payload;
    },
    setTrainingFormData(
      state,
      action: PayloadAction<Partial<TrainingFormData>>
    ) {
      state.trainingFormData = { ...state.trainingFormData, ...action.payload };
    },
    setSelectedTraining(state, action: PayloadAction<Training | null>) {
      state.selectedTraining = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setTrainingCache(
      state,
      action: PayloadAction<{ page: number; data: Training[] }>
    ) {
      const { page, data } = action.payload;
      state.trainingCache[page] = data;
    },
    setMyTrainings(state, action: PayloadAction<Training[]>) {
      state.myTrainings = action.payload;
    },
    setTrainingPagination(
      state,
      action: PayloadAction<TrainingState["trainingPagination"]>
    ) {
      state.trainingPagination = action.payload;
    },

    setFeedbackAnswers(
      state,
      action: PayloadAction<Record<string, FeedbackResponse>>
    ) {
      state.feedbackAnswers = action.payload;
    },
    setFeedbackComments(state, action: PayloadAction<string>) {
      state.feedbackComments = action.payload;
    },
    resetFeedback(state) {
      state.feedbackAnswers = {};
      state.feedbackComments = "";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      trainingApi.endpoints.getAllTrainings.matchFulfilled,
      (state, action: PayloadAction<PaginatedTrainingsResponse>) => {
        console.log("action", action);
        const trainings = action.payload.data.data;
        console.log("trainings", trainings);
        const pagination = action.payload.data.pagination;
        const page = pagination.page;
        state.trainingCache[page] = trainings;
        state.trainingPagination = pagination;
      }
    );

    builder.addMatcher(
      trainingApi.endpoints.getMyTrainings.matchFulfilled,
      (state, action: PayloadAction<Training[]>) => {
        state.myTrainings = action.payload;
      }
    );

    builder.addMatcher(
      trainingApi.endpoints.createTraining.matchFulfilled,
      (state, action: PayloadAction<Training>) => {
        if (state.trainingCache[1]) {
          state.trainingCache[1] = [action.payload, ...state.trainingCache[1]];
        }
      }
    );

    builder.addMatcher(
      trainingApi.endpoints.submitFeedback.matchFulfilled,
      (state, action: PayloadAction<Training>) => {
        const updated = action.payload;
        Object.keys(state.trainingCache).forEach((page) => {
          state.trainingCache[+page] = state.trainingCache[+page].map((t) =>
            t._id === updated._id ? updated : t
          );
        });

        state.myTrainings = state.myTrainings.map((t) =>
          t._id === updated._id ? updated : t
        );

        state.feedbackAnswers = {};
        state.feedbackComments = "";
      }
    );
  },
});

export const {
  setIsDialogOpen,
  setIsActionDialogOpen,
  setSelectedActionId,
  setSelectedActionType,
  setSelectedTraining,
  setLoading,
  setError,
  setTrainingCache,
  setMyTrainings,
  setTrainingFormData,
  setTrainingPagination,
  setFeedbackAnswers,
  setFeedbackComments,
  resetFeedback,
} = trainingSlice.actions;

export default trainingSlice.reducer;
