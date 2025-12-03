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
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


export default function CreateOperations() {
  const dispatch = useAppDispatch();
  const { operationsForm, reportIsLoading } = useAppSelector((state) => state.report);
  const { createOperation } = useReduxReportContext();
  const { companyId } = useParams(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOperationsForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await createOperation(operationsForm as IOperationReport);
      const payload: Partial<IOperationReport> = {
      ...operationsForm,
      company: companyId!,   
    };
    await createOperation(payload);
    dispatch(resetOperationsForm());
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <Card className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
            Create Operations Report
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6 text-left"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Consultant Name
                </Label>
                <Input
                  name="consultantName"
                  value={operationsForm.consultantName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter consultant's name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Shift
                </Label>
                <Select
                  value={operationsForm.shift || "day"}
                  onValueChange={(value) =>
                    dispatch(
                      setOperationsForm({
                        shift: value as "day" | "night",
                      })
                    )
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client Name
                </Label>
                <Input
                  name="clientName"
                  value={operationsForm.clientName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  PNR
                </Label>
                <Input
                  name="PNR"
                  value={operationsForm.PNR || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter PNR"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Ticket Number
                </Label>
                <Input
                  name="ticketNumber"
                  value={operationsForm.ticketNumber || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter ticket number"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Details
                </Label>
                <Input
                  name="details"
                  value={operationsForm.details || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter details"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Company
              </Label>
              <Input
                name="company"
                value={operationsForm.company || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter company name"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#646cffaa] hover:bg-[#646cff] text-white text-base font-medium rounded-xl py-2.5 mt-4 transition-colors duration-300"
              disabled={reportIsLoading}
             >
              {
                reportIsLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              }
              Create Operations Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
