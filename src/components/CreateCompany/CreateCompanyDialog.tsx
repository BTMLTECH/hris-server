/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import {
  setCompanyFormData,
  setIsCompanyDialogOpen,
} from "@/store/slices/profile/profileSlice";
import { CreateCompanyDTO } from "@/types/user";

export function CreateCompanyDialog({
  onSubmit,
  submitting,
  companyFormData,
  dispatch,
  isCompanyDialogOpen,
  handleCancel,
}: {
  onSubmit: (data: any) => void;
  submitting?: (scope: string, key: string) => boolean;
  companyFormData: CreateCompanyDTO;
  dispatch: ReturnType<typeof useDispatch>;
  isCompanyDialogOpen: boolean;
  handleCancel: () => void;
}) {
  // Company
  const handleChange = (field: keyof CreateCompanyDTO, value: string) => {
    dispatch(setCompanyFormData({ [field]: value } as any));
  };

  // Admin
  const handleAdminChange = (
    field: keyof CreateCompanyDTO["adminData"],
    value: string
  ) => {
    dispatch(
      setCompanyFormData({
        adminData: { ...companyFormData.adminData, [field]: value },
      })
    );
  };

  // Branding
  const handleBrandingChange = (
    field: keyof NonNullable<CreateCompanyDTO["branding"]>,
    value: string
  ) => {
    dispatch(
      setCompanyFormData({
        branding: { ...companyFormData.branding, [field]: value },
      })
    );
  };

 const handleSubmit = () => {
  // Ensure branding object always exists
  const payload = {
    ...companyFormData,
    branding: {
      displayName: companyFormData.branding?.displayName || "",
      logoUrl: companyFormData.branding?.logoUrl || "",
      primaryColor: companyFormData.branding?.primaryColor || "#030577ab",
    },
  };

  onSubmit(payload);
};


  return (
    <Dialog
      open={isCompanyDialogOpen}
      onOpenChange={(o) => dispatch(setIsCompanyDialogOpen(o))}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header (sticky) */}
        <DialogHeader className="shrink-0">
          <DialogTitle>Create Company</DialogTitle>
          <DialogDescription>
            Add a company and assign an admin
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Company Info */}
          <Input
            placeholder="Company Name"
            value={companyFormData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
          <Input
            placeholder="Description"
            value={companyFormData.companyDescription || ""}
            onChange={(e) => handleChange("companyDescription", e.target.value)}
          />

          {/* Admin Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              placeholder="Staff ID"
              value={companyFormData.adminData.staffId || ""}
              onChange={(e) => handleAdminChange("staffId", e.target.value)}
            />
            <Select
              value={companyFormData.adminData.title}
              onValueChange={(val) => handleAdminChange("title", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr">Mr</SelectItem>
                <SelectItem value="Mrs">Mrs</SelectItem>
                <SelectItem value="Ms">Ms</SelectItem>
         
              </SelectContent>
            </Select>

            <Input
              placeholder="First Name"
              value={companyFormData.adminData.firstName}
              onChange={(e) => handleAdminChange("firstName", e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={companyFormData.adminData.lastName}
              onChange={(e) => handleAdminChange("lastName", e.target.value)}
            />
            <Input
              placeholder="Middle Name (optional)"
              value={companyFormData.adminData.middleName || ""}
              onChange={(e) => handleAdminChange("middleName", e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              className="sm:col-span-2"
              value={companyFormData.adminData.email}
              onChange={(e) => handleAdminChange("email", e.target.value)}
            />

            <Select
              value={companyFormData.adminData.gender}
              onValueChange={(val) => handleAdminChange("gender", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branding Info */}
          <div className="space-y-2">
            <Input
              placeholder="Display Name"
              value={companyFormData.branding?.displayName || ""}
              onChange={(e) =>
                handleBrandingChange("displayName", e.target.value)
              }
            />
            <Input
              placeholder="Logo URL"
              value={companyFormData.branding?.logoUrl || ""}
              onChange={(e) => handleBrandingChange("logoUrl", e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-1 border rounded"
                value={companyFormData.branding?.primaryColor || "#000000"}
                onChange={(e) =>
                  handleBrandingChange("primaryColor", e.target.value)
                }
              />
              <span className="text-sm text-muted-foreground">
                Primary Color
              </span>
            </div>
          </div>
        </div>

        {/* Footer (sticky) */}
        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting("company", "company")}
          >
            {submitting("company", "company")
              ? "Creating..."
              : "Create Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
