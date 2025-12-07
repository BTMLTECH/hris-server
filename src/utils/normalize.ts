/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttendanceRecord } from "@/types/attendance";
import {
  LeaveActivityFeedItem,
  LeaveActivityFeedResponse,
  LeaveBalanceItem,
  LeaveRequest,
  RelieverItem,
  ReviewTrailItem,
} from "@/types/leave";
import { IPayroll } from "@/types/payroll";
import { ITaxInfo, PensionFundState } from "@/types/payroll";

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export const normalizeAttendanceRecord = (record: any): AttendanceRecord => {
  const user = record.user ?? {};

  return {
    id: record._id,
    staffId: user.staffId ?? "N/A",
    employeeId: user._id ?? null,
    department: user?.department,
    employeeName:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : "Unknown",
    date: record.date,
    shift: record.shift as "day" | "night",
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    status: (record.status ?? "absent") as
      | "present"
      | "late"
      | "absent"
      | "checked-in",
    hoursWorked:
      typeof record.hoursWorked === "number" ? record.hoursWorked : undefined,
    biometricId: record.biometryId ?? undefined,
  };
};

export const normalizeLeaveRequest = (
  rawLeave: any
): LeaveActivityFeedResponse => {
  const raw = rawLeave?.data ?? rawLeave;
  const getDate = (val: any): string => {
    if (!val) return "";
    const d = val instanceof Date ? val : new Date(val);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  };

  const normalizeFeedItem = (item: any): LeaveActivityFeedItem => {
    let currentReviewerRole: "reliever" | "teamlead" | "hr" | null = null;
    const nextReliever = item.relievers?.find(
      (r: any) => r.status?.toLowerCase() === "pending"
    );
    if (nextReliever) {
      currentReviewerRole = "reliever";
    } else {
      const teamleadApproved = item.reviewTrail?.some(
        (r: any) =>
          r.role === "teamlead" && r.action.toLowerCase() === "approved"
      );
      if (!teamleadApproved) {
        currentReviewerRole = "teamlead";
      } else {
        const hrApproved = item.reviewTrail?.some(
          (r: any) => r.role === "hr" && r.action.toLowerCase() === "approved"
        );
        if (!hrApproved) currentReviewerRole = "hr";
      }
    }

    return {
      id: String(item.id || item._id || ""),
      employeeId: String(item.employeeId || ""),
      employeeName: String(item.employeeName || ""),
      type: (item.type as "annual" | "maternity" | "compassionate") ?? "annual",
      startDate: getDate(item.startDate),
      endDate: getDate(item.endDate),
      appliedDate: getDate(item.appliedDate),
      days: Number(item.days ?? 0),
      reason: String(item.reason || ""),
      status:
        (item.status as "pending" | "approved" | "rejected" | "expired") ??
        "pending",
      teamleadId: item.teamleadId ? String(item.teamleadId) : undefined,
      teamlead: item.teamleadName ? String(item.teamleadName) : undefined,
      teamleadName: item.teamleadName ? String(item.teamleadName) : undefined,

      relievers: Array.isArray(item.relievers)
        ? item.relievers.map((r: any): RelieverItem & { status?: string } => ({
            user: String(r.user || ""),
            firstName: String(r.firstName || ""),
            lastName: String(r.lastName || ""),
            status: r.status?.toLowerCase() ?? "pending",
          }))
        : [],

      reviewTrail: Array.isArray(item.reviewTrail)
        ? item.reviewTrail.map(
            (t: any): ReviewTrailItem => ({
              reviewer: String(t.reviewer || ""),
              role: String(t.role || ""),
              action:
                (t.action as "approved" | "rejected" | "pending" | "expired") ??
                "pending",
              date: getDate(t.date),
              note: t.note ? String(t.note) : undefined,
            })
          )
        : [],

      currentReviewerRole,
      allowance: item.allowance,
      url: item.url,
    };
  };

  const safePagination = (p: any): PaginationMeta | undefined => {
    if (!p) return undefined;
    const total = Number(p.total ?? 0);
    const page = Number(p.page ?? 1);
    const limit = Number(p.limit ?? 20);
    const pages =
      p.pages !== undefined
        ? Number(p.pages)
        : Math.ceil(limit > 0 ? total / limit : 0);
    return { total, page, limit, pages };
  };

  return {
    // 🔹 now we have two feeds: myRequests & approvals
    myRequests: Array.isArray(raw.myRequests)
      ? raw.myRequests.map(normalizeFeedItem)
      : [],
    approvals: Array.isArray(raw.approvals)
      ? raw.approvals.map(normalizeFeedItem)
      : [],
    allApproved: Array.isArray(raw.allApproved)
      ? raw.allApproved.map(normalizeFeedItem)
      : [],

    summary: {
      pending: Number(raw.summary?.pending ?? 0),
      approved: Number(raw.summary?.approved ?? 0),
      rejected: Number(raw.summary?.rejected ?? 0),
      expired: Number(raw.summary?.expired ?? 0),
    },

    balance: Array.isArray(raw.balance)
      ? raw.balance.map(
          (b: any): LeaveBalanceItem => ({
            type:
              (b.type as "annual" | "maternity" | "compassionate") ?? "annual",
            remaining: Number(b.remaining ?? 0),
          })
        )
      : [],

    pagination: raw.pagination
      ? {
          myRequests: safePagination(raw.pagination.myRequests),
          approvals: safePagination(raw.pagination.approvals),
          allApproved: safePagination(raw.pagination.allApproved),
        }
      : undefined,
  };
};

export const normalizePayrollRecord = (record: any): IPayroll => {
  return {
    _id: record._id,
    email: record.email,
    employeeName: record.employeeName,
    employee: {
      _id: record.employee?._id ?? "",
      firstName: record.employee?.firstName ?? "",
      lastName: record.employee?.lastName ?? "",
      email: record.employee?.email ?? "",
    },
    company: record.company,
    month: record.month,
    year: record.year?.toString() ?? "",
    basicSalary: Number(record.basicSalary),
    housingAllowance: Number(record.housingAllowance),
    transportAllowance: Number(record.transportAllowance),
    lasgAllowance: Number(record.lasgAllowance),
    twentyFourHoursAllowance: Number(record.twentyFourHoursAllowance),
    healthAllowance: Number(record.healthAllowance),
    totalAllowances: Number(record.totalAllowances),
    grossSalary: Number(record.grossSalary),
    pension:
      typeof record.pension === "object" && record.pension !== null
        ? Number((record.pension as PensionFundState).fundRate) || 0
        : 0,

    CRA: Number(record.CRA),
    taxableIncome: Number(record.taxableIncome),
    tax: Number(record.tax),
    deductions: Number(record.deductions),
    netSalary: Number(record.netSalary),
    status: record.status ?? "Pending",
    paidDate: record.paidDate ? new Date(record.paidDate) : undefined,
    createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
    taxInfo: record.taxInfo
      ? {
          payrollId: record.taxInfo.payrollId,
          employeeId: record.taxInfo.employeeId,
          companyId: record.taxInfo.companyId,
          CRA: Number(record.taxInfo.CRA),
          pension: Number(record.taxInfo.pension),
          taxableIncome: Number(record.taxInfo.taxableIncome),
          tax: Number(record.taxInfo.tax),
          bands:
            record.taxInfo.bands?.map((band: any) => ({
              band: Number(band.band),
              amount: Number(band.amount),
            })) ?? [],
          createdAt: new Date(record.taxInfo.createdAt),
        }
      : null,
  };
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const years = ["2030", "2029", "2028", "2027", "2026", "2025", "2024"];

// export function mapAndCacheAppraisals(
//   state,
//   appraisals: any[],
//   pagination: { page: number }
// ) {
//   console.log("mapAndCacheAppraisals called with appraisals:", appraisals);
//   console.log("mapAndCacheAppraisals called with pagination:", pagination);
//   const status = state.activityFilter;
//   const page = pagination?.page;

//   const mappedData = Array.isArray(appraisals)
//     ? appraisals.map((appraisal: any) => ({
//         ...appraisal,
//         employeeId: appraisal.user?._id,
//         employeeName: appraisal.user?.firstName,
//         employeeLastName: appraisal.user?.lastName,
//       }))
//     : [];

//   if (!state.activityCache[status]) state.activityCache[status] = {};
//   state.activityCache[status][page] = mappedData;

//   state.appraisalRequests = mappedData;
// }
export function mapAndCacheAppraisals(state: any, data: any) {
  // data = { appraisals: [...], pagination: {...} }
  const status = state.activityFilter;
  const page = data?.pagination?.page ?? 1; // fallback to 1

  const mappedData = Array.isArray(data?.appraisals)
    ? data.appraisals.map((appraisal: any) => ({
        ...appraisal,
        employeeId: appraisal.user?._id,
        employeeName: appraisal.user?.firstName,
        employeeLastName: appraisal.user?.lastName,
        department: appraisal.user?.department
      }))
    : [];

  if (!state.activityCache[status]) state.activityCache[status] = {};
  state.activityCache[status][page] = mappedData;

  state.appraisalRequests = mappedData;

}


export function updateLeaveState(state: any, payload: any) {
  const { myRequests, approvals, allApproved, summary, balance, pagination } =
    payload.data;

  if (pagination?.myRequests?.page) {
    const page = pagination.myRequests.page;
    state.activityFeedCache[page] = myRequests ?? [];
    state.activityFeedPagination = pagination.myRequests;
    state.activityFeed = myRequests ?? [];
  }

  if (pagination?.approvals?.page) {
    const page = pagination.approvals.page;
    state.approvalsCache[page] = approvals ?? [];
    state.approvalsPagination = pagination.approvals;
    state.approvals = approvals ?? [];
  }

  if (pagination?.allApproved?.page) {
    const page = pagination.allApproved.page;
    state.allApprovedCache[page] = allApproved ?? [];
    state.allApprovedPagination = pagination.allApproved;
    state.allApproved = allApproved ?? [];
  }

  state.statusOverview = {
    pending: summary?.pending,
    approved: summary?.approved,
    rejected: summary?.rejected,
    expired: summary?.expired,
  };
  state.balance = balance;
}
