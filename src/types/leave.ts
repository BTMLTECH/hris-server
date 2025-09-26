/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IReliever {
  user: string;
  firstName: string;
  lastName: string;
  status: "Pending" | "Approved" | "Rejected";
  note?: string;
  createdAt?: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "maternity" | "compassionate";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "expired";
  appliedDate: string;
  // Team lead details
  teamlead: string;
  teamleadId?: string;
  teamleadName?: string;
  // Extra leave metadata
  typeIdentify?: "leave";
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  relievers?: IReliever[];
  reviewTrail?: {
    reviewer: string;
    role: "reliever" | "teamlead" | "hr";
    action: "approved" | "rejected";
    date: string;
    note?: string;
  }[];
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  compensation: { total: number; used: number; remaining: number };
  maternity: { total: number; used: number; remaining: number };
}

export interface TeamLead {
  id: string;
  name: string;
  department: string;
}

export interface TeamLeadResponse {
  success: boolean;
  data: TeamLead[];
  cached: boolean;
}

export interface UpdateLeaveBalanceBody {
  leaveType: "annual" | "compassionate" | "maternity";
  balance: number;
  year?: number;
}
export interface UseReduxLeaveReturnType {
  leaveApprovalQueue: LeaveActivityFeedItem[];
  cachedApprovedLeave: LeaveActivityFeedItem[];
  teamlead: TeamLeadResponse;
  isLoading: {
    approvalQueueLoading: boolean;
    activityFeedLoading: boolean;
    creatingLeave: boolean;
    approvingLeave: boolean;
    rejectingLeave: boolean;
    teamleadLoading: boolean;
  };

  error: {
    approvalQueueError: any;
    activityFeedError: any;
    teamleadError: any;
  };

  handleCreateLeaveRequest: (data: any) => Promise<boolean>;
  handleApproveLeaveRequest: (id: string) => Promise<boolean>;
  handleRejectLeaveRequest: (id: string, note: string) => Promise<boolean>;
  handleUpdateLeaveBalance: (
    id: string,
    body: UpdateLeaveBalanceBody
  ) => Promise<boolean>;
  refetchApprovalQueue: () => void;
  refetchTeamlead: () => void;
}

export interface ReviewTrailItem {
  reviewer: string;
  role: string;
  action: "approved" | "rejected" | "pending" | "expired";
  date: string;
  note?: string;
}

export interface RelieverItem {
  user: string;
  firstName: string;
  lastName: string;
  status: "pending" | "approved" | "rejected" | "expired";
}

export interface LeaveActivityFeedItem {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "maternity" | "compassionate";
  startDate: Date | string;
  endDate: Date | string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "expired";
  appliedDate: Date | string;
  teamlead?: string;
  teamleadId?: string;
  teamleadName?: string;
  relievers?: RelieverItem[];
  reviewTrail?: ReviewTrailItem[];
  currentReviewerRole?: "reliever" | "teamlead" | "hr" | null;
  allowance: boolean;
  url: string;
  typeIdentify?: "leave";
}

export interface LeaveActivitySummary {
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
}

export interface LeaveBalanceItem {
  type: "annual" | "maternity" | "compassionate";
  remaining: number;
}

export interface LeaveActivityFeedResponse {
  myRequests: LeaveActivityFeedItem[];
  approvals: LeaveActivityFeedItem[];
  allApproved: LeaveActivityFeedItem[];
  summary: LeaveActivitySummary;
  balance: LeaveBalanceItem[];
  pagination: {
    myRequests: { total: number; page: number; limit: number; pages: number };
    approvals: { total: number; page: number; limit: number; pages: number };
    allApproved?: { total: number; page: number; limit: number; pages: number };
  };
}
