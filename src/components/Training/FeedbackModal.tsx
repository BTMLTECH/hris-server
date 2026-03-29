// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { FeedbackResponse, FeedbackAnswer, Training } from "@/types/training";
// import { Loader2 } from "lucide-react";

// interface FeedbackModalProps {
//   isActionDialogOpen: boolean;
//   isLoading: boolean;
//   selectedTraining: Training | null;
//   selectedActionType: "delete" | "feedback" | "view" | "edit" | null;
//   feedbackAnswers: Record<string, FeedbackResponse>;
//   feedbackComments: string;
//   submitFeedback: (
//     trainingId: string,
//     answers: FeedbackAnswer[],
//     comments: string
//   ) => Promise<boolean>;
//   closeModal: () => void;
//   setFeedbackAnswers: (question: string, response: FeedbackResponse) => void;
//   setFeedbackComments: (comment: string) => void;
// }

// const responses: FeedbackResponse[] = [
//   "AGREE",
//   "STRONGLY AGREE",
//   "DISAGREE",
//   "AVERAGE",
//   "EXCELLENT",
// ];

// const FeedbackModal: React.FC<FeedbackModalProps> = ({
//   isActionDialogOpen,
//   selectedTraining,
//   selectedActionType,
//   feedbackAnswers,
//   feedbackComments,
//   isLoading,
//   submitFeedback,
//   closeModal,
//   setFeedbackAnswers,
//   setFeedbackComments,
// }) => {
//   if (!selectedTraining) return null;

//   return (
//     <Dialog open={isActionDialogOpen} onOpenChange={closeModal}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {selectedActionType === "feedback"
//               ? "Submit Feedback"
//               : "View Feedback"}
//           </DialogTitle>
//           <DialogDescription>
//             {selectedTraining.title} –{" "}
//             {new Date(selectedTraining.date).toLocaleDateString()}
//           </DialogDescription>
//         </DialogHeader>

//         {/* SUBMIT FEEDBACK */}
//         {selectedActionType === "feedback" && (
//           <div className="space-y-6">
//             {selectedTraining?.questions.map((q, idx) => (
//               <div key={idx} className="space-y-2">
//                 <p className="font-medium">{q}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {responses.map((r) => (
//                     <Button
//                       key={r}
//                       className="px-3 py-1 text-xs rounded-md"
//                       variant={feedbackAnswers[q] === r ? "default" : "outline"}
//                       onClick={() => setFeedbackAnswers(q, r)}
//                     >
//                       {r}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <textarea
//               className="w-full rounded-md border p-2"
//               placeholder="Additional Comments"
//               value={feedbackComments}
//               onChange={(e) => setFeedbackComments(e.target.value)}
//             />

//             <div className="flex justify-end">
//               <Button
//                 onClick={async () => {
//                   const answers: FeedbackAnswer[] = Object.entries(
//                     feedbackAnswers
//                   ).map(([question, response]) => ({
//                     question,
//                     response,
//                   }));
//                   await submitFeedback(
//                     selectedTraining._id,
//                     answers,
//                     feedbackComments
//                   );
//                   closeModal();
//                 }}
//                 disabled={
//                   isLoading ||
//                   Object.values(feedbackAnswers).some((r) => !r) ||
//                   !feedbackComments
//                 }
//               >
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Submit Feedback
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* VIEW FEEDBACK (READ-ONLY) */}
//         {selectedActionType === "view" && (
//           <div className="space-y-6">
//             {/* 🔹 Facilitators section at top */}
//             {selectedTraining?.facilitators?.length > 0 && (
//               <div className="rounded-lg border p-4 shadow-sm bg-gray-50">
//                 <p className="font-semibold mb-2">Facilitators:</p>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {selectedTraining.facilitators.map((f, idx) => (
//                     <li key={idx}>
//                       {f.email ? `${f.name} (${f.email})` : f.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {selectedTraining?.feedbacks?.length ? (
//               selectedTraining.feedbacks.map((fb, idx) => (
//                 <div key={idx} className="rounded-lg border p-4 shadow-sm">
//                   <p className="font-semibold">
//                     {fb.user?.firstName} {fb.user?.lastName} (
//                     {fb.user?.department})
//                   </p>
//                   <ul className="list-disc pl-5 mt-2 space-y-1">
//                     {fb.answers.map((ans, i) => (
//                       <li key={i}>
//                         <strong>{ans.question}:</strong> {ans.response}
//                       </li>
//                     ))}
//                   </ul>
//                   {fb.additionalComments && (
//                     <p className="mt-2 italic">💬 {fb.additionalComments}</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No feedback submitted yet.</p>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FeedbackModal;


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackResponse, FeedbackAnswer, Training } from "@/types/training";
import { Loader2, User, MessageSquare, CheckCircle2, Calendar, Users } from "lucide-react";

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
  "STRONGLY AGREE",
  "AGREE",
  "AVERAGE",
  "DISAGREE",
];

const responseColors: Record<FeedbackResponse, string> = {
  "STRONGLY AGREE": "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  "AGREE": "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "AVERAGE": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "DISAGREE": "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  "EXCELLENT": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
};

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

  const progress = selectedTraining.questions.length > 0 
    ? (Object.keys(feedbackAnswers).length / selectedTraining.questions.length) * 100 
    : 0;

  return (
    <Dialog open={isActionDialogOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {selectedActionType === "feedback" ? "Submit Feedback" : "View Feedback"}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(selectedTraining.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <DialogTitle className="text-xl font-semibold leading-tight">
              {selectedTraining.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {selectedActionType === "feedback" 
                ? "Please provide your honest feedback to help us improve future training sessions."
                : `Review feedback from ${selectedTraining.feedbacks?.length || 0} participant(s).`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6 pt-2">
            {/* SUBMIT FEEDBACK */}
            {selectedActionType === "feedback" && (
              <div className="space-y-6">
                {/* Progress indicator */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Separator />

                {/* Questions */}
                <div className="space-y-6">
                  {selectedTraining?.questions.map((q, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="font-medium text-sm leading-relaxed pt-0.5">{q}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-9">
                        {responses.map((r) => (
                          <Button
                            key={r}
                            variant="outline"
                            size="sm"
                            className={`text-xs font-medium transition-all ${
                              feedbackAnswers[q] === r 
                                ? responseColors[r] + " border-2"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setFeedbackAnswers(q, r)}
                          >
                            {feedbackAnswers[q] === r && (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            {r}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Comments */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Additional Comments
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    placeholder="Share your thoughts on the training content, delivery, or any suggestions for improvement..."
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={async () => {
                      const answers: FeedbackAnswer[] = Object.entries(
                        feedbackAnswers
                      ).map(([question, response]) => ({
                        question,
                        response,
                      }));
                      await submitFeedback(
                        selectedTraining._id,
                        answers,
                        feedbackComments
                      );
                      closeModal();
                    }}
                    disabled={
                      isLoading ||
                      Object.values(feedbackAnswers).some((r) => !r) ||
                      !feedbackComments.trim()
                    }
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* VIEW FEEDBACK (READ-ONLY) */}
            {selectedActionType === "view" && (
              <div className="space-y-6">
                {/* Facilitators section */}
                {selectedTraining?.facilitators?.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">Facilitators</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTraining.facilitators.map((f, idx) => (
                        <Badge key={idx} variant="secondary" className="font-normal">
                          {f.name}
                          {f.email && <span className="text-muted-foreground ml-1">({f.email})</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Feedback summary */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Participant Feedback
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {selectedTraining.feedbacks?.length || 0} response(s)
                  </Badge>
                </div>

                {selectedTraining?.feedbacks?.length ? (
                  <div className="space-y-4">
                    {selectedTraining.feedbacks.map((fb, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {fb.user?.firstName} {fb.user?.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {fb.user?.department}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {fb.submittedAt && new Date(fb.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-2 pl-10">
                          {fb.answers.map((ans, i) => (
                            <div key={i} className="flex items-start justify-between gap-4 text-sm">
                              <span className="text-muted-foreground flex-1">{ans.question}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-medium whitespace-nowrap ${responseColors[ans.response] || ''}`}
                              >
                                {ans.response}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {fb.additionalComments && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Additional Comments</p>
                            <p className="text-sm italic text-foreground">"{fb.additionalComments}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No feedback submitted yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;