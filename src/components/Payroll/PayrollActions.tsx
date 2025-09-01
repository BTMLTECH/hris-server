// ====== PayrollActions.tsx ======
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, PlayCircle, Undo2, DollarSign } from "lucide-react";
import { useLoadingState } from "@/hooks/useLoadingState";

interface PayrollActionsProps {
  recordId?: string; // optional for single actions
  allStatus?: string;
  payrollFn: {
    draft: (id: string) => Promise<boolean>;
    process: (id: string) => Promise<boolean>;
    reverse: (id: string) => Promise<boolean>;
    paid: (id: string) => Promise<boolean>;
    bulkDraft: () => Promise<boolean>;
    bulkProcess: () => Promise<boolean>;
    bulkReverse: () => Promise<boolean>;
    bulkPay: () => Promise<boolean>;
  };
}

export const PayrollActions: React.FC<PayrollActionsProps> = ({
  recordId,
  allStatus,
  payrollFn,
}) => {
  const { isLocalLoading: loading, setLocalLoading: setLoading, clearLocalLoading: clearLoading } = useLoadingState();

  const handleAction = async (key: string, actionType: string, actionFn: () => Promise<boolean>) => {
    setLoading(key, actionType);
    try {
      await actionFn();
    } finally {
      clearLoading(key, actionType);
    }
  };

  // Single payroll actions
  const handleDraft = () => recordId && handleAction(recordId, "draft", () => payrollFn.draft(recordId));
  const handleProcess = () => recordId && handleAction(recordId, "process", () => payrollFn.process(recordId));
  const handleReverse = () => recordId && handleAction(recordId, "reverse", () => payrollFn.reverse(recordId));
  const handlePaid = () => recordId && handleAction(recordId, "paid", () => payrollFn.paid(recordId));

  // Bulk actions
  const handleBulkDraft = () => handleAction("bulk-draft", "bulk-draft", payrollFn.bulkDraft);
  const handleBulkProcess = () => handleAction("bulk-process", "bulk-process", payrollFn.bulkProcess);
  const handleBulkReverse = () => handleAction("bulk-reverse", "bulk-reverse", payrollFn.bulkReverse);
  const handleBulkPay = () => handleAction("bulk-pay", "bulk-pay", payrollFn.bulkPay);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Single Payroll Actions */}
      {recordId && allStatus === "pending" && (
        <Button size="sm" onClick={handleDraft} disabled={loading(recordId, "draft")}>
          {loading(recordId, "draft") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
          Draft
        </Button>
      )}

      {recordId && allStatus === "draft" && (
        <>
          <Button size="sm" onClick={handleProcess} disabled={loading(recordId, "process")}>
            {loading(recordId, "process") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Process
          </Button>
          <Button size="sm" variant="destructive" onClick={handleReverse} disabled={loading(recordId, "reverse")}>
            {loading(recordId, "reverse") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Reverse
          </Button>
        </>
      )}

      {recordId && allStatus === "processed" && (
        <Button size="sm" variant="destructive" onClick={handlePaid} disabled={loading(recordId, "paid")}>
          {loading(recordId, "paid") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
          Pay
        </Button>
      )}

      {/* Bulk Payroll Actions */}
      {allStatus === "pending" && (
        <Button size="sm" onClick={handleBulkDraft} disabled={loading("bulk-draft", "bulk-draft")}>
          {loading("bulk-draft", "bulk-draft") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
          Draft Bulk
        </Button>
      )}

      {allStatus === "draft" && (
        <>
          <Button size="sm" onClick={handleBulkProcess} disabled={loading("bulk-process", "bulk-process")}>
            {loading("bulk-process", "bulk-process") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Process Bulk
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkReverse} disabled={loading("bulk-reverse", "bulk-reverse")}>
            {loading("bulk-reverse", "bulk-reverse") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            Reverse Bulk
          </Button>
        </>
      )}

      {allStatus === "processed" && (
        <Button size="sm" variant="destructive" onClick={handleBulkPay} disabled={loading("bulk-pay", "bulk-pay")}>
          {loading("bulk-pay", "bulk-pay") && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
          Pay Bulk
        </Button>
      )}
    </div>
  );
};
