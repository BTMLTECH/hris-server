import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCommsForm,
  resetCommsForm,
} from "@/store/slices/report/reportSlice";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { IComms } from "@/types/report";

export default function CreateComms() {
  const dispatch = useAppDispatch();
  const { commsForm } = useAppSelector((state) => state.report);
  const { createComms } = useReduxReportContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setCommsForm({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createComms(commsForm as IComms);
    dispatch(resetCommsForm());
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 border rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Create Comms Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Sender</Label>
            <Input
              name="sender"
              value={commsForm.sender || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Receiver</Label>
            <Input
              name="receiver"
              value={commsForm.receiver || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              name="subject"
              value={commsForm.subject || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea
              name="message"
              value={commsForm.message || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              name="company"
              value={commsForm.company || ""}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ffa30f] text-white hover:bg-[#e6920c]"
          >
            Create Comms Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
