// import { Appraisal } from "@/types/appraisal";

import { Appraisal } from "@/types/appraisal";




export function canUserEdit(
  appraisal: Appraisal,
  userId: string,
  userRole: 'employee' | 'teamlead' | 'hr' | 'md'
): boolean {
  const { status, reviewLevel, reviewTrail, employeeId, teamLeadId } = appraisal;

  const isEmployee = userRole === 'employee' && userId === employeeId;

  const isReviewer =
    userRole === reviewLevel &&
    (
      (userRole === 'teamlead' && teamLeadId === userId) ||
      userRole === 'hr' 
    );

  const alreadyApproved = reviewTrail?.some(
    (r) => r.role === userRole && r.action === 'approved'
  );

  if (isEmployee && ['pending', 'needs_revision'].includes(status)) {
    return true;
  }

  if (
    isReviewer &&
    ['submitted', 'needs_revision'].includes(status) &&
    !alreadyApproved
  ) {
    return true;
  }

  return false;
}
