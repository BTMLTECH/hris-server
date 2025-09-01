import { FundType } from "@/data/pfa";
import { User } from "./auth";
import { ProfileFormData } from "./user";


export interface Branding {
  displayName: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string; 
}

export interface Employee {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string; 
  department: string; 
  _id: string;
}

export interface Company {
  branding: Branding
}

export interface PensionFundState {
  selectedPFA: string | null;
  selectedFund: string | null;
  fundRate: number | null;
}

export interface ITaxBand {
  band: number;
  amount: number;
}


export interface ITaxInfo {
  payrollId: string;   
  employeeId: string;  
  companyId: string;   
  CRA: number;
  pension: number;
  taxableIncome: number;
  tax: number;
  bands: ITaxBand[];
  createdAt: Date;
}


export interface IPayroll {
  _id?: string;
  email: string;
  user?: User | ProfileFormData;
  company?: Company;
  month: string;
  year: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  lasgAllowance: number;
  twentyFourHoursAllowance: number;
  healthAllowance: number;
  totalAllowances?: number;
  grossSalary?: number;
  pension?: number ;
  CRA?: number;
  taxableIncome?: number;
  tax?: number;
  deductions: number;
  netSalary?: number;
  status?: 'pending' | 'draft' | 'processed' | 'reversed' | 'paid';
  paidDate?: Date;
  createdAt?: Date;
  taxBands?: ITaxBand[];
  employeeName?: string;
   employee?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  taxInfo?: ITaxInfo | null;  
}




export interface TaxBand {
  band: number;    
  amount: number;  
}


export interface IPayrollDTO {
  _id?: string;
  user: User;               
  classLevel?: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  CRA: number;
  pension: number;
  taxableIncome: number;
  tax: number;
  netSalary: number;
  taxBands: TaxBand[];
  month: number;               
  year: number;               
  createdAt?: Date;
  updatedAt?: Date;
}


export interface PayrollResponse {
  count: number;
  data: IPayroll[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    month?: string;
    year?: string
    search?: string
  };
  timestamp?: number
}


export type PayrollWrapper = {
  count: number;
  data: IPayroll[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    month?: string;
    year?: string;
    search?:string
  };
  timestamp?: number
};

export function extractPayrollArray(
  input: IPayroll[] | PayrollWrapper | null | undefined
): IPayroll[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if ('data' in input && Array.isArray(input.data)) return input.data;
  return [];
}


export interface PayrollPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PayrollContextType {
  cachedPayrolls: IPayroll[];
  cachedPayrollData: PayrollResponse;
  payrollPagination: PayrollPagination;
  isLoading: boolean;
  error: string | null;  
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedPayroll: IPayroll | null;
  selectedDeleteId: string | null;
  deletePayroll: (_id: string) => Promise<boolean>;
  draftPayroll: (payrollId: string) => Promise<boolean>;
  paidPayroll: (payrollId: string) => Promise<boolean>;
  processSinglePayroll: (payrollId: string) => Promise<boolean>;
  reverseSinglePayroll: (payrollId: string) => Promise<boolean>;
  processBulkPayroll: (month: string | number, year: string | number) => Promise<boolean>;
  reverseBulkPayroll: (month: string | number, year: string | number) => Promise<boolean>;
  payrollsAsDraftBulk: (month: string | number, year: string | number) => Promise<boolean>;
  payrollAsPayBulk: (month: string | number, year: string | number) => Promise<boolean>;
  setIsDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setSelectedPayroll: (payroll: IPayroll | null) => void;
  setSelectedDeleteId: (id: string | null) => void;
  refetchPayrolls: () => void;
  clearPayrollCache: () => void;
}


