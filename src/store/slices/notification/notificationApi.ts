/* eslint-disable @typescript-eslint/no-explicit-any */

import { NotificationResponse } from "@/types/notification";
import { apiSlice } from "../auth/apiSlice";


export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
       providesTags: (result) =>
          result
            ? [{ type: 'Notifications' }]
            : [],
    }),

    markNotificationAsRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

 
    markAllNotificationsAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
