
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'md' | 'employee';
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'terminated';
  hireDate: string;
  salary?: number;
  managerId?: string;
  phone?: string;
  avatar?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  departments: Record<string, number>;
  roleDistribution: Record<string, number>;
}
