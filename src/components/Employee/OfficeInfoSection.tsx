import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { setFormData } from "@/store/slices/profile/profileSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { OFFICE_BRANCHES, POSITIONS } from "@/data/constRaw";
import { departmentMap } from "@/types/report";

interface OfficeInfoSectionProps {
  formData: any;
  dispatch: Dispatch<any>;
}

export default function OfficeInfoSection({ formData, dispatch }: OfficeInfoSectionProps) {


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="officeEmail">Email</Label>
          <Input
            id="officeEmail"
            value={formData.email || ""}
            onChange={(e) => dispatch(setFormData({ ...formData, email: e.target.value }))}
          />
        </div>


      <div>
       <Label htmlFor="department">Department</Label>
      <Select
      value={
        // Find the department name that matches the current mapped value
        Object.keys(departmentMap).find(
          (name) => departmentMap[name] === formData.department
        ) || "none"
      }
      onValueChange={(val) => {
        dispatch(
          setFormData({
            ...formData,
            department: val === "none" ? "" : departmentMap[val] ?? "",
          })
        );
      }}
>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent className="max-h-60 overflow-y-auto">
    <SelectItem value="none">---select department---</SelectItem>
    {(formData.departments || []).map((dept) => {
      const code = dept.name ? departmentMap[dept.name] : undefined;
      return code ? (
        <SelectItem key={dept._id} value={dept.name}>
          {dept.name}
        </SelectItem>
      ) : null;
    })}
  </SelectContent>
</Select>
      </div>

    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="position">Position</Label>
        <Select
          value={formData.position ?? "none"}
          onValueChange={(val) =>
            dispatch(
              setFormData({
                ...formData,
                position: val === "none" ? undefined : val,
              })
            )
          }
        >
      <SelectTrigger>
        <SelectValue placeholder="Select position" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        <SelectItem value="none">---select position---</SelectItem>
        {POSITIONS.map((pos) => (
          <SelectItem key={pos} value={pos}>
            {pos}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

<div>
  <Label htmlFor="role">Role</Label>
  <Select
    value={formData.role ?? "none"}
    onValueChange={(val) =>
      dispatch(
        setFormData({
          ...formData,
          role: val === "none" ? undefined : val,
        })
      )
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Role" />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
      <SelectItem value="none">---select role---</SelectItem>
      {["md", "teamlead", "employee", "admin", "hr"].map((role) => (
        <SelectItem key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="officeBranch">Office Branch</Label>
          <Select
      value={formData.officeBranch ?? "none"}
      onValueChange={(val) =>
        dispatch(
          setFormData({
            ...formData,
            officeBranch: val === "none" ? undefined : val,
          })
        )
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select office branch" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        <SelectItem value="none">---select office branch---</SelectItem>
        {OFFICE_BRANCHES.map((branch) => (
          <SelectItem key={branch} value={branch}>
            {branch}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
        </div>

        <div>
          <Label htmlFor="employmentDate">Employment Date</Label>
          <Input
            id="employmentDate"
            type="date"
             value={formData.employmentDate ? formData.employmentDate.split("T")[0] : ""}
            onChange={(e) => dispatch(setFormData({ ...formData, employmentDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
