import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Eye } from 'lucide-react';
import { Appraisal } from '@/types/appraisal';
import { useLazyGetAllProfileQuery } from '@/store/slices/profile/profileApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useReduxAppraisal } from '@/hooks/appraisal/useReduxAppraisal';
import { setSelectedAppraisal } from '@/store/slices/appraisal/appraisalSlice';
import { toast } from '@/hooks/use-toast';

interface HRRecommendationProps {
  isOpen: boolean;
  onClose: () => void;
}

const HRRecommendation: React.FC<HRRecommendationProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [employeeAppraisals, setEmployeeAppraisals] = useState<Appraisal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAppraisals, setIsLoadingAppraisals] = useState(false);

  const dispatch = useAppDispatch();
  const { appraisalActivity } = useReduxAppraisal();
  const [triggerBackendSearch] = useLazyGetAllProfileQuery();

  const handleEmployeeSearch = async () => {
    if (!searchTerm.trim()) {
      toast({ title: 'Please enter employee name or email', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    try {
      const response = await triggerBackendSearch({
        page: 1,
        limit: 10,
        search: searchTerm.trim(),
      }).unwrap();

      const data = Array.isArray(response) ? response : response?.data?.data || [];
      setEmployees(data);
      
      if (data.length === 0) {
        toast({ title: 'No employees found', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Search failed', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    loadEmployeeAppraisals(employee._id);
  };

  const loadEmployeeAppraisals = (employeeId: string) => {
    setIsLoadingAppraisals(true);
    try {
      // Find appraisals for this employee that are pending HR review
      const appraisals = appraisalActivity.filter(
        (appraisal) =>
          appraisal.employeeId === employeeId &&
          appraisal.reviewLevel === 'hr' &&
          appraisal.status !== 'rejected'
      );

      if (appraisals.length === 0) {
        toast({ title: 'No appraisals pending for this employee', variant: 'default' });
      }
      
      setEmployeeAppraisals(appraisals);
    } finally {
      setIsLoadingAppraisals(false);
    }
  };

  const handleOpenAppraisal = (appraisal: Appraisal) => {
    // Set the selected appraisal in Redux to open it in AppraisalScoring view
    dispatch(setSelectedAppraisal({
      ...appraisal,
      employeeId: appraisal.employeeId || selectedEmployee?._id,
    }));
    
    // Close this dialog - the AppraisalScoring view will handle the HR adjustments
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setEmployees([]);
    setSelectedEmployee(null);
    setEmployeeAppraisals([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>HR Recommendation</DialogTitle>
          <DialogDescription>
            Search for an employee and select their appraisal to provide recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmployeeSearch()}
                />
                <Button onClick={handleEmployeeSearch} disabled={isSearching} className="gap-2">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employees List */}
          {employees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Found {employees.length} Employee(s)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {employees.map((emp) => (
                  <div
                    key={emp._id}
                    onClick={() => handleSelectEmployee(emp)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedEmployee?._id === emp._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                        <p className="text-sm text-gray-600">{emp.email}</p>
                      </div>
                      {selectedEmployee?._id === emp._id && (
                        <Badge className="bg-blue-500">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Appraisals List */}
          {selectedEmployee && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isLoadingAppraisals ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading appraisals...
                    </span>
                  ) : (
                    `Appraisals Pending for ${selectedEmployee.firstName} (${employeeAppraisals.length})`
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {employeeAppraisals.length > 0 ? (
                  employeeAppraisals.map((appraisal) => (
                    <div key={appraisal._id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{appraisal.title}</p>
                          <p className="text-sm text-gray-600">Period: {appraisal.period}</p>
                          <p className="text-xs text-gray-500">Team Lead Score: {appraisal.totalScore?.teamLead || 0}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOpenAppraisal(appraisal)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  !isLoadingAppraisals && (
                    <p className="text-sm text-gray-500 text-center py-4">No pending appraisals</p>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HRRecommendation;
