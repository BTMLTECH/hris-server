// features/cooperative/types.ts

export type CooperativeCache = Record<number, ICooperativeContributionInput[]>;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UserContribution {
  staffId?: string
  firstName? : string
  lastName ?:string
  department?:string

}

export interface ICooperativeContributionInput {
  _id?: string;
  user?: UserContribution;
  companyId?: string;
  email?: string;
  receiptUrl?: string;
  message?: string;
  month?: number;
  year?: number;
  status?: "REQUEST" | "APPROVED" | "COLLECTED" | "REJECTED";
  amount?: number;
}

export interface ICooperativeContribution extends ICooperativeContributionInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedCooperativeContributionResponse {
  success: boolean;
  data: {
    count: number;
    data: ICooperativeContribution[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}


export interface ICooperativeContributionListResponse {
  success: boolean;
  message: string;
  data: ICooperativeContribution[];
}

export interface ContributionContextType {
  isLoading: boolean;
  isFetchingContributions: boolean;
  error: any;
  contributions: ICooperativeContribution[];
  allContributions?: ICooperativeContribution[];
  handleHrContribution: (
    input: FormData
  ) => Promise<boolean>;
  handleCreateContribution: (
  contributionId: string
  ) => Promise<boolean>;

  handleUpdateContribution: (
    id: string,
    input: Partial<ICooperativeContributionInput>
  ) => Promise<boolean>;

  handleDeleteContribution: (id: string) => Promise<boolean>;

  refetch: () => void;
}