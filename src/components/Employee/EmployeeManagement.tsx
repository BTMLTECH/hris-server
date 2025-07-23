
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Upload, FileText, Search, Eye, Download, Mail, Loader2 } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useCombinedContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import EmployeeDetailView from './EmployeeDetailView';
import { useReduxAuth } from '@/hooks/auth/useReduxAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { User } from '@/types/auth';
import { ProfileFormData } from '@/types/user';
import { resetFormData, setFilterDepartment, setFormData, setIsEditMode, setIsBulkImportOpen, setIsDialogOpen, setIsProcessingBulk, setSearchTerm, setSelectedEmployee, setShowDetailView, removeEmployee, setSelectedDeleteId, setIsDeleteDialogOpen } from '@/store/slices/profile/profileSlice';
import { useReduxProfile } from '@/hooks/user/useReduxProfile';
import { DeleteConfirmationDialog } from '../ui/deleteDialog';

const EmployeeManagement: React.FC = () => {
  const {user: userEmployeeManagement,  profile } = useCombinedContext();

  const dispatch = useAppDispatch()
  const { formData, isEditMode, selectedDeleteId, isDeleteDialogOpen,  isLoading, isBulkImportOpen, filterDepartment, bulkEmployees, isProcessingBulk,isDialogOpen, showDetailView,searchTerm, selectedEmployee} = useAppSelector((state) => state.profile);
  const user = formData as unknown as ProfileFormData  
  const {inviteUser, bulkInviteUsers, resendInvite, profilesIsLoading, error} = useReduxAuth()
  const {editProfile, deleteProfile}  = useReduxProfile()
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);  
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const canManageEmployees = userEmployeeManagement.user?.role === 'admin' || userEmployeeManagement.user?.role === 'hr';
  const canViewAllEmployees = userEmployeeManagement.user?.role === 'admin' || userEmployeeManagement.user?.role === 'hr';
  const [loadingStates, setLoadingStates] = useState<Record<string, string | null>>({});
  const isButtonLoading = (id: string, type: string) => loadingStates[id] === type;
const shouldShowSkeleton =  !user || (user.role === 'hr' || user.role === 'admin' && profilesIsLoading);

const filteredEmployees = bulkEmployees?.filter((employee:any) => {
  const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
  const matchesSearch =
    fullName.includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesDepartment =
    filterDepartment === 'all' || employee.department === filterDepartment;

  return matchesSearch && matchesDepartment;
});


const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const validExt = ['.xlsx', '.xls', '.csv'];
  const isValid = validExt.some(ext => file.name.endsWith(ext));

  if (!isValid) {
    toast({
      title: "Invalid File Type",
      description: "Please upload an Excel or CSV file (.xlsx, .xls, .csv)",
      variant: "destructive",
    });
    return;
  }

  setUploadedFile(file); // store file for later upload
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
    email,firstName,middleName,lastName,role,department,hireDate,salary,phoneNumber,dateOfBirth,position,address,company
    john.doe@example.com,John,,Doe,employee,it,2023-06-01,55000,1234567890,1990-01-01,Software Engineer,123 Main St,Tech Corp
    jane.smith@example.com,Jane,M.,Smith,hr,hr,2022-04-15,60000,9876543210,1988-08-12,HR Manager,456 Elm St,People Inc
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

  const handleResendInvite = async (email: string, employeeId: string) => {
   setLoadingStates(prev => ({ ...prev, [employeeId]: 'resend' }));
  await resendInvite(email);
  setLoadingStates(prev => ({ ...prev, [employeeId]: null }));
  }

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const requiredFields: (keyof ProfileFormData)[] = [
    'firstName',
    'lastName',
    'middleName',
    'email',
    'department',
    'role',
    'startDate',
  ];

  for (const field of requiredFields) {
    if (!formData[field] || formData[field]?.toString().trim() === '') {
      toast({title:`Please fill the "${field}" field`,
      variant: 'destructive'});
      return;
    }
  }

  let success = false;

  if (isEditMode) {
    const updatedData: ProfileFormData = { ...formData };

    success = await editProfile(updatedData);
  } else {
  const {
      firstName,
      lastName,
      middleName,
      email,
      department,
      role,
      startDate,
      salary,
      phoneNumber,
      dateOfBirth,
      position,
      address,
    } = formData;

    const newEmployee = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName?.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber,
      dateOfBirth,
      address,
      department,
      role,
      startDate,
      salary,
      position,
    };


    success = await inviteUser(newEmployee);
  }

  if (success) {
    dispatch(setIsDialogOpen(false));
    dispatch(setIsEditMode(false));
    dispatch(resetFormData());
  }
};

//  const handleEdit = (employee: ProfileFormData) => {
//   console.log("employeeEdit", employee)
//   setLoadingStates(prev => ({ ...prev, [employee._id]: 'edit' }));
//   dispatch(setFormData(employee));
//   dispatch(setIsEditMode(true));
//   dispatch(setIsDialogOpen(true));
//   setLoadingStates(prev => ({ ...prev, [employee._id]: null }));
// };

const handleEdit = (employee: ProfileFormData) => {
  setLoadingStates(prev => ({ ...prev, [employee._id]: 'edit' }));

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  const cleanedData = {
    ...employee,
    dateOfBirth: formatDate(employee.dateOfBirth),
    startDate: formatDate(employee.startDate),
    salary: typeof employee.salary === 'string' ? employee.salary : String(employee.salary),
  };

  dispatch(setFormData(cleanedData));
  dispatch(setIsEditMode(true));
  dispatch(setIsDialogOpen(true));

  setLoadingStates(prev => ({ ...prev, [employee._id]: null }));
};


const handleDelete = async (employeeId: string) => {
  setLoadingStates(prev => ({ ...prev, [employeeId]: 'delete' }));
  const success = await deleteProfile(employeeId);
  if (success) {
    dispatch(removeEmployee(employeeId));
    dispatch(setIsDeleteDialogOpen(false));
    dispatch(setSelectedDeleteId(null));
  }
  setLoadingStates(prev => ({ ...prev, [employeeId]: null }));
};



 const handleViewDetails = (employee: ProfileFormData) => {
  setLoadingStates(prev => ({ ...prev, [employee._id]: 'view' }));
  dispatch(setSelectedEmployee(employee));
  dispatch(setShowDetailView(true));
  setLoadingStates(prev => ({ ...prev, [employee._id]: null }));
};


  const handleBackToList = () => {
    dispatch(setShowDetailView(false));
    dispatch(setSelectedEmployee(null));
  };


  if (showDetailView && selectedEmployee) {
    return <EmployeeDetailView employee={selectedEmployee} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-gray-600">Manage employee records and information</p>
        </div>
          {canManageEmployees && (
            <div className="flex gap-2">
         <Dialog
            open={isBulkImportOpen}
            onOpenChange={(open) => dispatch(setIsBulkImportOpen(open))}
          >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Employee</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to import multiple employees at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={downloadTemplate} variant="outline" className="flex-1">
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
                <Button variant="outline" className="w-full cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </span>
                </Button>
              </label>
              {uploadedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected file: <span className="font-medium">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* {formData.firstName && formData.email && (
            <div className="space-y-3">
              <h4 className="font-medium">Preview</h4>
              <div className="border rounded-md p-3 text-sm flex items-center justify-between">
                <span>
                  {formData.firstName} {formData.lastName} - {formData.email}
                </span>
                <Badge variant="outline" className="capitalize">
                  {formData.role}
                </Badge>
              </div>
            </div>
          )} */}
        </div>

     <DialogFooter>
  <Button
    variant="outline"
    onClick={() => {
    dispatch(setIsBulkImportOpen(false));
    dispatch(setIsEditMode(false));
    dispatch(resetFormData());
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
                <DialogTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        dispatch(setIsDialogOpen(true));
                        dispatch(setIsEditMode(false));
                        dispatch(resetFormData())
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode ? 'Update employee information' : 'Add a new employee to your organization'}
                    </DialogDescription>
                  </DialogHeader>
                  <form   onSubmit={handleSubmit}>
                  <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="job">Job Details</TabsTrigger>
                </TabsList>

                      {/* 🧾 BASIC INFO TAB */}
                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, firstName: e.target.value }))
                              }
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, lastName: e.target.value }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                              id="middleName"
                              value={formData.middleName || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, middleName: e.target.value }))
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, email: e.target.value }))
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              value={formData.phoneNumber || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, phoneNumber: e.target.value }))
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, dateOfBirth: e.target.value }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={formData.address || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, address: e.target.value }))
                              }
                            />
                          </div>

                          {/* <div>
                            <Label htmlFor="education">Education</Label>
                            <Input
                              id="education"
                              value={formData.education || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, education: e.target.value }))
                              }
                            />
                          </div> */}
                        </div>
                      </TabsContent>

                      {/* 💼 JOB INFO TAB */}
                      <TabsContent value="job" className="space-y-4">
                        {/* Role & Department */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={formData.role}
                              onValueChange={(value: ProfileFormData['role']) =>
                                dispatch(setFormData({ ...formData, role: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="teamlead">Team Lead</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="admin">ADMIN</SelectItem>
                                <SelectItem value="md">Manager</SelectItem>
                        
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="department">Department</Label>
                            <Select
                              value={formData.department}
                              onValueChange={(value) =>
                                dispatch(setFormData({ ...formData, department: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="it">IT</SelectItem>
                                <SelectItem value="hr">HR/ADMIN</SelectItem>
                                <SelectItem value="channel">Channel</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="operation">Operation</SelectItem>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="account">Account</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="md">Manager</SelectItem>
                                <SelectItem value="rm">Regional Manager</SelectItem>
                                <SelectItem value="cm">Country Manager</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Hire Date & Salary */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="hireDate">Hire Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={formData.startDate || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, startDate: e.target.value }))
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="salary">Salary</Label>
                            <Input
                              id="salary"
                              type="number"
                              value={formData.salary || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, salary: e.target.value }))
                              }
                            />
                          </div>

                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Input
                              id="position"
                              value={formData.position || ''}
                              onChange={(e) =>
                                dispatch(setFormData({ ...formData, position: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                      </TabsContent>


                  </Tabs>
                   <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        dispatch(setIsDialogOpen(false));
                        dispatch(setIsEditMode(false));
                        dispatch(resetFormData());
                      }}
                    >
                      Cancel
                    </Button>

                        {isEditMode ? (
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                                Updating...
                              </>
                            ) : (
                              'Update Employee'
                            )}
                          </Button>
                        ) : (
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                                Creating...
                              </>
                            ) : (
                              'Create Employee'
                            )}
                          </Button>
                          
                        )}
              </DialogFooter>

                  </form>
                </DialogContent>
              </Dialog>
            </div>
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
            <Select value={filterDepartment} 
            onValueChange={(value) => dispatch(setFilterDepartment(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
         <SelectItem value="employee">Employee</SelectItem>
                                         <SelectItem value="it">IT</SelectItem>
                                          <SelectItem value="hr">HR/ADMIN</SelectItem>
                                          <SelectItem value="channel">Channel</SelectItem>
                                          <SelectItem value="retail">Retail</SelectItem>
                                          <SelectItem value="operation">Operation</SelectItem>
                                          <SelectItem value="corporate">Corporate</SelectItem>
                                          <SelectItem value="account">Account</SelectItem>
                                          <SelectItem value="Marketing">Marketing</SelectItem>
                                          <SelectItem value="md">Manager</SelectItem>
                                          <SelectItem value="rm">Regional Manager</SelectItem>
                                      <SelectItem value="cm">Country Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
     <Card>
  <CardHeader>
    <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
    <CardDescription>Manage your organization's employees</CardDescription>
  </CardHeader>  
  {shouldShowSkeleton ? (
       Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`} className="animate-pulse">
        {/* Employee Cell */}
        <TableCell>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-1">
              <div className="h-4 w-32 bg-muted rounded" /> {/* Name */}
              <div className="h-3 w-40 bg-muted-foreground/50 rounded" /> {/* Email */}
              <div className="h-3 w-28 bg-muted-foreground/40 rounded" /> {/* Phone */}
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
        {canViewAllEmployees && (
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
    ))
  ): (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  {canViewAllEmployees && <TableHead>Salary</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...filteredEmployees]
                    .sort((a, b) => {
                      const dateA = new Date(a.createdAt || '').getTime();
                      const dateB = new Date(b.createdAt || '').getTime();
                      return dateB - dateA; 
                    })
                    .map((employee: ProfileFormData) => {
                      return (
                                  <TableRow key={employee._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={employee.profileImage} />
                              <AvatarFallback>{employee.firstName?.[0] || '-'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {employee.firstName || '-'} {employee.lastName || ''}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {employee.email || '-'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {employee.phoneNumber || '-'}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {employee.role ? (
                            <span className="capitalize">{employee.role}</span>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        <TableCell>
                         <span className="capitalize">{employee.department || '-'}</span>
                   </TableCell>

                        <TableCell>
                          {employee?.status ? (
                            <span className="capitalize">{employee.status}</span>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                          <TableCell className="text-sm">
                            {employee.startDate
                              ? new Intl.DateTimeFormat('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }).format(new Date(employee.startDate))
                              : '-'}
                          </TableCell>

                      {canViewAllEmployees && (
                        <TableCell className="font-medium">
                          {employee.salary ? `#${Number(employee.salary).toLocaleString()}` : '-'}
                        </TableCell>
                      )}


                    <TableCell>
                      <div className="flex space-x-2">
                        {canViewAllEmployees && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(employee)}
                            disabled={isButtonLoading(employee._id, 'view')}
                          >
                            {isButtonLoading(employee._id, 'view') ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {canManageEmployees && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(employee)}
                              disabled={isButtonLoading(employee._id, 'edit')}
                            >
                              {isButtonLoading(employee._id, 'edit') ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : (
                                <Edit className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                                  onClick={() => {
                                                    dispatch(setSelectedDeleteId(employee._id));
                                                    dispatch(setIsDeleteDialogOpen(true));
                                                  }}
                              disabled={isButtonLoading(employee._id, 'delete')}
                            >
                              {isButtonLoading(employee._id, 'delete') ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>

                     {(employee.sendInvite === true || employee.resetRequested === true) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-sm"
                                  onClick={() => handleResendInvite(employee.email, employee._id)}
                                  disabled={isButtonLoading(employee._id, 'resend')}
                                >
                                  {isButtonLoading(employee._id, 'resend') ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                      Sending...
                                    </>
                                  ) : (
                                    employee.sendInvite === true
                                      ? 'Resend Invite'
                                      : 'Send Password Instructions'
                                  )}
                                </Button>
                              )}

                          </>
                        )}
                      </div>
                    </TableCell>


                      </TableRow>
                      )
                    })}

              </TableBody>
            </Table>
          </CardContent>

  ) }
      </Card>

                            <Dialog
                              open={isDeleteDialogOpen}
                              onOpenChange={(open) => dispatch(setIsDeleteDialogOpen(open))}
                            >
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Delete</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this employee?
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => dispatch(setIsDeleteDialogOpen(false))}
                                    disabled={isLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selectedDeleteId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading && (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
                                    )}
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>


      {/* <DeleteConfirmationDialog onConfirm={handleDelete} />            */}
    </div>
  );
};

export default EmployeeManagement;
