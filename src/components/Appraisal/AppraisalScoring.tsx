
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Appraisal, AppraisalObjective, AppraisalScoringProps } from '@/types/appraisal';
import { setAppraisalObjectives } from '@/store/slices/appraisal/appraisalSlice';
import { useAppDispatch } from '@/store/hooks';
import { useLoadingState } from '@/hooks/useLoadingState';


const AppraisalScoring: React.FC<AppraisalScoringProps> = ({
  appraisal,
  canReviewAppraisal,
  isEmployee,
  isLoading,
  objectives,
  onBack,
  onSubmit,
  loading,
  hr,
  teamlead,
  hrAdjustments,
  setHrAdjustments
}) => {
  const dispatch =  useAppDispatch()
  
  // Derive scoresUpdated from objectives - if any teamLead scores are set, scores are updated
  const hasTeamLeadScores = objectives.some((obj) => obj.teamLeadScore > 0);
  const scoresUpdated = hasTeamLeadScores;
  
  // Check if HR has made any adjustments
  const hasHRJustments = hrAdjustments && 
    Object.values(hrAdjustments).some(val => val !== 0);
  
  const canEdit =
  (isEmployee && ['pending', 'needs_revision'].includes(appraisal.status)) ||
  (canReviewAppraisal && ['submitted', 'needs_revision', 'awaiting_hr_review'].includes(appraisal.status));

  // Check if teamlead has approved
  const teamLeadApproved = Array.isArray(appraisal.reviewTrail)
    ? appraisal.reviewTrail.some((r) => r.role === 'teamlead' && r.action === 'approved')
    : false;

  // Check if HR has approved
  const hrApproved = Array.isArray(appraisal.reviewTrail)
    ? appraisal.reviewTrail.some((r) => r.role === 'hr' && r.action === 'approved')
    : false;

  // Determine if employee can see teamlead score
  const canEmployeeSeeTeamLeadScore = isEmployee && (teamLeadApproved || hrApproved);

  // Determine if employee can see HR adjustments
  const canEmployeeSeeHRScore = isEmployee && hrApproved;

const totalScores = useMemo(() => {

  const employeeTotal = objectives.reduce((sum, obj) => sum + (obj.employeeScore || 0), 0);
  const teamLeadTotal = objectives.reduce((sum, obj) => sum + (obj.teamLeadScore || 0), 0);

  // If HR has approved, everyone sees the final HR score from backend
  if (hrApproved && appraisal.totalScore?.final !== undefined) {
    return {
      employee: employeeTotal,
      teamLead: teamLeadTotal,
      final: appraisal.totalScore.final,
    };
  }

  let finalTotal = teamLeadTotal;

  // For HR: Always calculate final score as Team Lead + Adjustments (updates in real-time as they type)
  if (hr && hrAdjustments) {
    for (const key of Object.keys(hrAdjustments) as ('innovation' | 'commendation' | 'query' | 'majorError')[]) {
      finalTotal += hrAdjustments[key] || 0;
    }
  } else if (teamlead) {
    finalTotal = teamLeadTotal;
  } else {
    finalTotal = employeeTotal;
  }

  return {
    employee: employeeTotal,
    teamLead: teamLeadTotal,
    final: finalTotal,
  };
}, [objectives, hrAdjustments, hr, teamlead, hrApproved, appraisal.totalScore?.final]);


const updateObjective = (index: number, field: keyof AppraisalObjective, value: any) => {
  const updatedObjectives = objectives.map((obj, i) =>
    i === index ? { ...obj, [field]: value } : obj
  );
  dispatch(setAppraisalObjectives({ appraisalId: appraisal._id, objectives: updatedObjectives }));
};





// Check if all team lead scores have been set
const allTeamLeadScoresSet = teamlead && objectives.every((obj) => obj.teamLeadScore > 0);

const handleSubmit = async (
  action: 'submitted' | 'approved' | 'needs_revision' | 'sent_to_employee' | 'rejected' | 'update'
) => {
  const updatedAppraisal: Appraisal & { hrAdjustments?: typeof hrAdjustments } = {
    ...appraisal,
    objectives,
    totalScore: totalScores,
    updatedAt: new Date().toISOString(),
    hrAdjustments: hr && hrAdjustments ? hrAdjustments : undefined,
  };

  onSubmit(updatedAppraisal, action);
  
  // Stay on page for update and approved actions
  if (action === 'update' || action === 'approved') {
    return;
  }
  
  // Navigate away for other actions
  onBack?.();
};


const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-800',
    submitted: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    needs_revision: 'bg-yellow-100 text-yellow-800',
    sent_to_employee: 'bg-cyan-100 text-cyan-800',
    rejected: 'bg-red-100 text-red-800',

  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-sm font-bold">{appraisal.title?.toLocaleUpperCase()}</h1>
              {/* <p className="text-gray-600">{appraisal.employeeName} • {appraisal.period}</p> */}
            </div>
          </div>
          <Badge className={getStatusColor(appraisal.status)}>
            {appraisal.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {isEmployee && (
                <p className="text-blue-700 bg-blue-50 p-3 rounded">
                  📝 <strong>Employee:</strong> Rate yourself on each objective using the sliders. Provide comments and evidence where applicable.
                </p>
              )}
              {canReviewAppraisal && (
                <p className="text-orange-700 bg-orange-50 p-3 rounded">
                  👥 <strong>Team Lead:</strong> Review employee's self-assessment and provide your scores. Add comments for feedback.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Objectives */}
        <div className="space-y-6">
          {objectives.map((objective, index) => (
            <Card key={objective.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{objective.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <strong>KPI:</strong> {objective.kpi}
                    </CardDescription>
                    <CardDescription className="mt-1">
                      <strong>Measurement:</strong> {objective.measurementTracker}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg font-semibold">
                    {objective.marks} marks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employee Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-blue-700">Employee Score</label>
                    <span className="text-lg font-bold text-blue-700">
                      {objective.employeeScore}/{objective.marks}
                    </span>
                  </div>
                  <Slider
                    value={[objective.employeeScore]}
                    onValueChange={(value) => updateObjective(index, 'employeeScore', value[0])}
                    max={objective.marks}
                    step={0.5}
                    disabled={!canEdit || !isEmployee}
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Employee comments and evidence..."
                    value={objective.employeeComments}
                    onChange={(e) => updateObjective(index, 'employeeComments', e.target.value)}
                    disabled={!canEdit || !isEmployee}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Team Lead Score */}
                {(canReviewAppraisal || canEmployeeSeeTeamLeadScore || objective.teamLeadScore > 0) && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <label className="font-medium text-orange-700">Team Lead Score</label>
                      <span className="text-lg font-bold text-orange-700">
                        {objective.teamLeadScore}/{objective.marks}
                      </span>
                    </div>
                    <Slider
                      value={[objective.teamLeadScore]}
                      onValueChange={(value) => updateObjective(index, 'teamLeadScore', value[0])}
                      max={objective.marks}
                      step={0.5}
                      disabled={!canEdit || !canReviewAppraisal}
                      className="w-full"
                    />
                    <Textarea
                      placeholder="Team lead comments and feedback..."
                      value={objective.teamLeadComments}
                      onChange={(e) => updateObjective(index, 'teamLeadComments', e.target.value)}
                      disabled={!canEdit || !canReviewAppraisal}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {/* Score Comparison */}
                {objective.employeeScore > 0 && objective.teamLeadScore > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Score Comparison</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span>Employee: {objective.employeeScore}</span>
                      <span>Team Lead: {objective.teamLeadScore}</span>
                      <span className={`font-medium ${
                        objective.employeeScore === objective.teamLeadScore ? 'text-green-600' :
                        objective.teamLeadScore < objective.employeeScore ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {objective.employeeScore === objective.teamLeadScore ? 'Match' :
                         objective.teamLeadScore < objective.employeeScore ? 'Reduced' : 'Increased'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {hr && appraisal.status !== "approved" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>HR Scoring Adjustments</CardTitle>
              <CardDescription>Apply additional HR points or deductions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['innovation', 'commendation', 'query', 'majorError'] as const).map((key) => {
                const isNegativeType = ['query', 'majorError'].includes(key);
                const label = key.replace(/([A-Z])/g, ' $1').trim();

                return (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="capitalize font-medium">
                      {isNegativeType ? '- ' : ''}{label}
                    </span>
                    <input
                      type="number"
                      value={hrAdjustments[key] || 0}
                      onChange={(e) =>
                        setHrAdjustments((prev) => ({
                          ...prev,
                          [key]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="border rounded px-3 py-2 w-20 text-center"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* HR Adjustments Display for Employee (Read-only when HR approved) */}
        {canEmployeeSeeHRScore && appraisal.hrAdjustments && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">HR Final Adjustments</CardTitle>
              <CardDescription>Applied HR scoring adjustments to your appraisal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['innovation', 'commendation', 'query', 'majorError'] as const).map((key) => {
                const adjustmentValue = appraisal.hrAdjustments?.[key];
                const isApplied = adjustmentValue && adjustmentValue !== 0;

                return isApplied ? (
                  <div key={key} className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span
                      className={`font-bold ${
                        adjustmentValue > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {adjustmentValue > 0 ? `+${adjustmentValue}` : adjustmentValue}
                    </span>
                  </div>
                ) : null;
              })}
            </CardContent>
          </Card>
        )}

        {/* Total Score Summary */}
    <Card className="mt-6">
  <CardHeader>
    <CardTitle>Score Summary</CardTitle>
  </CardHeader>

<CardContent>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

    {/* Employee Total */}
    <div className="text-center p-4 bg-blue-50 rounded-lg">
      <div className="text-2xl font-bold text-blue-700">
        {totalScores.employee.toFixed(1)}
      </div>
      <div className="text-sm text-blue-600">Employee Total</div>
    </div>

    {/* Team Lead Total */}
    <div className="text-center p-4 bg-orange-50 rounded-lg">
      <div className="text-2xl font-bold text-orange-700">
        {totalScores.teamLead.toFixed(1)}
      </div>
      <div className="text-sm text-orange-600">Team Lead Total</div>
    </div>

    {/* Final Total (dynamic based on role) */}
    <div className="text-center p-4 bg-green-50 rounded-lg">
      <div className="text-2xl font-bold text-green-700">
        {totalScores.final.toFixed(1)}
      </div>
      <div className="text-sm text-green-600">
        {hrApproved
          ? "Final HR Score"
          : hr
          ? "Final HR Score (Preview)"
          : teamlead
          ? "Team Lead Score"
          : "Final Score"}
      </div>
    </div>

  </div>
</CardContent>

</Card>

          {/* HR Adjustments (Only visible to HR) */}
     
        {/* Action Buttons */}
        {canEdit && (
          <div className="space-y-4">
            {/* Teamlead Update Reminder */}
            {teamlead && !scoresUpdated && allTeamLeadScoresSet && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-blue-900 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Please click "Update Score" to save your assessments before approving.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Incomplete Scores Warning */}
            {teamlead && !allTeamLeadScoresSet && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-yellow-900 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Please score all objectives before updating and approving the appraisal.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {isEmployee && (
              <Button
                onClick={() => handleSubmit('submitted')}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  Submit to Team Lead
              </Button>
            )}
            {!isEmployee && (
           <>
              <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSubmit('update')}
                  disabled={loading(appraisal._id ?? appraisal._id, 'update') || (teamlead && !allTeamLeadScoresSet) || (hr && !hasHRJustments)}
                >
                  {loading(appraisal._id ?? appraisal._id, 'update') && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  Update Score
                </Button>
            
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleSubmit('approved')}
                  disabled={loading(appraisal._id ?? appraisal._id, 'approved') || (teamlead && !scoresUpdated) || (hr && !hasHRJustments)}
                  title={!scoresUpdated && teamlead ? "Please click 'Update Score' first before approving" : !hasHRJustments && hr ? "Please add HR adjustments before approving" : ""}
                >
                  {loading(appraisal._id ?? appraisal._id, 'approved') && (
                  
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
           
                  )}
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onSubmit(appraisal, 'rejected')}
                  disabled={loading(appraisal._id ?? appraisal._id, 'rejected')}
                >
                  {loading(appraisal._id ?? appraisal._id, 'rejected') && (
                        
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
               
                  
                  )}
                  Reject
                </Button>
                {
                  teamlead && (

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSubmit(appraisal, 'needs_revision')}
                  disabled={loading(appraisal._id ?? appraisal._id, 'needs_revision')}
                >
                  {loading(appraisal._id ?? appraisal._id, 'needs_revision') && (
                
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  
                
                  )}
                  Need for Revision
                </Button>
                  )
                }
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppraisalScoring;
