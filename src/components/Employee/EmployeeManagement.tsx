/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Search,
  Eye,
  Download,
  Mail,
  Loader2,
  UserX,
  UserCheck,
  MoreHorizontal,
  Filter,
  Users,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import EmployeeDetailView from "./EmployeeDetailView";
import { useReduxAuth } from "@/hooks/auth/useReduxAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IDepartment, ProfileFormData } from "@/types/user";
import {
  resetFormData,
  setFilterDepartment,
  setFormData,
  setIsEditMode,
  setIsBulkImportOpen,
  setIsDialogOpen,
  setIsProcessingBulk,
  setSearchTerm,
  setSelectedEmployee,
  setShowDetailView,
  removeEmployee,
  setProfilePagination,
  setIsActionDialogOpen,
  setSelectedActionType,
  setSelectedActionId,
  setLoading,
  setIsCompanyDialogOpen,
  resetCompanyFormData,
  setStatusFilter,
} from "@/store/slices/profile/profileSlice";
import { useReduxProfile } from "@/hooks/user/useReduxProfile";
import { useLoadingState } from "@/hooks/useLoadingState";
import { PaginationNav } from "../ui/paginationNav";
import BasicInfoSection from "./BasicInfoSection";
import NextOfKinSection from "./NextOfKinSection";
import OfficeInfoSection from "./OfficeInfoSection";
import AccountInfoSection from "./AccountInfoSection";
import RequirementsSection from "./RequirementsSection";
import { departmentMap, reverseDepartmentMap } from "@/types/report";
import { requiredFields } from "@/data/constRaw";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateCompanyDialog } from "../CreateCompany/CreateCompanyDialog";

const EmployeeManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    formData,
    isEditMode,
    profilePagination,
    isActionDialogOpen,
    selectedActionType,
    isBulkImportOpen,
    filterDepartment,
    bulkEmployees,
    isProcessingBulk,
    isDialogOpen,
    showDetailView,
    searchTerm,
    selectedEmployee,
    selectedActionId,
    isCompanyDialogOpen,
    companyFormData,
    nextStaffId,
    statusFilter,
  } = useAppSelector((state) => state.profile);
  const { editProfile, deleteProfile, profileTerminate, profileActivate } =
    useReduxProfile();
  const { isLocalLoading, setLocalLoading, clearLocalLoading } =
    useLoadingState();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const canManageEmployees = user?.role === "admin" || user?.role === "hr";
  const {
    cachedEmployees,
    inviteUser,
    createCompanyWithAdim,
    bulkInviteUsers,
    resendInvite,
    // profilesIsLoading,
    totalPages,
    shouldShowSkeleton,
    shouldSearch,
  } = useReduxAuth();

  const mappedDepartment = departmentMap[formData?.department] || "all";

  const isParentCompany = cachedEmployees?.some(
    (employee: ProfileFormData) => employee.company?.name
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExt = [".xlsx", ".xls", ".csv"];
    const isValid = validExt.some((ext) => file.name.endsWith(ext));

    if (!isValid) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel or CSV file (.xlsx, .xls, .csv)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: "File Uploaded",
      description: `${file.name} is ready for import.`,
    });
  };

  const handleBulkImport = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first before importing.",
        variant: "destructive",
      });
      return;
    }

    dispatch(setIsProcessingBulk(true));

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const success = await bulkInviteUsers(formData);

      if (success) {
        setUploadedFile(null);
        dispatch(setIsBulkImportOpen(false));
        toast({
          title: "Success",
          description: "Employees imported successfully.",
        });
      } else {
        toast({
          title: "Import Failed",
          description: "Something went wrong during import.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      dispatch(setIsProcessingBulk(false));
    }
  };

  const downloadTemplate = () => {
    const csvContent = `data:text/csv;charset=utf-8,
  staffId,title,firstName,middleName,lastName,gender,dateOfBirth,stateOfOrigin,address,city,mobile,email,department,position,officeBranch,employmentDate,role,classLevel,basicPay,allowances,bankAccountNumber,bankName,taxNumber,pensionCompany,pensionNumber,nextOfKinName,nextOfKinPhone,nextOfKinEmail,nextOfKinRelationship,status
  EMP001,Mr,John,,Doe,male,1990-01-01,Lagos,123 Main St,Lagos,08012345678,john.doe@example.com,it,Software Engineer,HQ,2023-06-01,employee,Level 8,55000,5000,1234567890,UBA,TXN-12345,PENCO,PEN12345,Jane Doe,08098765432,jane.doe@example.com,Wife,active
  EMP002,Mrs,Jane,M.,Smith,female,1988-08-12,Ogun,456 Elm St,Abeokuta,08087654321,jane.smith@example.com,hr,HR Manager,Branch A,2022-04-15,hr,Level 10,60000,7000,9876543210,GTBank,TXN-67890,PENCO,PEN67890,John Smith,08011112222,john.smith@example.com,Husband,active
  `;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "Employee template has been downloaded",
    });
  };

  const handleResendInvite = async (
    email: string,
    employeeId: string,
    action: string
  ) => {
    setLocalLoading(employeeId, action);
    const uscess = await resendInvite(email);
    if (uscess) {
      clearLocalLoading(employeeId, action);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalLoading("editemployee", "editemployee");

    try {
      for (const field of requiredFields) {
        const value = formData[field];
        if (!value || value.toString().trim() === "") {
          toast({
            title: `Please fill the "${field}" field`,
            variant: "destructive",
          });
          return;
        }
      }

      const { nextOfKin, accountInfo } = formData;

      if (
        !nextOfKin?.name?.trim() ||
        !nextOfKin?.phone?.trim() ||
        !nextOfKin?.email?.trim() ||
        !nextOfKin?.relationship?.trim()
      ) {
        toast({
          title: "Please fill all Next of Kin fields",
          variant: "destructive",
        });
        return;
      }

      if (
        !accountInfo?.classLevel?.trim() ||
        accountInfo?.basicPay === undefined ||
        accountInfo?.allowances === undefined ||
        !accountInfo?.bankAccountNumber?.trim() ||
        !accountInfo?.bankName?.trim()
      ) {
        toast({
          title: "Please fill all Account Information fields",
          variant: "destructive",
        });
        return;
      }

      let payload: any = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName?.trim(),
        email: formData.email.toLowerCase().trim(),
      };
      if (isEditMode) {
        delete payload.departments;
        delete payload.leaveBalance;
        delete payload.classlevels;
        delete payload.requirements;
        delete payload.company;
        delete payload.cooperative;
      } else {
        payload = {
          ...payload,
          department: mappedDepartment,
          requirements: formData.requirements,
        };
      }

      let success = false;
      if (isEditMode) {
        success = await editProfile(payload);
      } else {
        success = await inviteUser(payload);
      }

      if (success) {
        dispatch(setIsDialogOpen(false));
        dispatch(setIsEditMode(false));
        dispatch(resetFormData());
      }
    } catch (error) {
      toast({
        title: "An unexpected error occurred",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      clearLocalLoading("editemployee", "editemployee");
    }
  };

  const handleAction = async (
    employeeId: string,
    action: "delete" | "terminate"
  ) => {
    setLocalLoading(employeeId, action);
    let success = false;
    if (action === "delete") {
      success = await deleteProfile(employeeId);
      if (success) dispatch(removeEmployee(employeeId));
    } else if (action === "terminate") {
      success = await profileTerminate(employeeId);
    } else if (action === "activate") {
      success = await profileActivate(employeeId);
    }

    if (success) {
      dispatch(setIsActionDialogOpen(false));
      dispatch(setSelectedActionId(null));
      dispatch(setSelectedActionType(null));
    }

    clearLocalLoading(employeeId, action);
  };

  const handleViewDetails = (employee: ProfileFormData, _: string) => {
    dispatch(setSelectedEmployee(employee));
    dispatch(setFormData(employee));
    dispatch(setShowDetailView(true));
    dispatch(setIsEditMode(true));
  };

  const handleBackToList = () => {
    dispatch(setShowDetailView(false));
    dispatch(setIsEditMode(false));
    dispatch(resetFormData());
  };
  const handleCancel = () => {
    clearLocalLoading("company", "company");
    dispatch(setIsCompanyDialogOpen(false));
    dispatch(resetCompanyFormData());
  };

  const handleCompany = async () => {
    setLocalLoading("company", "company");
    try {
      const success = await createCompanyWithAdim(companyFormData);
      if (success) {
        dispatch(setIsCompanyDialogOpen(false));
        dispatch(resetCompanyFormData());
      }
    } finally {
      clearLocalLoading("company", "company");
    }
  };

  if (showDetailView && selectedEmployee) {
    return (
      <EmployeeDetailView
        employee={selectedEmployee}
        onBack={handleBackToList}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={(data) => dispatch(setFormData(data))}
        isEditMode={isEditMode}
        isLocalLoading={isLocalLoading}
        dispatch={dispatch}
        nextStaffId={nextStaffId}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-gray-600">
            Manage employee records and information
          </p>
        </div>
        {canManageEmployees && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Manage Employee
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {/* Filter */}
                <DropdownMenuItem
                  onClick={() => dispatch(setStatusFilter("active"))}
                  className={
                    statusFilter === "active" ? "bg-blue-100 text-blue-600" : ""
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Show Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => dispatch(setStatusFilter("inactive"))}
                  className={
                    statusFilter === "inactive"
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Show Inactive
                </DropdownMenuItem>

                {/* Bulk Import Trigger */}
                <DropdownMenuItem
                  onClick={() => dispatch(setIsBulkImportOpen(true))}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </DropdownMenuItem>

                {/* Add Employee Trigger */}
                <DropdownMenuItem
                  onClick={() => {
                    dispatch(setIsDialogOpen(true));
                    dispatch(setIsEditMode(false));
                    dispatch(resetFormData());
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </DropdownMenuItem>

                {isParentCompany && (
                  <DropdownMenuItem
                    onClick={() => dispatch(setIsCompanyDialogOpen(true))}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={isBulkImportOpen}
              onOpenChange={(open) => dispatch(setIsBulkImportOpen(open))}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Import Employee</DialogTitle>
                  <DialogDescription>
                    Upload an Excel or CSV file to import multiple employees at
                    once
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={downloadTemplate}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bulk-upload"
                      />
                      <label htmlFor="bulk-upload">
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </span>
                        </Button>
                      </label>
                      {uploadedFile && (
                        <div className="text-sm text-muted-foreground">
                          Selected file:{" "}
                          <span className="font-medium">
                            {uploadedFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch(setIsBulkImportOpen(false));
                      dispatch(setIsEditMode(false));
                      // dispatch(resetFormData());
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkImport}
                    disabled={isProcessingBulk || bulkEmployees.length === 0}
                  >
                    {isProcessingBulk ? "Processing..." : "Import Employees"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
            >
              <DialogContent className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[90vh] p-0 flex flex-col">
                <DialogHeader className="p-4 sm:p-6 lg:p-8 border-b">
                  <DialogTitle>
                    {isEditMode ? "Edit Employee" : "Add New Employee"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update employee information"
                      : "Add a new employee to your organization"}
                  </DialogDescription>
                </DialogHeader>

                {/* Tabs */}
                <Tabs
                  defaultValue="basic"
                  className="flex-1 flex flex-col h-full overflow-hidden"
                >
                  {/* Tab Headers */}
                  <div className="sticky top-0 bg-white z-10 border-b">
                    <TabsList className="flex flex-wrap sm:flex-nowrap gap-1 w-full overflow-x-auto px-2 sm:px-4 py-2">
                      <TabsTrigger
                        value="basic"
                        className="flex-1 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                      >
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="kin"
                        className="flex-1 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                      >
                        Next of Kin
                      </TabsTrigger>
                      <TabsTrigger
                        value="office"
                        className="flex-1 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                      >
                        Office Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="account"
                        className="flex-1 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                      >
                        Account Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="requirements"
                        className="flex-1 min-w-[100px] sm:min-w-[120px] text-center whitespace-nowrap"
                      >
                        Requirements
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-8 py-4">
                    <TabsContent value="basic">
                      <BasicInfoSection
                        formData={formData}
                        nextStaffId={nextStaffId}
                        dispatch={dispatch}
                        isEditMode={isEditMode}
                      />
                    </TabsContent>
                    <TabsContent value="kin">
                      <NextOfKinSection
                        formData={formData}
                        dispatch={dispatch}
                      />
                    </TabsContent>
                    <TabsContent value="office">
                      <OfficeInfoSection
                        formData={formData}
                        dispatch={dispatch}
                      />
                    </TabsContent>
                    <TabsContent value="account">
                      <AccountInfoSection
                        formData={formData}
                        dispatch={dispatch}
                      />
                    </TabsContent>
                    <TabsContent value="requirements">
                      <RequirementsSection
                        formData={formData}
                        dispatch={dispatch}
                      />
                    </TabsContent>
                  </div>
                </Tabs>

                <DialogFooter className="p-4 sm:p-6 lg:p-8 border-t flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      dispatch(setIsDialogOpen(false));
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLocalLoading("editemployee", "editemployee")}
                  >
                    {isLocalLoading("editemployee", "editemployee") ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                        Creating...
                      </>
                    ) : (
                      "Create Employee"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <CreateCompanyDialog
              onSubmit={handleCompany}
              submitting={isLocalLoading}
              companyFormData={companyFormData}
              dispatch={dispatch}
              isCompanyDialogOpen={isCompanyDialogOpen}
              handleCancel={handleCancel}
            />
          </>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filterDepartment}
              onValueChange={(value) => dispatch(setFilterDepartment(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR/ADMIN</SelectItem>
                <SelectItem value="channel">Channel</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="operation">Operation</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sou">Sourcing Units</SelectItem>
                <SelectItem value="md">Manager</SelectItem>
                <SelectItem value="rm">Regional Manager</SelectItem>
                <SelectItem value="roaghi">
                  Regional Office - Airport & GHI
                </SelectItem>
                <SelectItem value="rgogh">Regional Office - Ghana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({cachedEmployees.length})</CardTitle>
          <CardDescription>
            Manage your organization's employees
          </CardDescription>
        </CardHeader>

        {shouldShowSkeleton ? (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  {canManageEmployees && <TableHead>Basic Salary</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="animate-pulse">
                    {/* Staff ID */}
                    <TableCell>
                      <div className="h-4 w-20 bg-muted rounded" />
                    </TableCell>

                    {/* Employee Cell */}
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-muted rounded" />
                          <div className="h-3 w-40 bg-muted-foreground/50 rounded" />
                          <div className="h-3 w-28 bg-muted-foreground/40 rounded" />
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <div className="h-4 w-16 bg-muted rounded" />
                    </TableCell>

                    {/* Department */}
                    <TableCell>
                      <div className="h-4 w-24 bg-muted rounded" />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="h-4 w-20 bg-muted rounded" />
                    </TableCell>

                    {/* Hire Date */}
                    <TableCell>
                      <div className="h-4 w-28 bg-muted rounded" />
                    </TableCell>

                    {/* Salary (conditionally rendered) */}
                    {canManageEmployees && (
                      <TableCell>
                        <div className="h-4 w-20 bg-muted rounded" />
                      </TableCell>
                    )}

                    {/* Actions */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 rounded bg-muted" />
                        <div className="h-8 w-8 rounded bg-muted" />
                        <div className="h-8 w-8 rounded bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        ) : cachedEmployees.length === 0 ? (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No employees found</h3>
              <p className="text-muted-foreground mt-2">
                {shouldSearch
                  ? "No employees match your search criteria"
                  : "No employees available"}
              </p>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  {canManageEmployees && <TableHead>Basic Salary</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {[...cachedEmployees]
                  .sort((a, b) => {
                    const dateA = new Date(a.createdAt ?? 0).getTime();
                    const dateB = new Date(b.createdAt ?? 0).getTime();
                    return dateB - dateA;
                  })
                  .map((employee: ProfileFormData) => (
                    <TableRow key={employee._id}>
                      <TableCell>
                        <span className="capitalize">
                          {employee.staffId || "-"}
                        </span>
                      </TableCell>

                      {/* Employee Info */}
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employee.profileImage} />
                            <AvatarFallback>
                              {employee.firstName?.[0] || "-"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.firstName || "-"}{" "}
                              {employee.lastName || ""}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.email || "-"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.mobile || "-"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <span className="capitalize">
                          {employee.role || "-"}
                        </span>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        <span className="capitalize">
                          {reverseDepartmentMap[employee?.department || ""] ||
                            "-"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span className="capitalize">
                          {employee.status || "-"}
                        </span>
                      </TableCell>

                      {/* Hire Date */}
                      <TableCell>
                        {employee.employmentDate
                          ? new Date(
                              employee.employmentDate
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      {/* Salary */}
                      {canManageEmployees && (
                        <TableCell>
                          ₦
                          {employee.accountInfo?.basicPay?.toLocaleString() ||
                            "-"}
                        </TableCell>
                      )}

                      {/* Actions */}
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* View Button */}
                          {canManageEmployees && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewDetails(employee, "view")
                              }
                              disabled={isLocalLoading(employee._id, "view")}
                            >
                              {isLocalLoading(employee._id, "view") ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {/* Edit / Delete */}
                          {canManageEmployees && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  dispatch(setSelectedActionId(employee._id));
                                  dispatch(setSelectedActionType("delete"));
                                  dispatch(setIsActionDialogOpen(true));
                                }}
                                disabled={isLocalLoading(
                                  employee._id,
                                  "delete"
                                )}
                              >
                                {isLocalLoading(employee._id, "delete") ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>

                              {employee.status === "active" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    dispatch(setSelectedActionId(employee._id));
                                    dispatch(
                                      setSelectedActionType("terminate")
                                    );
                                    dispatch(setIsActionDialogOpen(true));
                                  }}
                                  disabled={isLocalLoading(
                                    employee._id,
                                    "terminate"
                                  )}
                                >
                                  {isLocalLoading(employee._id, "terminate") ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                  ) : (
                                    <UserX className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              {employee.status === "inactive" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    dispatch(setSelectedActionId(employee._id));
                                    dispatch(setSelectedActionType("activate"));
                                    dispatch(setIsActionDialogOpen(true));
                                  }}
                                  disabled={isLocalLoading(
                                    employee._id,
                                    "activate"
                                  )}
                                >
                                  {isLocalLoading(employee._id, "activate") ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              {(employee.sendInvite ||
                                employee.resetRequested ||
                                !employee.isActive) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-sm"
                                  onClick={() =>
                                    handleResendInvite(
                                      employee.email,
                                      employee._id,
                                      "resend"
                                    )
                                  }
                                  disabled={isLocalLoading(
                                    employee._id,
                                    "resend"
                                  )}
                                >
                                  {isLocalLoading(employee._id, "resend") ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                      Sending...
                                    </>
                                  ) : employee.sendInvite ? (
                                    "Resend Invite"
                                  ) : (
                                    "Send Password Instructions"
                                  )}
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <PaginationNav
              page={profilePagination?.page}
              totalPages={totalPages}
              pageSize={profilePagination?.limit || 20}
              onPageChange={(newPage) =>
                dispatch(
                  setProfilePagination({
                    ...profilePagination,
                    page: newPage,
                  })
                )
              }
              onPageSizeChange={(newSize) =>
                dispatch(
                  setProfilePagination({
                    ...profilePagination,
                    page: 1,
                    limit: newSize,
                  })
                )
              }
              className="mt-6"
            />
          </CardContent>
        )}
      </Card>

      <Dialog
        open={isActionDialogOpen}
        onOpenChange={(open) => dispatch(setIsActionDialogOpen(open))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedActionType === "delete"
                ? "Confirm Delete"
                : selectedActionType === "terminate"
                ? "Confirm Termination"
                : "Confirm Activation"}
            </DialogTitle>
            <DialogDescription>
              {selectedActionType === "delete"
                ? "Are you sure you want to delete this employee?"
                : selectedActionType === "terminate"
                ? "Are you sure you want to terminate this employee? This will deactivate their account."
                : "Are you sure you want to activate this employee? This will reactivate their account."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setSelectedActionId(null));
                dispatch(setSelectedActionType(null));
                dispatch(setIsActionDialogOpen(false));
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleAction(
                  selectedActionId,
                  selectedActionType as "delete" | "terminate"
                )
              }
              disabled={isLocalLoading(selectedActionId, selectedActionType)}
            >
              {isLocalLoading(selectedActionId, selectedActionType) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
