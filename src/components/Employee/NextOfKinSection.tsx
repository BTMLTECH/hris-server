/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { setFormData } from "@/store/slices/profile/profileSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { ProfileFormData } from "@/types/user";


interface NextOfKinSectionProps {
  formData: ProfileFormData;
  dispatch: Dispatch<any>;
}

export default function NextOfKinSection({ formData, dispatch }: NextOfKinSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nextOfKinName">Next of Kin's Name</Label>
          <Input
            id="nextOfKinName"
            value={formData.nextOfKin?.name || ""}
            onChange={(e) =>
              dispatch(setFormData({ 
                ...formData, 
                nextOfKin: { ...formData.nextOfKin, name: e.target.value } 
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="nextOfKinPhone">Next of Kin's Phone Number</Label>
          <Input
            id="nextOfKinPhone"
            value={formData.nextOfKin?.phone || ""}
            onChange={(e) =>
              dispatch(setFormData({ 
                ...formData, 
                nextOfKin: { ...formData.nextOfKin, phone: e.target.value } 
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nextOfKinEmail">Next of Kin's Email</Label>
          <Input
            id="nextOfKinEmail"
            type="email"
            value={formData.nextOfKin?.email || ""}
            onChange={(e) =>
              dispatch(setFormData({ 
                ...formData, 
                nextOfKin: { ...formData.nextOfKin, email: e.target.value } 
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="nextOfKinRelationship">Relationship</Label>
          <Input
            id="nextOfKinRelationship"
            value={formData.nextOfKin?.relationship || ""}
            onChange={(e) =>
              dispatch(setFormData({ 
                ...formData, 
                nextOfKin: { ...formData.nextOfKin, relationship: e.target.value } 
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
