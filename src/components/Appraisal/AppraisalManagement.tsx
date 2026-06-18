import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, AlertTriangle, Copy } from 'lucide-react';
import AppraisalScoring from './AppraisalScoring';
import AppraisalTargetSelection from './AppraisalTargetSelection';
import { Appraisal } from '@/types/appraisal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActivityFilter, setActivityPagination, setIsCreateDialogOpen, setSelectedAppraisal, updateAppraisalInState } from '@/store/slices/appraisal/appraisalSlice';
import { useReduxAppraisal } from '@/hooks/appraisal/useReduxAppraisal';
import { useLoadingState } from '@/hooks/useLoadingState';

import ApprovalSteps from '../Leave/ApprovalSteps';
import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { PaginationNav } from '../ui/paginationNav';
import { getAppraisalStatusBadge } from '../getAppraisalBadge';
import { reverseDepartmentMap } from '@/types/report';

const AppraisalManagement: React.FC = () => {
  const dispatch =  useAppDispatch()
 const {user } = useAppSelector((state) => state.auth); 

  const role = user?.role?.toLowerCase();
  const isEmployee = role === 'employee';
  const isTeamLeadOnly = role === 'teamlead';
  const isHr = role === 'hr';
  const isMd = role === 'md';
  const isAdmin = role === 'admin';

  const { isLocalLoading, setLocalLoading, clearLocalLoading } = useLoadingState();
    
  const { isLocalLoading: loading, setLocalLoading:setLoading, clearLocalLoading:clearLoading } = useLoadingState();
  const {cachedPageData, isLoading, totalPages,  handleUpdateAppraisalRequest, handleApproveAppraisalRequest, handleRejectAppraisalRequest, refetchActivity} = useReduxAppraisal()
  const { activityPagination, activityCache, activityFilter:filter, isLoading:appraisalLoading, isCreateDialogOpen, selectedAppraisal} = useAppSelector((state) => state.appraisal);
  // const safeAppraisalRequests = Array.isArray(cachedPageData) ? cachedPageData : [];
 const safeAppraisalRequests = Array.isArray(cachedPageData)
  ? cachedPageData
  : (cachedPageData && typeof cachedPageData === "object" && "appraisals" in cachedPageData &&
      Array.isArray((cachedPageData as any).appraisals))
    ? (cachedPageData as any).appraisals
    : [];

    console.log("Safe Appraisal Requests:", safeAppraisalRequests);

    
  const [hrAdjustments, setHrAdjustments] = useState({
       innovation: 0,
       commendation: 0,
       query: 0,
       majorError: 0,
     });

  // Clone mode state
  const [clonedAppraisal, setClonedAppraisal] = useState<Appraisal | null>(null);
  const [isCloneMode, setIsCloneMode] = useState(false);

  // Load hrAdjustments from selectedAppraisal when it opens
  React.useEffect(() => {
    if (selectedAppraisal?.hrAdjustments) {
      // Convert any boolean values to 0 for backwards compatibility
      const converted = Object.entries(selectedAppraisal.hrAdjustments).reduce((acc, [key, val]) => {
        acc[key as keyof typeof hrAdjustments] = typeof val === 'number' ? val : 0;
        return acc;
      }, {} as typeof hrAdjustments);
      setHrAdjustments(converted);
    } else {
      setHrAdjustments({
        innovation: 0,
        commendation: 0,
        query: 0,
        majorError: 0,
      });
    }
  }, [selectedAppraisal?._id]);


 

  const isPrivilegedReviewer =
    ['teamlead', 'hr', 'md'].includes(role) &&
    (
      (role === 'teamlead' && selectedAppraisal?.reviewLevel === 'teamlead' && selectedAppraisal?.teamLeadId === user?._id) ||
      (role === 'hr' && selectedAppraisal?.reviewLevel === 'hr') 
    );



const handleAppraisalUpdate = async (
  updatedAppraisal: Appraisal & { _id?: string},
  action: 'pending' | 'submitted' | 'approved' | 'needs_revision' | 'sent_to_employee' | 'rejected' | 'awaiting_hr_review' | 'update'
) => {
  const id = updatedAppraisal._id ?? updatedAppraisal._id;

  
  if (!id) {

    return;
  }

  // Strip _id/id out to avoid conflicts, BUT preserve hrAdjustments explicitly
  const { _id, _id: ignoredId, ...rest } = updatedAppraisal;

  const payload: any = {
    ...rest,
    ...(hrAdjustments && Object.values(hrAdjustments).some(v => v !== 0) ? { hrAdjustments } : {}),  
    ...(action !== 'update' ? { status: action } : {}), 
  };


  setLoading(id, action);

  const handledByUpdate = [
    'pending',
    'submitted',
    'needs_revision',
    'sent_to_employee',
    'update',
  ];

  try {
    let result = null;
    if (action === 'approved') {
      result = await handleApproveAppraisalRequest(id, payload);
    } else if (action === 'rejected') {
      result = await handleRejectAppraisalRequest(id, payload);
    } else if (handledByUpdate.includes(action)) {
      result = await handleUpdateAppraisalRequest(id, payload);
    }

    // Update Redux with the response data for any action that returns data
    if (result && result.data) {
      const updatedAppraisal = result.data.data || result.data;
      dispatch(setSelectedAppraisal({
        ...updatedAppraisal,
        employeeId: updatedAppraisal.user?._id,
      }));
    }

    // Refetch activity to update the table
    refetchActivity();
  } catch (error) {
  } finally {
    clearLoading(id, action);
  }
};


  const handleViewAppraisal = (appraisal: any) => {
    dispatch(setSelectedAppraisal({
      ...appraisal,
      employeeId: appraisal.user?._id, 
    }));
  };

  const handleClone = (appraisal: Appraisal) => {
    setClonedAppraisal(appraisal);
    setIsCloneMode(true);
    dispatch(setIsCreateDialogOpen(true));
  };

if (selectedAppraisal) {
  const handleBackAndRefresh = () => {
    // Clear the selected appraisal to go back to the table
    dispatch(setSelectedAppraisal(null));
    
    // Refetch activity so table is updated
    refetchActivity();
  };

  return (
    <AppraisalScoring
      key={selectedAppraisal._id + (selectedAppraisal.updatedAt || "")}
      appraisal={selectedAppraisal}
      canReviewAppraisal={isPrivilegedReviewer}
      isEmployee={isEmployee && selectedAppraisal.employeeId === user?._id}
      onBack={handleBackAndRefresh}
      onSubmit={handleAppraisalUpdate}
      objectives={selectedAppraisal.objectives}
      isLoading={appraisalLoading}
      loading={loading}
      hr={isHr}
      teamlead={isTeamLeadOnly}
      hrAdjustments={hrAdjustments}
      setHrAdjustments={setHrAdjustments}
      onClone={handleClone}
    />
  );
}


  // if (selectedAppraisal) {
  //   return (
  //     <AppraisalScoring
  //       appraisal={selectedAppraisal}
  //       canReviewAppraisal={isPrivilegedReviewer}
  //       isEmployee={isEmployee && selectedAppraisal.employeeId === user?._id}
  //       onBack={() => dispatch(setSelectedAppraisal(null))}
  //       onSubmit={handleAppraisalUpdate}
  //       objectives={selectedAppraisal.objectives}
  //       isLoading={appraisalLoading}
  //       loading={loading}
  //       hr={isHr}
  //       teamlead={isTeamLeadOnly}
  //        hrAdjustments={hrAdjustments}
  //       setHrAdjustments={setHrAdjustments}
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Performance Appraisal</h2>
            <p className="text-gray-600">Manage and track employee performance evaluations</p>
          </div>
          {isTeamLeadOnly && (
            <Button onClick={() => dispatch(setIsCreateDialogOpen(true))} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Appraisal
            </Button>
          )}
        </div>

        {/* Main Content */}
   <Card>
  <CardHeader>
    <CardTitle>Appraisals</CardTitle>
    <CardDescription>All appraisals in the system</CardDescription>
  </CardHeader>

  <CardContent>
    <Tabs
      value={filter}
      onValueChange={(value) => {
        dispatch(setActivityFilter(value));
        dispatch(setActivityPagination({ ...activityPagination, page: 1 }));
      }}
    >
      {/* <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList> */}
    </Tabs>

    {isLoading.appraisaActivityLoading ? (
      // 👇 Skeleton loading state
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {(isTeamLeadOnly || isAdmin || isHr || isMd) && (
                <TableHead className="hidden sm:table-cell">Employee Name</TableHead>
              )}
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Period</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ) : safeAppraisalRequests?.length === 0 ? (
      // 👇 Empty state
      <div className="text-center py-8 text-gray-500">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No appraisals found</p>
        {isTeamLeadOnly && (
          <Button
            onClick={() => dispatch(setIsCreateDialogOpen(true))}
            className="mt-4"
            variant="outline"
          >
            Create your first appraisal
          </Button>
        )}
      </div>
    ) : (
      // 👇 Normal rendering
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {(isTeamLeadOnly || isHr || isMd || isAdmin) && (
        
                <TableHead className="hidden sm:table-cell">Employee Name</TableHead>
       
              )}
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Period</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {safeAppraisalRequests.map((appraisal: Appraisal, index:number) => {
                    let updatedRequest = {...appraisal}

                    if("teamLeadId" in appraisal){
                      updatedRequest = {
                                            ...updatedRequest,
                                            typeIdentify: "appraisal"
                                          } 
                                      

                    } 
              const trail = Array.isArray(appraisal.reviewTrail) ? appraisal.reviewTrail : [];
              const latestReview = trail.at(-1);
              const rejectedReview = trail.find((r) => r.action === 'rejected');
              const hrApproved = trail.find((r) => r.role === 'hr' && r.action === 'approved');

              const finalStatus = rejectedReview
                ? 'rejected'
                : hrApproved
                ? 'approved'
                : appraisal.status;

              const latestFinalReview = rejectedReview || hrApproved || latestReview;

              return (
                <TableRow key={appraisal._id || `appraisal-${index}`}>
                  <TableCell className="font-medium">{appraisal.title?.toLocaleUpperCase()}</TableCell>

                  {(isTeamLeadOnly || isAdmin || isHr || isMd) && (
                 
                    <TableCell className="font-medium">
                    {appraisal.employeeName ?? 'N/A'} {appraisal.employeeLastName ?? ''}
                    </TableCell>
                
                  )}

                  <TableCell className="hidden sm:table-cell">{reverseDepartmentMap[appraisal?.department]}</TableCell>              
                  <TableCell className="hidden sm:table-cell">
                    {appraisal.period
                      ? appraisal.period.charAt(0).toUpperCase() + appraisal.period.slice(1)
                      : ""}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {appraisal.dueDate
                      ? new Date(appraisal.dueDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>

                  <TableCell>
                    <motion.div
                      key={finalStatus}
                      initial={{ opacity: 0.6, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getAppraisalStatusBadge(appraisal, user?.role)}
                      {/* <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        {latestFinalReview?.role && (
                          <div>
                            Last reviewed by <strong>{latestFinalReview.role}</strong>
                          </div>
                        )}
                        {latestFinalReview?.date && (
                          <div>
                            <strong>
                              {new Date(latestFinalReview.date).toLocaleDateString()}
                            </strong>
                          </div>
                        )}
                      </div> */}
                      <ApprovalSteps request={updatedRequest} />
                    </motion.div>
                  </TableCell>

                  <TableCell className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAppraisal(appraisal)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    
                    {appraisal.status === 'approved' && isTeamLeadOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClone(appraisal)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="hidden sm:inline">Recreate</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    )}

    {/* ✅ Pagination always rendered below, if data exists */}
    {/* {activityPagination.pages > 1 && (
      <PaginationNav
        page={activityPagination.page}
        totalPages={activityPagination.pages}
        onPageChange={(newPage) =>
          dispatch(setActivityPagination({ ...activityPagination, page: newPage }))
        }
        className="mt-6"
      />
    )} */}

          {activityPagination.pages > 1 && (

     <PaginationNav
                    page={activityPagination?.page}
                    totalPages={totalPages}
                    pageSize={activityPagination?.limit || 20}
                    onPageChange={(newPage) =>
                      dispatch(
                        setActivityPagination({
                          ...activityPagination,
                          page: newPage,
                        })
                      )
                    }
                    onPageSizeChange={(newSize) =>
                      dispatch(
                        setActivityPagination({
                          ...activityPagination,
                          page: 1,
                          limit: newSize,
                        })
                      )
                    }
                    className="mt-6"
                  />
              )}

  </CardContent>
</Card>


        {/* Create Appraisal Dialog */}
        <AppraisalTargetSelection
          isOpen={isCreateDialogOpen}
          onClose={() => {
            dispatch(setIsCreateDialogOpen(false));
            setIsCloneMode(false);
            setClonedAppraisal(null);
          }}
          clonedAppraisal={isCloneMode ? clonedAppraisal : undefined}
          isCloneMode={isCloneMode}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};

export default AppraisalManagement;




