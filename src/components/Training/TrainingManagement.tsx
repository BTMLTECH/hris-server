/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Eye, MessageSquare, Search, Users } from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useReduxAuth } from "@/hooks/auth/useReduxAuth";
import { ProfileFormData } from "@/types/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { useReduxTraining } from "@/hooks/training/useReduxTraining";
import {
  setIsDialogOpen,
  setTrainingFormData,
  setLoading,
  setTrainingPagination,
  setIsActionDialogOpen,
  setSelectedTraining,
  resetFeedback,
  setSelectedActionType,
  setFeedbackComments,
  setFeedbackAnswers,
} from "@/store/slices/training/trainingSlice";
import { PaginationNav } from "../ui/paginationNav";
import FeedbackModal from "./FeedbackModal";
import { setSearchTerm } from "@/store/slices/profile/profileSlice";
import { EmployeeSelector } from "../ui/employee-selector";

const TrainingManagement: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { searchTerm } = useAppSelector((state) => state.profile);
  const { cachedEmployees, shouldShowSkeleton } = useReduxAuth();
  const dispatch = useAppDispatch();
  const canManageEmployees = currentUser?.role === "teamlead";

  const {
    trainingFormData,
    isLoading,
    isDialogOpen,
    trainingCache,
    trainingPagination,
    isActionDialogOpen,
    selectedTraining,
    selectedActionType,
    feedbackAnswers,
    feedbackComments,
  } = useAppSelector((state) => state.training);

  const { createTraining, submitFeedback } = useReduxTraining();

  // Handle create training
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const payload = {
  //     ...trainingFormData,
  //     trainer: `${currentUser.firstName} ${currentUser.lastName}`,
  //     department: `${currentUser.department}`,
  //   };

  //   const success = await createTraining(payload);

  //   if (success) {
  //     dispatch(setIsDialogOpen(false));
  //     // reset form
  //     dispatch(
  //       setTrainingFormData({
  //         title: "",
  //         date: "",
  //         trainer: `${currentUser.firstName} ${currentUser.lastName}`,
  //         department: `${currentUser.department}`,
  //         noOfTrainees: 0,
  //         participantEmails: [],
  //       })
  //     );
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...trainingFormData,
      facilitators: trainingFormData.facilitators?.length
        ? trainingFormData.facilitators
        : [
            {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email || "",
            },
          ],
      department: currentUser.department || "",
    };

    const success = await createTraining(payload);

    if (success) {
      dispatch(setIsDialogOpen(false));

      // ✅ Reset form with a default facilitator
      dispatch(
        setTrainingFormData({
          title: "",
          date: "",
          facilitators: [
            {
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email || "",
            },
          ],
          department: currentUser.department || "",
          noOfTrainees: 0,
          participantEmails: [],
        })
      );
    }
  };

  const closeModal = () => {
    dispatch(setIsActionDialogOpen(false));
    dispatch(setSelectedTraining(null));
    dispatch(setSelectedActionType(null));
    dispatch(resetFeedback());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Training Management</h2>
          <p className="text-gray-600">Manage trainings and participants</p>
        </div>
        {/* {canManageEmployees && (
        )} */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            dispatch(setIsDialogOpen(isOpen));
            if (!isOpen) {
              dispatch(
                setTrainingFormData({
                  title: "",
                  date: "",
                  trainer: "",
                  noOfTrainees: 0,
                  participantEmails: [],
                })
              );
            }
          }}
        >
          <Button onClick={() => dispatch(setIsDialogOpen(true))}>
            <Plus className="h-4 w-4 mr-2" />
            Create Training
          </Button>

          <DialogContent className="bg-white rounded-2xl shadow-xl max-w-2xl w-full sm:mx-4 mx-2 max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Create Training
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm mt-1">
                Fill in the details to create a new training session.
              </DialogDescription>
            </DialogHeader>

            {/* Form */}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={trainingFormData?.title}
                  placeholder="Enter training title"
                  onChange={(e) =>
                    dispatch(
                      setTrainingFormData({
                        ...trainingFormData,
                        title: e.target.value,
                      })
                    )
                  }
                  required
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={trainingFormData?.date}
                  onChange={(e) =>
                    dispatch(
                      setTrainingFormData({
                        ...trainingFormData,
                        date: e.target.value,
                      })
                    )
                  }
                  required
                />
              </div>

              <div>
                <Label>Facilitators</Label>

                {/* Render facilitator fields */}
                {trainingFormData?.facilitators?.map((facilitator, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 mb-2"
                  >
                    <Input
                      type="text"
                      placeholder="Facilitator name"
                      value={facilitator.name}
                      required
                      onChange={(e) => {
                        const updated = [...trainingFormData.facilitators];
                        updated[index] = {
                          ...updated[index],
                          name: e.target.value,
                        };
                        dispatch(
                          setTrainingFormData({
                            ...trainingFormData,
                            facilitators: updated,
                          })
                        );
                      }}
                    />

                    <Input
                      type="email"
                      placeholder="Facilitator email (optional)"
                      value={facilitator.email || ""}
                      onChange={(e) => {
                        const updated = [...trainingFormData.facilitators];
                        updated[index] = {
                          ...updated[index],
                          email: e.target.value,
                        };
                        dispatch(
                          setTrainingFormData({
                            ...trainingFormData,
                            facilitators: updated,
                          })
                        );
                      }}
                    />

                    {trainingFormData?.facilitators?.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated =
                            trainingFormData?.facilitators?.filter(
                              (_, i) => i !== index
                            );
                          dispatch(
                            setTrainingFormData({
                              ...trainingFormData,
                              facilitators: updated,
                            })
                          );
                        }}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                {/* Add new facilitator */}
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      setTrainingFormData({
                        ...trainingFormData,
                        facilitators: [
                          ...trainingFormData.facilitators,
                          { name: "", email: "" },
                        ],
                      })
                    );
                  }}
                  className="text-primary text-sm font-medium mt-1 hover:underline"
                >
                  + Add Facilitator
                </button>
              </div>

              {/* Participants */}
              {/* THE CODE IN NODEPAD  */}

              <EmployeeSelector
                label="Participants"
                selectedEmails={trainingFormData?.participantEmails || []}
                onSelectionChange={(emails) =>
                  dispatch(
                    setTrainingFormData({
                      ...trainingFormData,
                      participantEmails: emails,
                      noOfTrainees: emails.length,
                    })
                  )
                }
                employees={cachedEmployees}
                searchTerm={searchTerm}
                onSearchChange={(term) => dispatch(setSearchTerm(term))}
                shouldShowSkeleton={shouldShowSkeleton}
              />
              {/* Number of trainees (auto-calculated, read-only) */}
              <div>
                <Label htmlFor="noOfTrainees">Number of Trainees</Label>
                <Input
                  id="noOfTrainees"
                  type="number"
                  value={trainingFormData?.noOfTrainees}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Footer */}
              <DialogFooter className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    dispatch(setIsDialogOpen(false));
                    dispatch(
                      setTrainingFormData({
                        title: "",
                        date: "",
                        trainer: `${currentUser.firstName} ${currentUser.lastName}`,
                        noOfTrainees: 0,
                        participantEmails: [],
                      })
                    );
                    dispatch(setLoading(false));
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !trainingFormData?.title ||
                    !trainingFormData?.date ||
                    trainingFormData?.participantEmails?.length === 0
                  }
                >
                  {isLoading ? (
                    <>
                      Creating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Create Training"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Trainings Table */}
      <Tabs defaultValue="trainings" className="space-y-8">
        <TabsContent value="trainings">
          <Card>
            <CardHeader>
              <CardTitle>Trainings</CardTitle>
              <CardDescription>
                View and track your training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Facilitators</TableHead>
                    <TableHead>No. of Trainees</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Object.values(trainingCache)
                    .flat()
                    .map((training) => (
                      <TableRow key={training._id}>
                        <TableCell>{training.title}</TableCell>
                        <TableCell>
                          {new Date(training.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {training.facilitators
                            ?.map((f) =>
                              f.email ? `${f.name} (${f.email})` : f.name
                            )
                            .join(", ")}
                        </TableCell>

                        <TableCell>{training.noOfTrainees}</TableCell>
                        <TableCell>
                          {training?.participants
                            ?.map((p) => `${p.firstName} ${p.lastName}`)
                            .join(", ")}
                        </TableCell>

                        {/* ✅ Actions column */}
                        <TableCell className="flex gap-2 justify-end">
                          {(training.participants?.some(
                            (p) =>
                              p.email === currentUser.email &&
                              p.status === "submitted"
                          ) ||
                            (["teamlead", "hr", "employee", "admin"].includes(
                              currentUser.role
                            ) &&
                              training.status === "submitted")) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                dispatch(setSelectedTraining(training));
                                dispatch(setSelectedActionType("view"));
                                dispatch(setIsActionDialogOpen(true));
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          )}

                          {training.participants?.some(
                            (p) =>
                              p.email === currentUser.email &&
                              p.status === "pending"
                          ) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                dispatch(setSelectedTraining(training));
                                dispatch(setSelectedActionType("feedback"));
                                dispatch(setIsActionDialogOpen(true));
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />{" "}
                              Feedback
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {trainingPagination.pages > 1 && (
                <PaginationNav
                  page={trainingPagination.page}
                  totalPages={trainingPagination.pages}
                  onPageChange={(newPage) =>
                    dispatch(
                      setTrainingPagination({
                        ...trainingPagination,
                        page: newPage,
                      })
                    )
                  }
                  className="mt-6"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback modal mounted globally */}

        <FeedbackModal
          isActionDialogOpen={isActionDialogOpen}
          selectedTraining={selectedTraining}
          selectedActionType={selectedActionType}
          feedbackAnswers={feedbackAnswers}
          feedbackComments={feedbackComments}
          isLoading={isLoading}
          submitFeedback={submitFeedback}
          closeModal={closeModal}
          setFeedbackAnswers={(q, r) =>
            dispatch(setFeedbackAnswers({ ...feedbackAnswers, [q]: r }))
          }
          setFeedbackComments={(c) => dispatch(setFeedbackComments(c))}
        />
      </Tabs>
    </div>
  );
};

export default TrainingManagement;
