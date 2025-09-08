/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/store/hooks";
import { setFormData } from "@/store/slices/profile/profileSlice";

import { departmentMap } from "@/types/report";
import { ProfileFormData } from "@/types/user";
import { requirementsByDepartment } from "@/utils/onboardingRequirements";
import { Dispatch, useEffect, useState } from "react";

interface Task {
  name: string;
  category: "training" | "services" | "device";
  completed: boolean;
}

interface Requirement {
  employee: string;
  department: string;
  tasks: Task[];
  createdAt: string;
}

interface RequirementsSectionProps {
  formData: ProfileFormData;
  dispatch: Dispatch<any>;
}

export default function RequirementsSection({ formData, dispatch }: RequirementsSectionProps) {
  const { departmentsCache } = useAppSelector((state) => state.profile);
  const { department } = useAppSelector((state) => state.report);

  const allDepartments = Object.values(departmentsCache || {}).flat();
  
  const selectedDepartment = department || allDepartments[0]?.name || "";

  const mappedDepartment = departmentMap[selectedDepartment] || "";

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!mappedDepartment || !(mappedDepartment in requirementsByDepartment)) {
      setTasks([]); 
      return;
    }

    const deptTasks = requirementsByDepartment[mappedDepartment] || [];
    const initialized = deptTasks.map((t) => ({
      ...t,
      completed:
        formData.requirements
          ?.find((r: Requirement) => r.department === mappedDepartment)
          ?.tasks?.find((ft: Task) => ft.name === t.name)?.completed || false,
    }));

    setTasks(initialized);

    const otherRequirements = (formData.requirements || []).filter(
      (r: Requirement) => r.department !== mappedDepartment
    );

    const updatedRequirement: Requirement = {
      employee: formData._id,
      department: mappedDepartment,
      tasks: initialized,
      createdAt: new Date().toISOString(),
    };

    dispatch(setFormData({ requirements: [...otherRequirements, updatedRequirement] }));
  }, [mappedDepartment, formData, dispatch]);

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);

    const otherRequirements = (formData.requirements || []).filter(
      (r: Requirement) => r.department !== mappedDepartment
    );

    const updatedRequirement: Requirement = {
      employee: formData._id,
      department: mappedDepartment,
      tasks: updatedTasks,
      createdAt: new Date().toISOString(),
    };

    dispatch(setFormData({ requirements: [...otherRequirements, updatedRequirement] }));
  };

  const categories: ("training" | "services" | "device")[] = ["training", "services", "device"];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="font-semibold capitalize">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {tasks
              .filter((task) => task.category === category)
              .map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${category}-${index}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(index)}
                  />
                  <label htmlFor={`${category}-${index}`} className="select-none">
                    {task.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
