import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCommsForm,
  resetCommsForm,
} from "@/store/slices/report/reportSlice";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { IComms } from "@/types/report";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";


export default function CreateComms() {
  const dispatch = useAppDispatch();
  const { commsForm, reportIsLoading } = useAppSelector((state) => state.report);
  const { createComms } = useReduxReportContext();
  const { companyId } = useParams(); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setCommsForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await createComms(commsForm as IComms);
      const payload: Partial<IComms> = {
      ...commsForm,
      company: companyId!,   
    };
    await createComms(payload);

    dispatch(resetCommsForm());
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <Card className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
            Create Comms Report
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
                  Sender
                </Label>
                <Input
                  name="sender"
                  value={commsForm.sender || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter sender name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Receiver
                </Label>
                <Input
                  name="receiver"
                  value={commsForm.receiver || ""}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Enter receiver name"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Subject</Label>
              <Input
                name="subject"
                value={commsForm.subject || ""}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter subject"
              />
            </div>

            {/* Row 3 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Message</Label>
              <Textarea
                name="message"
                value={commsForm.message || ""}
                onChange={handleChange}
                required
                className="mt-1 resize-none min-h-[100px]"
                placeholder="Enter message"
              />
            </div>

            {/* Row 4 */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Company</Label>
              <Input
                name="company"
                value={commsForm.company || ""}
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
              Create Comms Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
