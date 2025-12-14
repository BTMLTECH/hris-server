/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pagination } from "./user";

export const departmentMap: Record<string, string> = {
  "Business Management": "md",
  "Human Resources & Admin": "hr",
  "Accounts Department": "account",
  "Protocol and Shared Services": "admin",
  Operations: "operation",
  "Operations - SHELL SBU": "operationsbu",
  "Information Technology & MIS": "it",
  "Corporate Sales": "corporate",
  Sourcing: "sou",
  "Channel sales": "channel",
  "Retail Sales": "retail",
  "Marketing": "marketing",
  "Regional Office": "roaghi",
  "Regional Office - Ghana": "rgogh",
};
export const reverseDepartmentMap: Record<string, string> = Object.fromEntries(
  Object.entries(departmentMap).map(([key, value]) => [value, key])
);

export interface GenerateReportDTO {
  reportType?:
    | "employee_summary"
    | "department_analysis"
    | "attendance_report"
    | "payroll_summary"
    | "performance_metrics";
  dateRange?:
    | "daily"
    | "last_7_days"
    | "last_30_days"
    | "last_quarter"
    | "last_year"
    | "custom";
  startDate?: Date;
  endDate?: Date;
  department?: string;
  exportFormat?: "pdf" | "excel" | "csv";
  company: string;
  generatedBy: string;
}

export type ReportTypes = 'quality' | 'operations' | 'comms' | 'it';


export interface ReportUIState {
  reportTitles: Array<string>;
  selectedReport:
    | "employee_summary"
    | "department_analysis"
    | "attendance_report"
    | "payroll_summary"
    | "performance_metrics";
  dateRange:
    | "daily"
    | "last_7_days"
    | "last_30_days"
    | "last_quarter"
    | "last_year"
    | "custom";
  department: string;
  isGenerating: boolean;
  showCustomDatePicker: boolean;
  customStartDate: string | null;
  customEndDate: string | null;
  exportFormat: "pdf" | "excel" | "csv";
  company: string;
}

export const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
};

export interface IOperationReport {
  _id: string;
  consultantName: string;
  shift: "day" | "night";
  clientName: string;
  PNR: string;
  ticketNumber: string;
  details: string;
  company: string;
  createdAt: string;
}

export interface IComms {
  _id: string;
  sender: string;
  receiver: string;
  subject: string;
  message: string;
  dateSent: string;
  status: "sent" | "delivered" | "read";
  company: string;
}

export interface IReport {
  _id: string;
  name: string;
  week: number;
  task: string;
  company: string;
  createdAt: string;
}



export interface IQualityAssurance {
  _id: string;
  agentName: string;
  week: number;
  score: number;
  remarks?: string;
  evaluatedBy?: string;
  company: string;
  createdAt: string;
}

// ✅ Generic cache interface for paginated data
export interface PaginatedCache<T> {
  [page: number]: T[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      search: string;
      department: string;
      status: string;
    };
    count?: number;
  };
}
type ReportCategoryMap = {
  quality: IQualityAssurance[];
  operations: IOperationReport[];
  comms: IComms[];
  it: IReport[];
};

export interface ReportContextType {
  qualityReports: IQualityAssurance[];
  operationsReports: IOperationReport[];
  commsReports: IComms[];
  itReports: IReport[];

  dataMap: ReportCategoryMap;

  loadingMap: Record<keyof ReportCategoryMap, boolean>;
  paginationMap: Record<keyof ReportCategoryMap, Pagination>;
  paginationSetterMap: Record<
    keyof ReportCategoryMap,
    React.Dispatch<React.SetStateAction<Pagination>>
  >;
  totalPagesMap: Record<keyof ReportCategoryMap, number>;
  skeletonMap: Record<keyof ReportCategoryMap, boolean>;
  shouldSearchMap: Record<keyof ReportCategoryMap, boolean>;

  // selectedReport: string;

  // dateRange: string;
  // department: string;
  // isGenerating: boolean;
  // isLoadingReport: boolean;
  // showCustomDatePicker: boolean;
  // customStartDate: string | null;
  // customEndDate: string | null;
  // data: any | null;
  isLoading: boolean;
  // error: any;
  generateLinkReport: (data: ReportTypes) => void;
  createQuality: (data: Partial<IQualityAssurance>) => void;
  createOperation: (data: Partial<IOperationReport>) => void;
  createComms: (data: Partial<IComms>) => void;
  createITReport: (data: Partial<IReport>) => void;
  handleSetSelectedReport: (value: string) => void;
  handleSetDateRange: (value: string) => void;
  handleSetDepartment: (value: string) => void;
  handleSetCustomStartDate: (value: string | null) => void;
  handleSetCustomEndDate: (value: string | null) => void;
  handleGenerateReport: (payload: GenerateReportDTO) => Promise<boolean>;
  handleClearReport: () => void;
}
