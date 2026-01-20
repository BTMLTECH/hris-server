export type LeaveTypeKey =
  | "annual"
  | "compassionate"
  | "maternity";
    

export interface LeaveTypeConfig {
  key: LeaveTypeKey;
  label: string;
  color: string;
}

export const LEAVE_TYPES: LeaveTypeConfig[] = [
  { key: "annual", label: "Annual", color: "text-green-600" },
  { key: "compassionate", label: "Compassionate", color: "text-yellow-600" },
  { key: "maternity", label: "Maternity", color: "text-pink-600" },

];
