import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Calendar, User, AlertTriangle } from "lucide-react";
import { useReduxNotificationContext } from "@/hooks/notification/useReduxNotification";
import { PaginationNav } from "../ui/paginationNav";
import { useAppSelector } from "@/store/hooks";

interface NotificationListProps {
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const {
    notifications,
    pagination,
    handleMarkAsRead,
    handleDeleteNotification,
    handleSetPage,
    handleMarkAllAsRead,
  } = useReduxNotificationContext();
  const { user } = useAppSelector((state) => state.auth);
  const canManageNotification = user?.role === 'admin' || user?.role === 'hr';

  const scrollRef = useRef<HTMLDivElement>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "attendance":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "payroll":
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Scroll to top when page changes to avoid confusion
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [pagination.page]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-list-title"
    >
      <Card
        className="
          w-full
          max-w-md  /* Narrower max width */
          sm:max-w-lg  /* Medium screens wider */
          md:max-w-xl  /* Larger screens wider */
          max-h-[85vh]  /* Slightly less height */
          flex flex-col rounded-lg shadow-xl border bg-white
        "
      >
  <CardHeader className="flex items-center justify-between pb-3 px-6 pt-4">
  <div className="flex items-center space-x-2">
    <CardTitle id="notification-list-title" className="text-lg">
      All Notifications
    </CardTitle>

    {/* Show X button next to title */}
    <Button
      size="sm"
      variant="ghost"
      onClick={onClose}
      aria-label="Close notifications"
    >
      <X className="h-5 w-5" />
    </Button>
  </div>

  {/* Right-aligned button if allowed */}
  {canManageNotification && (
    <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
      Mark All as Read
    </Button>
  )}
</CardHeader>


        {/* Scrollable content */}
        <CardContent
          ref={scrollRef}
          className="flex-1 px-6 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
        >
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No notifications.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border rounded cursor-pointer flex justify-between items-start space-x-3 ${
                    !notification.read ? "bg-blue-50" : "bg-white"
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div>{getNotificationIcon(notification.type)}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Badge
                        variant="secondary"
                        className="ml-2 px-1 py-0 text-xs whitespace-nowrap"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  {canManageNotification && (

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification._id);
                    }}
                    aria-label="Delete notification"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>

        {pagination.pages > 1 && (
          <div className="p-4 border-t flex justify-center">
            <PaginationNav
              page={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handleSetPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationList;
