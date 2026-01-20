


// import React from "react";
// import { Eye } from "lucide-react";
// import { LeaveActivityFeedItem } from "@/types/leave";
// import { Appraisal as AppraisalType } from "@/types/appraisal";

// type ApprovalRequest = LeaveActivityFeedItem | AppraisalType;

// interface ApprovalStepsProps {
//   request: ApprovalRequest;
// }

// type ApprovalStep = {
//   label: string;
//   reviewerId?: string;
//   role?: string;
// };

// const ApprovalSteps: React.FC<ApprovalStepsProps> = ({ request }) => {
//   console.log('ApprovalSteps request', request);



//   if (!request?.typeIdentify || !["appraisal", "leave"].includes(request.typeIdentify)) {
//     return null;
//   }



//   // 🔹 Build review trail and relievers
//   const trail = request.reviewTrail || [];
//   const relievers = request.typeIdentify === "leave" ? request.relievers || [] : [];


//    const isLeave = request.typeIdentify === "leave";
//    const isAppraisal = request.typeIdentify === "appraisal";
//   const isTeamLeadLeave = isLeave &&  request.teamleadId || isAppraisal && request.teamLeadId === request.employeeId;

  

//     const approvalFlow: ApprovalStep[] = [
//       ...relievers.map((r) => ({
//         label: `${r.firstName} ${r.lastName.charAt(0)}.`,
//         reviewerId: r.user,
//       })),

//       // Team Lead only if not teamlead leave
//       ...(!isTeamLeadLeave ? [{ label: "Team Lead", role: "teamlead" }] : []),
//       { label: "HR", role: "hr" },
//       // MD only if teamlead leave
//       ...(isTeamLeadLeave ? [{ label: "MD", role: "md" }] : []),
//     ];
// console.log('approvalFlow', approvalFlow);

//   let stopAt: number | null = null;

//   // 🔹 Build the elements for approval steps
//   const elements = approvalFlow.map((step, index) => {
//     // Find review for this step (check if it's reliever or role-based)
//     const review = step.reviewerId
//       ? trail.find((r) => r.reviewer === step.reviewerId) // For relievers, use `reviewerId`
//       : trail.find((r) => r.role.toLowerCase() === step.role); // For Team Lead and HR, use `role`

//     const isApproved = review?.action === "approved";
//     const isRejected = review?.action === "rejected";

//     // Stop at the first rejected review
//     if (isRejected && stopAt === null) stopAt = index;

//     const statusIcon = isApproved ? "✔" : isRejected ? "✖" : "⏳"; 
//     const statusColor = isRejected
//       ? "text-red-500"
//       : isApproved
//       ? "text-green-600"
//       : "text-gray-400"; 

//     return (
//       <React.Fragment key={step.reviewerId || step.role}>
//         <div className={`flex items-center space-x-1 ${statusColor}`}>
//           <span>{statusIcon}</span>
//           <span>{step.label}</span>
//           {isRejected && review?.note && (
//             <span title={review.note}>
//               <Eye className="w-3.5 h-3.5 ml-1 text-muted-foreground hover:text-black cursor-pointer" />
//             </span>
//           )}
//         </div>
//         {index < approvalFlow.length - 1 && (!stopAt || index < stopAt) && (
//           <span className="text-gray-300">—</span>
//         )}
//       </React.Fragment>
//     );
//   });

//   const visible = stopAt !== null ? elements.slice(0, stopAt * 2 + 1) : elements;

//   return (
//     <div className="flex items-center flex-wrap gap-1 mt-2 text-xs font-medium">
//       {visible}
//     </div>
//   );
// };

// export default ApprovalSteps;
import React from "react";
import { Eye } from "lucide-react";
import { LeaveActivityFeedItem } from "@/types/leave";
import { Appraisal as AppraisalType } from "@/types/appraisal";

type ApprovalRequest = LeaveActivityFeedItem | AppraisalType;

interface ApprovalStepsProps {
  request: ApprovalRequest;
}

type ApprovalStep = {
  label: string;
  reviewerId?: string;
  role?: string;
};

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({ request }) => {

  if (
    !request?.typeIdentify ||
    !["appraisal", "leave"].includes(request.typeIdentify)
  ) {
    return null;
  }

  // =========================
  // BASIC FLAGS
  // =========================
  const isLeave = request.typeIdentify === "leave";
  const isAppraisal = request.typeIdentify === "appraisal";

  const trail = request.reviewTrail || [];
  const relievers = isLeave ? request.relievers || [] : [];

  const currentRole = request.currentReviewerRole?.toLowerCase();

  // =========================
  // TEAM LEAD VISIBILITY RULE
  // =========================
  const isTeamLeadLeave =
    isLeave && request.employeeId === request.teamleadId;

  const isTeamLeadAppraisal =
    isAppraisal && request.employeeId === request.teamLeadId;

  const isApplicantTeamLead = isTeamLeadLeave || isTeamLeadAppraisal;

  /**
   * Team Lead is shown ONLY if:
   * - we are NOT already at HR or MD
   * - applicant is NOT the team lead
   */
  const shouldShowTeamLead =
    currentRole !== "hr" &&
    currentRole !== "md" &&
    !isApplicantTeamLead;

  // =========================
  // BUILD APPROVAL FLOW
  // =========================
  const approvalFlow: ApprovalStep[] = [
    // Relievers (leave only)
    ...(isLeave
      ? relievers.map((r) => ({
          label: `${r.firstName} ${r.lastName.charAt(0)}.`,
          reviewerId: r.user,
        }))
      : []),

    // Team Lead (state-aware)
    ...(shouldShowTeamLead
      ? [{ label: "Team Lead", role: "teamlead" }]
      : []),

    { label: "HR", role: "hr" },
    { label: "MD", role: "md" },
  ];


  // =========================
  // RENDER STEPS
  // =========================
  let stopAt: number | null = null;

  const elements = approvalFlow.map((step, index) => {
    const review = step.reviewerId
      ? trail.find((r) => r.reviewer === step.reviewerId)
      : trail.find((r) => r.role?.toLowerCase() === step.role);

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

        {index < approvalFlow.length - 1 &&
          (!stopAt || index < stopAt) && (
            <span className="text-gray-300">—</span>
          )}
      </React.Fragment>
    );
  });

  const visible =
    stopAt !== null ? elements.slice(0, stopAt * 2 + 1) : elements;

  return (
    <div className="flex items-center flex-wrap gap-1 mt-2 text-xs font-medium">
      {visible}
    </div>
  );
};

export default ApprovalSteps;
