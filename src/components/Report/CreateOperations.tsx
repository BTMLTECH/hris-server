import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setOperationsForm,
  resetOperationsForm,
} from "@/store/slices/report/reportSlice";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { IOperationReport } from "@/types/report";

export default function CreateOperations() {
  const dispatch = useAppDispatch();
  const { operationsForm } = useAppSelector((state) => state.report);
  const { createOperation } = useReduxReportContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOperationsForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOperation(operationsForm as IOperationReport);
    dispatch(resetOperationsForm());
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 border rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Create Operations Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Consultant Name</Label>
            <Input
              name="consultantName"
              value={operationsForm.consultantName || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Shift</Label>
            <Select
              value={operationsForm.shift || "day"}
              onValueChange={(value) =>
                dispatch(setOperationsForm({ shift: value as "day" | "night" }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Client Name</Label>
            <Input
              name="clientName"
              value={operationsForm.clientName || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>PNR</Label>
            <Input
              name="PNR"
              value={operationsForm.PNR || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Ticket Number</Label>
            <Input
              name="ticketNumber"
              value={operationsForm.ticketNumber || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Details</Label>
            <Input
              name="details"
              value={operationsForm.details || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Company</Label>
            <Input
              name="company"
              value={operationsForm.company || ""}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ffa30f] text-white hover:bg-[#e6920c]"
          >
            Create Operations Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
