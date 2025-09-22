/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { setFormData } from "@/store/slices/profile/profileSlice";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { NIGERIAN_STATES } from "@/data/constRaw";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { ProfileFormData } from "@/types/user";

interface BasicInfoSectionProps {
  formData: ProfileFormData;
  dispatch: Dispatch<any>;
  nextStaffId: string;
  isEditMode: boolean;
}

export default function BasicInfoSection({
  formData,
  dispatch,
  nextStaffId,
  isEditMode,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Staff ID + Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="staffId">STAFF ID</Label>
          <Input
            id="staffId"
            value={isEditMode ? formData.staffId : nextStaffId}
            readOnly
            className="bg-gray-100 text-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Select
            value={formData.title ?? "none"}
            onValueChange={(val) =>
              dispatch(
                setFormData({
                  ...formData,
                  title: val === "none" ? undefined : val,
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="none">---select title---</SelectItem>
              {["Mr", "Mrs", "Ms", "Dr", "Prof"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: First Name + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName || ""}
            onChange={(e) =>
              dispatch(setFormData({ ...formData, firstName: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName || ""}
            onChange={(e) =>
              dispatch(setFormData({ ...formData, lastName: e.target.value }))
            }
            required
          />
        </div>
      </div>

      {/* Row 3: Middle Name + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName || ""}
            onChange={(e) =>
              dispatch(setFormData({ ...formData, middleName: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender ?? "none"}
            onValueChange={(val) =>
              dispatch(
                setFormData({
                  ...formData,
                  gender: val === "none" ? undefined : val,
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">---select gender---</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 4: Date of Birth + State of Origin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) =>
              dispatch(
                setFormData({ ...formData, dateOfBirth: e.target.value })
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="stateOfOrigin">State of Origin</Label>
          <Select
            value={formData.stateOfOrigin ?? "none"}
            onValueChange={(val) =>
              dispatch(
                setFormData({
                  ...formData,
                  stateOfOrigin: val === "none" ? undefined : val,
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state of origin" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="none">---select state---</SelectItem>
              {NIGERIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5: Address + City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) =>
              dispatch(setFormData({ ...formData, address: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city || ""}
            onChange={(e) =>
              dispatch(setFormData({ ...formData, city: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Row 6: Mobile (full width for better UX) */}
      <div>
        <Label htmlFor="mobile">Mobile</Label>
        <Input
          id="mobile"
          value={formData.mobile || ""}
          onChange={(e) =>
            dispatch(setFormData({ ...formData, mobile: e.target.value }))
          }
        />
      </div>
    </div>
  );
}
