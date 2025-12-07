import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setQualityForm,
  resetQualityForm,
} from "@/store/slices/report/reportSlice";
import { IQualityAssurance } from "@/types/report";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


export default function CreateQuality() {
  const dispatch = useAppDispatch();
  const { companyId } = useParams(); 
  const { qualityForm, reportIsLoading } = useAppSelector((state) => state.report);
  const { createQuality } = useReduxReportContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQualityForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await createQuality(qualityForm as IQualityAssurance);
        // 🔥 Inject companyId into the form before sending
    const payload: Partial<IQualityAssurance> = {
      ...qualityForm,
      company: companyId!,   
    };
    await createQuality(payload);
    dispatch(resetQualityForm());
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <Card className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
            Create Quality Report
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
                  Agent Name
                </Label>
                <Input
                  name="agentName"
                  value={qualityForm.agentName || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter agent's name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Week
                </Label>
                <Input
                  name="week"
                  type="number"
                  value={qualityForm.week || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter week number"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Score
                </Label>
                <Input
                  name="score"
                  type="number"
                  value={qualityForm.score || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter score"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Evaluated By
                </Label>
                <Input
                  name="evaluatedBy"
                  value={qualityForm.evaluatedBy || ""}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Enter evaluator's name"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Remarks
              </Label>
              <Input
                name="remarks"
                value={qualityForm.remarks || ""}
                onChange={handleChange}
                className="mt-1"
                placeholder="Add remarks (optional)"
              />
            </div>

            {/* Row 4 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Company
              </Label>
              <Input
                name="company"
                value={qualityForm.company || ""}
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
              Create Quality Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
