/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Loader2, X } from "lucide-react";
import { Pagination, ProfileFormData } from "@/types/user";
import { useAppDispatch } from "@/store/hooks";
import { PaginationNav } from "../ui/paginationNav";
import { setProfilePagination } from "@/store/slices/profile/profileSlice";

interface LeaveBalanceDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  employees: ProfileFormData[];
  onEdit: (employee: ProfileFormData) => void;
  profilePagination: Pagination;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedEmployee: ProfileFormData | null;
  selectedType: string;
  setSelectedType: (type: string) => void;
  newBalance: number;
  setNewBalance: (bal: number) => void;
  onSubmit: (payload: { employeeId: string; leaveType: string; balance: number }) => void;
}

export function LeaveBalanceDialog({
  isOpen,
  isLoading,
  onClose,
  employees,
  onEdit,
  profilePagination,
  /* edit dialog props */
  editOpen,
  setEditOpen,
  selectedEmployee,
  selectedType,
  setSelectedType,
  newBalance,
  setNewBalance,
  onSubmit,
}: LeaveBalanceDialogProps) {
  const dispatch = useAppDispatch();

  const getBadgeVariant = (value: number) => {
    return value > 0 ? "success" : "destructive";
  };

  const getTooltipText = (value: number, type: string) => {
    if (value > 0) return `${value} ${type} leave day(s) available`;
    return `No ${type.toLowerCase()} leave left`;
  };

  // When user changes the leave type in the popup, populate the balance for that type
  const handleTypeChange = (type: string) => {
    setSelectedType(type);

    if (!selectedEmployee) {
      setNewBalance(0);
      return;
    }

    const balances = selectedEmployee.leaveBalance?.balances as Record<string, number> | undefined;

    const val =
      type === "annual"
        ? balances?.annual ?? 0
        : type === "compassionate"
        ? balances?.compassionate ?? 0
        : balances?.maternity ?? 0;

    setNewBalance(val);
  };

  const handleSave = () => {
    if (!selectedEmployee) return;
    onSubmit({
      employeeId: selectedEmployee.leaveBalance?._id,
      leaveType: selectedType,
      balance: newBalance,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="
            bg-white
            rounded-2xl
            shadow-xl
            max-w-3xl
            w-full
            sm:mx-4
            mx-2
            max-h-[90vh]
            flex flex-col
            animate-slide-in
            p-0
          "
        >
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white z-20 border-b px-6 py-4 flex items-start justify-between">
            <div>
              <DialogHeader className="p-0 m-0">
                <DialogTitle className="text-xl font-semibold text-gray-900 leading-tight">
                  Manage Leave Balances
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-sm mt-1">
                  View or update leave balances for your employees.
                </DialogDescription>
              </DialogHeader>

              {/* Total employees summary */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Total employees:</span>
                <Badge variant="outline" className="text-gray-900 font-medium">
                  {employees.length}
                </Badge>
              </div>
            </div>

            {/* Close Button (always visible top-right) */}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
              {employees.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No employees found.</div>
              ) : (
                <Table className="table-fixed w-full min-w-[600px]">
                  <TableHead className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableCell className="w-1/4 font-medium pl-4">Name</TableCell>
                      <TableCell className="w-1/6 text-center font-medium">Annual</TableCell>
                      <TableCell className="w-1/6 text-center font-medium">Compassionate</TableCell>
                      <TableCell className="w-1/6 text-center font-medium">Maternity</TableCell>
                      <TableCell className="w-1/6 text-center font-medium">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {employees.map((emp, idx) => {
                      const annual = emp.leaveBalance?.balances.annual ?? 0;
                      const compassionate = emp.leaveBalance?.balances.compassionate ?? 0;
                      const maternity = emp.leaveBalance?.balances.maternity ?? 0;

                      return (
                        <TableRow
                          key={emp._id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <TableCell className="pl-4">
                            <span className="font-medium text-gray-900">
                              {emp.firstName} {emp.lastName}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={getBadgeVariant(annual)}>{annual}</Badge>
                                </TooltipTrigger>
                                <TooltipContent>{getTooltipText(annual, "Annual")}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-xs text-gray-400 mt-1">days</div>
                          </TableCell>

                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={getBadgeVariant(compassionate)}>
                                    {compassionate}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {getTooltipText(compassionate, "Compassionate")}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-xs text-gray-400 mt-1">days</div>
                          </TableCell>

                          <TableCell className="text-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={getBadgeVariant(maternity)}>{maternity}</Badge>
                                </TooltipTrigger>
                                <TooltipContent>{getTooltipText(maternity, "Maternity")}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-xs text-gray-400 mt-1">days</div>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => onEdit(emp)} // parent will run handleEditClick
                                title="Edit Balance"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Pagination at bottom */}
          {profilePagination.pages > 1 && (
            <div className="p-4 border-t flex justify-center">
              <PaginationNav
                page={profilePagination.page}
                totalPages={profilePagination.pages}
                onPageChange={(newPage) =>
                  dispatch(setProfilePagination({ ...profilePagination, page: newPage }))
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Popup (controlled by parent via props) */}
      <Dialog open={editOpen} onOpenChange={(open) => !open && setEditOpen(false)}>
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md w-full sm:mx-4 mx-2">
          <DialogHeader>
            <DialogTitle>Edit Leave Balance</DialogTitle>
            <DialogDescription>
              Update {selectedEmployee?.firstName} {selectedEmployee?.lastName}’s balance
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Leave Type Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="annual">Annual</option>
                <option value="compassionate">Compassionate</option>
                <option value="maternity">Maternity</option>
              </select>
            </div>

            {/* Balance Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance (days)</label>
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button 
            onClick={handleSave}
            disabled={isLoading}
            >
                      {isLoading && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
                        )}
                Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
