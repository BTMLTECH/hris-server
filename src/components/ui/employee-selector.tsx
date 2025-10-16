import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users } from "lucide-react";
import { ProfileFormData } from "@/types/user";

interface EmployeeSelectorProps {
  label: string;
  selectedEmails: string[];
  onSelectionChange: (emails: string[]) => void;
  employees: ProfileFormData[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  shouldShowSkeleton: boolean;
  maxSelections?: number;
  employeeFilter?: (emp: ProfileFormData) => boolean;
  requiredMin?: number;
  className?: string;
}

export function EmployeeSelector({
  label,
  selectedEmails,
  onSelectionChange,
  employees,
  searchTerm,
  onSearchChange,
  shouldShowSkeleton,
  maxSelections,
  employeeFilter = () => true,
  requiredMin = 1,
  className = "",
}: EmployeeSelectorProps) {
  const filteredEmployees = employees.filter(employeeFilter);

  const handleEmployeeToggle = (email: string) => {
    let updated = [...selectedEmails];
    if (selectedEmails.includes(email)) {
      updated = updated.filter((e) => e !== email);
    } else {
      if (maxSelections && updated.length >= maxSelections) return;
      updated = [...updated, email];
    }
    onSelectionChange(updated);
  };

  return (
    <div className={className}>
      <Label className="text-gray-800 text-sm font-semibold mb-2 block">
        {label}
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between 
              rounded-2xl px-4 py-3 
              bg-white/60 backdrop-blur-md 
              border border-gray-200 shadow-sm
              hover:bg-white/80 hover:shadow-md 
              transition-all duration-300 
              text-gray-700 font-medium"
          >
            {selectedEmails.length
              ? `${selectedEmails.length} selected`
              : `Select ${label.toLowerCase()}`}
            <span className="text-gray-400 text-sm">⌄</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full max-w-md p-4 rounded-2xl bg-white/80 backdrop-blur-lg 
                                   border border-gray-200 shadow-lg max-h-96"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9 rounded-xl"
            />
          </div>

          <div
            className="space-y-2 max-h-64 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {shouldShowSkeleton ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50/60 animate-pulse"
                  >
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-3 bg-muted-foreground/50 rounded w-40" />
                          <div className="h-3 bg-muted-foreground/40 rounded w-28" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-sm font-medium">No employees found</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  No employees match your search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-2 pb-2">
                {filteredEmployees.map((emp) => {
                  const isChecked = selectedEmails.includes(emp.email);
                  return (
                    <div
                      key={emp._id}
                      className="flex items-center justify-between rounded-xl px-3 py-2 
                                 bg-gray-50/60 hover:bg-gray-100/70 transition-all duration-200 cursor-pointer"
                      onClick={() => handleEmployeeToggle(emp.email)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox checked={isChecked} />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-gray-800 text-sm font-medium truncate">
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span className="text-gray-500 text-xs truncate">
                            {emp.position || emp.role || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedEmails.length < requiredMin && (
        <p className="text-sm text-red-500 mt-2">
          Please select at least {requiredMin} {label.toLowerCase()}
        </p>
      )}
    </div>
  );
}
