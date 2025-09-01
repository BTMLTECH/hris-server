import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackResponse, FeedbackAnswer, Training } from "@/types/training";
import { Loader2 } from "lucide-react";

interface FeedbackModalProps {
  isActionDialogOpen: boolean;
  isLoading: boolean;
  selectedTraining: Training | null;
  selectedActionType: "delete" | "feedback" | "view" | "edit" | null;
  feedbackAnswers: Record<string, FeedbackResponse>;
  feedbackComments: string;
  submitFeedback: (
    trainingId: string,
    answers: FeedbackAnswer[],
    comments: string
  ) => Promise<boolean>;
  closeModal: () => void;
  setFeedbackAnswers: (question: string, response: FeedbackResponse) => void;
  setFeedbackComments: (comment: string) => void;
}

const responses: FeedbackResponse[] = [
  "AGREE",
  "STRONGLY AGREE",
  "DISAGREE",
  "AVERAGE",
  "EXCELLENT",
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isActionDialogOpen,
  selectedTraining,
  selectedActionType,
  feedbackAnswers,
  feedbackComments,
  isLoading,
  submitFeedback,
  closeModal,
  setFeedbackAnswers,
  setFeedbackComments,
}) => {
  if (!selectedTraining) return null;


  return (
    <Dialog open={isActionDialogOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedActionType === "feedback"
              ? "Submit Feedback"
              : "View Feedback"}
          </DialogTitle>
          <DialogDescription>
            {selectedTraining.title} –{" "}
            {new Date(selectedTraining.date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

    
        {selectedActionType === "feedback" && (
          <div className="space-y-6">
            {selectedTraining?.questions.map((q, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-medium">{q}</p>
                <div className="flex flex-wrap gap-2">
                  {responses.map((r) => (
                    <Button
                      key={r}
                     className="px-3 py-1 text-xs rounded-md"
                      variant={feedbackAnswers[q] === r ? "default" : "outline"}
                      onClick={() => setFeedbackAnswers(q, r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <textarea
              className="w-full rounded-md border p-2"
              placeholder="Additional Comments"
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
            />

            <div className="flex justify-end">
  <Button
    onClick={async () => {
      const answers: FeedbackAnswer[] = Object.entries(feedbackAnswers).map(
        ([question, response]) => ({
          question,
          response,
        })
      );
      await submitFeedback(selectedTraining._id, answers, feedbackComments);
      closeModal();
    }}
    disabled={
        isLoading ||
        Object.values(feedbackAnswers).some((r) => !r) ||
        !feedbackComments
    }
  >
   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Submit Feedback
  </Button>
</div>

          </div>
        )}

        {/* VIEW FEEDBACK (READ-ONLY) */}
        {selectedActionType === "view" && (
          <div className="space-y-6">
            {selectedTraining?.feedbacks?.length ? (
              selectedTraining.feedbacks.map((fb, idx) => (
                <div key={idx} className="rounded-lg border p-4 shadow-sm">
                  <p className="font-semibold">
                    {fb.user?.firstName} {fb.user?.lastName} (
                    {fb.user?.department})
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {fb.answers.map((ans, i) => (
                      <li key={i}>
                        <strong>{ans.question}:</strong> {ans.response}
                      </li>
                    ))}
                  </ul>
                  {fb.additionalComments && (
                    <p className="mt-2 italic">💬 {fb.additionalComments}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No feedback submitted yet.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
