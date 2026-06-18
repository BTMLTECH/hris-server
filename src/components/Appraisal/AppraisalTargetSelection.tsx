import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Loader2, Plus, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appraisal } from '@/types/appraisal';
import { useReduxAppraisal } from '@/hooks/appraisal/useReduxAppraisal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useReduxAuth } from '@/hooks/auth/useReduxAuth';
import { EmployeeSelector } from '@/components/ui/employee-selector';
import { useLazyGetAllProfileQuery } from '@/store/slices/profile/profileApi';
import {
  setFormData,
  setStep,
  addManualObjective,
  removeManualObjective,
  updateManualObjective,
  clearManualObjectives,
  setSelectedEmployee,
  setEmployeeSearchTerm,
  setEmployeeSearchResults,
} from '@/store/slices/appraisal/appraisalSlice';
import { toast } from '@/hooks/use-toast';

interface ManualObjective {
  id: string;
  category: string;
  name: string;
  kpi: string;
  marks: number;
  measurementTracker?: string;
}

interface AppraisalTargetSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: any;
  clonedAppraisal?: Appraisal;
  isCloneMode?: boolean;
}

const CATEGORIES = ['OBJECTIVES', 'FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH'] as const;

const AppraisalTargetSelection: React.FC<AppraisalTargetSelectionProps> = ({
  isOpen,
  onClose,
  dispatch,
  clonedAppraisal,
  isCloneMode = false,
}) => {
  const {
    formData,
    step,
    isLoading,
    manualObjectives,
    employeeSearchTerm,
    employeeSearchResults,
  } = useAppSelector((state) => state.appraisal);
  const { user } = useAppSelector((state) => state.auth);
  const { cachedEmployees, shouldShowSkeleton } = useReduxAuth();

  const { handleCreateAppraisalRequest } = useReduxAppraisal();

  const [triggerBackendSearch] = useLazyGetAllProfileQuery();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Initialize with clone data if in clone mode
  useEffect(() => {
    if (isCloneMode && clonedAppraisal && isOpen) {
      // Pre-populate the form with cloned data
      const selectedEmp = {
        _id: clonedAppraisal.employeeId || '',
        firstName: clonedAppraisal.employeeName || '',
        lastName: clonedAppraisal.employeeLastName || '',
        email: '',
        department: clonedAppraisal.department || '',
        position: '',
      };

      dispatch(setSelectedEmployee(selectedEmp));
      
      // Set form data with suggested title and period
      const suggestedTitle = `${clonedAppraisal.title} - Q2 2026`;
      const newDueDate = new Date();
      newDueDate.setMonth(newDueDate.getMonth() + 3); // 3 months from now

      dispatch(setFormData({
        title: suggestedTitle,
        period: clonedAppraisal.period || 'monthly',
        dueDate: newDueDate,
        selectedEmployeeId: clonedAppraisal.employeeId || '',
        selectedEmployee: selectedEmp,
      }));

      // Pre-populate objectives with scores reset to 0
      dispatch(clearManualObjectives());
      (clonedAppraisal.objectives || []).forEach((obj) => {
        const newObjective: ManualObjective = {
          id: `obj_${Date.now()}_${Math.random()}`,
          category: obj.category,
          name: obj.name,
          kpi: obj.kpi || '',
          marks: obj.marks || 0,
          measurementTracker: obj.measurementTracker || '',
        };
        dispatch(addManualObjective({ 
          category: obj.category, 
          objective: newObjective 
        }));
      });

      // Start from objectives step since employee is already selected
      dispatch(setStep('objectives'));
    }
  }, [isCloneMode, clonedAppraisal, isOpen]);

  const [objectiveFormState, setObjectiveFormState] = useState<{
    category: string;
    name: string;
    kpi: string;
    marks: string;
    measurementTracker: string;
  }>({
    category: 'OBJECTIVES',
    name: '',
    kpi: '',
    marks: '',
    measurementTracker: '',
  });

  // Calculate total marks from all objectives
  const getTotalMarks = () => {
    let total = 0;
    CATEGORIES.forEach((category) => {
      manualObjectives[category]?.forEach((obj) => {
        total += obj.marks || 0;
      });
    });
    return total;
  };

  // Mock search employees from department
  const handleEmployeeSearch = (term: string) => {
    dispatch(setEmployeeSearchTerm(term));
    if (!term.trim()) {
      dispatch(setEmployeeSearchResults([]));
      return;
    }

    const filtered = cachedEmployees.filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(term.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(term.toLowerCase()) ||
        emp.email?.toLowerCase().includes(term.toLowerCase())
    );

    // Convert ProfileFormData to SelectedEmployee format for Redux
    const selectedEmployeeFormat = filtered.map((emp) => ({
      _id: emp._id || '',
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      department: emp.department || '',
      position: emp.position || '',
    }));

    dispatch(setEmployeeSearchResults(selectedEmployeeFormat));
  };

  const handleBackendEmployeeSearch = async (term: string): Promise<any[]> => {
    try {
      const response = await triggerBackendSearch({
        page: 1,
        limit: 10,
        search: term.trim(),
      }).unwrap();
      
      const data = Array.isArray(response) ? response : response?.data || [];
      return data as any[];
    } catch (error) {
      console.error('Backend employee search failed:', error);
      return [];
    }
  };

  const handleSelectEmployeeFromSelector = (selectedEmails: string[]) => {
    if (selectedEmails.length > 0) {
      const selectedEmployee = cachedEmployees.find((emp) => emp.email === selectedEmails[0]);
      if (selectedEmployee) {
        dispatch(setSelectedEmployee({
          _id: selectedEmployee._id || '',
          firstName: selectedEmployee.firstName || '',
          lastName: selectedEmployee.lastName || '',
          email: selectedEmployee.email || '',
          department: selectedEmployee.department || '',
          position: selectedEmployee.position || '',
        }));
        dispatch(setStep('basic'));
      }
    }
  };

  const handleAddObjective = () => {
    if (!objectiveFormState.name.trim() || !objectiveFormState.kpi.trim() || !objectiveFormState.marks) {
      toast({ title: 'Please fill all objective fields', variant: 'destructive' });
      return;
    }

    const marks = parseInt(objectiveFormState.marks);
    if (isNaN(marks) || marks <= 0) {
      toast({ title: 'Marks must be a positive number', variant: 'destructive' });
      return;
    }

    const category = objectiveFormState.category;
    const newObjective: ManualObjective = {
      id: `obj_${Date.now()}`,
      category,
      name: objectiveFormState.name,
      kpi: objectiveFormState.kpi,
      marks,
      measurementTracker: objectiveFormState.measurementTracker,
    };

    dispatch(addManualObjective({ category, objective: newObjective }));

    // Reset form
    setObjectiveFormState({
      ...objectiveFormState,
      name: '',
      kpi: '',
      marks: '',
      measurementTracker: '',
    });

    toast({ title: 'Objective added successfully' });
  };

  const handleNextStep = () => {
    if (step === 'employee-selection') {
      if (!formData.selectedEmployeeId) {
        toast({ title: 'Please select an employee', variant: 'destructive' });
        return;
      }
      dispatch(setStep('basic'));
    } else if (step === 'basic') {
      if (!formData.title.trim() || !formData.dueDate) {
        toast({ title: 'Please fill title and due date', variant: 'destructive' });
        return;
      }
      dispatch(setStep('objectives'));
    } else if (step === 'objectives') {
      const totalMarks = getTotalMarks();
      if (totalMarks !== 100) {
        toast({ title: `Total marks must equal 100 (currently ${totalMarks})`, variant: 'destructive' });
        return;
      }
      dispatch(setStep('preview'));
    }
  };

  const handlePreviousStep = () => {
    if (step === 'basic') {
      // In clone mode, skip back to basic (no employee selection step)
      if (!isCloneMode) {
        dispatch(setStep('employee-selection'));
      }
    } else if (step === 'objectives') {
      dispatch(setStep('basic'));
    } else if (step === 'preview') {
      dispatch(setStep('objectives'));
    }
  };

  const resetForm = () => {
    dispatch(setStep(isCloneMode ? 'objectives' : 'employee-selection'));
    dispatch(
      setFormData({
        title: '',
        period: 'monthly',
        dueDate: null,
        selectedEmployeeId: '',
        selectedEmployee: null,
      })
    );
    dispatch(clearManualObjectives());
    dispatch(setEmployeeSearchTerm(''));
    dispatch(setEmployeeSearchResults([]));
  };

  const handleSubmit = async () => {
    if (getTotalMarks() !== 100) {
      toast({ title: 'Total marks must equal 100', variant: 'destructive' });
      return;
    }

    // Flatten all manual objectives
    const allObjectives = CATEGORIES.flatMap((category) =>
      manualObjectives[category]?.map((obj) => ({
        id: obj.id,
        category: obj.category,
        name: obj.name,
        marks: obj.marks,
        kpi: obj.kpi,
        measurementTracker: obj.measurementTracker || '',
        employeeScore: 0,
        teamLeadScore: 0,
        finalScore: 0,
        employeeComments: '',
        teamLeadComments: '',
        evidence: '',
      }))
    );

    const newAppraisal: Appraisal = {
      teamLeadId: user?._id || '',
      teamLeadName: user?.firstName || '',
      employeeId: formData.selectedEmployeeId,
      title: formData.title,
      period: formData.period,
      dueDate: new Date(formData.dueDate!).toISOString(),
      status: 'pending',
      objectives: allObjectives as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalScore: {
        employee: 0,
        teamLead: 0,
        final: 0,
      },
    };

    const success = await handleCreateAppraisalRequest(newAppraisal, formData.selectedEmployeeId);
    if (success) {
      resetForm();
      onClose();
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCloneMode ? (
              <>Recreate Appraisal for New Period</>
            ) : (
              <>
                {step === 'employee-selection' && 'Select Employee'}
                {step === 'basic' && 'Create New Appraisal'}
                {step === 'objectives' && 'Create Objectives'}
                {step === 'preview' && 'Preview Appraisal'}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCloneMode ? (
              <>Review and edit the recreated appraisal for the new period</>
            ) : (
              <>
                {step === 'employee-selection' && 'Search and select the employee to appraise'}
                {step === 'basic' && 'Set up basic information for the appraisal'}
                {step === 'objectives' && `Create objectives for evaluation (Total: ${getTotalMarks()}/100 marks)`}
                {step === 'preview' && 'Review your appraisal before sending to employee'}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Employee Selection - Skip in clone mode */}
        {step === 'employee-selection' && !isCloneMode && (
          <div className="space-y-4">
            <EmployeeSelector
              label="Employee"
              selectedEmails={formData.selectedEmployee ? [formData.selectedEmployee.email] : []}
              onSelectionChange={handleSelectEmployeeFromSelector}
              employees={cachedEmployees}
              searchTerm={employeeSearchTerm}
              onSearchChange={handleEmployeeSearch}
              shouldShowSkeleton={shouldShowSkeleton}
              maxSelections={1}
              employeeFilter={(emp) => emp.role === 'employee'}
              requiredMin={1}
              onBackendSearch={handleBackendEmployeeSearch}
            />

            {formData.selectedEmployee && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="font-semibold">
                      ✓ Selected: {formData.selectedEmployee.firstName} {formData.selectedEmployee.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{formData.selectedEmployee.email}</div>
                    <div className="text-sm text-gray-600">{formData.selectedEmployee.position}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 'basic' && (
          <div className="space-y-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div>
                  <strong>Employee:</strong> {formData.selectedEmployee?.firstName} {formData.selectedEmployee?.lastName}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="title">Appraisal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => dispatch(setFormData({ ...formData, title: e.target.value }))}
                placeholder="Q4 2024 Performance Review"
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
                      'w-full justify-start text-left font-normal',
                      !formData.dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onSelect={(date) => {
                      dispatch(setFormData({ ...formData, dueDate: date }));
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Step 3: Create Objectives */}
        {step === 'objectives' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Total Objectives: {Object.values(manualObjectives).flat().length}</span>
              <Badge variant={getTotalMarks() === 100 ? 'default' : 'outline'}>
                Total Score: {getTotalMarks()}/100
              </Badge>
            </div>

            {/* Add Objective Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Objective</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={objectiveFormState.category} onValueChange={(value) => setObjectiveFormState({ ...objectiveFormState, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Objective Name</Label>
                  <Input
                    value={objectiveFormState.name}
                    onChange={(e) => setObjectiveFormState({ ...objectiveFormState, name: e.target.value })}
                    placeholder="e.g., Increase sales by 15%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>KPI / Measurement</Label>
                  <Input
                    value={objectiveFormState.kpi}
                    onChange={(e) => setObjectiveFormState({ ...objectiveFormState, kpi: e.target.value })}
                    placeholder="e.g., Sales Revenue"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Marks (out of 100)</Label>
                  <Input
                    type="number"
                    value={objectiveFormState.marks}
                    onChange={(e) => setObjectiveFormState({ ...objectiveFormState, marks: e.target.value })}
                    placeholder="e.g., 20"
                    min="1"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Measurement Tracker (optional)</Label>
                  <Input
                    value={objectiveFormState.measurementTracker}
                    onChange={(e) => setObjectiveFormState({ ...objectiveFormState, measurementTracker: e.target.value })}
                    placeholder="e.g., Monthly reports"
                  />
                </div>

                <Button onClick={handleAddObjective} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Objective
                </Button>
              </CardContent>
            </Card>

            {/* Display Objectives by Category */}
            {CATEGORIES.map((category) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.replace(/_/g, ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {manualObjectives[category]?.length > 0 ? (
                    manualObjectives[category].map((objective) => (
                      <div key={objective.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{objective.name}</h4>
                          <p className="text-sm text-gray-600">{objective.kpi}</p>
                          {objective.measurementTracker && <p className="text-xs text-gray-500">{objective.measurementTracker}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{objective.marks} marks</Badge>
                          <button
                            onClick={() => dispatch(removeManualObjective({ category, objectiveId: objective.id }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No objectives added yet</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appraisal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <strong>Employee:</strong> {formData.selectedEmployee?.firstName} {formData.selectedEmployee?.lastName}
                </div>
                <div>
                  <strong>Title:</strong> {formData.title}
                </div>
                <div>
                  <strong>Period:</strong> {formData.period}
                </div>
                <div>
                  <strong>Due Date:</strong> {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : 'Not set'}
                </div>
                <div>
                  <strong>Total Score:</strong> {getTotalMarks()}/100 marks
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CATEGORIES.map((category) => (
                  manualObjectives[category]?.length > 0 && (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category.replace(/_/g, ' ')}</h4>
                      <div className="space-y-2 pl-4">
                        {manualObjectives[category].map((obj) => (
                          <div key={obj.id} className="flex justify-between text-sm">
                            <span>{obj.name}</span>
                            <Badge>{obj.marks} marks</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {step !== 'employee-selection' && !(isCloneMode && step === 'objectives') && (
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
              <Button type="button" onClick={handleNextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Recreating...' : isCloneMode ? 'Recreate' : 'Send to Employee'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppraisalTargetSelection;
