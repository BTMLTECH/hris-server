import { useState, useEffect } from 'react';
import { Employee, EmployeeStats } from '@/types/employee';

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'System Administrator',
    email: 'admin@hris.com',
    role: 'admin',
    department: 'IT',
    position: 'System Admin',
    status: 'active',
    hireDate: '2020-01-15',
    salary: 95000,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'hr@hris.com',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    status: 'active',
    hireDate: '2021-03-20',
    salary: 75000,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'manager@hris.com',
    role: 'md',
    department: 'Engineering',
    position: 'Team Lead',
    status: 'active',
    hireDate: '2019-08-10',
    salary: 85000,
  },
  {
    id: '4',
    name: 'Jane Doe',
    email: 'employee@hris.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    status: 'active',
    hireDate: '2022-06-15',
    salary: 70000,
  },
  {
    id: '5',
    name: 'Alice Smith',
    email: 'alice@hris.com',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'active',
    hireDate: '2023-01-10',
    salary: 55000,
  },
  {
    id: '6',
    name: 'Bob Johnson',
    email: 'bob@hris.com',
    role: 'employee',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'inactive',
    hireDate: '2021-11-05',
    salary: 50000,
  },
];

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployees(mockEmployees);
      const totalEmployees = mockEmployees.length;
      const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
      const newHires = mockEmployees.filter(emp => {
        const hireDate = new Date(emp.hireDate);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return hireDate > threeMonthsAgo;
      }).length;

      const departments: Record<string, number> = {};
      const roleDistribution: Record<string, number> = {};

      mockEmployees.forEach(emp => {
        departments[emp.department] = (departments[emp.department] || 0) + 1;
        roleDistribution[emp.role] = (roleDistribution[emp.role] || 0) + 1;
      });

      setStats({
        totalEmployees,
        activeEmployees,
        newHires,
        departments,
        roleDistribution,
      });
      
      setIsLoading(false);
    };

    loadEmployees();
  }, []);

  return {
    employees,
    stats,
    isLoading,
  };
};
