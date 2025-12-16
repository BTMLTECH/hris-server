// baseApi.ts
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "@/hooks/use-toast";
import { logout } from "./auth/authSlice";

const isProd = import.meta.env.VITE_NODE_ENV === "production";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
  // baseUrl: "http://localhost:8080/api/",
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 429) {
    toast({ title: "Too many requests. Please try again later!" });
  }
  if (result.error?.status === 401) {
    const errorMessage =
      typeof result.error?.data === "object" && result.error?.data !== null
        ? (result.error.data as { message?: string }).message
        : "";

    const authErrorMessages = [
      "No token provided",
      "Invalid token",
      "Token has been revoked",
      "Token expired",
    ];

    if (authErrorMessages.includes(errorMessage)) {
      api.dispatch(logout());
    }

    if (isProd && !authErrorMessages.includes(errorMessage)) {
      return { data: null };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Profiles",
    "AttendanceHistory",
    "CompanySummary",
    "LeaveActivityFeed",
    "LeaveApprovalQueue",
    "getAppraisalActivity",
    "getAllPayrolls",
    "Notifications",
    "Trainings",
    "Contribution",
    "Handover"
  ],
  endpoints: () => ({}),
});
