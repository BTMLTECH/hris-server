import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, ChevronDown } from "lucide-react";
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
  onBackendSearch?: (term: string) => Promise<ProfileFormData[]>;
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
  onBackendSearch,
}: EmployeeSelectorProps) {
  const [backendResults, setBackendResults] = React.useState<ProfileFormData[]>([]);
  const [isSearchingBackend, setIsSearchingBackend] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredEmployees = employees.filter(employeeFilter);
  const displayedEmployees = backendResults.length > 0 && searchTerm.trim() ? backendResults : filteredEmployees;

  const handleSearchWithBackend = async (term: string) => {
    onSearchChange(term);
    setBackendResults([]);

    // If search term is provided and no local results, try backend search
    if (term.trim() && onBackendSearch) {
      const localFilteredCount = filteredEmployees.filter(
        (emp) =>
          emp.firstName?.toLowerCase().includes(term.toLowerCase()) ||
          emp.lastName?.toLowerCase().includes(term.toLowerCase()) ||
          emp.email?.toLowerCase().includes(term.toLowerCase())
      ).length;

      // If local search returned no results, search backend
      if (localFilteredCount === 0) {
        setIsSearchingBackend(true);
        try {
          const results = await onBackendSearch(term);
          setBackendResults(results.filter(employeeFilter));
        } catch (error) {
          console.error("Backend search failed:", error);
          setBackendResults([]);
        } finally {
          setIsSearchingBackend(false);
        }
      }
    }
  };

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
      <Label className="text-gray-700 text-sm font-semibold mb-3 block">
        {label}
      </Label>

      <Button
        variant="outline"
        className="w-full justify-between 
          h-11 px-4 
          bg-white border border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 
          text-gray-700 font-medium text-left"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center gap-2">
          <span className="text-sm">
            {selectedEmails.length > 0
              ? `${selectedEmails.length} selected`
              : `Select ${label.toLowerCase()}`}
          </span>
          {selectedEmails.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 px-2 py-0.5 text-xs font-medium text-white bg-blue-500 rounded-full">
              {selectedEmails.length}
            </span>
          )}
        </span>
        <ChevronDown 
          className="h-4 w-4 text-gray-400 transition-transform duration-200"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search and Select {label}</DialogTitle>
            <DialogDescription>
              Type to search for {label.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => handleSearchWithBackend(e.target.value)}
                className="pl-10 h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Results List */}
            <div className="border border-gray-200 rounded-lg bg-white">
              <div
                className="overflow-y-auto"
                style={{
                  height: '350px',
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                }}
              >
                {shouldShowSkeleton || isSearchingBackend ? (
                  <div className="px-4 py-3 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 animate-pulse"
                      >
                        <div className="h-4 w-4 bg-gray-300 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-32" />
                          <div className="h-2 bg-gray-200 rounded w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayedEmployees.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
                    <div className="mb-3 p-3 bg-gray-100 rounded-full">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">No employees found</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {searchTerm ? "Try a different search term" : "Start typing to search"}
                    </p>
                  </div>
                ) : (
                  <div className="px-2 py-2 space-y-1">
                    {displayedEmployees.map((emp) => {
                      const isChecked = selectedEmails.includes(emp.email);
                      return (
                        <div
                          key={emp._id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                     hover:bg-blue-50 transition-colors duration-150 cursor-pointer
                                     border border-transparent hover:border-blue-200"
                          onClick={() => handleEmployeeToggle(emp.email)}
                        >
                          <Checkbox 
                            checked={isChecked}
                            className="h-4 w-4 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {(emp.firstName?.charAt(0) || '').toUpperCase()}{(emp.lastName?.charAt(0) || '').toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {emp.firstName} {emp.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {emp.position || emp.role || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedEmails.length > 0 && (
                <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-lg">
                  <p className="text-xs text-gray-600 font-medium">
                    Selected: <span className="text-blue-600">{selectedEmails.length}</span>
                    {maxSelections && <span className="text-gray-400"> / {maxSelections}</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedEmails.length < requiredMin && (
        <p className="text-xs text-red-500 mt-2 font-medium">
          Please select at least {requiredMin} {label.toLowerCase()}
        </p>
      )}
    </div>
  );
}
