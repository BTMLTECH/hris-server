import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setITForm, resetITForm } from "@/store/slices/report/reportSlice";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { IReport } from "@/types/report";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


export default function CreateITReport() {
  const dispatch = useAppDispatch();
  const { itForm, reportIsLoading } = useAppSelector((state) => state.report);
  const { createITReport } = useReduxReportContext();
 const { companyId } = useParams(); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setITForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await createITReport(itForm as IReport);
      const payload: Partial<IReport> = {
      ...itForm,
      company: companyId!,   
    };
    await createITReport(payload);

    dispatch(resetITForm());
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <Card className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
            Create IT Report
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 sm:space-y-6 text-left"
          >
            <div>
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                name="name"
                value={itForm.name || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Week</Label>
              <Input
                name="week"
                type="number"
                value={itForm.week || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter week number"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Task</Label>
              <Input
                name="task"
                value={itForm.task || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Company</Label>
              <Input
                name="company"
                value={itForm.company || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter company name"
              />
            </div>

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
              Create IT Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
