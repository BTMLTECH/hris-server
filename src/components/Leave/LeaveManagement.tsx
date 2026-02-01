// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { LeaveActivityFeedItem, LeaveRequest } from "@/types/leave";
// import {
//   Check,
//   Delete,
//   Edit,
//   Eye,
//   Filter,
//   Hand,
//   Info,
//   Loader2,
//   MoreHorizontal,
//   Notebook,
//   NotebookPen,
//   NotepadText,
//   Plus,
//   Trash,
//   Trash2,
//   Upload,
//   X,
// } from "lucide-react";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useCombinedContext } from "@/contexts/AuthContext";
// import { toast } from "@/hooks/use-toast";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import {
//   setDateCalculation,
//   updateStatusOverview,
//   setFormData,
//   setIsDialogOpen,
//   setSelectedRequest,
//   setRejectionNote,
//   setCreateIsDialogOpen,
//   resetLeaveState,
//   resetFormData,
//   LeaveType,
//   setLoading,
//   AllApprovedFeedCache,
//   setAllLeavePagination,
//   setActivityFeedPagination,
//   setSelectedRequestId,
//   setLeaveDialog,
// } from "@/store/slices/leave/leaveSlice";
// import { calculateWorkingDays, getHolidaysInRange } from "@/utils/holidays";
// import { useReduxAuth } from "@/hooks/auth/useReduxAuth";
// import { ProfileFormData, TeamLeadDepartmentProfile } from "@/types/user";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Checkbox } from "../ui/checkbox";
// import { useLoadingState } from "@/hooks/useLoadingState";
// import { useReduxLeave } from "@/hooks/leave/useReduxLeave";
// import { PaginationNav } from "../ui/paginationNav";
// import { LeaveCalendar } from "./LeaveCalendar";
// import { LeaveBalanceDialog } from "./LeaveBalanceDialog";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@radix-ui/react-dropdown-menu";
// import { EmployeeSelector } from "../ui/employee-selector";
// import { setSearchTerm } from "@/store/slices/profile/profileSlice";
// import ApprovalSteps from "./ApprovalSteps";
// import { Appraisal } from "@/types/appraisal";
// import { reverseDepartmentMap } from "@/types/report";
// import { setPayrollPagination } from "@/store/slices/payroll/payrollSlice";
// import { LeaveActivityTableSkeleton } from "../Attendance/AttendanceTableSkeleton";

// const LeaveManagement: React.FC = () => {
//   const { user: userLeaveManagement, leave } = useCombinedContext();
//   const { user } = userLeaveManagement;
//   const { user: currentUser } = useAppSelector((state) => state.auth);
//   const { searchTerm, formData:leaveBalance } = useAppSelector((state) => state.profile);
//   const { cachedEmployees, shouldShowSkeleton } = useReduxAuth();
//   const { isLocalLoading, setLocalLoading, clearLocalLoading } =
//     useLoadingState();
//   const [leaveBalanceOpen, setLeaveBalanceOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] =
//     useState<ProfileFormData | null>(null);
//   const [selectedType, setSelectedType] = useState<string>("annual");
//   const [newBalance, setNewBalance] = useState<number>(0);
//   const canManageEmployees = user?.role === "admin" || user?.role === "hr";

//   const {
//     handleCreateLeaveRequest,
//     handleApproveLeaveRequest,
//     handleRejectLeaveRequest,
//     handleUpdateLeaveBalance,
//     handleDeleteLeaveRequest,
//     totalPages

//   } = leave;
//   const {
//     isDialogOpen,
//     formData,
//     dateCalculation,
//     isLoading,
//     statusOverview,
//     selectedRequest,
//     rejectionNote,
//     createIsDialogOpen,
//     activityFeedCache,
//     activityFeedPagination,
//     approvalsCache,
//     approvalsPagination,
//     allApprovedPagination,
//     leaveDialog,
//     selectedRequestId,
//     teamLead
//   } = useAppSelector((state) => state.leave);
  
//   const dispatch = useAppDispatch();
//   const canApproveLeave =
//     user?.role === "teamlead" ||
//     user?.role === "admin" ||
//     user?.role === "hr" ||
//     user?.role === "employee" ||
//     user?.role === "md";
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const { profilePagination, teamleads } = useAppSelector((state) => state.profile);
//   const { cachedApprovedLeave } = useReduxLeave();
//   const canView = user?.role === "admin" || user?.role === "hr";
//   const currentLeavePage = activityFeedPagination?.page ?? 1;
//   const cachedMyApproved = activityFeedCache?.[currentLeavePage] ?? [];
//   const currentApprovalPage = approvalsPagination?.page ?? 1;
//   const cachedApproval = approvalsCache?.[currentApprovalPage] ?? [];


//   const rowsToRender: LeaveActivityFeedItem[] = ["hr", "admin"].includes(
//     user?.role ?? ""
//   )
//     ? cachedApprovedLeave
//     : cachedMyApproved;

// console.log("teamlead", teamleads)

// const isLeaveExceedsBalance = () => {
//   const leaveBalances = leaveBalance.leaveBalance?.balances || {};

//   // Extract the available leave balance for the selected type
//   const balance = leaveBalances[formData.type] || 0;

//   // Check if the requested working days exceed the balance
//   return dateCalculation?.workingDays > balance;
// };

//   const calculateDays = (start: string, end: string) => {
//     if (!start || !end) return null;
//     const calculation = calculateWorkingDays(start, end);
//     const holidays = getHolidaysInRange(start, end);

//     return {
//       totalDays: calculation.totalDays,
//       workingDays: calculation.workingDays,
//       holidays,
//     };
//   };


//   const handleDateChange = (field: "startDate" | "endDate", value: string) => {
//     const newFormData = { ...formData, [field]: value };
//     dispatch(setFormData(newFormData));

//     if (newFormData.startDate && newFormData.endDate) {
//       const calculation = calculateDays(
//         newFormData.startDate,
//         newFormData.endDate
//       );
//       dispatch(setDateCalculation(calculation));
//        if (calculation.workingDays > leaveBalance.leaveBalance?.balances[formData.type]) {
//       // Trigger the error toast if working days exceed balance
//       toast({
//         title: "Leave Request Exceeds Balance",
//         description: `Your requested leave days of ${calculation.workingDays} exceed the available balance for ${formData.type} leave.`,
//         variant: "destructive", // This shows a red error message
//       });
//      }
      
//     } else {
//       dispatch(setDateCalculation(null));
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const validExt = [".pdf"];
//     const isValid = validExt.some((ext) => file.name.endsWith(ext));

//     if (!isValid) {
//       toast({
//         title: "Invalid File Type",
//         description: "Please upload a PDF file (.pdf)",
//         variant: "destructive",
//       });
//       return;
//     }

//     setUploadedFile(file);
//     toast({
//       title: "File Uploaded",
//       description: `${file.name} is ready for submission.`,
//     });
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   if (!formData.teamleadId) {
//   //     toast({
//   //       title: "Team Lead Required",
//   //       description: "Please select a team lead to review your leave request.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   const calculation = calculateDays(formData.startDate, formData.endDate);
//   //   if (!calculation) {
//   //     toast({
//   //       title: "Invalid Dates",
//   //       description: "Please select valid start and end dates.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }
//   //   if (!uploadedFile) {
//   //     toast({
//   //       title: "No File Uploaded",
//   //       description: "Please upload a supporting document.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   // ✅ Use FormData to include file
//   //   const formDataToSend = new FormData();
//   //   formDataToSend.append("file", uploadedFile);
//   //   formDataToSend.append("type", formData.type);
//   //   formDataToSend.append("startDate", formData.startDate);
//   //   formDataToSend.append("endDate", formData.endDate);
//   //   formDataToSend.append("days", calculation.workingDays.toString());
//   //   formDataToSend.append("reason", formData.reason);
//   //   formDataToSend.append("teamleadId", formData.teamleadId);
//   //   formDataToSend.append("typeIdentify", formData.typeIdentify);
//   //   formDataToSend.append("allowance", formData.allowance);
//   //   formData.relievers?.forEach((reliever) =>
//   //     formDataToSend.append("relievers", reliever)
//   //   );

//   //   const success = await handleCreateLeaveRequest(formDataToSend);

//   //   if (success) {
//   //     dispatch(setCreateIsDialogOpen(false));
//   //     setFormData({
//   //       type: "annual",
//   //       startDate: "",
//   //       endDate: "",
//   //       reason: "",
//   //       teamleadId: "",
//   //       days: 0,
//   //       typeIdentify: "leave",
//   //       allowance: "yes",
//   //       relievers: [],
//   //     });
//   //     setUploadedFile(null);
//   //     dispatch(setDateCalculation(null));
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // Team lead selection is still required
//   if (!formData.teamleadId) {
//     toast({
//       title: "Team Lead Required",
//       description: "Please select a team lead to review your leave request.",
//       variant: "destructive",
//     });
//     return;
//   }

//   // Relievers validation ONLY for non-teamlead users
//   if (
//     user?.role !== "teamlead" &&
//     (!formData.relievers || formData.relievers.length < 2)
//   ) {
//     toast({
//       title: "Relievers Required",
//       description: "Please select at least 2 relievers.",
//       variant: "destructive",
//     });
//     return;
//   }

//   const calculation = calculateDays(formData.startDate, formData.endDate);
//   if (!calculation) {
//     toast({
//       title: "Invalid Dates",
//       description: "Please select valid start and end dates.",
//       variant: "destructive",
//     });
//     return;
//   }

//   if (!uploadedFile) {
//     toast({
//       title: "No File Uploaded",
//       description: "Please upload a supporting document.",
//       variant: "destructive",
//     });
//     return;
//   }

//   // ✅ Use FormData to include file
//   const formDataToSend = new FormData();
//   formDataToSend.append("file", uploadedFile);
//   formDataToSend.append("type", formData.type);
//   formDataToSend.append("startDate", formData.startDate);
//   formDataToSend.append("endDate", formData.endDate);
//   formDataToSend.append("days", calculation.workingDays.toString());
//   formDataToSend.append("reason", formData.reason);
//   formDataToSend.append("teamleadId", formData.teamleadId);
//   formDataToSend.append("typeIdentify", formData.typeIdentify);
//   formDataToSend.append("allowance", formData.allowance);

//   // Append relievers ONLY if user is not teamlead
//   if (user?.role !== "teamlead") {
//     formData.relievers.forEach((reliever) =>
//       formDataToSend.append("relievers", reliever)
//     );
//   }

//   const success = await handleCreateLeaveRequest(formDataToSend);

//   if (success) {
//     dispatch(setCreateIsDialogOpen(false));
//     dispatch(
//       setFormData({
//         type: "annual",
//         startDate: "",
//         endDate: "",
//         reason: "",
//         teamleadId: "",
//         days: 0,
//         typeIdentify: "leave",
//         allowance: "yes",
//         relievers: [],
//       })
//     );
//     setUploadedFile(null);
//     dispatch(setDateCalculation(null));
//   }
// };


//   const handleApproveLeaveRequestFlow = async (
//     requestId: string,
//     action: string
//   ) => {
//     setLocalLoading(requestId, action);
//     const success = await handleApproveLeaveRequest(requestId);
//     if (success) {
//       clearLocalLoading(requestId, action);
//     }
//   };

//   const handleRejectLeaveRequestWithNote = async (
//     id: string,
//     note: string,
//     action: string
//   ): Promise<boolean> => {
//     return handleRejectLeaveRequest(id, note);
//   };



//     const handleDeleteRequest = async (
//     requestId: string,
//     action: string
//   ) => {
//     setLocalLoading(requestId, action);
//     const success = await handleDeleteLeaveRequest(requestId);
//     if (success) {
//       clearLocalLoading(requestId, action);
//     }
//   };
//   const getStatusBadge = (status: LeaveRequest["status"]) => {
//     const variants = {
//       pending: "outline",
//       approved: "default",
//       rejected: "destructive",
//       expired: "destructive",
//     } as const;

//     return (
//       <Badge variant={variants[status]}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const getLeaveTypeColor = (type?: LeaveRequest["type"]) => {
//     const colors: Record<string, string> = {
//       annual: "bg-blue-100 text-blue-800",
//       sick: "bg-red-100 text-red-800",
//       compensation: "bg-green-100 text-green-800",
//       maternity: "bg-purple-100 text-purple-800",
//     };

//     return colors[type ?? ""] || "bg-gray-100 text-gray-800";
//   };

//   const handleViewRequest = (request: LeaveActivityFeedItem) => {
//     dispatch(setLeaveDialog(true));
//     dispatch(setSelectedRequestId(request));
//   };

//   const handleEditClick = (emp: ProfileFormData) => {
//     setSelectedEmployee(emp);
//     setSelectedType("annual");
//     setNewBalance(emp.leaveBalance?.balances.annual ?? 0);
//     setEditOpen(true);
//   };

//   const handleEditBalance = async ({
//     employeeId,
//     leaveType,
//     balance,
//   }: {
//     employeeId: string;
//     leaveType: "annual" | "compassionate" | "maternity";
//     balance: number;
//   }) => {
//     const success = await handleUpdateLeaveBalance(employeeId, {
//       leaveType,
//       balance,
//     });
//     if (success) {
//       setEditOpen(false);
//     }
//   };




//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Leave Management</h2>
//           <p className="text-gray-600">Manage leave requests and balances</p>
//         </div>

//         {/* Manage Leave Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="flex items-center gap-2">
//               <MoreHorizontal className="h-4 w-4" />
//               {canView ? "Manage Leave" : "Request Leave"}
//             </Button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             align="end"
//             sideOffset={6}
//             className="w-48 bg-white shadow-lg rounded-md border border-gray-200 cursor-pointer gap-2 p-2"
//           >
//             {/* Edit Leave */}
//             {canManageEmployees && (
//               <DropdownMenuItem
//                 onClick={() => setLeaveBalanceOpen(true)}
//                 className="flex items-center"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Edit Balance
//               </DropdownMenuItem>
//             )}

//             <DropdownMenuSeparator />

//             {/* Request Leave */}
//             <DropdownMenuItem
//               onClick={() => dispatch(setCreateIsDialogOpen(true))}
//               className="flex items-center"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Request Leave
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <LeaveBalanceDialog
//           isOpen={leaveBalanceOpen}
//           onClose={() => setLeaveBalanceOpen(false)}
//           employees={cachedEmployees}
//           profilePagination={profilePagination}
//           editOpen={editOpen}
//           setEditOpen={setEditOpen}
//           selectedEmployee={selectedEmployee}
//           selectedType={selectedType}
//           setSelectedType={setSelectedType}
//           newBalance={newBalance}
//           setNewBalance={setNewBalance}
//           onSubmit={handleEditBalance}
//           onEdit={handleEditClick}
//           isLoading={isLoading}
//         />

//         {/* Request Leave Dialog */}
//         <Dialog
//           open={createIsDialogOpen}
//           onOpenChange={(isOpen) => {
//             dispatch(setCreateIsDialogOpen(isOpen));
//             if (!isOpen) {
//               dispatch(resetFormData());
//             }
//           }}
//         >
//           <DialogContent
//             className="
//         bg-white
//         rounded-2xl
//         shadow-xl
//         max-w-2xl
//         w-full
//         sm:mx-4
//         mx-2
//         max-h-[90vh]
//         overflow-y-auto
//         p-6
//         animate-slide-in
//       "
//           >
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-semibold text-gray-800">
//                 Request Leave
//               </DialogTitle>
//               <DialogDescription className="text-gray-600 text-sm mt-1">
//                 Submit a new leave request. Working days are calculated
//                 excluding weekends and Nigerian public holidays.
//               </DialogDescription>
//             </DialogHeader>
//              {/* Display leave balances */}
           
//             {/* Leave Balances Box */}
//             <div className="mt-4 p-3 border border-gray-200 rounded-lg shadow-sm bg-white">
//               <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">Leave Balance</h3>
              
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//                 {/* Annual Leave */}
//                 <div className="flex justify-between items-center p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm">
//                   <span className="text-xs sm:text-sm text-gray-600 font-medium">Annual</span>
//                   <span className="text-sm sm:text-base text-green-600 font-semibold">
//                     {leaveBalance.leaveBalance?.balances?.annual || 0}
//                   </span>
//                 </div>
                
//                 {/* Compassionate Leave */}
//                 <div className="flex justify-between items-center p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm">
//                   <span className="text-xs sm:text-sm text-gray-600 font-medium">Compassionate</span>
//                   <span className="text-sm sm:text-base text-yellow-600 font-semibold">
//                     {leaveBalance.leaveBalance?.balances?.compassionate || 0}
//                   </span>
//                 </div>

//                 {/* Maternity Leave */}
//                 <div className="flex justify-between items-center p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm">
//                   <span className="text-xs sm:text-sm text-gray-600 font-medium">Maternity</span>
//                   <span className="text-sm sm:text-base text-pink-600 font-semibold">
//                     {leaveBalance.leaveBalance?.balances?.maternity || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* === Full Request Leave Form === */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Leave Type & Team Lead */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="type">Leave Type</Label>
//                   <Select
//                     value={formData.type}
//                     onValueChange={(value) =>
//                       dispatch(
//                         setFormData({ ...formData, type: value as LeaveType })
//                       )
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select leave type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="annual">Annual</SelectItem>
//                       <SelectItem value="compassionate">
//                         Compassionate
//                       </SelectItem>
//                       <SelectItem value="maternity">Maternity</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="teamLead">
//                   {user?.role === "teamlead" ? "HR" : "Team Lead"}
//                 </Label>

//                   <Select
//                     value={formData.teamleadId}
//                     onValueChange={(value) =>
//                       dispatch(setFormData({ ...formData, teamleadId: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       {/* <SelectValue placeholder="Select team lead" /> */}
//                       <SelectValue
//                         placeholder={
//                           user?.role === "teamlead"
//                             ? "Select HR"
//                             : "Select team lead"
//                         }
//                       />  
//                     </SelectTrigger>
              
//                     <SelectContent>
//                       {teamleads?.length ? (
//                         teamleads.map((lead: TeamLeadDepartmentProfile) => (
//                           <SelectItem key={lead._id} value={lead._id}>
//                             {lead.firstName} {lead.lastName} ({lead.position})
//                           </SelectItem>
//                         ))
//                       ) : (
//                         <div className="p-2 text-gray-400 text-sm">No team leads available</div>
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Dates */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="startDate">Start Date</Label>
//                   <Input
//                     id="startDate"
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(e) =>
//                       handleDateChange("startDate", e.target.value)
//                     }
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="endDate">End Date</Label>
//                   <Input
//                     id="endDate"
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) =>
//                       handleDateChange("endDate", e.target.value)
//                     }
//                     min={formData.startDate}
//                     required
//                   />
//                 </div>
//               </div>

            
//               {dateCalculation && (
//                 <Card className="bg-blue-50 border-blue-200">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <Info className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <div className="space-y-2">
//                         <h4 className="font-medium text-blue-900">
//                           Leave Duration
//                         </h4>
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="text-gray-600">Total Days:</span>
//                             <span className="ml-2 font-medium">
//                               {dateCalculation.totalDays}
//                             </span>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Working Days:</span>
//                             <span className="ml-2 font-medium text-blue-600">
//                               {dateCalculation.workingDays}
//                             </span>
//                           </div>
//                         </div>
//                         {dateCalculation.holidays.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-sm font-medium text-gray-700 mb-1">
//                               Excluded Days:
//                             </p>
//                             <div className="flex flex-wrap gap-1">
//                               {dateCalculation.holidays.map(
//                                 (holiday, index) => (
//                                   <Badge
//                                     key={index}
//                                     variant="outline"
//                                     className="text-xs"
//                                   >
//                                     {holiday.name}
//                                   </Badge>
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

             

//               {/* <EmployeeSelector
//                 label="Relievers (Select 2 or 3)"
//                 selectedEmails={formData.relievers || []}
//                 onSelectionChange={(emails) =>
//                   dispatch(setFormData({ ...formData, relievers: emails }))
//                 }
//                 employees={cachedEmployees}
//                 searchTerm={searchTerm}
//                 onSearchChange={(term) => dispatch(setSearchTerm(term))}
//                 shouldShowSkeleton={shouldShowSkeleton}
//                 maxSelections={3}
//                 employeeFilter={(emp) =>
//                   emp.role === "employee" && emp.email !== currentUser.email
//                 }
//                 requiredMin={2}
//               /> */}
//               {user?.role !== "teamlead" && (
//                 <EmployeeSelector
//                   label="Relievers (Select 2 or 3)"
//                   selectedEmails={formData.relievers || []}
//                   onSelectionChange={(emails) =>
//                     dispatch(setFormData({ ...formData, relievers: emails }))
//                   }
//                   employees={cachedEmployees}
//                   searchTerm={searchTerm}
//                   onSearchChange={(term) => dispatch(setSearchTerm(term))}
//                   shouldShowSkeleton={shouldShowSkeleton}
//                   maxSelections={3}
//                   employeeFilter={(emp) =>
//                     emp.role === "employee" && emp.email !== currentUser.email
//                   }
//                   requiredMin={2}
//                 />
//               )}


//               {/* Allowance & Reason */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <Label>Allowance</Label>
//                   <div className="flex gap-4 mt-1">
//                     <Button
//                       type="button"
//                       variant={
//                         formData.allowance === "yes" ? "default" : "outline"
//                       }
//                       onClick={() =>
//                         dispatch(setFormData({ ...formData, allowance: "yes" }))
//                       }
//                     >
//                       Yes
//                     </Button>
//                     <Button
//                       type="button"
//                       variant={
//                         formData.allowance === "no" ? "default" : "outline"
//                       }
//                       onClick={() =>
//                         dispatch(setFormData({ ...formData, allowance: "no" }))
//                       }
//                     >
//                       No
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="flex flex-col">
//                   <Label htmlFor="reason">Reason</Label>
//                   <Textarea
//                     id="reason"
//                     value={formData.reason}
//                     onChange={(e) =>
//                       dispatch(
//                         setFormData({ ...formData, reason: e.target.value })
//                       )
//                     }
//                     placeholder="Provide a reason"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* File Upload */}
//               <div className="flex-1 space-y-1">
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   id="handover-upload"
//                 />
//                 <label htmlFor="handover-upload">
//                   <Button
//                     variant="outline"
//                     className="w-full cursor-pointer"
//                     asChild
//                   >
//                     <span className="flex items-center gap-2">
//                       <Upload className="h-4 w-4" />
//                       Upload Handover
//                     </span>
//                   </Button>
//                 </label>
//                 {uploadedFile && (
//                   <div className="text-sm text-muted-foreground">
//                     Selected file:{" "}
//                     <span className="font-medium">{uploadedFile.name}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               <DialogFooter className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     dispatch(setCreateIsDialogOpen(false));
//                     dispatch(
//                       setFormData({
//                         type: "annual",
//                         startDate: "",
//                         endDate: "",
//                         reason: "",
//                         teamleadId: "",
//                         days: 0,
//                         typeIdentify: "leave",
//                         allowance: "yes",
//                         relievers: [],
//                       })
//                     );
//                     setUploadedFile(null);
//                     dispatch(setDateCalculation(null));
//                     dispatch(setLoading(false));
//                   }}
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </Button>
//               <Button
//                 type="submit"
//                 disabled={
//                   isLoading ||
//                   !formData.type ||
//                   !formData.startDate ||
//                   !formData.endDate ||
//                   !formData.reason ||
//                   !formData.teamleadId ||
//                   (user?.role !== "teamlead" &&
//                     (!formData.relievers || formData.relievers.length < 2)) ||
//                   !uploadedFile ||
//                   isLeaveExceedsBalance()
//                 }
//               >
//                   {isLoading ? (
//                     <>
//                       Submitting{" "}
//                       <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                     </>
//                   ) : (
//                     "Submit Request"
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* tab */}

//       <Tabs defaultValue="requests" className="space-y-8">
//         <TabsList
//           className={`grid w-full ${
//             currentUser.role !== "employee" ? "grid-cols-2" : "grid-cols-2"
//           }`}
//         >
//           <TabsTrigger value="requests">
//             {["hr", "admin"].includes(user?.role ?? "")
//               ? "All Leave"
//               : "My Requests"}
//           </TabsTrigger>
//           {/* <TabsTrigger value="status">Status</TabsTrigger> */}
//           <TabsTrigger value="approval">Approval Queue</TabsTrigger>
//         </TabsList>

//         {/* --- My Requests Tab --- */}
//         <TabsContent value="requests">
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 {["hr", "admin"].includes(user?.role ?? "")
//                   ? "All Leave"
//                   : "My Leave Requests"}
//               </CardTitle>
//               <CardDescription>
//                 View and track your leave requests
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Staff Id</TableHead>
//                     <TableHead>Employee Name</TableHead>
//                     <TableHead>Department</TableHead>
//                     <TableHead>Allowance</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Dates</TableHead>
//                     <TableHead>Days</TableHead>
//                     <TableHead>Reason</TableHead>
//                     {/* <TableHead>Relievers</TableHead> */}
//                     {/* <TableHead>Status</TableHead> */}
//                     <TableHead>Applied Date</TableHead>
//                     <TableHead>Handover</TableHead>
//                     <TableHead>Action</TableHead>
         
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                 {(shouldShowSkeleton ||
//                   (isLoading && !activityFeedCache[activityFeedPagination.page]?.length)) ? (
//                   <LeaveActivityTableSkeleton rows={activityFeedPagination?.limit || 6} />
//                 ) : (
//                   rowsToRender.map((request) => {
//                     console.log("request", request);
//                     let updatedRequest = { ...request };

//                     if ("teamleadId" in request) {
//                       updatedRequest = {
//                         ...updatedRequest,
//                         typeIdentify: "leave",
//                       };
//                     }

//                    const trail = Array.isArray(request.reviewTrail) ? request.reviewTrail : [];

//                   const rejectedReview = trail.find(
//                     (r) => r.action === "rejected"
//                   );

//                   const mdApproved = trail.find(
//                     (r) => r.role === "md" && r.action === "approved"
//                   );

//                   let finalStatus: LeaveActivityFeedItem["status"] = request.status;

//                   // ❌ rejection always wins
//                   if (rejectedReview) {
//                     finalStatus = "rejected";
//                   }
//                   // ✅ if MD approved, it is FINAL (teamlead flow)
//                   else if (mdApproved) {
//                     finalStatus = "approved";
//                   }
//                   // ✅ otherwise, trust backend status
//                   else {
//                     finalStatus = request.status;
//                   }


//                     console.log("finalStatus", finalStatus, request.reviewTrail);

//                     return (
//                       <TableRow key={request.id}>
//                         <TableCell>{request.staffId?.toLocaleUpperCase() || "NA"}</TableCell>
//                         <TableCell>{request.employeeName?.toLocaleUpperCase() || "NA"}</TableCell>
//                         <TableCell>{reverseDepartmentMap[request?.department] || "NA"}</TableCell>
//                         <TableCell>{request.allowance ? "Yes" : "No"}</TableCell>

//                         <TableCell>
//                           <Badge className={getLeaveTypeColor(request.type)}>
//                             {typeof request.type === "string"
//                               ? request.type.charAt(0).toUpperCase() + request.type.slice(1)
//                               : "Unknown"}
//                           </Badge>
//                         </TableCell>

//                         <TableCell>
//                           <div className="text-sm">
//                             <div>{new Date(request.startDate).toLocaleDateString()}</div>
//                             <div className="text-gray-500">{new Date(request.endDate).toLocaleDateString()}</div>
//                           </div>
//                         </TableCell>

//                         <TableCell>{request.days} day(s)</TableCell>
//                         <TableCell className="max-w-xs truncate">{request.reason || "-"}</TableCell>

//                         <TableCell>
//                           <motion.div
//                             key={finalStatus}
//                             initial={{ opacity: 0.6, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.2 }}
//                           >
//                             {getStatusBadge(finalStatus as "approved" | "pending" | "rejected")}
//                             <ApprovalSteps request={updatedRequest} />
//                           </motion.div>
//                         </TableCell>

//                         <TableCell>{new Date(request.appliedDate).toLocaleString()}</TableCell>

//                         <TableCell>
//                           <button
//                             className="p-2 rounded-full hover:bg-gray-100"
//                             onClick={() => window.open(`${request?.url}`, "_blank")}
//                           >
//                             <NotepadText className="w-5 h-5 text-gray-600" />
//                           </button>
//                         </TableCell>

//                         {["hr", "admin"].includes(user?.role ?? "") && (
//                           <TableCell>
//                             <button
//                               className="p-2 rounded-full hover:bg-gray-100"
//                               onClick={() => handleViewRequest(request)}
//                             >
//                               <Eye className="w-5 h-5 text-gray-600" />
//                             </button>
//                           </TableCell>
//                         )}

//                         {user?.role === "employee" && request?.status === "pending" && (
//                           <TableCell>
//                             <button
//                               className="p-2 rounded-full hover:bg-gray-100"
//                               onClick={() => handleDeleteRequest(request.id, "deleteLeave")}
//                               disabled={isLocalLoading(request.id, "deleteLeave")}
//                             >
//                               {isLocalLoading(request.id, "deleteLeave") ? (
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               ) : (
//                                 <Trash2 className="w-5 h-5 text-red-600" />
//                               )}
//                             </button>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>

//               </Table>
//               {/* <>
//                 {["hr", "admin"].includes(user?.role ?? "")
//                   ? allApprovedPagination?.pages > 1 && (
//                       <PaginationNav
//                         page={allApprovedPagination?.page}
//                         totalPages={allApprovedPagination?.pages}
//                         onPageChange={(newPage) =>
//                           dispatch(
//                             setAllLeavePagination({
//                               ...allApprovedPagination,
//                               page: newPage,
//                             })
//                           )
//                         }
//                         className="mt-6"
//                       />
//                     )
//                   : activityFeedPagination?.pages > 1 && (
//                       <PaginationNav
//                         page={activityFeedPagination?.page}
//                         totalPages={activityFeedPagination?.pages}
//                         onPageChange={(newPage) =>
//                           dispatch(
//                             setActivityFeedPagination({
//                               ...activityFeedPagination,
//                               page: newPage,
//                             })
//                           )
//                         }
//                         className="mt-6"
//                       />
//                     )}
//               </> */}
//                     {activityFeedPagination.pages > 1 && (

//                 <PaginationNav
//                 page={activityFeedPagination?.page}
//                 totalPages={totalPages}
//                 pageSize={activityFeedPagination?.limit || 20}
//                 onPageChange={(newPage) =>
//                   dispatch(
//                     setActivityFeedPagination({
//                       ...activityFeedPagination,
//                       page: newPage,
//                     })
//                   )
//                 }
//                 onPageSizeChange={(newSize) =>
//                   dispatch(
//                     setActivityFeedPagination({
//                       ...activityFeedPagination,
//                       page: 1,
//                       limit: newSize,
//                     })
//                   )
//                 }
//                 className="mt-6"
//               />
//               )}
              
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* --- Status Tab --- */}
//         {/* <TabsContent value="status">
//           <Card>
//             <CardHeader>
//               <CardTitle>Leave Status Overview</CardTitle>
//               <CardDescription>
//                 Track the status of all your leave requests
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {["pending", "approved", "rejected"].map((status) => (
//                   <Card key={`status-card-${status}`}>
//                     <CardContent className="p-4 text-center">
//                       <div className="text-2xl font-bold mb-2">
//                         {statusOverview[status]}
//                       </div>
//                       <div className="text-sm text-gray-600 capitalize">
//                         {status} Requests
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent> */}

//         {/* --- Approval Queue Tab --- */}
//         {canApproveLeave && (
//           <TabsContent value="approval">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Leave Approval Queue</CardTitle>
//                 <CardDescription>
//                   Review and approve/reject leave requests
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Staff Id</TableHead>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Department</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Dates</TableHead>
//                       <TableHead>Days</TableHead>
//                       <TableHead>Reason</TableHead>
//                       {currentUser?.role != "employee" && (
//                         <TableHead>Allowance</TableHead>
//                       )}
//                       <TableHead>Status</TableHead>
//                       <TableHead>Handover</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {cachedApproval?.flat().map((request) => (
//                       <TableRow key={request.id}>
//                         <TableCell className="font-medium">
//                           {request.staffId}
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {request.employeeName}
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {reverseDepartmentMap[request?.department]}
//                         </TableCell>
                      

//                         <TableCell>
//                           <Badge className={getLeaveTypeColor(request.type)}>
//                             {request.type?.toLocaleUpperCase()}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="text-sm">
//                             <div>
//                               {new Date(request.startDate).toLocaleDateString()}
//                             </div>
//                             <div className="text-gray-500">
                            
//                               {new Date(request.endDate).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>{request.days} day(s)</TableCell>
//                         <TableCell className="max-w-xs truncate">
//                           {request.reason}
//                         </TableCell>

//                         {/* Allowance */}
//                         {currentUser?.role != "employee" && (
//                           <TableCell>
//                             {request.allowance ? (
//                               <Badge variant="success">Yes</Badge>
//                             ) : (
//                               <Badge variant="secondary">No</Badge>
//                             )}
//                           </TableCell>
//                         )}

//                         <TableCell>{getStatusBadge(request?.status)}</TableCell>
//                         {/* Document / URL */}
//                         <TableCell>
//                           {request.url ? (
//                             <a
//                               href={request.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 underline"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </a>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </TableCell>

//                         <TableCell>
//                           {/* {request.status === "pending" && (
//                   )} */}
//                           <div className="flex space-x-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               disabled={isLocalLoading(request.id, "approved")}
//                               onClick={() =>
//                                 handleApproveLeaveRequestFlow(
//                                   request.id,
//                                   "approved"
//                                 )
//                               }
//                             >
//                               {isLocalLoading(request.id, "approved") ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <Check className="h-4 w-4" />
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               // disabled={isLocalLoading(request.id, 'reject')}
//                               style={{ border: "2px solid red" }}
//                               onClick={() => {
//                                 dispatch(setSelectedRequest(request));
//                                 dispatch(setIsDialogOpen(true));
//                               }}
//                             >
//                               {/* {isLocalLoading(request.id, 'reject') ? (
//                             <Loader2 className="h-4 w-4 animate-spin text-red-500" />
//                           ) : (
//                           )} */}
//                               <X className="h-4 w-4 text-red-500" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         )}

//         <Dialog
//           open={leaveDialog}
//           onOpenChange={(open) => dispatch(setLeaveDialog(open))}
//         >
//           <DialogContent className="max-w-md sm:max-w-lg w-full">
//             <DialogHeader>
//               <DialogTitle>Leave Calendar</DialogTitle>
//               <DialogDescription>
//                 Displays leave duration for selected request.
//               </DialogDescription>
//             </DialogHeader>
//             {selectedRequestId ? (
//               <LeaveCalendar request={selectedRequestId} />
//             ) : (
//               <p>No request selected.</p>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* --- Reject Dialog --- */}
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
//         >
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Reject Leave Request</DialogTitle>
//               <DialogDescription>
//                 You are about to reject {selectedRequestId?.employeeName}
//                 's leave request. Please provide a reason.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="rejectionNote">Reason for Rejection</Label>
//                 <Textarea
//                   id="rejectionNote"
//                   value={rejectionNote}
//                   onChange={(e) => dispatch(setRejectionNote(e.target.value))}
//                   placeholder="Provide feedback or reason for rejection..."
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => dispatch(setIsDialogOpen(false))}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 disabled={isLoading}
//                 onClick={async () => {
//                   if (selectedRequest) {
//                     setLocalLoading(selectedRequest.id, "reject");
//                     const success = await handleRejectLeaveRequestWithNote(
//                       selectedRequest.id,
//                       rejectionNote,
//                       "reject"
//                     );
//                     if (success) {
//                       dispatch(
//                         updateStatusOverview({
//                           approved: false,
//                           rejected: true,
//                         })
//                       );
//                       dispatch(resetLeaveState());
//                       dispatch(setIsDialogOpen(false));
//                       clearLocalLoading(selectedRequest.id, "reject");
//                     }
//                   }
//                 }}
//               >
//                 {isLocalLoading(selectedRequest?.id, "reject") && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 Reject Leave
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </Tabs>
//     </div>
//   );
// };

// export default LeaveManagement;
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LeaveActivityFeedItem, LeaveRequest } from "@/types/leave";
import {
  Check,
  Delete,
  Edit,
  Eye,
  Filter,
  Hand,
  Info,
  Loader2,
  MoreHorizontal,
  Notebook,
  NotebookPen,
  NotepadText,
  Plus,
  Trash,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCombinedContext } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setDateCalculation,
  updateStatusOverview,
  setFormData,
  setIsDialogOpen,
  setSelectedRequest,
  setRejectionNote,
  setCreateIsDialogOpen,
  resetLeaveState,
  resetFormData,
  LeaveType,
  setLoading,
  AllApprovedFeedCache,
  setAllLeavePagination,
  setActivityFeedPagination,
  setSelectedRequestId,
  setLeaveDialog,
} from "@/store/slices/leave/leaveSlice";
import { calculateWorkingDays, getHolidaysInRange } from "@/utils/holidays";
import { useReduxAuth } from "@/hooks/auth/useReduxAuth";
import { ProfileFormData, TeamLeadDepartmentProfile } from "@/types/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useReduxLeave } from "@/hooks/leave/useReduxLeave";
import { PaginationNav } from "../ui/paginationNav";
import { LeaveCalendar } from "./LeaveCalendar";
import { LeaveBalanceDialog } from "./LeaveBalanceDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { EmployeeSelector } from "../ui/employee-selector";
import { setSearchTerm } from "@/store/slices/profile/profileSlice";
import ApprovalSteps from "./ApprovalSteps";
import { Appraisal } from "@/types/appraisal";
import { reverseDepartmentMap } from "@/types/report";
import { setPayrollPagination } from "@/store/slices/payroll/payrollSlice";
import { LeaveActivityTableSkeleton } from "../Attendance/AttendanceTableSkeleton";
import { LEAVE_TYPES } from "@/utils/leaveType";


const LeaveManagement: React.FC = () => {
  const { user: userLeaveManagement, leave } = useCombinedContext();
  const { user } = userLeaveManagement;
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { searchTerm, formData:leaveBalance,  } = useAppSelector((state) => state.profile);
  const { cachedEmployees, shouldShowSkeleton } = useReduxAuth();
  const { isLocalLoading, setLocalLoading, clearLocalLoading } =
    useLoadingState();
  const [leaveBalanceOpen, setLeaveBalanceOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ProfileFormData | null>(null);
  const [selectedType, setSelectedType] = useState<string>("annual");
  const [newBalance, setNewBalance] = useState<number>(0);
  const canManageEmployees = user?.role === "admin" || user?.role === "hr";

  const {
    handleCreateLeaveRequest,
    handleApproveLeaveRequest,
    handleRejectLeaveRequest,
    handleUpdateLeaveBalance,
    handleDeleteLeaveRequest,
    totalPages

  } = leave;
  const {
    isDialogOpen,
    formData,
    dateCalculation,
    isLoading,
    statusOverview,
    selectedRequest,
    rejectionNote,
    createIsDialogOpen,
    activityFeedCache,
    activityFeedPagination,
    approvalsCache,
    approvalsPagination,
    allApprovedPagination,
    leaveDialog,
    selectedRequestId,
  } = useAppSelector((state) => state.leave);

    const {        
      totalPages: totalProfilePages,  
     
    } = useReduxAuth();
  
  const dispatch = useAppDispatch();
  const canApproveLeave =
    user?.role === "teamlead" ||
    user?.role === "admin" ||
    user?.role === "hr" ||
    user?.role === "employee" ||
    user?.role === "md";
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { profilePagination, teamleads } = useAppSelector((state) => state.profile);
  const { cachedApprovedLeave } = useReduxLeave();
  const canView = user?.role === "admin" || user?.role === "hr";
  const currentLeavePage = activityFeedPagination?.page ?? 1;
  const cachedMyApproved = activityFeedCache?.[currentLeavePage] ?? [];
  const currentApprovalPage = approvalsPagination?.page ?? 1;
  const cachedApproval = approvalsCache?.[currentApprovalPage] ?? [];


  const rowsToRender: LeaveActivityFeedItem[] = ["hr", "admin"].includes(
    user?.role ?? ""
  )
    ? cachedApprovedLeave
    : cachedMyApproved;



const isLeaveExceedsBalance = () => {
  const leaveBalances = leaveBalance.leaveBalance?.balances || {};

  // Extract the available leave balance for the selected type
  const balance = leaveBalances[formData.type] || 0;

  // Check if the requested working days exceed the balance
  return dateCalculation?.workingDays > balance;
};

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return null;
    const calculation = calculateWorkingDays(start, end);
    const holidays = getHolidaysInRange(start, end);

    return {
      totalDays: calculation.totalDays,
      workingDays: calculation.workingDays,
      holidays,
    };
  };


  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    const newFormData = { ...formData, [field]: value };
    dispatch(setFormData(newFormData));

    if (newFormData.startDate && newFormData.endDate) {
      const calculation = calculateDays(
        newFormData.startDate,
        newFormData.endDate
      );
      dispatch(setDateCalculation(calculation));
       if (calculation.workingDays > leaveBalance.leaveBalance?.balances[formData.type]) {
      // Trigger the error toast if working days exceed balance
      toast({
        title: "Leave Request Exceeds Balance",
        description: `Your requested leave days of ${calculation.workingDays} exceed the available balance for ${formData.type} leave.`,
        variant: "destructive", // This shows a red error message
      });
     }
      
    } else {
      dispatch(setDateCalculation(null));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExt = [".pdf"];
    const isValid = validExt.some((ext) => file.name.endsWith(ext));

    if (!isValid) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file (.pdf)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: "File Uploaded",
      description: `${file.name} is ready for submission.`,
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.teamleadId) {
  //     toast({
  //       title: "Team Lead Required",
  //       description: "Please select a team lead to review your leave request.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const calculation = calculateDays(formData.startDate, formData.endDate);
  //   if (!calculation) {
  //     toast({
  //       title: "Invalid Dates",
  //       description: "Please select valid start and end dates.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   if (!uploadedFile) {
  //     toast({
  //       title: "No File Uploaded",
  //       description: "Please upload a supporting document.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   // ✅ Use FormData to include file
  //   const formDataToSend = new FormData();
  //   formDataToSend.append("file", uploadedFile);
  //   formDataToSend.append("type", formData.type);
  //   formDataToSend.append("startDate", formData.startDate);
  //   formDataToSend.append("endDate", formData.endDate);
  //   formDataToSend.append("days", calculation.workingDays.toString());
  //   formDataToSend.append("reason", formData.reason);
  //   formDataToSend.append("teamleadId", formData.teamleadId);
  //   formDataToSend.append("typeIdentify", formData.typeIdentify);
  //   formDataToSend.append("allowance", formData.allowance);
  //   formData.relievers?.forEach((reliever) =>
  //     formDataToSend.append("relievers", reliever)
  //   );

  //   const success = await handleCreateLeaveRequest(formDataToSend);

  //   if (success) {
  //     dispatch(setCreateIsDialogOpen(false));
  //     setFormData({
  //       type: "annual",
  //       startDate: "",
  //       endDate: "",
  //       reason: "",
  //       teamleadId: "",
  //       days: 0,
  //       typeIdentify: "leave",
  //       allowance: "yes",
  //       relievers: [],
  //     });
  //     setUploadedFile(null);
  //     dispatch(setDateCalculation(null));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Team lead selection is still required
  if (!formData.teamleadId) {
    toast({
      title: "Team Lead Required",
      description: "Please select a team lead to review your leave request.",
      variant: "destructive",
    });
    return;
  }

  // Relievers validation ONLY for non-teamlead users
  if (
    user?.role !== "teamlead" &&
    (!formData.relievers || formData.relievers.length < 2)
  ) {
    toast({
      title: "Relievers Required",
      description: "Please select at least 2 relievers.",
      variant: "destructive",
    });
    return;
  }

  const calculation = calculateDays(formData.startDate, formData.endDate);
  if (!calculation) {
    toast({
      title: "Invalid Dates",
      description: "Please select valid start and end dates.",
      variant: "destructive",
    });
    return;
  }

  if (!uploadedFile) {
    toast({
      title: "No File Uploaded",
      description: "Please upload a supporting document.",
      variant: "destructive",
    });
    return;
  }

  // ✅ Use FormData to include file
  const formDataToSend = new FormData();
  formDataToSend.append("file", uploadedFile);
  formDataToSend.append("type", formData.type);
  formDataToSend.append("startDate", formData.startDate);
  formDataToSend.append("endDate", formData.endDate);
  formDataToSend.append("days", calculation.workingDays.toString());
  formDataToSend.append("reason", formData.reason);
  formDataToSend.append("teamleadId", formData.teamleadId);
  formDataToSend.append("typeIdentify", formData.typeIdentify);
  formDataToSend.append("allowance", formData.allowance);

  // Append relievers ONLY if user is not teamlead
  if (user?.role !== "teamlead") {
    formData.relievers.forEach((reliever) =>
      formDataToSend.append("relievers", reliever)
    );
  }

  const success = await handleCreateLeaveRequest(formDataToSend);

  if (success) {
    dispatch(setCreateIsDialogOpen(false));
    dispatch(
      setFormData({
        type: "annual",
        startDate: "",
        endDate: "",
        reason: "",
        teamleadId: "",
        days: 0,
        typeIdentify: "leave",
        allowance: "yes",
        relievers: [],
      })
    );
    setUploadedFile(null);
    dispatch(setDateCalculation(null));
  }
};


  const handleApproveLeaveRequestFlow = async (
    requestId: string,
    action: string
  ) => {
    setLocalLoading(requestId, action);
    const success = await handleApproveLeaveRequest(requestId);
    if (success) {
      clearLocalLoading(requestId, action);
    }
  };

  const handleRejectLeaveRequestWithNote = async (
    id: string,
    note: string,
    action: string
  ): Promise<boolean> => {
    return handleRejectLeaveRequest(id, note);
  };



    const handleDeleteRequest = async (
    requestId: string,
    action: string
  ) => {
    setLocalLoading(requestId, action);
    const success = await handleDeleteLeaveRequest(requestId);
    if (success) {
      clearLocalLoading(requestId, action);
    }
  };
  const getStatusBadge = (status: LeaveRequest["status"]) => {
    const variants = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      expired: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLeaveTypeColor = (type?: LeaveRequest["type"]) => {
    const colors: Record<string, string> = {
      annual: "bg-blue-100 text-blue-800",
      sick: "bg-red-100 text-red-800",
      maternity: "bg-purple-100 text-purple-800",
      compassionate: "bg-yellow-100 text-yellow-800",
      casual: "bg-indigo-100 text-indigo-800",
      examination: "bg-teal-100 text-teal-800",
      study: "bg-pink-100 text-pink-800",
    };

    return colors[type ?? ""] || "bg-gray-100 text-gray-800";
  };

  const handleViewRequest = (request: LeaveActivityFeedItem) => {
    dispatch(setLeaveDialog(true));
    dispatch(setSelectedRequestId(request));
  };

  const handleEditClick = (emp: ProfileFormData) => {
    setSelectedEmployee(emp);
    setSelectedType("annual");
    setNewBalance(emp.leaveBalance?.balances.annual ?? 0);
    setEditOpen(true);
  };

  const handleEditBalance = async ({
    employeeId,
    leaveType,
    balance,
  }: {
    employeeId: string;
    leaveType: "annual" | "compassionate" | "maternity";
    balance: number;
  }) => {
    const success = await handleUpdateLeaveBalance(employeeId, {
      leaveType,
      balance,
    });
    if (success) {
      setEditOpen(false);
    }
  };




  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-gray-600">Manage leave requests and balances</p>
        </div>

        {/* Manage Leave Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <MoreHorizontal className="h-4 w-4" />
              {canView ? "Manage Leave" : "Request Leave"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-48 bg-white shadow-lg rounded-md border border-gray-200 cursor-pointer gap-2 p-2"
          >
            {/* Edit Leave */}
            {canManageEmployees && (
              <DropdownMenuItem
                onClick={() => setLeaveBalanceOpen(true)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Edit Balance
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Request Leave */}
            <DropdownMenuItem
              onClick={() => dispatch(setCreateIsDialogOpen(true))}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LeaveBalanceDialog
          isOpen={leaveBalanceOpen}
          onClose={() => setLeaveBalanceOpen(false)}
          employees={cachedEmployees}
          profilePagination={profilePagination}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          selectedEmployee={selectedEmployee}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          newBalance={newBalance}
          setNewBalance={setNewBalance}
          onSubmit={handleEditBalance}
          onEdit={handleEditClick}
          isLoading={isLoading}
          totalPages={totalProfilePages}
        />

        {/* Request Leave Dialog */}
        <Dialog
          open={createIsDialogOpen}
          onOpenChange={(isOpen) => {
            dispatch(setCreateIsDialogOpen(isOpen));
            if (!isOpen) {
              dispatch(resetFormData());
            }
          }}
        >
          <DialogContent
            className="
            bg-white
            rounded-2xl
            shadow-xl
            max-w-2xl
            w-full
            sm:mx-4
            mx-2
            max-h-[90vh]
            overflow-y-auto
            p-6
            animate-slide-in
          "
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Request Leave
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm mt-1">
                Submit a new leave request. Working days are calculated
                excluding weekends and Nigerian public holidays.
              </DialogDescription>
            </DialogHeader>
             {/* Display leave balances */}
           
            {/* Leave Balances Box */}
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-white">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Leave Balance
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LEAVE_TYPES.map(({ key, label, color }) => (
              <div
                key={key}
                className="flex items-center justify-between px-2 py-1.5 border border-gray-200 rounded-md"
              >
                <span className="text-xs text-gray-600 font-medium">
                  {label}
                </span>
                <span className={`text-sm font-semibold ${color}`}>
                  {leaveBalance.leaveBalance?.balances?.[key] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

            {/* === Full Request Leave Form === */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Leave Type & Team Lead */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Leave Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      dispatch(
                        setFormData({ ...formData, type: value as LeaveType })
                      )
                    }
                  >
                    <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map(({ key, label }) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="teamLead">
                  {user?.role === "teamlead" ? "HR" : "Team Lead"}
                </Label>

                  <Select
                    value={formData.teamleadId}
                    onValueChange={(value) =>
                      dispatch(setFormData({ ...formData, teamleadId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${user?.role === "teamlead" ? "HR" : "Team Lead"}`} />

                    </SelectTrigger>
              
                    <SelectContent>
                      {teamleads?.length ? (
                        teamleads.map((lead: TeamLeadDepartmentProfile) => (
                          <SelectItem key={lead._id} value={lead._id}>
                            {lead.firstName} {lead.lastName} ({lead.position})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-gray-400 text-sm">No team leads available</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleDateChange("startDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleDateChange("endDate", e.target.value)
                    }
                    min={formData.startDate}
                    required
                  />
                </div>
              </div>

            
              {dateCalculation && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">
                          Leave Duration
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Days:</span>
                            <span className="ml-2 font-medium">
                              {dateCalculation.totalDays}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Working Days:</span>
                            <span className="ml-2 font-medium text-blue-600">
                              {dateCalculation.workingDays}
                            </span>
                          </div>
                        </div>
                        {dateCalculation.holidays.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Excluded Days:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {dateCalculation.holidays.map(
                                (holiday, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {holiday.name}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

             

              {/* <EmployeeSelector
                label="Relievers (Select 2 or 3)"
                selectedEmails={formData.relievers || []}
                onSelectionChange={(emails) =>
                  dispatch(setFormData({ ...formData, relievers: emails }))
                }
                employees={cachedEmployees}
                searchTerm={searchTerm}
                onSearchChange={(term) => dispatch(setSearchTerm(term))}
                shouldShowSkeleton={shouldShowSkeleton}
                maxSelections={3}
                employeeFilter={(emp) =>
                  emp.role === "employee" && emp.email !== currentUser.email
                }
                requiredMin={2}
              /> */}
              {user?.role !== "teamlead" && (
                <EmployeeSelector
                  label="Relievers (Select 2 or 3)"
                  selectedEmails={formData.relievers || []}
                  onSelectionChange={(emails) =>
                    dispatch(setFormData({ ...formData, relievers: emails }))
                  }
                  employees={cachedEmployees}
                  searchTerm={searchTerm}
                  onSearchChange={(term) => dispatch(setSearchTerm(term))}
                  shouldShowSkeleton={shouldShowSkeleton}
                  maxSelections={3}
                  employeeFilter={(emp) =>
                    emp.role === "employee" && emp.email !== currentUser.email
                  }
                  requiredMin={2}
                />
              )}


              {/* Allowance & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label>Allowance</Label>
                  <div className="flex gap-4 mt-1">
                    <Button
                      type="button"
                      variant={
                        formData.allowance === "yes" ? "default" : "outline"
                      }
                      onClick={() =>
                        dispatch(setFormData({ ...formData, allowance: "yes" }))
                      }
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.allowance === "no" ? "default" : "outline"
                      }
                      onClick={() =>
                        dispatch(setFormData({ ...formData, allowance: "no" }))
                      }
                    >
                      No
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) =>
                      dispatch(
                        setFormData({ ...formData, reason: e.target.value })
                      )
                    }
                    placeholder="Provide a reason"
                    required
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="handover-upload"
                />
                <label htmlFor="handover-upload">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Handover
                    </span>
                  </Button>
                </label>
                {uploadedFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected file:{" "}
                    <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <DialogFooter className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    dispatch(setCreateIsDialogOpen(false));
                    dispatch(
                      setFormData({
                        type: "annual",
                        startDate: "",
                        endDate: "",
                        reason: "",
                        teamleadId: "",
                        days: 0,
                        typeIdentify: "leave",
                        allowance: "yes",
                        relievers: [],
                      })
                    );
                    setUploadedFile(null);
                    dispatch(setDateCalculation(null));
                    dispatch(setLoading(false));
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.type ||
                  !formData.startDate ||
                  !formData.endDate ||
                  !formData.reason ||
                  !formData.teamleadId ||
                  (user?.role !== "teamlead" &&
                    (!formData.relievers || formData.relievers.length < 2)) ||
                  !uploadedFile ||
                  isLeaveExceedsBalance()
                }
              >
                  {isLoading ? (
                    <>
                      Submitting{" "}
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* tab */}

      <Tabs defaultValue="requests" className="space-y-8">
        <TabsList
          className={`grid w-full ${
            currentUser.role !== "employee" ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          <TabsTrigger value="requests">
            {["hr", "admin"].includes(user?.role ?? "")
              ? "All Leave"
              : "My Requests"}
          </TabsTrigger>
          {/* <TabsTrigger value="status">Status</TabsTrigger> */}
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
        </TabsList>

        {/* --- My Requests Tab --- */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>
                {["hr", "admin"].includes(user?.role ?? "")
                  ? "All Leave"
                  : "My Leave Requests"}
              </CardTitle>
              <CardDescription>
                View and track your leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Id</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Allowance</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    {/* <TableHead>Relievers</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Handover</TableHead>
                    <TableHead>Action</TableHead>
         
                  </TableRow>
                </TableHeader>
                <TableBody>
                {(shouldShowSkeleton ||
                  (isLoading && !activityFeedCache[activityFeedPagination.page]?.length)) ? (
                  <LeaveActivityTableSkeleton rows={activityFeedPagination?.limit || 6} />
                ) : (
                  rowsToRender.map((request) => {
                    let updatedRequest = { ...request };

                    if ("teamleadId" in request) {
                      updatedRequest = {
                        ...updatedRequest,
                        typeIdentify: "leave",
                      };
                    }


                   const trail = Array.isArray(request.reviewTrail) ? request.reviewTrail : [];
                   

                  const rejectedReview = trail.find(
                    (r) => r.action === "rejected"
                  );
                  const hrApproved = trail.find((r) => r.role === "hr" && r.action === "approved");
                  const mdApproved = trail.find(
                    (r) => r.role === "md" && r.action === "approved"
                  );

                  let finalStatus: LeaveActivityFeedItem["status"] = request.status;

                  // ❌ rejection always wins
                  if (rejectedReview) {
                    finalStatus = "rejected";
                  }
                  // ✅ if MD approved, it is FINAL (teamlead flow)
                  else if (mdApproved) {
                    finalStatus = "approved";
                  }

                  else if (user?.role === "md" && hrApproved) {
                    finalStatus = "pending";
                  }
                  // ✅ otherwise, trust backend status
                  else {
                    finalStatus = request.status;
                  }



                    return (
                      <TableRow key={request.id}>
                        <TableCell>{request.staffId?.toLocaleUpperCase() || "NA"}</TableCell>
                        <TableCell>{request.employeeName?.toLocaleUpperCase() || "NA"}</TableCell>
                        <TableCell>{reverseDepartmentMap[request?.department] || "NA"}</TableCell>
                        <TableCell>{request.allowance ? "Yes" : "No"}</TableCell>

                        <TableCell>
                          <Badge className={getLeaveTypeColor(request.type)}>
                            {typeof request.type === "string"
                              ? request.type.charAt(0).toUpperCase() + request.type.slice(1)
                              : "Unknown"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(request.startDate).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(request.endDate).toLocaleDateString()}</div>
                          </div>
                        </TableCell>

                        <TableCell>{request.days} day(s)</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason || "-"}</TableCell>

                        <TableCell>
                          <motion.div
                            key={finalStatus}
                            initial={{ opacity: 0.6, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {getStatusBadge(finalStatus as "approved" | "pending" | "rejected")}
                            {
                              finalStatus === "pending"  && (
                              <ApprovalSteps request={updatedRequest} />

                              )
                            }
                          </motion.div>
                        </TableCell>

                        <TableCell>{new Date(request.appliedDate).toLocaleString()}</TableCell>

                        <TableCell>
                          <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() => window.open(`${request?.url}`, "_blank")}
                          >
                            <NotepadText className="w-5 h-5 text-gray-600" />
                          </button>
                        </TableCell>

                        {["hr", "admin"].includes(user?.role ?? "") && (
                          <TableCell>
                            <button
                              className="p-2 rounded-full hover:bg-gray-100"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                          </TableCell>
                        )}
{/* 
                        {user?.role === "employee" && request?.status === "pending" && (
                          <TableCell>
                            <button
                              className="p-2 rounded-full hover:bg-gray-100"
                              onClick={() => handleDeleteRequest(request.id, "deleteLeave")}
                              disabled={isLocalLoading(request.id, "deleteLeave")}
                            >
                              {isLocalLoading(request.id, "deleteLeave") ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-600" />
                              )}
                            </button>
                          </TableCell>
                        )} */}
                        {request?.status === "pending" &&
                        !request?.reviewTrail?.some(trail => trail.action === "approved") && (
                          <TableCell>
                            <button
                              className="p-2 rounded-full hover:bg-gray-100"
                              onClick={() => handleDeleteRequest(request.id, "deleteLeave")}
                              disabled={isLocalLoading(request.id, "deleteLeave")}
                            >
                              {isLocalLoading(request.id, "deleteLeave") ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-600" />
                              )}
                            </button>
                          </TableCell>
                      )}

                      </TableRow>
                    );
                  })
                )}
              </TableBody>

              </Table>
              {/* <>
                {["hr", "admin"].includes(user?.role ?? "")
                  ? allApprovedPagination?.pages > 1 && (
                      <PaginationNav
                        page={allApprovedPagination?.page}
                        totalPages={allApprovedPagination?.pages}
                        onPageChange={(newPage) =>
                          dispatch(
                            setAllLeavePagination({
                              ...allApprovedPagination,
                              page: newPage,
                            })
                          )
                        }
                        className="mt-6"
                      />
                    )
                  : activityFeedPagination?.pages > 1 && (
                      <PaginationNav
                        page={activityFeedPagination?.page}
                        totalPages={activityFeedPagination?.pages}
                        onPageChange={(newPage) =>
                          dispatch(
                            setActivityFeedPagination({
                              ...activityFeedPagination,
                              page: newPage,
                            })
                          )
                        }
                        className="mt-6"
                      />
                    )}
              </> */}
              {activityFeedPagination.pages > 1 && (

                    <PaginationNav
                    page={activityFeedPagination?.page}
                    totalPages={totalPages}
                    pageSize={activityFeedPagination?.limit || 20}
                    onPageChange={(newPage) =>
                      dispatch(
                        setActivityFeedPagination({
                          ...activityFeedPagination,
                          page: newPage,
                        })
                      )
                    }
                    onPageSizeChange={(newSize) =>
                      dispatch(
                        setActivityFeedPagination({
                          ...activityFeedPagination,
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
        </TabsContent>

        {/* --- Status Tab --- */}
        {/* <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Leave Status Overview</CardTitle>
              <CardDescription>
                Track the status of all your leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["pending", "approved", "rejected"].map((status) => (
                  <Card key={`status-card-${status}`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold mb-2">
                        {statusOverview[status]}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {status} Requests
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* --- Approval Queue Tab --- */}
        {canApproveLeave && (
          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Leave Approval Queue</CardTitle>
                <CardDescription>
                  Review and approve/reject leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Id</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      {currentUser?.role != "employee" && (
                        <TableHead>Allowance</TableHead>
                      )}
                      <TableHead>Status</TableHead>
                      <TableHead>Handover</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
               <TableBody>
                {cachedApproval?.flat().map((request) => {
                  // ✅ Compute effective status for display
                  const effectiveStatus =
                    request.status === "rejected" || request.status === "expired"
                      ? request.status
                      : request.currentReviewerRole 
                      ? "pending"
                      : request.status;

                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.staffId}</TableCell>
                      <TableCell className="font-medium">{request.employeeName}</TableCell>
                      <TableCell className="font-medium">
                        {reverseDepartmentMap[request?.department]}
                      </TableCell>

                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.type)}>
                          {request.type?.toLocaleUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(request.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            {new Date(request.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{request.days} day(s)</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>

                      {currentUser?.role !== "employee" && (
                        <TableCell>
                          {request.allowance ? (
                            <Badge variant="success">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                      )}

                      {/* ✅ Use effectiveStatus here */}
                      <TableCell>{getStatusBadge(effectiveStatus)}</TableCell>

                      <TableCell>
                        {request.url ? (
                          <a
                            href={request.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLocalLoading(request.id, "approved")}
                            onClick={() =>
                              handleApproveLeaveRequestFlow(request.id, "approved")
                            }
                          >
                            {isLocalLoading(request.id, "approved") ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            style={{ border: "2px solid red" }}
                            onClick={() => {
                              dispatch(setSelectedRequest(request));
                              dispatch(setIsDialogOpen(true));
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <Dialog
          open={leaveDialog}
          onOpenChange={(open) => dispatch(setLeaveDialog(open))}
        >
          <DialogContent className="max-w-md sm:max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Leave Calendar</DialogTitle>
              <DialogDescription>
                Displays leave duration for selected request.
              </DialogDescription>
            </DialogHeader>
            {selectedRequestId ? (
              <LeaveCalendar request={selectedRequestId} />
            ) : (
              <p>No request selected.</p>
            )}
          </DialogContent>
        </Dialog>

        {/* --- Reject Dialog --- */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
              <DialogDescription>
                You are about to reject {selectedRequestId?.employeeName}
                's leave request. Please provide a reason.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejectionNote">Reason for Rejection</Label>
                <Textarea
                  id="rejectionNote"
                  value={rejectionNote}
                  onChange={(e) => dispatch(setRejectionNote(e.target.value))}
                  placeholder="Provide feedback or reason for rejection..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => dispatch(setIsDialogOpen(false))}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isLoading}
                onClick={async () => {
                  if (selectedRequest) {
                    setLocalLoading(selectedRequest.id, "reject");
                    const success = await handleRejectLeaveRequestWithNote(
                      selectedRequest.id,
                      rejectionNote,
                      "reject"
                    );
                    if (success) {
                      dispatch(
                        updateStatusOverview({
                          approved: false,
                          rejected: true,
                        })
                      );
                      dispatch(resetLeaveState());
                      dispatch(setIsDialogOpen(false));
                      clearLocalLoading(selectedRequest.id, "reject");
                    }
                  }
                }}
              >
                {isLocalLoading(selectedRequest?.id, "reject") && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reject Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
