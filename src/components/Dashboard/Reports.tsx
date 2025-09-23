import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedReport,
  setDateRange,
  setDepartment,
  setExportFormat,
  setCustomStartDate,
  setCustomEndDate,
} from "@/store/slices/report/reportSlice";
import { useEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { departmentMap, GenerateReportDTO } from "@/types/report";
import { IDepartment } from "@/types/user";

const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useEmployees();
  const { toast } = useToast();
  const { handleGenerateReport } = useReduxReportContext();

  const { departmentsCache } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state) => state.auth);
  const {
    selectedReport,
    dateRange,
    department,
    isGenerating,
    showCustomDatePicker,
    customStartDate,
    customEndDate,
    exportFormat,
  } = useAppSelector((state) => state.report);
  const { company } = useAppSelector((state) => state.profile);
  const mappedDepartment = departmentMap[department] || "all";

  const reportTypes = [
    { id: "employee_summary", title: "Employee Summary Report" },
    { id: "department_analysis", title: "Department Analysis" },
    { id: "attendance_report", title: "Attendance Report" },
    { id: "payroll_summary", title: "Payroll Summary" },
    // { id: "performance_metrics", title: "Performance Metrics" },
  ];

  const handleGenerate = async () => {
    const payload: GenerateReportDTO = {
      reportType: selectedReport,
      dateRange: dateRange,
      startDate: customStartDate ? new Date(customStartDate) : undefined,
      endDate: customEndDate ? new Date(customEndDate) : undefined,
      department: mappedDepartment,
      exportFormat,
      company,
      generatedBy: user?._id,
    };

    await handleGenerateReport(payload);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="generate" className="cursor-default">
            Generate Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Report Configuration
                </CardTitle>
                <CardDescription>
                  Configure your report parameters
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select
                    value={selectedReport ?? undefined}
                    onValueChange={(val) =>
                      dispatch(
                        setSelectedReport(
                          val as GenerateReportDTO["reportType"]
                        )
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select
                    value={dateRange ?? undefined}
                    onValueChange={(val) =>
                      dispatch(
                        setDateRange(val as GenerateReportDTO["dateRange"])
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="daily">Daily</SelectItem> */}
                      <SelectItem value="last_7_days">Last 7 days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 days</SelectItem>
                      <SelectItem value="last_quarter">Last Quarter</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Dates */}
                {showCustomDatePicker && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Start Date */}
                    <div className="flex flex-col">
                      <Label htmlFor="start-date">Start Date</Label>
                      <input
                        type="date"
                        id="start-date"
                        className="border rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={customStartDate || ""}
                        onChange={(e) => {
                          dispatch(setCustomStartDate(e.target.value));
                          // Reset end date if it is before the new start date
                          if (customEndDate && e.target.value > customEndDate) {
                            dispatch(setCustomEndDate(""));
                          }
                        }}
                      />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                      <Label htmlFor="end-date">End Date</Label>
                      <input
                        type="date"
                        id="end-date"
                        className="border rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={customEndDate || ""}
                        min={customStartDate || ""} // 👈 ensures end date cannot be before start date
                        onChange={(e) =>
                          dispatch(setCustomEndDate(e.target.value))
                        }
                        disabled={!customStartDate} // 👈 disable until start date is selected
                      />
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={department ?? undefined}
                    onValueChange={(val) => dispatch(setDepartment(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">All Departments</SelectItem>
                      {Object.values(departmentsCache || {})
                        .flat()
                        .map((dept: IDepartment) => (
                          <SelectItem key={dept._id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Format */}
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Export Options</Label>
                  <Select
                    value={exportFormat ?? undefined}
                    onValueChange={(val) =>
                      dispatch(setExportFormat(val as "pdf" | "excel" | "csv"))
                    }
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select export format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">Export as PDF</SelectItem>
                      <SelectItem value="excel">Export as Excel</SelectItem>
                      {/* <SelectItem value="csv">Export as CSV</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
