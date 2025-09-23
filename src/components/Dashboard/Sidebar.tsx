import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCombinedContext } from "@/contexts/AuthContext";
import {
  Home,
  Users,
  Clock,
  Calendar,
  Briefcase,
  BarChart3,
  FileBarChart,
  // Settings,
  Star,
  HandHeart,
  CreditCard,
} from "lucide-react";
import { NairaSign } from "../ui/NairaSign";
import { useAppSelector } from "@/store/hooks";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const { user } = useAppSelector((state) => state.auth);
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      roles: ["admin", "hr", "md", "employee"],
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      roles: ["admin", "hr", "md"],
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Clock,
      roles: ["admin", "hr", "md", "employee"],
    },
    {
      id: "leave",
      label: "Leave Management",
      icon: Calendar,
      roles: ["admin", "hr", "md", "employee"],
    },
    // { id: 'loan', label: 'Loan Management', icon: CreditCard, roles: ['admin', 'hr', 'employee'] },
    {
      id: "appraisal",
      label: "Appraisal",
      icon: Star,
      roles: ["admin", "hr", "md", "employee"],
    },
    // { id: 'appraisal-approval', label: 'Appraisal Approval', icon: ClipboardList, roles: ['admin', 'hr', 'md'], badge: '3' },
    {
      id: "payroll",
      label: "Payroll",
      icon: NairaSign,
      roles: ["admin", "hr"],
    },
    // { id: 'performance', label: 'Performance', icon: TrendingUp, roles: ['admin', 'hr', 'md'] },
    // { id: 'recruitment', label: 'Recruitment', icon: UserPlus, roles: ['admin', 'hr'] },
    // { id: 'documents', label: 'Documents', icon: FileText, roles: ['admin', 'hr', 'md', 'employee'] },
    {
      id: "handover",
      label: "Handover",
      icon: HandHeart,
      roles: ["admin", "hr", "md", "employee"],
    },
    {
      id: "handover-approval",
      label: "Handover Approval",
      icon: Briefcase,
      roles: ["admin", "hr", "md"],
      badge: "2",
    },
    // { id: 'time-tracking', label: 'Time Tracking', icon: Timer, roles: ['admin', 'hr', 'md', 'employee'] },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      roles: ["admin", "hr", "md"],
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileBarChart,
      roles: ["admin", "hr", "md"],
    },
    // { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'hr'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {user?.company.name}
            </h1>
            <p className="text-sm text-gray-300">{user?.company.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left h-12 px-4 ${
                isActive
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-200 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => onItemClick(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-red-500 text-white hover:bg-red-600 ml-2">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"}
            </p>
            <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
