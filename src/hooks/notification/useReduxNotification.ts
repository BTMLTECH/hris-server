/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "@/store/slices/notification/notificationApi";
import {
  setPage,
  setLimit,
  markLocalAsRead,
  markAllLocalAsRead,
  pushNotification,
  removeNotificationLocal,
} from "@/store/slices/notification/notificationSlice";
import { toast } from "@/hooks/use-toast";
import { INotification, NotificationContextType } from "@/types/notification";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const connectNotificationSocket = (userId: string) => {
  if (!socket) {
      socket = io('http://localhost:8080', {
        withCredentials: true,
        transports: ['websocket'],
        query: { userId }
      });
  }
  return socket;
};

export const useReduxNotificationContext = (): NotificationContextType => {
  const dispatch = useAppDispatch();
  const { user} = useAppSelector(
    (state) => state.auth
  );
  const { notifications, unreadCount, pagination } = useAppSelector(
    (state) => state.notification
  );
const userId = user?._id
  const {
    isLoading: fetchingNotifications,
    error: fetchError,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const [markNotificationAsRead, { isLoading: markingRead }] =
    useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: markingAllRead }] =
    useMarkAllNotificationsAsReadMutation();
  const [deleteNotification, { isLoading: deletingNotification }] =
    useDeleteNotificationMutation();


  const handleMarkAsRead = async (id: string): Promise<boolean> => {
    try {
      await markNotificationAsRead(id).unwrap();
      dispatch(markLocalAsRead(id));
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to mark notification as read",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleMarkAllAsRead = async (): Promise<boolean> => {
    try {
      await markAllNotificationsAsRead(undefined).unwrap();
      dispatch(markAllLocalAsRead());
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to mark all as read",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteNotification = async (id: string): Promise<boolean> => {
    try {
      await deleteNotification(id).unwrap();
      dispatch(removeNotificationLocal(id));
      toast({ title: "Notification deleted" });
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete notification",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePushNotification = (notif: INotification) => {
    dispatch(pushNotification(notif));
    toast({
      title: notif.title,
      description: notif.message,
    });
  };

  const handleSetPage = (page: number) => {
    dispatch(setPage(page));
  };

  const handleSetLimit = (limit: number) => {
    dispatch(setLimit(limit));
  };

  useEffect(() => {
     if (!user?._id) return;

    const sock = connectNotificationSocket(userId);

    sock.on("connect", () => {
    });

    sock.on("notification:new", (notif: INotification) => {
      handlePushNotification(notif);
    });

    sock.on("disconnect", () => {
    });

    return () => {
      sock.off("notification:new");
      sock.disconnect();
      socket = null;
    };
  }, []);

  return {
    notifications,
    unreadCount,
    pagination,
    isLoading: {
      fetchingNotifications,
      markingRead,
      markingAllRead,
      deletingNotification,
    },
    error: {
      fetchError,
    },
    refetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handlePushNotification,
    handleSetPage,
    handleSetLimit,
  };
};
