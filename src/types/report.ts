
export const departmentMap: Record<string, string> = {
  "Business Management": "md",
  "Human Resources & Admin": "hr",
  "Accounts Department": "account",
  "Protocol and Shared Services": "admin",
  "Operations": "operation",
  "Operations - SHELL SBU": "operationsbu",
  "Information Technology & MIS": "it",
  "Corporate Sales": "corporate",
  "Sourcing": "sou",
  "Channel sales": "channel",
  "Retail Sales": "retail",
  "Regional Office": 'roaghi',
  "Regional Office - Ghana": 'rgogh',

};
export const reverseDepartmentMap: Record<string, string> = Object.fromEntries(
  Object.entries(departmentMap).map(([key, value]) => [value, key])
);




export interface GenerateReportDTO {
  reportType?: 'employee_summary' | 'department_analysis' | 'attendance_report' | 'payroll_summary' | 'performance_metrics';
  dateRange?:'daily' | 'last_7_days' | 'last_30_days' | 'last_quarter' | 'last_year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  department?: string;
  exportFormat?: 'pdf' | 'excel' | 'csv';
  company: string;
  generatedBy: string; 
}


export interface ReportContextType {
  selectedReport: string;
  dateRange: string;
  department: string;
  isGenerating: boolean;
  showCustomDatePicker: boolean;
  customStartDate: string | null;
  customEndDate: string | null;
  data: any | null;
  isLoading: boolean;
  error: any;
  handleSetSelectedReport: (value: string) => void;
  handleSetDateRange: (value: string) => void;
  handleSetDepartment: (value: string) => void;
  handleSetCustomStartDate: (value: string | null) => void;
  handleSetCustomEndDate: (value: string | null) => void;
  handleGenerateReport: (payload: GenerateReportDTO) => Promise<boolean>;
  handleClearReport: () => void;
}