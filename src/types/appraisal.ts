
export interface AppraisalObjective {
  id: string;
  category: 'OBJECTIVES' | 'FINANCIAL' | 'CUSTOMER' | 'INTERNAL_PROCESS' | 'LEARNING_AND_GROWTH';
  name: string;
  marks: number;
  kpi: string;
  measurementTracker: string;
  employeeScore: number;
  teamLeadScore: number;
  finalScore: number;
  employeeComments: string;
  teamLeadComments: string;
  evidence?: string;
}

export interface AppraisalScoringProps {
  appraisal: Appraisal & {
    _id?: string;
    hrAdjustments?: {
      innovation: boolean;
      commendation: boolean;
      query: boolean;
      majorError: boolean;
    };
  };
  canReviewAppraisal: boolean;
  isEmployee: boolean;
  isLoading: boolean;
  hr: boolean;
  teamlead: boolean;
  loading: (id: string, action: string) => boolean;
  objectives: AppraisalObjective[];
  onBack: () => void;
  onSubmit: (
    appraisal: Appraisal & {
      hrAdjustments?: {
        innovation: boolean;
        commendation: boolean;
        query: boolean;
        majorError: boolean;
      };
    },
    action:
      | 'pending'
      | 'submitted'
      | 'approved'
      | 'needs_revision'
      | 'sent_to_employee'
      | 'rejected'
      | 'update'
  ) => void;

  // ✅ NEW props
  hrAdjustments: {
    innovation: boolean;
    commendation: boolean;
    query: boolean;
    majorError: boolean;
  };
  setHrAdjustments: React.Dispatch<
    React.SetStateAction<{
      innovation: boolean;
      commendation: boolean;
      query: boolean;
      majorError: boolean;
    }>
  >;
}



export interface IAppraisalReviewTrail {
  reviewer: string;
  role: string;
  action: 'approved' | 'rejected';
  date: Date;
  note?: string;
  marksGiven?: number;
}
export interface Appraisal {
  _id?: string;
  employeeId?: string;
  employeeName?: string;
  employeeLastName?: string;
  department?: string;
  teamLeadId: string;
  teamLeadName: string;
  title: string;
  period: string;
  dueDate: string;
  status: 'pending'
  | 'approved'
  | 'rejected'
  | 'sent_to_employee'
  | 'needs_revision'
  | 'submitted'
  | 'update';
  objectives: AppraisalObjective[];
  reviewLevel?:'teamlead' | 'hr' | 'relievers';
  reviewTrail?: IAppraisalReviewTrail[]
  createdAt: string;
  updatedAt: string;
  typeIdentify?:'appraisal'
  totalScore: {
    employee: number;
    teamLead: number;
    final: number;
  };
  revisionReason?: string;
  hrAdjustments?: {
    innovation: boolean;
    commendation: boolean;
    query: boolean;
    majorError: boolean;
  };
}

export interface AppraisalTemplate {
  id: string;
  name: string;
  objectives: Omit<AppraisalObjective, 'id' | 'employeeScore' | 'teamLeadScore' | 'finalScore' | 'employeeComments' | 'teamLeadComments' | 'evidence'>[];
}


export interface UseReduxAppraisalReturnType {
  // appraisalApprovalQueue: Appraisal[];
  getEmployeeUnderTeamlead:Appraisal[];
  appraisalActivity: Appraisal[];
  cachedPageData: Record<number, Appraisal[]>;
  activityPagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  isLoading: {
    // approvalQueueLoading: boolean;
    creatingAppraisal: boolean;
    approvingAppraisal: boolean;
    rejectingAppraisal: boolean;
    updatingAppraisal: boolean;
    appraisaActivityLoading: boolean;    
  };

  handleCreateAppraisalRequest: (data: Partial<Appraisal>) => Promise<boolean>;
  handleUpdateAppraisalRequest: (id: string, data: Partial<Appraisal>) => Promise<boolean>;
  handleApproveAppraisalRequest: (id: string) => Promise<boolean>;
  handleRejectAppraisalRequest: (id: string) => Promise<boolean>;
  // refetchApprovalQueue: () => void;
  refetchActivity: () => void;
}
