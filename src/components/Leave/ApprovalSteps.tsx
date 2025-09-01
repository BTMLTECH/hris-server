import React from "react";
import { Eye } from "lucide-react";
import { LeaveActivityFeedItem, LeaveRequest } from "@/types/leave";
import { useAppSelector } from "@/store/hooks";
import { Appraisal } from "@/types/appraisal";

type ApprovalRequest = LeaveActivityFeedItem | Appraisal;

interface ApprovalStepsProps {
  request: ApprovalRequest;
}

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({ request }) => {


  if (!request?.typeIdentify || !["appraisal", "leave"].includes(request.typeIdentify)) {
    return null;
  }

  // 🔹 Build review trail and relievers
  const trail = request.reviewTrail || [];
  const relievers = request.typeIdentify === "leave" ? request.relievers || [] : [];

  // 🔹 Approval flow: list relievers as individuals, then roles
  const approvalFlow: { label: string; reviewerId?: string; role?: string }[] = [
    ...relievers.map((r, idx) => ({
      label: `${r.firstName} ${r.lastName}`,
      reviewerId: r.user,
    })),
    { label: "Team Lead", role: "teamlead" },
    { label: "HR", role: "hr" }
  ];

  let stopAt: number | null = null;

  const elements = approvalFlow.map((step, index) => {
    // Determine if step is approved or rejected
    const review = step.reviewerId
      ? trail.find((r) => r.reviewer === step.reviewerId)
      : trail.find((r) => r.role.toLowerCase() === step.role);

    const isApproved = review?.action === "approved";
    const isRejected = review?.action === "rejected";

    if (isRejected && stopAt === null) stopAt = index;

    const statusIcon = isApproved ? "✔" : isRejected ? "✖" : "⏳";
    const statusColor = isRejected
      ? "text-red-500"
      : isApproved
      ? "text-green-600"
      : "text-gray-400";

    return (
      <React.Fragment key={step.reviewerId || step.role}>
        <div className={`flex items-center space-x-1 ${statusColor}`}>
          <span>{statusIcon}</span>
          <span>{step.label}</span>
          {isRejected && review?.note && (
            <span title={review.note}>
              <Eye className="w-3.5 h-3.5 ml-1 text-muted-foreground hover:text-black cursor-pointer" />
            </span>
          )}
        </div>
        {index < approvalFlow.length - 1 && (!stopAt || index < stopAt) && (
          <span className="text-gray-300">—</span>
        )}
      </React.Fragment>
    );
  });

  const visible = stopAt !== null ? elements.slice(0, stopAt * 2 + 1) : elements;

  return (
    <div className="flex items-center flex-wrap gap-1 mt-2 text-xs font-medium">
      {visible}
    </div>
  );
};

export default ApprovalSteps;


