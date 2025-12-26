import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Download,
  Eye,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Settings,
  PlayCircle,
  Undo2,
  FileText,
} from "lucide-react";
import { extractPayrollArray, IPayroll } from "@/types/payroll";

import { toast } from "@/hooks/use-toast";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setEditingRecord,
  setFiltersApplied,
  setIsBulkDeleteDialogOpen,
  setIsBulkUploadOpen,
  setIsCreateDialogOpen,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
  setIsProcessingBulkUpload,
  setNewRecord,
  setPayrollPagination,
  setSearchTerm,
  setSelectedMonth,
  setSelectedPayslip,
  setSelectedRecords,
  setSelectedYear,
  setSortDirection,
  setSubmitted,
  setYear,
  setLoadingPdf,
  setIsDraftBulkOpen,
  setIsDraftDialogOpen,
} from "@/store/slices/payroll/payrollSlice";
import { useReduxPayroll } from "@/hooks/payroll/useReduxPayroll";

import { PaginationNav } from "../ui/paginationNav";

import { Skeleton } from "../ui/skeleton";
import { generatePayslip } from "@/utils/generatePayslip";
import { PayslipWithTaxDialog } from "./TaxInfo";
import ClassResultDialog from "./ClassResultDialog";
import {
  setClassRecord,
  setIsBand,
  setIsPaygrade,
  setIsResultDialogOpen,
} from "@/store/slices/class/classSlice";
import { useReduxClass } from "@/hooks/class/useReduxClass";
import { IClassLevelInput } from "@/types/class";
import { getPayrollStatusBadge } from "../getAppraisalBadge";
import { useLoadingState } from "@/hooks/useLoadingState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NairaSign } from "../ui/NairaSign";
import { DraftPayrollDialog } from "./DraftPayrollDialog";
import { months, years } from "@/utils/normalize";

const PayrollManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    isLoading: isFetchingPayrolls,
    cachedPayrolls: filteredRecords,
    deletePayroll,
    draftPayroll,
    processSinglePayroll,
    paidPayroll,
    payrollAsPayBulk,
    reverseBulkPayroll,
    payrollsAsDraftBulk,
    reverseSinglePayroll,
    processBulkPayroll,
    bulkGeneratePayroll,
    downloadBulkPayroll,
    totalPages,
    shouldShowSkeleton,
  } = useReduxPayroll();
  const {
    handleCalculateClass,
    bulkUploadClass,
    handleCreateClassLevel,
    bulkDeleteClass,
  } = useReduxClass();
  const {
    isLoading,
    loadingPdf,
    searchTerm,
    selectedMonth,
    selectedYear,
    selectedPayslip,
    isEditDialogOpen,
    isDraftDialogOpen,
    editingRecord,
    payrollPagination,
    sortDirection,
    isDeleteDialogOpen,
    isBulkUploadOpen,
    isBulkDeleteDialogOpen,
    year,
  } = useAppSelector((state) => state.payroll);
  const { isLocalLoading, setLocalLoading, clearLocalLoading } =
    useLoadingState();
  const {
    classRecord,
    isBand,
    isLoading: bandIsLoading,
    isResultDialogOpen,
    classResponse,
    isPaygrade,
  } = useAppSelector((state) => state.classlevel);
  const [deleteParams, setDeleteParams] = useState<{
    id: string;
    action: string;
  } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const canManagePayroll = user?.role === "admin" || user?.role === "hr";
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const aDate = new Date(Number(a.year), Number(a.month) - 1);
      const bDate = new Date(Number(b.year), Number(b.month) - 1);

      if (aDate.getTime() !== bDate.getTime()) {
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      const aCreated = new Date(a.createdAt).getTime();
      const bCreated = new Date(b.createdAt).getTime();

      return sortDirection === "asc"
        ? aCreated - bCreated
        : bCreated - aCreated;
    });
  }, [filteredRecords, sortDirection]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
 
  const allStatus = useMemo(() => {
    
    if (!sortedRecords.length) return "none";

    const currentRecords = sortedRecords.filter(
      (r) =>
        (Number(r.month) === currentMonth && Number(r.year) === currentYear) ||
        (Number(r.month) === currentMonth - 1 && Number(r.year) === currentYear)
    );

    if (!currentRecords.length) return "none";

    const statuses = currentRecords.map((r) => r.status);

    if (statuses.every((s) => s === "pending")) return "pending";
    if (statuses.every((s) => s === "draft")) return "draft";
    if (statuses.every((s) => s === "processed")) return "processed";
    if (statuses.every((s) => s === "paid")) return "paid";

    return "mixed";
  }, [sortedRecords, currentMonth, currentYear]);
// const allStatus = useMemo(() => {
//   if (!sortedRecords.length) return "none";

//   // Filter records where the month is October (month 10)
//   const currentRecords = sortedRecords.filter(
//     (r) =>
//       (Number(r.month) === 10 && Number(r.year) === currentYear) ||  // Checking for October of current year
//       (Number(r.month) === 9 && Number(r.year) === currentYear)     // Checking for September of current year
//   );

//   if (!currentRecords.length) return "none";

//   const statuses = currentRecords.map((r) => r.status);

//   if (statuses.every((s) => s === "pending")) return "pending";
//   if (statuses.every((s) => s === "draft")) return "draft";
//   if (statuses.every((s) => s === "processed")) return "processed";
//   if (statuses.every((s) => s === "paid")) return "paid";

//   return "mixed";
// }, [sortedRecords, currentYear]);

  const handleDeleteRecord = async (recordId: string, p0: string) => {
    const success = await deletePayroll(recordId);
    if (success) {
      dispatch(setIsDeleteDialogOpen(false));
    }
  };
  const handleOpenDeleteDialog = (recordId: string, action: string) => {
    setDeleteParams({ id: recordId, action });
    dispatch(setIsDeleteDialogOpen(true));
  };

  const handleDownloadPayslip = async (record: IPayroll) => {
    dispatch(setLoadingPdf(true));
    await generatePayslip(record);
    toast({
      title: "Payslip Download",
      description: `Payslip for ${record.month} ${record.year} has been downloaded.`,
    });
    dispatch(setLoadingPdf(false));
    dispatch(setIsCreateDialogOpen(false));
    dispatch(setIsCreateDialogOpen(false));
    dispatch(setSelectedPayslip(null));
  };

  const handleViewPayslip = (record: IPayroll) => {
    dispatch(setSelectedPayslip(record));
  };

  const handleCloseDialog = () => {
    dispatch(setSelectedPayslip(null));
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validExt = [".xlsx", ".xls", ".csv"];
    const isValid = validExt.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValid) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel or CSV file (.xlsx, .xls, .csv)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    dispatch(setIsBulkUploadOpen(true));
  };

  const handleBulkUploads = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first before importing.",
        variant: "destructive",
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", uploadedFile);
    const response = await bulkUploadClass(formData);
    if (response) {
      setUploadedFile(null);
      dispatch(setIsBulkUploadOpen(false));
    }
  };

  const downloadClassLevelTemplate = () => {
    const csvContent = `data:text/csv;charset=utf-8,
    Year,Level,PayGrade,GrossSalary,BasicSalary,HousingAllowance,TransportAllowance
    2025,1,1.0,90000,49500,22500,18000
    2025,1,1.1,100000,55000,25000,20000
    2025,1,1.2,125000,68750,31250,25000
    2025,1,1.3,156250,85937.5,39062.5,31250
    2025,2,2.1,203125,111718.75,50781.25,40625
    2025,2,2.2,253906.25,139648.44,63476.56,50781.25
    2025,2,2.3,317382.81,174560.55,79345.7,63476.56
    2025,3,3.1,412597.66,226928.71,103149.42,82519.53
    2025,3,3.2,453857.42,249621.58,113464.36,90771.48
    2025,3,3.3,499243.16,274583.74,124810.79,99848.63
    2025,4,4.1,549167.48,302042.11,137291.87,109833.5
    2025,4,4.2,604084.23,332246.33,151021.06,120816.85
    2025,4,4.3,664492.65,365471.96,166123.16,132898.53
    2025,5,5.1,730941.92,402018.06,182735.48,146188.38
    2025,5,5.2,804036.11,442219.86,201009.03,160807.22
    2025,5,5.3,884439.72,486441.85,221109.93,176887.94
    2025,6,6.1,972883.69,535085.03,243220.92,194576.74
    2025,6,6.2,1070172.06,588444.63,267543.02,214344.41
    2025,6,6.3,1177189.27,647454.1,294297.32,235437.85
    2025,7,7.1,1550000,852500,387500,310000
    2025,7,7.2,2200000,1210000,550000,440000
    2025,7,7.3,2420000,1331000,605000,484000
    `;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "class_levels_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "Class Levels template CSV has been downloaded.",
    });
  };

  const handleGenerate = async () => {
    if (!classRecord?.band) return;
    dispatch(setIsPaygrade(true));
    const success = await handleCalculateClass(classRecord?.band);
    if (success) {
      dispatch(setClassRecord({ ...classRecord, band: "" }));
      dispatch(setIsBand(false));
      dispatch(setIsResultDialogOpen(true));
    }
    dispatch(setIsPaygrade(false));
  };

  const handleAddClass = async () => {
    if (!classRecord.level || !classRecord.payGrade || !classRecord.year)
      return;
    const formattedPayGrade =
      `${classRecord.year} ${classRecord.payGrade}`.trim();
    const payload: IClassLevelInput = {
      level: classRecord.level,
      payGrade: formattedPayGrade,
      year: classRecord.year,
      basicSalary: classResponse?.basicSalary ?? 0,
      housingAllowance: classResponse?.housingAllowance ?? 0,
      transportAllowance: classResponse?.transportAllowance ?? 0,
    };
    const success = await handleCreateClassLevel(payload);
    if (success) {
      dispatch(
        setClassRecord({
          ...classRecord,
          level: "",
          payGrade: "",
          year: "",
        })
      );
      dispatch(setIsBand(false));
      dispatch(setIsResultDialogOpen(false));
    }
  };

  const handleBulkDelete = async () => {
    const success = await bulkDeleteClass(year);
    if (success) {
      dispatch(setIsBulkDeleteDialogOpen(false));
      dispatch(setYear(""));
    }
  };


  const handleAction = async (
    key: string,
    actionType: string,
    actionFn: () => Promise<boolean>
  ) => {
    setLocalLoading(key, actionType);
    try {
      await actionFn();
    } finally {
      clearLocalLoading(key, actionType);
    }
  };

  const handleMarkDraft = (recordId: string) =>
    handleAction(recordId, "draft", () => draftPayroll(recordId));

  const handleProcessPayroll = (recordId: string) =>
    handleAction(recordId, "processPayroll", () =>
      processSinglePayroll(recordId)
    );

  const handleReversePayroll = (recordId: string) =>
    handleAction(recordId, "reversePayroll", () =>
      reverseSinglePayroll(recordId)
    );

  const handleMarkPaid = (recordId: string) =>
    handleAction(recordId, "paid", () => paidPayroll(recordId));

  const handleBulkDraft = () =>
    handleAction("bulk-draft", "bulk-draft", () =>
      payrollsAsDraftBulk(currentMonth, currentYear)
    );

  const handleBulkProcess = () =>
    handleAction("bulk-process", "bulk-process", () =>
      processBulkPayroll(currentMonth, currentYear)
    );

  const handleBulkReverse = () =>
    handleAction("bulk-reverse", "bulk-reverse", () =>
      reverseBulkPayroll(currentMonth, currentYear)
    );

  const handleBulkPay = () =>
    handleAction("bulk-pay", "bulk-pay", () =>
      payrollAsPayBulk(currentMonth, currentYear)
    );

  const handleBulkGeneratePayroll = () =>
    handleAction("bulk-generate", "bulk-generate", () =>
      bulkGeneratePayroll()
    );
    

  const bulkDownloadPayroll = (type) =>
    handleAction("bulk-download", "bulk-download", () =>
      downloadBulkPayroll(type)
    );
  
    

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-gray-600">Manage salary records and payslips</p>
        </div>
        {canManagePayroll && (
          <>
            {/* 🔹 Dropdown menu for payroll actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Manage Payroll
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40">
                {/* Bulk Upload */}
                <DropdownMenuItem
                  onClick={() => dispatch(setIsBulkUploadOpen(true))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Bulk Upload Class
                </DropdownMenuItem>


                {/* {GENERATE PAYROLL} */}
                {/* <DropdownMenuItem
                onClick={()=> handleBulkGeneratePayroll()}
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={isLocalLoading("bulk-generate", "bulk-generate")}
                >
                  {isLocalLoading("bulk-generate", "bulk-generate") && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}                

                  <Plus className="h-4 w-4" />
                   Generate Payroll
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    if (isLocalLoading("bulk-generate", "bulk-generate")) {
                      e.preventDefault(); // ⛔ DO NOT CLOSE DROPDOWN
                      return;
                    }
                    handleBulkGeneratePayroll();
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={isLocalLoading("bulk-generate", "bulk-generate")}
                >
                  {isLocalLoading("bulk-generate", "bulk-generate") && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}

                  <Plus className="h-4 w-4" />
                  Generate Payroll
                </DropdownMenuItem>


                {/* Delete Previous Class Levels */}
                <DropdownMenuItem
                  onClick={() => dispatch(setIsBulkDeleteDialogOpen(true))}
                  className="flex items-center gap-2 cursor-pointer text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Previous Class Levels
                </DropdownMenuItem>

                {/* Generate Pay Class */}
                <DropdownMenuItem
                  onClick={() => dispatch(setIsBand(true))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Generate Pay Class
                </DropdownMenuItem>
{/* 
                <DropdownMenuItem
                  onClick={() => dispatch(setIsDraftDialogOpen(true))}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  View Draft Payrolls
                </DropdownMenuItem> */}

                {allStatus === "pending" && (
                  <DropdownMenuItem
                    onClick={handleBulkDraft}
                    className="flex items-center gap-2"
                    disabled={isLocalLoading("bulk-draft", "bulk-draft")}
                  >
                    {isLocalLoading("bulk-draft", "bulk-draft") && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                    <FileText className="h-4 w-4" />
                    Draft Bulk Payroll
                  </DropdownMenuItem>
                )}

                {allStatus === "draft" && (
                  <>
                    <DropdownMenuItem
                      onClick={handleBulkProcess}
                      className="flex items-center gap-2"
                      disabled={isLocalLoading("bulk-process", "bulk-process")}
                    >
                      {isLocalLoading("bulk-process", "bulk-process") && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                      <PlayCircle className="h-4 w-4" />
                      Process Bulk Payroll
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleBulkReverse}
                      className="flex items-center gap-2 text-red-600"
                      disabled={isLocalLoading("bulk-reverse", "bulk-reverse")}
                    >
                      {isLocalLoading("bulk-reverse", "bulk-reverse") && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                      <Undo2 className="h-4 w-4" />
                      Reverse Payroll
                    </DropdownMenuItem>

                    
                    <DropdownMenuItem
                      onClick={() => dispatch(setIsDraftDialogOpen(true))}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      View Draft Payrolls
                    </DropdownMenuItem>
                  </>
                )}

                {allStatus === "processed" && (
                  <DropdownMenuItem
                    onClick={handleBulkPay}
                    className="flex items-center gap-2 text-red-600"
                    disabled={isLocalLoading("bulk-pay", "bulk-pay")}
                  >
                    {isLocalLoading("bulk-pay", "bulk-pay") && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                    <NairaSign className="h-4 w-4" />
                    Pay Payroll
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={isBulkUploadOpen}
              onOpenChange={(open) => {
                dispatch(setIsBulkUploadOpen(open));
                if (!open) setUploadedFile(null);
              }}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Class</DialogTitle>
                  <DialogDescription>
                    Upload an Excel file to import multiple class paygrades.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={downloadClassLevelTemplate}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Template
                    </Button>

                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="bulk-payslip-upload"
                      />
                      <label htmlFor="bulk-payslip-upload">
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer flex items-center justify-center gap-2"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4" />
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
                      dispatch(setIsBulkUploadOpen(false));
                      setUploadedFile(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBulkUploads} disabled={bandIsLoading}>
                    {bandIsLoading && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                    {bandIsLoading ? "Processing..." : "Import Class PayGrade"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Bulk Delete Dialog */}
            <Dialog
              open={isBulkDeleteDialogOpen}
              onOpenChange={(open) => dispatch(setIsBulkDeleteDialogOpen(open))}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Bulk Delete</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all class levels for the
                    selected year.
                  </DialogDescription>
                </DialogHeader>

                <div className="my-4">
                  <Select
                    value={year}
                    onValueChange={(val) => dispatch(setYear(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {years.map((yr) => (
                        <SelectItem key={yr} value={yr}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => dispatch(setIsBulkDeleteDialogOpen(false))}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bandIsLoading || !year}
                  >
                    {bandIsLoading && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
                    )}
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Generate Pay Class Dialog */}
            <Dialog
              open={isBand}
              onOpenChange={(open) => dispatch(setIsBand(open))}
            >
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Process Pay Class Value</DialogTitle>
                  <DialogDescription>
                    Enter the gross paygrade for the level you want to generate
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="w-full flex items-end gap-3">
                    <div className="flex-1">
                      <Label htmlFor="grossPay">Enter the Gross</Label>
                      <Input
                        id="grossPay"
                        value={classRecord?.band ?? ""}
                        onChange={(e) =>
                          dispatch(
                            setClassRecord({
                              ...classRecord,
                              band: e.target.value,
                            })
                          )
                        }
                        placeholder="Enter the band paygrade"
                        className={
                          isPaygrade && !classRecord?.band
                            ? "border border-red-500"
                            : ""
                        }
                      />
                      {isPaygrade && !classRecord?.band && (
                        <p className="text-red-500 text-sm mt-1">
                          Gross is required.
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={bandIsLoading}
                      size="sm"
                      className="h-10 px-5 rounded-lg shadow-md"
                    >
                      {bandIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Class Result Dialog */}
            <ClassResultDialog
              dispatch={dispatch}
              open={isResultDialogOpen}
              onOpenChange={setIsResultDialogOpen}
              classResponse={classResponse}
              newRecord={classRecord}
              setNewRecord={setClassRecord}
              onAddClass={handleAddClass}
              bandIsLoading={bandIsLoading}
            />
          </>
        )}
      </div>

      <Tabs defaultValue="payslips" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payslips">Payrolls</TabsTrigger>
        </TabsList>
        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardDescription>View and manage payslips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6 items-end justify-between">
                <div className="flex flex-wrap gap-4 items-end w-full">
                  {canManagePayroll ? (
                    <>
                      {/* Admin/HR Filters */}

                      {/* Month Dropdown */}
                      <Select
                        value={selectedMonth || ""}
                        onValueChange={(value) => {
                          dispatch(setSelectedMonth(value));
                          dispatch(setFiltersApplied(true));
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Search by month" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          className="max-h-48 overflow-y-auto"
                        >
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Year Dropdown */}
                      <Select
                        value={selectedYear || ""}
                        onValueChange={(value) => {
                          dispatch(setSelectedYear(value));
                          dispatch(setFiltersApplied(true));
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Search by year" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          className="max-h-48 overflow-y-auto"
                        >
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Clear Filters Button */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          dispatch(setSelectedMonth(""));
                          dispatch(setSelectedYear(""));
                          dispatch(setSortDirection("desc"));
                          dispatch(setFiltersApplied(false));
                          dispatch(setSearchTerm(""));
                        }}
                      >
                        Clear Filters
                      </Button>

                      {/* Sort Toggle */}
                      <Button
                        variant="outline"
                        onClick={() =>
                          dispatch(
                            setSortDirection(
                              sortDirection === "desc" ? "asc" : "desc"
                            )
                          )
                        }
                      >
                        Sort by {sortDirection === "desc" ? "Oldest" : "Latest"}
                      </Button>

                      {/* Search Bar */}
                      <div className="flex-1 min-w-[200px] md:min-w-[250px] lg:min-w-[300px]">
                        <Input
                          type="text"
                          placeholder="Search employee by name..."
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value;
                            dispatch(setSearchTerm(value));

                            if (value.trim() === "") {
                              dispatch(setSelectedMonth(""));
                              dispatch(setSelectedYear(""));
                              dispatch(setSortDirection("desc"));
                              dispatch(setFiltersApplied(false));
                            } else {
                              dispatch(setFiltersApplied(true));
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Employee View: Just show Year & Month */}
                      <Select
                        value={selectedMonth || ""}
                        onValueChange={(value) => {
                          dispatch(setSelectedMonth(value));
                          dispatch(setFiltersApplied(true));
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          className="max-h-48 overflow-y-auto"
                        >
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedYear || ""}
                        onValueChange={(value) => {
                          dispatch(setSelectedYear(value));
                          dispatch(setFiltersApplied(true));
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          sideOffset={4}
                          className="max-h-48 overflow-y-auto"
                        >
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* 🦴 Show skeleton while searching/loading */}
                  {shouldShowSkeleton ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index} className="animate-pulse">
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Skeleton className="h-6 w-8 rounded" />
                            <Skeleton className="h-6 w-8 rounded" />
                            <Skeleton className="h-6 w-8 rounded" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : sortedRecords?.length === 0 ? (
                    // 📭 No Data Found
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="text-3xl">📭</div>
                          <div className="text-lg font-medium text-gray-700">
                            No data found
                          </div>
                          <div className="text-sm text-gray-400">
                            Try clearing filters or adjust your search
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // ✅ Render Payroll Records
                    sortedRecords.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-medium">
                          {record.user?.staffId}
                        </TableCell>

                        <TableCell className="font-medium">
                          {record.user?.firstName} {record.user?.lastName}
                        </TableCell>

                        <TableCell>
                          <div>
                            {record?.month} {record?.year}
                          </div>
                          {record?.paidDate && (
                            <div className="text-sm text-gray-500">
                              Paid:{" "}
                              {new Date(record?.paidDate).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          {getPayrollStatusBadge(record?.status)}
                        </TableCell>

                        <TableCell className="font-medium">
                          ₦{record.basicSalary?.toLocaleString()}
                        </TableCell>

                        <TableCell className="font-medium text-green-600">
                          ₦{record.grossSalary?.toLocaleString()}
                        </TableCell>

                        <TableCell>
                          <div className="flex space-x-2">
                            {/* View & Download */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPayslip(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPayslip(record)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            {/* Payroll Actions */}
                            {canManagePayroll && (
                              <>
                                {record.status !== "paid" && (
                                  <>
                                    {/* Delete */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleOpenDeleteDialog(
                                          record._id,
                                          "delete"
                                        )
                                      }
                                      disabled={isLocalLoading(
                                        record._id,
                                        "delete"
                                      )}
                                    >
                                      {isLocalLoading(record._id, "delete") ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>

                                    {/* Mark Draft */}
                                    {record.status === "pending" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleMarkDraft(record._id)
                                        }
                                        disabled={isLocalLoading(
                                          record._id,
                                          "draft"
                                        )}
                                      >
                                        {isLocalLoading(
                                          record._id,
                                          "draft"
                                        ) && (
                                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        )}
                                        Mark Draft
                                      </Button>
                                    )}

                                    {/* Process & Reverse */}
                                    {record.status === "draft" && (
                                      <>
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          onClick={() =>
                                            handleProcessPayroll(record._id)
                                          }
                                          disabled={isLocalLoading(
                                            record._id,
                                            "processPayroll"
                                          )}
                                        >
                                          {isLocalLoading(
                                            record._id,
                                            "processPayroll"
                                          ) && (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          )}
                                          Process
                                        </Button>

                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleReversePayroll(record._id)
                                          }
                                          disabled={isLocalLoading(
                                            record._id,
                                            "reversePayroll"
                                          )}
                                        >
                                          {isLocalLoading(
                                            record._id,
                                            "reversePayroll"
                                          ) && (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          )}
                                          Reverse
                                        </Button>
                                      </>
                                    )}
                                  </>
                                )}

                                {/* Pay */}
                                {record.status === "processed" && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleMarkPaid(record._id)}
                                    disabled={isLocalLoading(
                                      record._id,
                                      "paid"
                                    )}
                                  >
                                    {isLocalLoading(record._id, "paid") && (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Pay
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <PayslipWithTaxDialog
                selectedPayslip={selectedPayslip}
                onClose={handleCloseDialog}
                onDownload={handleDownloadPayslip}
                loadingPdf={loadingPdf}
              />

              <PaginationNav
                page={payrollPagination?.page}
                totalPages={totalPages}
                pageSize={payrollPagination?.limit || 20}
                onPageChange={(newPage) =>
                  dispatch(
                    setPayrollPagination({
                      ...payrollPagination,
                      page: newPage,
                    })
                  )
                }
                onPageSizeChange={(newSize) =>
                  dispatch(
                    setPayrollPagination({
                      ...payrollPagination,
                      page: 1,
                      limit: newSize,
                    })
                  )
                }
                className="mt-6"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Payroll Record Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          dispatch(setIsEditDialogOpen(open));
          if (!open) {
            dispatch(setIsEditDialogOpen(false));
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payroll Record</DialogTitle>
            <DialogDescription>Update the payroll details</DialogDescription>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Email - read only */}
                <div>
                  <Label htmlFor="editEmail">Employee Email</Label>
                  <Input
                    id="editEmail"
                    value={editingRecord.user?.email}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                    placeholder="Employee email"
                  />
                </div>

                {/* Employee Name */}
                <div>
                  <Label htmlFor="editEmployeeName">Employee Name</Label>
                  <Input
                    id="editEmployeeName"
                    className="bg-gray-100 cursor-not-allowed"
                    value={`${editingRecord.user?.firstName || ""} ${
                      editingRecord.user?.lastName || ""
                    }`.trim()}
                    readOnly
                    placeholder="Enter employee name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Month */}
                <div>
                  <Label htmlFor="editMonth">Month</Label>
                  <Input
                    id="editMonth"
                    value={editingRecord.month || ""}
                    onChange={(e) =>
                      dispatch(
                        setEditingRecord({
                          ...editingRecord,
                          month: e.target.value,
                        })
                      )
                    }
                    placeholder="Enter month"
                  />
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="editYear">Year</Label>
                  <Input
                    id="editYear"
                    value={editingRecord.year || ""}
                    onChange={(e) =>
                      dispatch(
                        setEditingRecord({
                          ...editingRecord,
                          year: e.target.value,
                        })
                      )
                    }
                    placeholder="Enter year"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Basic Salary */}
                <div>
                  <Label htmlFor="editBasicSalary">Basic Salary</Label>
                  <Input
                    id="editBasicSalary"
                    type="number"
                    value={editingRecord.basicSalary || 0}
                    onChange={(e) =>
                      dispatch(
                        setEditingRecord({
                          ...editingRecord,
                          basicSalary: Number(e.target.value),
                        })
                      )
                    }
                    placeholder="Enter basic salary"
                  />
                </div>

                {/* Total Allowances */}
                <div>
                  <Label htmlFor="totalAllowances">Total Allowances</Label>
                  <Input
                    id="totalAllowances"
                    type="number"
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                    value={editingRecord.totalAllowances || 0}
                    placeholder="Enter total allowances"
                  />
                </div>
              </div>

              {/* Allowances Section */}
              <div>
                <div className="mb-3">
                  <Label>Allowances</Label>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <Label htmlFor="housingAllowance">Housing Allowance</Label>
                    <Input
                      id="housingAllowance"
                      type="number"
                      value={editingRecord.housingAllowance || 0}
                      onChange={(e) =>
                        dispatch(
                          setEditingRecord({
                            ...editingRecord,
                            housingAllowance: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="transportAllowance">
                      Transport Allowance
                    </Label>
                    <Input
                      id="transportAllowance"
                      type="number"
                      value={editingRecord.transportAllowance || 0}
                      onChange={(e) =>
                        dispatch(
                          setEditingRecord({
                            ...editingRecord,
                            transportAllowance: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="lasgAllowance">LASG Allowance</Label>
                    <Input
                      id="lasgAllowance"
                      type="number"
                      value={editingRecord.lasgAllowance || 0}
                      onChange={(e) =>
                        dispatch(
                          setEditingRecord({
                            ...editingRecord,
                            lasgAllowance: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="twentyFourHoursAllowance">
                      24hrs Allowance
                    </Label>
                    <Input
                      id="twentyFourHoursAllowance"
                      type="number"
                      value={editingRecord.twentyFourHoursAllowance || 0}
                      onChange={(e) =>
                        dispatch(
                          setEditingRecord({
                            ...editingRecord,
                            twentyFourHoursAllowance: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="healthAllowance">Health Allowance</Label>
                    <Input
                      id="healthAllowance"
                      type="number"
                      value={editingRecord.healthAllowance || 0}
                      onChange={(e) =>
                        dispatch(
                          setEditingRecord({
                            ...editingRecord,
                            healthAllowance: Number(e.target.value),
                          })
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div>
                <div className="mb-3">
                  <Label htmlFor="deductions">Deductions</Label>
                </div>
                <Input
                  id="deductions"
                  type="number"
                  value={editingRecord.deductions || 0}
                  onChange={(e) =>
                    dispatch(
                      setEditingRecord({
                        ...editingRecord,
                        deductions: Number(e.target.value),
                      })
                    )
                  }
                />
              </div>
            </div>
          )}
        </DialogContent>

        <DraftPayrollDialog
          handleProcessPayroll={handleProcessPayroll}
          handleReversePayroll={handleReversePayroll}
          handleBulkProcess={handleBulkProcess}
          handleBulkReverse={handleBulkReverse}
          isLocalLoading={isLocalLoading}
          handleDownloadPayrollBulk={bulkDownloadPayroll}
          currentMonth={currentMonth}
          currentYear={currentYear}
          cachedPayrolls={sortedRecords}
          isDraftDialogOpen={isDraftDialogOpen}
          setIsDraftDialogOpen={setIsDraftDialogOpen}
          pagination={payrollPagination}
          dispatch={dispatch}
        />
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => dispatch(setIsDeleteDialogOpen(open))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payslip?
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
              onClick={() => handleDeleteRecord(deleteParams.id, "delete")}
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
    </div>
  );
};

export default PayrollManagement;
