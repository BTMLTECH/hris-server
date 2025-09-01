
import React from 'react';
import DashboardOverview from './DashboardOverview';
import EmployeeManagement from '../Employee/EmployeeManagement';
import AttendanceManagement from '../Attendance/AttendanceManagement';
import LeaveManagement from '../Leave/LeaveManagement';
import TrainingManagement from '../Training/TrainingManagement';
import PayrollManagement from '../Payroll/PayrollManagement';
import PerformanceManagement from '../Performance/PerformanceManagement';
import RecruitmentManagement from '../Recruitment/RecruitmentManagement';
import DocumentManagement from '../Documents/DocumentManagement';
import HandoverManagement from '../Handover/HandoverManagement';
import TimeTrackingManagement from '../TimeTracking/TimeTrackingManagement';
import Reports from './Reports';
import Analytics from './Analytics';
import SystemSettings from '../Settings/SystemSettings';
import LoanManagement from '../Loan/LoanManagement';
import AppraisalManagement from '../Appraisal/AppraisalManagement';
import UserProfile from '../Profile/UserProfile';
import { Cooperative } from '../Contribution/ContributionManagement';


interface DashboardContentProps {
  activeItem: string;
  onNavigate: (section: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeItem, onNavigate }) => {

  switch (activeItem) {
    case 'dashboard':
      return <DashboardOverview onNavigate={onNavigate} />;
    case 'employees':
      return <EmployeeManagement />;
    case 'attendance':
      return <AttendanceManagement />;
    case 'leave':
      return <LeaveManagement />;
    // case 'loan':
    //   return <LoanManagement />;
    case 'appraisal':
      return <AppraisalManagement />;
    // case 'appraisal-approval':
    //   return <AppraisalApprovalQueue />;
    case 'payroll':
      return <PayrollManagement />;
    // case 'performance':
    //   return <PerformanceManagement />;
    // case 'recruitment':
    //   return <RecruitmentManagement />;
    // case 'documents':
    //   return <DocumentManagement />;
    case 'handover':
      return <HandoverManagement />;
    // case 'time-tracking':
    //   return <TimeTrackingManagement />;
    case 'training':
      return <TrainingManagement />;
    case 'cooperative':
      return <Cooperative />;
    case 'analytics':
      return <Analytics />;
    case 'reports':
      return <Reports />;
    // case 'settings':
    //   return <SystemSettings />;
    case 'profile':
      return <UserProfile />;
    default:
      return <DashboardOverview onNavigate={onNavigate} />;
  }
};

export default DashboardContent;
