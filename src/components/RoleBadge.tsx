
// import React from "react";
// import { Badge } from "@/components/ui/badge";

// const roleConfig = {
//   admin: {
//     label: "admin",
//     className: "bg-admin text-white hover:bg-admin/90",
//   },
//   hr: {
//     label: "hr",
//     className: "bg-hr text-white hover:bg-hr/90",
//   },
//   md: {
//     label: "md",
//     className: "bg-md text-white hover:bg-md/90",
//   },
//   teamlead: {
//     label: "teamlead",
//     className: "bg-teamlead text-white hover:bg-teamlead/90",
//   },
//   employee: {
//     label: "employee",
//     className: "bg-employee text-white hover:bg-employee/90",
//   },
// };

// export interface RoleBadgeProps {
//   role: "employee" | "md" | "teamlead" | "admin" | "hr";
//   size?: "sm" | "md" | "lg";
// }

// const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = "md" }) => {
//   const config = roleConfig[role];
//   console.log("RoleBadge config:", config);

//   if (!config) {
//     return null; // or some default badge
//   }



//   // Capitalize first letter of label
//   const formattedLabel =
//     config?.label.charAt(0).toUpperCase() +
//     config?.label.slice(1).toLowerCase();

//   return (
//     <Badge
//       className={`${config.className} ${
//         size === "sm"
//           ? "text-xs px-2 py-0.5"
//           : size === "lg"
//           ? "text-sm px-3 py-1"
//           : ""
//       }`}
//     >
//       {formattedLabel}
//     </Badge>
//   );
// };

// export default RoleBadge;


import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Allowed roles
 */
export type RoleType =
  | "employee"
  | "md"
  | "teamlead"
  | "admin"
  | "hr";

/**
 * Role config (type-safe & complete)
 */
const roleConfig: Record<
  RoleType,
  {
    label: string;
    className: string;
  }
> = {
  admin: {
    label: "Admin",
    className: "bg-admin text-white hover:bg-admin/90",
  },
  hr: {
    label: "HR",
    className: "bg-hr text-white hover:bg-hr/90",
  },
  md: {
    label: "MD",
    className: "bg-md text-white hover:bg-md/90",
  },
  teamlead: {
    label: "Team Lead",
    className: "bg-teamlead text-white hover:bg-teamlead/90",
  },
  employee: {
    label: "Employee",
    className: "bg-employee text-white hover:bg-employee/90",
  },
};

export interface RoleBadgeProps {
  role?: string; // ← intentionally loose (API-safe)
  size?: "sm" | "md" | "lg";
}

const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = "md",
}) => {
  // Normalize role safely
  const normalizedRole = role?.toLowerCase() as RoleType | undefined;
  const config = normalizedRole
    ? roleConfig[normalizedRole]
    : undefined;

  // 🚨 Fallback: unknown / missing role
  if (!config) {
    return (
      <Badge className="bg-gray-400 text-white">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge
      className={`${config.className} ${
        size === "sm"
          ? "text-xs px-2 py-0.5"
          : size === "lg"
          ? "text-sm px-3 py-1"
          : ""
      }`}
    >
      {config.label}
    </Badge>
  );
};

export default RoleBadge;
