import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { IPayroll } from "@/types/payroll";
import { getPayrollStatusBadge } from "../getAppraisalBadge";

interface Props {
  selectedPayslip: IPayroll | null;
  onClose: () => void;
  onDownload: (record: IPayroll) => Promise<void>;
  loadingPdf: boolean;
}

const formatCurrency = (value?: number) =>
  value === undefined || value === null ? "—" : `₦${value.toLocaleString()}`;

export function PayslipWithTaxDialog({
  selectedPayslip,
  onClose,
  onDownload,
  loadingPdf,
}: Props) {
  if (!selectedPayslip) return null;


  return (
    <Dialog open={!!selectedPayslip} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="
          w-full max-w-4xl
          max-h-[85vh]
          p-0
          rounded-lg
          bg-white
          flex flex-col
          shadow-xl
        "
      >
        {/* Header */}
        <DialogHeader
          className="
            sticky top-0 z-30 bg-white
            p-6
            shadow-sm
            rounded-t-lg
            flex flex-col
          "
        >
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Payslip Details
          </DialogTitle>
          <DialogDescription className="mt-1 text-gray-600 text-base">
            {selectedPayslip.month ? new Date(selectedPayslip.createdAt).toLocaleString("default", { month: "long" }) : "—"}
               {selectedPayslip.year} —{" "}
            {selectedPayslip.user?.firstName} {selectedPayslip.user?.lastName}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="payslip" className="flex flex-col flex-grow overflow-hidden">
          {/* Tabs List */}
          <TabsList
            className="
              flex
              bg-white
              z-20
              px-6 py-3
              space-x-6
              shadow-sm
              rounded-b-lg
            "
          >
            <TabsTrigger
              value="payslip"
              className="
                flex-1 text-center
                py-2
                font-semibold
                text-gray-700
                data-[state=active]:bg-blue-600
                data-[state=active]:text-white
                data-[state=active]:rounded-md
                hover:bg-blue-100
                transition
              "
            >
              Payslip
            </TabsTrigger>
            <TabsTrigger
              value="tax"
              className="
                flex-1 text-center
                py-2
                font-semibold
                text-gray-700
                data-[state=active]:bg-blue-600
                data-[state=active]:text-white
                data-[state=active]:rounded-md
                hover:bg-blue-100
                transition
              "
            >
              Tax Info
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div
            className="
              overflow-y-auto
              flex-grow
              bg-gray-50
              p-6
              rounded-b-lg
              min-h-0
            "
          >
            {/* Payslip Content */}
     {/* Payslip Content */}
<TabsContent value="payslip" className="space-y-8 text-gray-800">
  {/* Summary */}
  <section className="flex flex-wrap justify-between bg-white rounded-lg p-5 shadow-sm gap-6">
    <div className="min-w-[160px]">
      <p>
        <strong>Month:</strong>{" "}
        {getPayrollStatusBadge(selectedPayslip.status)}
      </p>
      <p className="mt-2">
        <strong>Created At:</strong>{" "}
        {selectedPayslip.createdAt
          ? new Date(selectedPayslip.createdAt).toLocaleDateString()
          : "—"}
      </p>
    </div>
    <div className="min-w-[160px] text-right">
      <p>
        <strong>Total Allowances:</strong>{" "}
        {formatCurrency(selectedPayslip.totalAllowances)}
      </p>
      <p className="mt-2">
        <strong>Gross Salary:</strong>{" "}
        {formatCurrency(selectedPayslip.grossSalary)}
      </p>
    </div>
  </section>

  {/* Earnings & Allowances */}
  <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h4 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2">
        Earnings
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Basic Salary</span>
          <span className="font-semibold">{formatCurrency(selectedPayslip.basicSalary)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Allowances</span>
          <span className="font-semibold">{formatCurrency(selectedPayslip.totalAllowances)}</span>
        </div>
        <div className="flex justify-between">
          <span>Gross Salary</span>
          <span className="font-semibold">{formatCurrency(selectedPayslip.grossSalary)}</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h4 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2">
        CRA & Taxable Income
      </h4>
      <div className="space-y-3 text-blue-700">
        <div className="flex justify-between">
          <span>CRA</span>
          <span>{formatCurrency(selectedPayslip.CRA)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxable Income</span>
          <span>{formatCurrency(selectedPayslip.taxableIncome)}</span>
        </div>
      </div>
    </div>
  </section>

  {/* Deductions & Net Salary */}
  <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-5 shadow-sm">
    <div>
      <h4 className="mb-4 text-lg font-semibold text-gray-900 border-b pb-2">
        Deductions
      </h4>
      <div className="space-y-3 text-red-600">
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(selectedPayslip.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Pension</span>
          <span>{formatCurrency(selectedPayslip.pension)}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center items-end text-blue-800">
      <h4 className="mb-2 text-2xl font-bold">Net Salary</h4>
      <p className="text-4xl font-extrabold">
        {formatCurrency(selectedPayslip.netSalary)}
      </p>
    </div>
  </section>
</TabsContent>

{/* Tax Info Content */}
<TabsContent value="tax" className="space-y-6 text-gray-800">
  {/* Cards */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
    {[
      { label: "CRA", value: selectedPayslip.CRA, color: "text-blue-700" },
      { label: "Pension", value: selectedPayslip.pension, color: "text-green-700" },
      { label: "Taxable Income", value: selectedPayslip.taxableIncome, color: "text-yellow-700" },
      { label: "Tax", value: selectedPayslip.tax, color: "text-red-700" },
    ].map(({ label, value, color }) => (
      <div
        key={label}
        className="bg-white p-5 rounded-lg shadow-sm flex flex-col items-center"
      >
        <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
        <p className={`mt-2 text-lg font-semibold ${color}`}>
          {formatCurrency(value)}
        </p>
      </div>
    ))}
  </div>

  {/* Tax Bands Table */}
  {selectedPayslip.taxBands?.length ? (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
          <tr>
            <th className="px-6 py-3">Band (%)</th>
            <th className="px-6 py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {selectedPayslip.taxBands.map((band, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-3 font-medium text-gray-700">{Math.round(band.band)}%</td>
              <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(band.amount)}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-6 py-3">Total</td>
            <td className="px-6 py-3">
              {formatCurrency(selectedPayslip.taxBands.reduce((sum, b) => sum + b.amount, 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div className="rounded-lg bg-yellow-50 p-4 shadow-sm text-yellow-800">
      No tax information available for this payslip.
    </div>
  )}
</TabsContent>

          </div>

          {/* Action Buttons */}
          <div
            className="
              flex flex-col sm:flex-row sm:justify-end gap-4
              p-6 bg-white rounded-b-lg shadow-md
              flex-shrink-0
            "
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto text-gray-800"
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => onDownload(selectedPayslip)}
              className="w-full sm:w-auto"
            >
              {loadingPdf && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
