import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DraftPayrollDialogProps, IPayroll } from "@/types/payroll";
import { PaginationNav } from "../ui/paginationNav";
import { setPayrollPagination } from "@/store/slices/payroll/payrollSlice";

export function DraftPayrollDialog({
  handleProcessPayroll,
  handleReversePayroll,
  handleBulkProcess,
  handleBulkReverse,
  isLocalLoading,
  currentMonth,
  currentYear,
  cachedPayrolls,
  isDraftDialogOpen,
  setIsDraftDialogOpen,
  dispatch,
}: DraftPayrollDialogProps & { handleBulkReverse?: () => void }) {
  const draftPayrolls =
    cachedPayrolls?.filter((p) => p.status === "draft") ?? [];

  return (
    <Dialog
      open={isDraftDialogOpen}
      onOpenChange={(open) => {
        dispatch(setIsDraftDialogOpen(open));
        if (!open) {
          dispatch(setIsDraftDialogOpen(false));
        }
      }}
    >
      <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
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
          <div className="sticky top-0 z-10 bg-white flex flex-col sm:flex-row gap-3 justify-end p-3 border-b">
            <Button
              onClick={handleBulkProcess}
              disabled={isLocalLoading("bulk-process", "bulk-process")}
              className="w-full sm:w-auto"
            >
              {isLocalLoading("bulk-process", "bulk-process") && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Process All Drafts
            </Button>

            <Button
              variant="destructive"
              onClick={handleBulkReverse}
              disabled={isLocalLoading("bulk-reverse", "bulk-reverse")}
              className="w-full sm:w-auto"
            >
              {isLocalLoading("bulk-reverse", "bulk-reverse") && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reverse All Drafts
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border rounded-lg text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Staff ID</th>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2 hidden sm:table-cell">Email</th>
                <th className="px-4 py-2">Gross Salary</th>
                <th className="px-4 py-2">Net Salary</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {draftPayrolls.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No draft payrolls found.
                  </td>
                </tr>
              ) : (
                draftPayrolls.map((payroll: IPayroll) => (
                  <tr
                    key={payroll._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {payroll.user?.staffId ?? "—"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {payroll.user?.firstName} {payroll.user?.middleName}{" "}
                      {payroll.user?.lastName}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {payroll?.user?.email}
                    </td>
                    <td className="px-4 py-2">
                      {payroll.grossSalary?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-4 py-2">
                      {payroll.netSalary?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
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
                        ) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
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
                        ) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reverse
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {cachedPayrolls.pagination?.pages > 1 && (
          <PaginationNav
            page={cachedPayrolls.pagination?.page}
            totalPages={cachedPayrolls.pagination?.pages}
            onPageChange={(newPage) =>
              dispatch(
                setPayrollPagination({
                  ...cachedPayrolls.pagination,
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
