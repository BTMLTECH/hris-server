/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ICompany, IOnboardingRequirement, User } from "./auth";
import { SerializedError } from "@reduxjs/toolkit";
import { Department } from "./department";

type DepartmentCache = Record<number, IDepartment[]>;
type ClassLevelCache = Record<number, IClassLevel[]>;



export interface IDepartment {
  name?: string;
  supervisor?: string;
  sopDocument?: string; 
  company?: string;
  _id: string
}

export interface IClassLevel {
  year: number;
  level: number;
  payGrade: string;
  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  lasgAllowance?: number;
  twentyFourHoursAllowance?: number;
  healthAllowance?: number;
  otherAllowance?: number;
  totalAllowances?: number;
  grossSalary?: number;
  createdAt: Date;
  updatedAt: Date;
  company: string
}

export interface ISalaryByDept {
  department: string;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  employees: number;
}

export interface ISalaryByRole {
  role: string;
  avgSalary: number;
  count: number;
  fill: string;
}

// Interface for Leave Analytics
export interface ILeaveAnalytics {
  type: string;
  used: number;
  total: number;
  fill: string;
}

// Interface for Hiring Trend
export interface IHiringTrend {
  month: string;
  hires: number;
  terminations: number;
}

// Interface for Attendance
export interface IAttendance {
  month: string;
  attendance: number;
}

// Interface for Chart Configuration
export interface IChartConfig {
  key: string;
  label: string;
  color: string;
}


export interface IBirthdayAnalytics {
  month: string;
  celebrants: [
    {
      staffId: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      profileImage: string;
    }
  ];
}

// Interface for Key Metrics
export interface IKeyMetrics {
  employeeGrowth: {
    value: number;
    trend: string;
  };
  avgSalary: {
    value: number;
    trend: string;
  };
  leaveUtilization: {
    value: number;
    trend: string;
  };
}

// Interface for Dashboard Cards
export interface IDashboardCards {
  totalEmployees: {
    value: number;
    trend: string;
  };
  activeLeave: {
    value: number;
    trend: string;
  };
  appraisalsDue: {
    value: number;
    trend: string;
  };
  completedTasks: {
    value: number;
    trend: string;
  };
}

// Interface for Recent Activity
export interface IRecentActivity {
  message: string;
  timestamp: Date;
  type: string;
}

export interface IAnalytics {
  company: string;
  salaryDistributionByDept: ISalaryByDept[];
  salaryDistributionByRole: ISalaryByRole[];
  leaveTypesData: ILeaveAnalytics[];
  hiringTrends: IHiringTrend[];
  attendanceData: IAttendance[];
  chartConfig: IChartConfig[];
  birthdayAnalytics: IBirthdayAnalytics[];
  keyMetrics: IKeyMetrics;
  dashboardCards: IDashboardCards;
  recentActivity: IRecentActivity[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProfileFormData {
  _id?: string;
  staffId: string;
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  address: string;
  city: string;
  mobile: string;
  email: string;
  message?: string;
  biometryId?: string;
  profileImage?: string;
  position: string; 
  officeBranch: string;
  employmentDate: string;
  accountInfo: {
    classLevel: string; 
    basicPay: number;
    allowances: number;
    bankAccountNumber: string;
    bankName: string;
    taxNumber?: string;
    pensionCompany?: string;
    pensionNumber?: string;
  };
  role: 'md' | 'teamlead' | 'employee' | 'admin' | 'hr';
  company?: ICompany;
  status?: 'active' | 'inactive' | 'terminated';
  terminationDate?: string;
  isActive?: boolean;
  failedLoginAttempts?: number;
  lockUntil?: string;
  resetRequested?: boolean;
  resetRequestedAt?: string;
  twoFactorEnabled?: boolean;
  twoFactorCode?: string;
  twoFactorExpiry?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  cooperative?: {
    monthlyContribution: number;
    totalContributed: number;
    lastContributionDate?: string;
  };
  createdAt?: string;
  nextOfKin: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  sendInvite?: boolean;
  selectedDepartment: string,
  department: string;
  departmentName: string;
  departments: IDepartment[];
  classlevels: IClassLevel[];
  requirements: IOnboardingRequirement[];  
}

export interface EmployeeCache {
  [page: number]: ProfileFormData[];
}
export interface ProfileState {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  bulkEmployees: Partial<ProfileFormData>[];
  classlevel: IClassLevel[];
  analytics: IAnalytics,
  formData: ProfileFormData;  
  isBulkImportOpen: boolean;
  isDialogOpen:boolean;
  selectedEmployee: ProfileFormData | null;
  showDetailView: boolean;
  searchTerm: string;
  filterDepartment: string;
  isProcessingBulk: boolean;
  isEditMode: boolean
  selectedDeleteId: string
  isDeleteDialogOpen: boolean;
  profilePagination: Pagination;
  departmentsPagination: Pagination;
  profileCache: EmployeeCache;
  departmentsCache: DepartmentCache;
  classlevelPagination: Pagination;
  classlevelCache: ClassLevelCache;
  company?: string,
  selectedActionId: string | null,
  selectedActionType: 'delete' | 'terminate' | 'activate' | 'training-feedback' | 'cooperative-staff' | 'resend-invite' | 'toggle-status' | null,
  isActionDialogOpen: boolean,
  isManageDialogOpen: boolean,

}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    data: User;

  };
}
export interface PaginatedProfilesResponse {
  success: boolean;
  data: {
    data: ProfileFormData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
    count: number;
  };
}

export interface ProfileContextType {
  profile: ProfileFormData | null;  
  isProfileLoading: boolean;  
   profileError: string | null;  
   uploadIsLoading: boolean; 
    editProfile: (profile: ProfileFormData) => Promise<boolean>;  
    uploadProfile: (formData: FormData) => Promise<boolean>;  
    deleteProfile: (id: string) => Promise<boolean>; 
    profileTerminate: (id: string) => Promise<boolean>; 
    profileActivate: (id: string) => Promise<boolean>; 
}

