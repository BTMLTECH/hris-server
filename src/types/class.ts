export interface IClassLevelInput {
  year?: string;
  level?: string;
  payGrade?: string;
  band?: string;
  basicSalary?: number;
  housingAllowance?: number;
  transportAllowance?: number;
}



export interface PayrollResult {
  totalAllowances: number;
  grossSalary: number;
  pension: number;
  CRA: number;
  taxableIncome: number;
  tax: number;
  netSalary: number;
  taxBands: any[];
}

export interface ClassResponse {
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  totalAllowances: number;
  payrollResult: PayrollResult;
}



export interface ClassResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classResponse: ClassResponse | null;
  newRecord: IClassLevelInput;
  setNewRecord: (record: IClassLevelInput) => void;
  onAddClass: () => void;
  dispatch: any;
  bandIsLoading: boolean
  
}

export interface ClassContextType {
  isLoading: boolean;
  error: any;
 handleCreateClassLevel: (input: IClassLevelInput) => Promise<boolean>;
 bulkUploadClass: (formData: FormData) => Promise<boolean>;
  handleUpdateClassLevel: (id: string) => Promise<boolean>;
  handleCalculateClass: (band: string) => Promise<any | null>;
  bulkDeleteClass: (year: string) => Promise<boolean>;

}