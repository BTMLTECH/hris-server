// Match your Mongoose schema

export type FeedbackResponse =
  | "AGREE"
  | "STRONGLY AGREE"
  | "DISAGREE"
  | "AVERAGE"
  | "EXCELLENT";

export interface FeedbackAnswer {
  question: string;
  response: FeedbackResponse;
}

export interface Feedback {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  };
  department: string;
  answers: FeedbackAnswer[];
  additionalComments?: string;
  submittedAt?: string; 
  status: "pending" | "submitted";
}

export interface Training {
  _id: string;
  title: string;
  date: string | Date;
  trainer: string;
  department: string;
  noOfTrainees: number;
  participants?: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    department: string;
    position?: string;
    role: string;
    staffId: string;
    status: string;
  }[];
  participantEmails?: string[];
  questions: string[];
  feedbacks?: any[];
  status?: string
}


export interface TrainingPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedTrainingsResponse {
  success: boolean;
  data: {
    data: Training[];
    pagination: TrainingPagination;
    count: number;
  };
}




export interface TrainingContextType {
  isTrainingLoading: boolean;
  trainingError: string | null;
  trainingCache: Record<number, Training[]>;
  trainingPagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  myTrainings: Training[] | null;

  createTraining: (training: Partial<Training>) => Promise<boolean>;
  submitFeedback: (
    id: string,
    answers: FeedbackAnswer[],
    additionalComments?: string
  ) => Promise<boolean>;
}