import { Appraisal, AppraisalObjective } from '@/types/appraisal';

/**
 * Clone an approved appraisal for a new review period
 * Resets all scores but maintains objective structure
 */
export const cloneAppraisalForNewPeriod = (
  appraisal: Appraisal,
  newPeriod: string,
  newDueDate: Date,
  newTitle: string
) => {
  // Clone objectives with scores reset
  const clonedObjectives: AppraisalObjective[] = (appraisal.objectives || []).map((obj) => ({
    ...obj,
    employeeScore: 0,
    teamLeadScore: 0,
    finalScore: 0,
    employeeComments: '',
    teamLeadComments: '',
    evidence: '',
  }));

  // Return cloned appraisal template (not yet saved to backend)
  return {
    title: newTitle,
    period: newPeriod,
    dueDate: newDueDate.toISOString(),
    objectives: clonedObjectives,
    // Keep same employee and teamlead
    employeeId: appraisal.employeeId || appraisal.user,
    // These will be set by the form
  };
};

/**
 * Pre-populate form data from a cloned appraisal
 */
export const getCloneFormData = (appraisal: Appraisal) => {
  // Group objectives by category
  const objectivesByCategory: Record<string, AppraisalObjective[]> = {
    OBJECTIVES: [],
    FINANCIAL: [],
    CUSTOMER: [],
    INTERNAL_PROCESS: [],
    LEARNING_AND_GROWTH: [],
  };

  (appraisal.objectives || []).forEach((obj) => {
    const category = obj.category as keyof typeof objectivesByCategory;
    if (objectivesByCategory[category]) {
      objectivesByCategory[category].push({
        ...obj,
        employeeScore: 0,
        teamLeadScore: 0,
        finalScore: 0,
        employeeComments: '',
        teamLeadComments: '',
        evidence: '',
      });
    }
  });

  return objectivesByCategory;
};
