import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X, Calendar, User, AlertTriangle, CheckCircle } from "lucide-react";
import NotificationList from "./NotificationList";
import { useReduxNotificationContext } from "@/hooks/notification/useReduxNotification";
import { useAppSelector } from "@/store/hooks";

interface NotificationCenterProps {
  onClose: () => void;
  notifications: any;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, notifications }) => {
  const { user } = useAppSelector((state) => state.auth);
  const canManageNotifications = user?.role === "admin" || user?.role === "hr";
  const [showAll, setShowAll] = useState(false);
  const { handleMarkAsRead, handleMarkAllAsRead } = useReduxNotificationContext();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "attendance":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "payroll":
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (showAll) {
    return <NotificationList onClose={() => setShowAll(false)} />;
  }

  const recentNotifications = notifications.slice(0, 4);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg border">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {canManageNotifications && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                aria-label="Mark all as read"
                className="flex items-center text-xs"
              >
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Mark All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-0">
        <ScrollArea className="h-72 sm:h-80">
          <div className="space-y-1">
            {recentNotifications.length === 0 && (
              <p className="p-4 text-center text-gray-500">No notifications.</p>
            )}

            {recentNotifications.map((notification: any) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition rounded-md ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed break-words">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => setShowAll(true)}
            aria-label="View all notifications"
          >
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
