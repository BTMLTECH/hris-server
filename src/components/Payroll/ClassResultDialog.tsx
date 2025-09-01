import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClassResultDialogProps } from "@/types/class";
import { Loader2 } from "lucide-react";

export default function ClassResultDialog({
  open,
  onOpenChange,
  classResponse,
  newRecord,
  setNewRecord,
  onAddClass,
  dispatch,
  bandIsLoading,
  
  
}: ClassResultDialogProps) {
  const fmt = (v: number | undefined | null) =>
    typeof v === "number"
      ? v.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
          maximumFractionDigits: 2,
        })
      : "-";

  const taxBands: Array<{ band: number; amount: number }> =
    classResponse?.payrollResult?.taxBands ?? [];

  return (
  <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        dispatch(onOpenChange(isOpen));
        if (!isOpen) {
           dispatch(onOpenChange(false)) 
          dispatch(setNewRecord(null));
        }
      }}
    >
      {/* hideClose removes the X button */}
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Class Calculation Result</DialogTitle>
          <DialogDescription>
            Review the payroll breakdown and assign class details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left side - Payroll Breakdown (display only) */}
          <div className="space-y-4 text-sm">
            <div>
              <Label>Basic Salary</Label>
              <p className="p-2 border rounded-md bg-muted">
                {fmt(classResponse?.basicSalary)}
              </p>
            </div>
            <div>
              <Label>Housing Allowance</Label>
              <p className="p-2 border rounded-md bg-muted">
                {fmt(classResponse?.housingAllowance)}
              </p>
            </div>
            <div>
              <Label>Transport Allowance</Label>
              <p className="p-2 border rounded-md bg-muted">
                {fmt(classResponse?.transportAllowance)}
              </p>
            </div>
            <div>
              <Label>Total Allowances</Label>
              <p className="p-2 border rounded-md bg-muted">
                {fmt(classResponse?.totalAllowances)}
              </p>
            </div>

            {/* Payroll Result */}
            <div className="space-y-3 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <p className="p-2 border rounded-md bg-muted">
                  Gross: {fmt(classResponse?.payrollResult?.grossSalary)}
                </p>
                <p className="p-2 border rounded-md bg-muted">
                  Pension: {fmt(classResponse?.payrollResult?.pension)}
                </p>
                <p className="p-2 border rounded-md bg-muted">
                  CRA: {fmt(classResponse?.payrollResult?.CRA)}
                </p>
                <p className="p-2 border rounded-md bg-muted">
                  Taxable: {fmt(classResponse?.payrollResult?.taxableIncome)}
                </p>
                <p className="p-2 border rounded-md bg-muted">
                  Tax: {fmt(classResponse?.payrollResult?.tax)}
                </p>
                <p className="p-2 border rounded-md bg-muted">
                  Net: {fmt(classResponse?.payrollResult?.netSalary)}
                </p>
              </div>

              {/* Tax Bands Table */}
              <div className="space-y-2">
                <Label>Tax Bands</Label>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-2 p-2 bg-muted font-medium">
                    <div>Rate (%)</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="divide-y">
                    {taxBands.length > 0 ? (
                      taxBands.map((tb, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-2 p-2 items-center"
                        >
                          <div>{tb.band}</div>
                          <div className="text-right">{fmt(tb.amount)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">
                        No tax bands available.
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 p-2 font-semibold">
                    <div>Total Tax</div>
                    <div className="text-right">
                      {fmt(classResponse?.payrollResult?.tax)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Editable inputs for backend */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={newRecord?.year ?? ""}
                onChange={(e) =>
                  dispatch(setNewRecord({ ...newRecord, year: e.target.value }))
                }
                placeholder="Enter year"
                required 
              />
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                value={newRecord?.level ?? ""}
                onChange={(e) =>
                  dispatch(setNewRecord({ ...newRecord, level: e.target.value }))
                }
                placeholder="Enter level"
                required 
              />
            </div>
            <div>
              <Label htmlFor="paygrade">Paygrade</Label>
              <div className="flex">
                {/* Non-editable prefix with year */}
                <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                  {newRecord?.year || new Date().getFullYear()}
                </span>
                <Input
                  id="paygrade"
                  className="rounded-l-none"
                  value={newRecord?.payGrade ?? ""} // <-- store ONLY the suffix here (e.g. "2.1")
                  onChange={(e) =>
                    dispatch(
                      setNewRecord({
                        ...newRecord,
                        payGrade: e.target.value, // <-- do NOT prepend the year here
                      })
                    )
                  }
                  placeholder="Enter paygrade (e.g. 2.1)"
                  required 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Will send as: "
                {(newRecord?.year || new Date().getFullYear())} {newRecord?.payGrade || ""}
                "
              </p>
            </div>



            {/* Footer Buttons: Add + Close side by side */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => dispatch(onOpenChange(false)) }>
                Close
              </Button>
              <Button onClick={onAddClass}
              disabled={bandIsLoading || !newRecord?.year || !newRecord?.level || !newRecord?.payGrade}
              >
              {bandIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Class
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
