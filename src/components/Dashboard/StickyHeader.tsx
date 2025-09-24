import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useIsMobile } from "@/hooks/use-mobile";
import NotificationCenter from "./NotificationCenter";
import { Bell, Settings, User, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCombinedContext } from "@/contexts/AuthContext";
import { useReduxNotificationContext } from "@/hooks/notification/useReduxNotification";

interface StickyHeaderProps {
  onMobileMenuToggle?: () => void;
  onNavigate?: (section: string) => void;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  onMobileMenuToggle,
  onNavigate,
}) => {
  // const { user, logout } = useAuth();
  const { user: userStickyHeader } = useCombinedContext();
  const { user } = userStickyHeader;
  const isMobile = useIsMobile();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications } = useReduxNotificationContext();

  if (!user) return null;

  const getUserInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  const getUserFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || "User";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "hr":
        return "bg-blue-100 text-blue-800";
      case "md":
        return "bg-green-100 text-green-800";
      case "employee":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate("profile");
    }
  };

  const handleSettingsClick = () => {
    if (onNavigate) {
      onNavigate("settings");
    }
  };

  const canAccessSettings = user.role === "admin" || user.role === "hr";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              HRIS Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-red-500 text-white border-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-12 z-50">
                {/* <NotificationCenter onClose={() => setIsNotificationOpen(false)} /> */}
                <NotificationCenter
                  notifications={notifications}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>
            )}
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getUserFullName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge
                    className={`${getRoleBadgeColor(
                      user.role
                    )} w-fit mt-1 capitalize`}
                  >
                    {user.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {canAccessSettings && (
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={userStickyHeader?.logout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
