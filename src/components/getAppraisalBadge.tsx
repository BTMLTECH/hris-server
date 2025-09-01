
import { Badge } from "@/components/ui/badge";
import { Appraisal } from "@/types/appraisal";
import { IPayroll } from "@/types/payroll";

type Role = "md" | "employee" | "teamlead" | "hr" | "admin";

// Payroll badge function
export const getPayrollStatusBadge = (status?: IPayroll["status"]) => {
  const variants: Record<IPayroll["status"], "outline" | "secondary" | "default" | "destructive" |'success'> = {
    pending: "outline",
    draft: "outline",
    processed: "secondary",
    reversed: "destructive",
    paid: 'success'
  };

  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

  return <Badge variant={status ? variants[status] : "outline"}>{label}</Badge>;
};

// Appraisal badge function
export const getAppraisalStatusBadge = (appraisal: Appraisal, currentUserRole: Role) => {
  const { status, reviewLevel, reviewTrail } = appraisal;

  if (status === "rejected") {
    return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
  }

  if (status === "approved") {
    return <Badge variant="outline" className="bg-green-50 text-green-800">Approved</Badge>;
  }

  if (status === "needs_revision") {
    const revisionMessages: Record<Role, string> = {
      teamlead: "Sent for Revision",
      employee: "Urgent Revision",
      md: "Needs Revision",
      hr: "Needs Revision",
      admin: "Needs Revision",
    };
    return <Badge variant="outline" className="bg-red-50 text-red-700">{revisionMessages[currentUserRole]}</Badge>;
  }

  if (status === "pending") {
    const pendingMessages: Record<Role, string> = {
      teamlead: "Send to Employee",
      employee: "New Appraisal",
      md: "Pending",
      hr: "Pending",
      admin: "Pending",
    };
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">{pendingMessages[currentUserRole]}</Badge>;
  }

  if (status === "submitted") {
    const lastReview = reviewTrail?.length ? reviewTrail[reviewTrail.length - 1] : undefined;

    if (lastReview?.role === currentUserRole) {
      return <Badge variant="outline" className="bg-green-50 text-green-800">Approved</Badge>;
    }

    if (currentUserRole === reviewLevel) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Awaiting Your Review</Badge>;
    }

    if (currentUserRole === "employee") {
      const reviewingMap: Record<string, string> = {
        teamlead: "Team Lead Reviewing",
        hr: "HR Reviewing",
        md: "MD Reviewing",
      };
      const reviewingText = reviewLevel ? reviewingMap[reviewLevel] : null;
      return <Badge variant="outline" className="bg-blue-50 text-blue-800">{reviewingText || "In Review"}</Badge>;
    }

    return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Awaiting Review</Badge>;
  }

  return <Badge variant="outline" className="bg-gray-50 text-gray-700">Unknown</Badge>;
};



