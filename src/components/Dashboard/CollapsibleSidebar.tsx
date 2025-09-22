import React from "react";
import { Button } from "@/components/ui/button";

import {
  Home,
  Users,
  BarChart,
  Calendar,
  FileText,
  Settings,
  User,
  Clock,
  DollarSign,
  Menu,
  X,
  UserCheck,
  TrendingUp,
  Briefcase,
  FolderOpen,
  ArrowRightLeft,
  MapPin,
  CreditCard,
  Award,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PiggyBank,
} from "lucide-react";
import { useCombinedContext } from "@/contexts/AuthContext";
import { useAppSelector } from "@/store/hooks";
import { NairaSign } from "../ui/NairaSign";

interface CollapsibleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onMobileToggle,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const getMenuItems = () => {
    const baseItems = [{ id: "dashboard", label: "Dashboard", icon: Home }];

    const role = user.role;

    switch (role) {
      case "admin":
      case "hr":
        return [
          ...baseItems,
          // { id: 'profile', label: 'My Profile', icon: User },
          { id: "employees", label: "Employee Management", icon: Users },
          { id: "attendance", label: "Attendance", icon: Clock },
          { id: "leave", label: "Leave Management", icon: Calendar },
          // { id: 'loan', label: 'Loan Management', icon: CreditCard },
          { id: "appraisal", label: "Appraisal Management", icon: Award },
          // { id: 'appraisal-approval', label: 'Appraisal Approval', icon: ClipboardCheck },
          { id: "payroll", label: "Payroll Management", icon: NairaSign },
          // { id: 'performance', label: 'Performance Management', icon: TrendingUp },
          // { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          // { id: 'documents', label: 'Document Management', icon: FolderOpen },
          {
            id: "handover",
            label: "Handover Management",
            icon: ArrowRightLeft,
          },
          // { id: 'time-tracking', label: 'Time Tracking', icon: MapPin },
          { id: "training", label: "Training Management", icon: BookOpen },
          {
            id: "cooperative",
            label: "Cooperative Management",
            icon: PiggyBank,
          },

          { id: "analytics", label: "Analytics", icon: BarChart },
          { id: "reports", label: "Reports", icon: FileText },
          // { id: 'settings', label: 'System Settings', icon: Settings },
        ];

      case "md":
      case "teamlead":
        return [
          ...baseItems,
          { id: "profile", label: "My Profile", icon: User },
          // { id: 'employees', label: 'My Team', icon: Users },
          { id: "attendance", label: "Team Attendance", icon: Clock },
          { id: "leave", label: "Leave Requests", icon: Calendar },
          // { id: 'loan', label: 'Loan Requests', icon: CreditCard },
          { id: "appraisal", label: "Appraisal Management", icon: Award },
          // { id: 'appraisal-approval', label: 'Appraisal Approval', icon: ClipboardCheck },
          {
            id: "handover",
            label: "Handover Management",
            icon: ArrowRightLeft,
          },
          { id: "training", label: "Training Management", icon: BookOpen },
          {
            id: "cooperative",
            label: "Cooperative Management",
            icon: PiggyBank,
          },
          // { id: 'time-tracking', label: 'Team Time Tracking', icon: MapPin },
          //  { id: 'reports', label: 'Team Reports', icon: FileText },
        ];

      case "employee":
        return [
          ...baseItems,
          { id: "profile", label: "My Profile", icon: User },
          { id: "attendance", label: "My Attendance", icon: Clock },
          { id: "leave", label: "My Leave", icon: Calendar },
          // { id: 'loan', label: 'My Loans', icon: CreditCard },
          { id: "appraisal", label: "My Appraisals", icon: Award },
          { id: "payroll", label: "Payroll", icon: DollarSign },
          // { id: 'documents', label: 'My Documents', icon: FolderOpen },
          { id: "handover", label: "Handover Tasks", icon: ArrowRightLeft },
          { id: "training", label: "Training Management", icon: BookOpen },
          {
            id: "cooperative",
            label: "Cooperative Management",
            icon: PiggyBank,
          },
          // { id: 'time-tracking', label: 'Time Tracking', icon: MapPin },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white">HRIS</span>
            )}
          </div>
          {/* Desktop collapse toggle - always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-gray-700 p-1 h-8 w-8 flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileToggle}
            className="lg:hidden text-white hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${
                  isCollapsed ? "justify-center px-2" : "justify-start"
                } text-left ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  onMobileToggle(); // Close mobile sidebar when item is selected
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-600 
        transform transition-all duration-300 ease-in-out lg:translate-x-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
        w-64
      `}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default CollapsibleSidebar;
