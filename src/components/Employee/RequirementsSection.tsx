/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { requirementsByDepartment } from "@/utils/onboardingRequirements";
import {
  setSelectedDepartment,
  toggleTask
} from "@/store/slices/profile/profileSlice";
import { ProfileFormData } from "@/types/user";


interface RequirementsSectionProps {
  formData:ProfileFormData;
  dispatch: Dispatch<any>;
}

export default function RequirementsSection({
  formData,
  dispatch
}: RequirementsSectionProps) {

  // Auto-select first department on mount
  useEffect(() => {
    if (!formData?.selectedDepartment) {
      const firstDept = Object.keys(requirementsByDepartment)[0];
      dispatch(setSelectedDepartment(firstDept));
    }
  }, [formData?.selectedDepartment, dispatch]);

  const tasks = requirementsByDepartment[formData?.selectedDepartment] || [];
  const categories: ("training" | "services" | "device")[] = [
    "training",
    "services",
    "device"
  ];

  return (
    <div className="space-y-6">
      {/* Department Selector */}
      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData?.selectedDepartment}
          onValueChange={(val) => dispatch(setSelectedDepartment(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(requirementsByDepartment).map((dept) => (
              <SelectItem key={dept} value={dept}>
                 {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Grouped by Category */}
      {formData?.selectedDepartment &&
        categories.map((category) => {
          const filteredTasks = tasks.filter(
            (task) => task.category === category
          );

          // Skip category if no tasks
          if (filteredTasks.length === 0) return null;

          const departmentRequirement = formData?.requirements.find(
            (r) => r.department === formData?.selectedDepartment
          );

          return (
            <div key={category} className="space-y-2">
              <h4 className="font-semibold capitalize">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredTasks.map((task, index) => {
                  const isChecked = departmentRequirement?.tasks.some(
                    (t) => t.name === task.name && t.completed
                  );

                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${index}`}
                        checked={!!isChecked}
                        onCheckedChange={() =>
                          dispatch(
                            toggleTask({
                              department: formData?.selectedDepartment,
                              task
                            })
                          )
                        }
                      />
                      <label
                        htmlFor={`${category}-${index}`}
                        className="select-none"
                      >
                        {task.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
