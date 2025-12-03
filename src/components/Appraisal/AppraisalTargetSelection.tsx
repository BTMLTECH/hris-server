
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Eye, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appraisal } from '@/types/appraisal';
import {  AppraisalTarget, groupedTargets } from '@/data/appraisalTargets';
import { useReduxAppraisal } from '@/hooks/appraisal/useReduxAppraisal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAvailableTargets, setFormData, setSelectedTargets, setStep, toggleTarget } from '@/store/slices/appraisal/appraisalSlice';
import { toast } from '@/hooks/use-toast';

interface AppraisalTargetSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: any
  // onCreateAppraisal: (appraisal: Appraisal) => void;
  // employees: Array<{ id: string; name: string; email: string; department: string; }>;
}

const AppraisalTargetSelection: React.FC<AppraisalTargetSelectionProps> = ({
  isOpen,
  onClose,
  dispatch,
}) => {
  const { formData,selectedTargets, availableTargets, step, isLoading, error } = useAppSelector((state) => state.appraisal);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {getEmployeeUnderTeamlead, handleCreateAppraisalRequest} = useReduxAppraisal()
 
   const {user } = useAppSelector((state) => state.auth);  

 const handleTargetToggle = (target: AppraisalTarget) => {
  const isSelected = selectedTargets.some(t => t.id === target.id);
  const newTotal = isSelected
    ? getTotalScore() - target.marks
    : getTotalScore() + target.marks;

  if (!isSelected && newTotal > 100) {
    toast({title: "Total score cannot exceed 100 marks.", variant:'destructive'});
    return;
  }

  dispatch(toggleTarget(target));
};

  
  const getTotalScore = () => {
    return selectedTargets.reduce((sum, target) => sum + target.marks, 0);
  };

  const getTargetsByCategory = () => {
    const categories = ['OBJECTIVES', 'FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH'] as const;
    return categories.map(category => ({
      category,
      targets: availableTargets.filter(t => t.category === category)
    }));
  };

  // const handleNextStep = () => {
  //   if (step === 'basic') {
  //     setStep('targets');
  //   } else if (step === 'targets') {
  //     setStep('preview');
  //   }
  // };

  const handleNextStep = () => {
    if (step === 'basic') {
      // const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      const department = user?.department.toLocaleLowerCase();
      const departmentTargets = groupedTargets[department]; 

      // Flatten targets
      const allTargets = [
        ...(departmentTargets.financial || []),
        ...(departmentTargets.customer || []),
        ...(departmentTargets.internal_processes || []),
        ...(departmentTargets.learning_and_growth || [])
      ];

      dispatch(setAvailableTargets(allTargets));
      dispatch(setStep('targets'));
    } else if (step === 'targets') {
      dispatch(setStep('preview'));
    }
  };
  const handlePreviousStep = () => {
    if (step === 'targets') {
      dispatch(setStep('basic'));
    } else if (step === 'preview') {
      dispatch(setStep('targets'));
    }
  };

const resetForm = () => {
  dispatch(setStep('basic'));
  dispatch(setFormData({
    title: '',
    employeeId: '',
    period: 'monthly',
    dueDate: null,
  }));
  dispatch(setSelectedTargets([]));
};

const handleSubmit = async () => {
  if (!formData.title || !formData.dueDate || selectedTargets.length === 0) return;

  const newAppraisal: Appraisal = {
    // id: `appr_${Date.now()}`,
    teamLeadId: user?._id || '',
    teamLeadName: user?.firstName || '',
    title: formData.title,
    period: formData.period,
    dueDate: new Date(formData.dueDate!).toISOString(), 
    status: 'pending',
    objectives: selectedTargets.map((target, index) => ({
      id: `obj_${target.id}_${index}`,
      category: target.category,
      name: target.name,
      marks: target.marks,
      kpi: target.kpi,
      measurementTracker: target.measurementTracker,
      employeeScore: 0,
      teamLeadScore: 0,
      finalScore: 0,
      employeeComments: '',
      teamLeadComments: '',
      evidence: ''
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalScore: {
      employee: 0,
      teamLead: 0,
      final: 0
    }
  };

  const success = await handleCreateAppraisalRequest(newAppraisal)
  if(success){

    // onCreateAppraisal(newAppraisal);
    resetForm();
    onClose(); // Close dialog
  }
};

const handleClose = (open: boolean) => {
  if (!open) {
    resetForm();
    onClose(); 
  }
};



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'basic' && 'Create New Appraisal'}
            {step === 'targets' && 'Select Targets'}
            {step === 'preview' && 'Preview Appraisal'}
          </DialogTitle>
          <DialogDescription>
            {step === 'basic' && 'Set up basic information for the appraisal.'}
            {step === 'targets' && `Select targets for evaluation (Total: ${getTotalScore()}/100 marks)`}
            {step === 'preview' && 'Review your appraisal before sending to employee.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'basic' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Appraisal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => dispatch(setFormData({ ...formData, title: e.target.value }))}
                placeholder="Q4 2024 Performance Review"
                required
              />
            </div>

    

            <div className="space-y-2">
              <Label htmlFor="period">Review Period</Label>
              <Select value={formData.period} onValueChange={(value) => dispatch(setFormData({ ...formData, period: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
              
                    {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}

                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onSelect={(date) => {
                      dispatch(
                        setFormData({
                          ...formData,
                          dueDate: date ? date.toISOString() : null,
                        })
                      );
                      setIsCalendarOpen(false); 
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {step === 'targets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Selected Targets: {selectedTargets.length}</span>
              <Badge variant={getTotalScore() === 100 ? "default" : "outline"}>
                Total Score: {getTotalScore()}/100
              </Badge>
            </div>

            {getTargetsByCategory().map(({ category, targets }) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.replace('_', ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {targets.map((target) => (
                    <div key={target.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedTargets.some(t => t.id === target.id)}
                        onCheckedChange={() => handleTargetToggle(target)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{target.name}</h4>
                          <Badge variant="outline">{target.marks} marks</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{target.kpi}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appraisal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Title:</strong> {formData.title}</div>
                {/* <div><strong>Employee:</strong> {employees.find(e => e.id === formData.employeeId)?.name}</div> */}
                <div><strong>Period:</strong> {formData.period}</div>
                <div><strong>Due Date:</strong> {formData.dueDate ? format(new Date(new Date(formData.dueDate)), "PPP")   : 'Not set'}</div>
                <div><strong>Total Score:</strong> {getTotalScore()}/100 marks</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Targets ({selectedTargets.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTargets.map((target) => (
                  <div key={target.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{target.name}</h4>
                      <p className="text-sm text-gray-600">{target.category.replace('_', ' ')}</p>
                    </div>
                    <Badge>{target.marks} marks</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {step !== 'basic' && (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>

            {step !== 'preview' ? (
              <Button 
                type="button" 
                onClick={handleNextStep}
                disabled={
                  (step === 'basic' && (!formData.title  || !formData.dueDate)) ||
                  (step === 'targets' && selectedTargets.length === 0)
                }
              >
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Sending...' : 'Send to Employee'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppraisalTargetSelection;
