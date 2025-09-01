import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { HandCoins, Upload, Loader2 } from "lucide-react";
import { useCombinedContext } from "@/contexts/AuthContext";
import { useReduxContribution } from "@/hooks/cooperative/useReduxCooperative";
import {
  setContributionPagination,
  setCooperativeRecord,
  setIsDeleteDialogOpen,
  setIsDialogOpen,
  setIsUpdateDialogOpen,
} from "@/store/slices/cooperative/cooperativeSlice";
import { PaginationNav } from "../ui/paginationNav";
import { useLoadingState } from "@/hooks/useLoadingState";
import { set } from "date-fns";

export const Cooperative: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    user
  } = useAppSelector((state) => state.auth);
  const {
    isDialogOpen,
    isDeleteDialogOpen,
    isLoading: coopIsLoading,
    cooperativeRecord,
    cooperativeResponse,
    cooperativePagination,
    isUpdateDialogOpen
  } = useAppSelector((state) => state.cooperative);
  
  const canOnlyView = user?.role === "hr" || user?.role === "admin"
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [deleteParams, setDeleteParams] = useState<{ id: string | null }>({
    id: null,
  });
  const { isLocalLoading, setLocalLoading, clearLocalLoading } = useLoadingState();  

  const {
    handleHrContribution,
    handleDeleteContribution,
    handleCreateContribution,
    handleUpdateContribution
  } = useReduxContribution();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValid = file.name.endsWith(".pdf");
    if (!isValid) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF receipt.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    toast({
      title: "File Uploaded",
      description: `${file.name} is ready for import.`,
    });
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !cooperativeRecord.amount) {
      toast({
        title: "Missing Data",
        description: "Please upload a receipt and enter an amount.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("email", user?.email);
    formData.append("amount", cooperativeRecord.amount.toString());
    formData.append("message", cooperativeRecord.message || "");
    formData.append("month", cooperativeRecord.month.toString());
    formData.append("year", cooperativeRecord.year.toString());

    const success = await handleHrContribution(formData);
    if (success) {
      dispatch(setIsDialogOpen(false));
      setUploadedFile(null);
      dispatch(
        setCooperativeRecord({
          ...cooperativeRecord,
          amount: 0,
          message: "",
        })
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-8">
        {/* 📌 Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cooperative</h1>
            <p className="text-gray-600">
              Manage and view your cooperative contributions
            </p>
          </div>

          {canOnlyView ? (
            <Button
              onClick={() => dispatch(setIsDialogOpen(true))}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <HandCoins className="h-4 w-4" />
              Add Contribution
            </Button>
          ) : cooperativeRecord?.status === "REQUEST" ? (
            <Button
              onClick={() => dispatch(setIsDialogOpen(true))}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <HandCoins className="h-4 w-4" />
              Participate in Contribution
            </Button>
          ) : null}
        </div>

        {/* 📌 Contribution Dialog */}
        <Dialog
  open={isDialogOpen}
  onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
>
  <DialogContent
    className="
      w-full max-w-lg
      sm:rounded-2xl
      max-h-[90vh]
      overflow-y-auto
      sm:my-auto
      p-6
    "
  >
    <DialogHeader>
      <DialogTitle>Participate in Cooperation</DialogTitle>
      <DialogDescription>
        Submit your monthly cooperative contribution with proof of payment.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6">
      {/* Rules */}
      <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md">
        💡 <strong>Rules:</strong> Contributions must be at least{" "}
        <span className="font-semibold">₦1000</span>. Upload a valid{" "}
        <span className="font-semibold">PDF receipt</span> as proof.
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Receipt (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="receipt-upload"
        />
        <label htmlFor="receipt-upload">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            asChild
          >
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Choose File
            </span>
          </Button>
        </label>
        {uploadedFile && (
          <p className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium">{uploadedFile.name}</span>
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Contribution Amount (₦)</label>
        <Input
          type="number"
          placeholder="Enter amount"
          value={cooperativeRecord.amount || ""}
          onChange={(e) =>
            dispatch(
              setCooperativeRecord({
                ...cooperativeRecord,
                amount: Number(e.target.value),
              })
            )
          }
        />
      </div>

      {/* Month & Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Month</label>
          <Input
            type="number"
            placeholder="1 - 12"
            value={cooperativeRecord.month || ""}
            min={1}
            max={12}
            onChange={(e) =>
              dispatch(
                setCooperativeRecord({
                  ...cooperativeRecord,
                  month: Number(e.target.value),
                })
              )
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Input
            type="number"
            placeholder="e.g. 2025"
            value={cooperativeRecord.year || ""}
            onChange={(e) =>
              dispatch(
                setCooperativeRecord({
                  ...cooperativeRecord,
                  year: Number(e.target.value),
                })
              )
            }
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Message (optional)</label>
        <Textarea
          placeholder="Add a note..."
          value={cooperativeRecord.message || ""}
          onChange={(e) =>
            dispatch(
              setCooperativeRecord({
                ...cooperativeRecord,
                message: e.target.value,
              })
            )
          }
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={coopIsLoading}
      >
        {coopIsLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>Submit Contribution</>
        )}
      </Button>
    </div>
  </DialogContent>
</Dialog>

        {/* 📌 Contribution History */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            My Contribution History
          </h2>

          {cooperativeResponse?.length === 0 ? (
            <p className="text-gray-500 text-sm">No contributions yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-md text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      {canOnlyView && (
                        <>
                        <th className="px-4 py-2 text-left">StaffId</th>
                        <th className="px-4 py-2 text-left">Employee Name</th>
                        <th className="px-4 py-2 text-left">Department</th>
                        </>                        
                      )}
                      <th className="px-4 py-2 text-left">Month</th>
                      <th className="px-4 py-2 text-left">Year</th>
                      <th className="px-4 py-2 text-left">Amount (₦)</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Receipt</th>
                      {
                      canOnlyView &&   <th className="px-4 py-2 text-left">Actions</th>
                      
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {cooperativeResponse?.map((c, i) => (
                      <tr key={i} className="border-t">
                        {
                          canOnlyView && (
                            <>
                        <td className="px-4 py-2">{c.user?.staffId}</td>
                        <td className="px-4 py-2">{c.user?.firstName} {c.user?.lastName}</td>
                        <td className="px-4 py-2">{c.user?.department}</td>
                            </>
                          )
                        }
                        <td className="px-4 py-2">{c.month}</td>
                        <td className="px-4 py-2">{c.year}</td>
                        <td className="px-4 py-2 font-medium">₦{c.amount}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium
                              ${
                                c.status === "APPROVED"
                                  ? "bg-green-100 text-green-700"
                                  : c.status === "COLLECTED"
                                  ? "bg-blue-100 text-blue-700"
                                  : c.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {c.receiptUrl ? (
                            <a
                              href={c.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          {/* Delete */}
               

                          {/* Add (HR/Admin only) */}
                         {canOnlyView && (
  <>
    {c.status === "APPROVED" ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // open update dialog with pre-filled values
          dispatch(setCooperativeRecord({
            _id: c._id,
            amount: c.amount,
            month: c.month,
            year: c.year
          }));
          dispatch(setIsUpdateDialogOpen(true));
        }}
      >
        Update
      </Button>
    ) : (
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          setLocalLoading(c._id, "add");
          const success = await handleCreateContribution(c._id);
          if (success) clearLocalLoading(c._id, "add");
        }}
        disabled={isLocalLoading(c._id, "add")}
      >
        {isLocalLoading(c._id, "add") && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        Add
      </Button>
    )}

    <Button
      variant="destructive"
      size="sm"
      onClick={() => {
        setDeleteParams({ id: c._id });
        dispatch(setIsDeleteDialogOpen(true));
      }}
    >
      Remove
    </Button>
  </>
)}

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📌 Pagination */}
              {cooperativePagination.pages > 1 && (
                <PaginationNav
                  page={cooperativePagination.page}
                  totalPages={cooperativePagination.pages}
                  onPageChange={(newPage) =>
                    dispatch(
                      setContributionPagination({
                        ...cooperativePagination,
                        page: newPage,
                      })
                    )
                  }
                  className="mt-6"
                />
              )}
            </>
          )}
        </div>
      </div>


      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => dispatch(setIsDeleteDialogOpen(open))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contribution?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>{ dispatch(setIsDeleteDialogOpen(false));
                setDeleteParams({ id: null });
                dispatch(setCooperativeRecord({
                  cooperativeId: null,
                  amount: null,
                  month: null,
                  year: null
                }));
                dispatch(setIsDialogOpen(false));
                

              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteParams.id) {
                  setLocalLoading(deleteParams.id, "remove");
                 const success = await handleDeleteContribution(deleteParams.id);
                 if(success){
                  clearLocalLoading(deleteParams.id, "remove");
                  dispatch(setIsDeleteDialogOpen(false));
                  setDeleteParams({ id: null });
                  
                 }
                }
              }}
              disabled={isLocalLoading(deleteParams.id, 'remove')}

            >
              {isLocalLoading(deleteParams.id, 'remove') && (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
  open={isUpdateDialogOpen}
  onOpenChange={(open) => dispatch(setIsUpdateDialogOpen(open))}
>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Update Contribution</DialogTitle>
      <DialogDescription>
        Modify your contribution details below.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6">
      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount (₦)</label>
        <Input
          type="number"
          value={cooperativeRecord.amount || ""}
          onChange={(e) =>
            dispatch(
              setCooperativeRecord({
                ...cooperativeRecord,
                amount: Number(e.target.value),
              })
            )
          }
        />
      </div>

{/* Month & Year */}
<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">Month</label>
    <Input
      type="number"
      min={1}
      max={12}
      value={cooperativeRecord?.month || ""}
      onChange={(e) =>
        dispatch(
          setCooperativeRecord({
            ...cooperativeRecord,
            month: Number(e.target.value),
          })
        )
      }
    />
  </div>
  <div className="space-y-2">
    <label className="text-sm font-medium">Year</label>
    <Input
      type="number"
      min={2000} 
      max={2100} 
      value={cooperativeRecord?.year || ""}
      onChange={(e) =>
        dispatch(
          setCooperativeRecord({
            ...cooperativeRecord,
            year: Number(e.target.value),
          })
        )
      }
    />
  </div>
</div>


      {/* Submit */}
      <Button
        onClick={async () => {
           setLocalLoading(cooperativeRecord._id, "update")
           if (!cooperativeRecord._id) return;
          const success = await handleUpdateContribution(cooperativeRecord._id, {
            amount: cooperativeRecord?.amount,
            month: cooperativeRecord?.month,
            year: cooperativeRecord.year,
          });
          if (success) {
            dispatch(setIsUpdateDialogOpen(false));
            clearLocalLoading(cooperativeRecord._id, "update");
          }
        }}
        className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={isLocalLoading(cooperativeRecord._id, "update")}
      >
        {isLocalLoading(cooperativeRecord._id, "update") ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Contribution"
        )}
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};
