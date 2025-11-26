import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setITForm, resetITForm } from "@/store/slices/report/reportSlice";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { IReport } from "@/types/report";

export default function CreateITReport() {
  const dispatch = useAppDispatch();
  const { itForm } = useAppSelector((state) => state.report);
  const { createITReport } = useReduxReportContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setITForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createITReport(itForm as IReport);
    dispatch(resetITForm());
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 border rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Create IT Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={itForm.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Week</Label>
            <Input
              name="week"
              type="number"
              value={itForm.week || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Task</Label>
            <Input
              name="task"
              value={itForm.task || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              name="company"
              value={itForm.company || ""}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ffa30f] text-white hover:bg-[#e6920c]"
          >
            Create IT Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
