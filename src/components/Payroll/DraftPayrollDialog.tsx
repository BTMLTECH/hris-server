import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { DraftPayrollDialogProps, IPayroll } from "@/types/payroll";
import { PaginationNav } from "../ui/paginationNav";
import { setPayrollPagination } from "@/store/slices/payroll/payrollSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

export function DraftPayrollDialog({
  handleProcessPayroll,
  handleReversePayroll,
  handleBulkProcess,
  handleDownloadPayrollBulk,
  handleBulkReverse,
  isLocalLoading,
  currentMonth,
  currentYear,
  cachedPayrolls,
  isDraftDialogOpen,
  setIsDraftDialogOpen,
  dispatch,
  pagination,
}: DraftPayrollDialogProps & { handleBulkReverse?: () => void }) {
  const draftPayrolls =
    cachedPayrolls?.filter((p) => p.status === "draft") ?? [];

  return (
    <Dialog
      open={isDraftDialogOpen}
      onOpenChange={(open) => {
        dispatch(setIsDraftDialogOpen(open));
      }}
    >
      <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Draft Payrolls
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            All employees with draft payrolls for{" "}
            <span className="font-medium">
              {currentMonth}/{currentYear}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Sticky Bulk Action Buttons */}
        {draftPayrolls.length > 0 && (
          <div className="sticky top-0 z-10 bg-white flex gap-2 justify-between sm:justify-end p-2 border-b shadow-sm shadow-gray-200">
            {/* <Button
              onClick={handleDownloadPayrollBulk}
              disabled={isLocalLoading("bulk-download", "bulk-download")}
              className="w-full sm:w-auto h-8 text-sm"
            >
              {isLocalLoading("bulk-download", "bulk-download") && (
                <Loader2 className="mr-2 h-2 w-2 animate-spin" />
              )}
              <Download className="h-2 w-2" />

              Download
            </Button> */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      disabled={isLocalLoading("bulk-download", "bulk-download")}
      className="w-full sm:w-auto h-8 text-sm flex items-center gap-2"
    >
      {isLocalLoading("bulk-download", "bulk-download") ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      Download
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="
      w-56
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      shadow-lg
      rounded-md
      z-50
    "
  >
    <DropdownMenuItem
      className="flex gap-3 items-start cursor-pointer"
      onClick={() => handleDownloadPayrollBulk('excel')}
    >
      <FileSpreadsheet className="h-5 w-5 text-green-600 mt-0.5" />
      <div className="flex flex-col">
        <span className="font-medium">Excel (.xlsx)</span>
        <span className="text-xs text-muted-foreground">
          Full payroll breakdown
        </span>
      </div>
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      className="flex gap-3 items-start cursor-pointer"
      onClick={() => handleDownloadPayrollBulk('pdf')}
    >
      <FileText className="h-5 w-5 text-red-600 mt-0.5" />
      <div className="flex flex-col">
        <span className="font-medium">PDF Summary</span>
        <span className="text-xs text-muted-foreground">
          Company totals only
        </span>
      </div>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


            <Button
              onClick={handleBulkProcess}
              disabled={isLocalLoading("bulk-process", "bulk-process")}
              className="w-full sm:w-auto h-8 text-sm"
            >
              {isLocalLoading("bulk-process", "bulk-process") && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Process All
            </Button>

            <Button
              variant="destructive"
              onClick={handleBulkReverse}
              disabled={isLocalLoading("bulk-reverse", "bulk-reverse")}
              className="w-full sm:w-auto h-8 text-sm"
            >
              {isLocalLoading("bulk-reverse", "bulk-reverse") && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Reverse All
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">Staff ID</TableHead>
                <TableHead className="px-4 py-2">Employee</TableHead>
                <TableHead className="px-4 py-2 hidden sm:table-cell">
                  Email
                </TableHead>
                <TableHead className="px-4 py-2">Basic Salary</TableHead>
                <TableHead className="px-4 py-2">Gross Salary</TableHead>
                <TableHead className="px-4 py-2">Total Allowances</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftPayrolls.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No draft payrolls found.
                  </TableCell>
                </TableRow>
              ) : (
                draftPayrolls.map((payroll: IPayroll) => (
                  <TableRow
                    key={payroll._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-2">
                      {payroll.user?.staffId ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2 whitespace-nowrap">
                      {payroll.user?.firstName} {payroll.user?.lastName}
                    </TableCell>
                    <TableCell className="px-4 py-2 hidden sm:table-cell">
                      {payroll?.user?.email}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {payroll.basicSalary?.toLocaleString() ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {payroll.grossSalary?.toLocaleString() ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {payroll.totalAllowances?.toLocaleString() ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          payroll._id && handleProcessPayroll(payroll._id)
                        }
                        disabled={isLocalLoading(
                          payroll._id ?? "",
                          "processPayroll"
                        )}
                      >
                        {isLocalLoading(
                          payroll._id ?? "",
                          "processPayroll"
                        ) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Process
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          payroll._id && handleReversePayroll(payroll._id)
                        }
                        disabled={isLocalLoading(
                          payroll._id ?? "",
                          "reversePayroll"
                        )}
                      >
                        {isLocalLoading(
                          payroll._id ?? "",
                          "reversePayroll"
                        ) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reverse
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <PaginationNav
            page={pagination?.page}
            totalPages={pagination?.pages}
            onPageChange={(newPage) =>
              dispatch(
                setPayrollPagination({
                  ...pagination,
                  page: newPage,
                })
              )
            }
            className="mt-6"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
