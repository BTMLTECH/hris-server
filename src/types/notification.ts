import { FetchBaseQueryError } from "@reduxjs/toolkit/query";


export interface INotification {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationResponse {
  success: boolean;
  count: number;
  total: number;
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  data: INotification[];
}


export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  pagination: NotificationPagination;
  isLoading: {
    fetchingNotifications: boolean;
    markingRead: boolean;
    markingAllRead: boolean;
    deletingNotification: boolean;
  };
  error: {
    fetchError: any ;
  };
  refetchNotifications: () => void;
  handleMarkAsRead: (id: string) => Promise<boolean>;
  handleMarkAllAsRead: () => Promise<boolean>;
  handleDeleteNotification: (id: string) => Promise<boolean>;
  handlePushNotification: (notif: Notification) => void;
  handleSetPage: (page: number) => void;
  handleSetLimit: (limit: number) => void;
}
