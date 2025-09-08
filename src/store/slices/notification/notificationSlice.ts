/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notificationApi } from "./notificationApi";

import { INotification, NotificationPagination, NotificationResponse } from "@/types/notification";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  pagination: NotificationPagination;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.pagination.limit = action.payload;
    },
    markLocalAsRead(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.map((n) =>
        n._id === action.payload ? { ...n, read: true } : n
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAllLocalAsRead(state) {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      state.unreadCount = 0;
    },
    pushNotification(state, action: PayloadAction<INotification>) {
      state.notifications = [action.payload, ...state.notifications];
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      state.pagination.total += 1;
    },
    removeNotificationLocal(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload
      );
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    // GET: Fetch notifications
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchFulfilled,
      (state, action) => {
    
        const { data, total, unreadCount, currentPage, totalPages } =
          action.payload as NotificationResponse;

        // Always keep newest first
        state.notifications = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        state.pagination = {
          total,
          page: currentPage,
          limit: state.pagination.limit,
          pages: totalPages,
        };
        state.unreadCount = unreadCount;
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error =
          action.error?.message || "Failed to fetch notifications";
      }
    );

    // PATCH: Mark as read
    builder.addMatcher(
      notificationApi.endpoints.markNotificationAsRead.matchFulfilled,
      (state, action) => {
        const id = action.meta.arg.originalArgs;
        state.notifications = state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    );

    // PATCH: Mark all as read
    builder.addMatcher(
      notificationApi.endpoints.markAllNotificationsAsRead.matchFulfilled,
      (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
        state.unreadCount = 0;
      }
    );

    // DELETE: Remove notification
    builder.addMatcher(
      notificationApi.endpoints.deleteNotification.matchFulfilled,
      (state, action) => {
        const id = action.meta.arg.originalArgs;
        notificationSlice.caseReducers.removeNotificationLocal(state, {
          type: "",
          payload: id,
        });
      }
    );
  },
});

export const {
  setPage,
  setLimit,
  markLocalAsRead,
  markAllLocalAsRead,
  pushNotification,
  removeNotificationLocal,
} = notificationSlice.actions;

export default notificationSlice.reducer;
