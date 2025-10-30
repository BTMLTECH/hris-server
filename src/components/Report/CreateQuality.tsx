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

export default function CreateQuality() {
  const dispatch = useAppDispatch();
  const { qualityForm } = useAppSelector((state) => state.report);
  const { createQuality } = useReduxReportContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQualityForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createQuality(qualityForm as IQualityAssurance);
    dispatch(resetQualityForm());
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 border rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Create Quality Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Agent Name</Label>
            <Input
              name="agentName"
              value={qualityForm.agentName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Week</Label>
            <Input
              name="week"
              type="number"
              value={qualityForm.week || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Score</Label>
            <Input
              name="score"
              type="number"
              value={qualityForm.score || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Remarks</Label>
            <Input
              name="remarks"
              value={qualityForm.remarks || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Evaluated By</Label>
            <Input
              name="evaluatedBy"
              value={qualityForm.evaluatedBy || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              name="company"
              value={qualityForm.company || ""}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ffa30f] text-white hover:bg-[#e6920c]"
          >
            Create Quality Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
