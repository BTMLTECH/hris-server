/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useBulkInviteUsersMutation,
  useCreateCompanyMutation,
  useInviteUserMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useNewSetPasswordMutation,
  useRequestPasswordMutation,
  useResendIviteLinkMutation,
  useResendPasswordMutation,
  useResetPasswordMutation,
  useVerify2faMutation,
} from "@/store/slices/auth/authApi";
import {
  logout as logoutAction,
  clearError,
  setCredentials,
  setIsLoading,
} from "@/store/slices/auth/authSlice";
import { toast } from "@/hooks/use-toast";
import { AuthContextType, PasswordConfig, User } from "@/types/auth";
import {
  clearEmployeeCache,
  setBulkEmployees,
  setFormData,
  setLoading,
  setProfileCache,
  setProfilePagination,
  updateBirthdayAnalytics,
} from "@/store/slices/profile/profileSlice";
import { set } from "date-fns";
import {
  useGetAllProfileQuery,
  useGetClassLevelQuery,
  useGetDepartmentsQuery,
  useGetLastStaffIdQuery,
  useGetProfileQuery,
  useLazyGetAllProfileQuery,
  useGetTeamleadQuery
} from "@/store/slices/profile/profileApi";
import { extractErrorMessage } from "@/utils/errorHandler";
import { clearActivityCache } from "@/store/slices/appraisal/appraisalSlice";
import { clearAttenadanceCache } from "@/store/slices/attendance/attendanceSlice";
import { CreateCompanyDTO, IBirthdayAnalytics } from "@/types/user";
import { io, Socket } from "socket.io-client";
import { useDebounce } from "../payroll/useDebounce";
import { useSmartPaginatedResource } from "../smartPaginatedQuery/useSmartPaginatedQuery";
import { persistor } from "@/store/store";
import { baseApi } from "@/store/slices/baseApi";
let socket: Socket | null = null;

export const connectNotificationSocket = (userId: string) => {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_API_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId },
    });
  }
  return socket;
};

export const useReduxAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const {
    profilePagination,
    classlevelPagination,
    departmentsPagination,
    profileCache,
    searchTerm,
    filterDepartment,
    statusFilter,
  } = useAppSelector((state) => state.profile);
  const [loginMutation] = useLoginMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verify2FA] = useVerify2faMutation();
  const [logoutUser] = useLogoutUserMutation();
  const [resendPassword] = useResendPasswordMutation();
  const [inviteUserMutation] = useInviteUserMutation();
  const [bulkInviteUsersMutation] = useBulkInviteUsersMutation();
  const [resendIviteLink] = useResendIviteLinkMutation();
  const [createCompany] = useCreateCompanyMutation();
  const [newSetPassword] = useNewSetPasswordMutation();
  const [requestPassword] = useRequestPasswordMutation();
  const currentDepartmentPage = departmentsPagination?.page;
  const currentClasslevelPage = classlevelPagination?.page;
  // const shouldAllUsers = !isAuthenticated || !user;
  // const { data } = useGetLastStaffIdQuery(undefined, {
  //   skip: shouldAllUsers,
  // });
  // const { data: profileRecord, error: profileError } = useGetProfileQuery(
  //   undefined,
  //   {
  //     skip: shouldAllUsers,
  //   }
  // );

  // const {} = useGetDepartmentsQuery(
  //   { page: currentDepartmentPage, limit: departmentsPagination.limit },
  //   { skip: shouldAllUsers }
  // );

  // const {} = useGetClassLevelQuery(
  //   { page: currentClasslevelPage, limit: classlevelPagination.limit },
  //   { skip: shouldAllUsers }
  // );

  // const currentPage = profilePagination?.page ?? 1;
  // const pageSize = profilePagination?.limit || 20;
  // const debouncedSearch = useDebounce(searchTerm, 500);

  // const cachedProfiles = profileCache[currentPage] ?? [];
  // const allCachedProfiles = Object.values(profileCache).flatMap((page: any) =>
  //   Array.isArray(page) ? page : []
  // );
  // const isCacheAvailable = cachedProfiles.length > 0;

  // // Search + filter handling
  // const isValidSearch = debouncedSearch.trim().length >= 2;
  // const filtersApplied =
  //   !!debouncedSearch || filterDepartment !== "all" || !!statusFilter;
  // const shouldSearch = filtersApplied && isValidSearch;

  // // In your useReduxAuth hook, add these loading states:

  // // Base query
  // const {
  //   data: profilesRecord,
  //   isLoading: profilesIsLoading,
  //   refetch: refetchProfiles,
  // } = useGetAllProfileQuery(
  //   { page: currentPage, limit: pageSize },
  //   { skip: !isAuthenticated, refetchOnMountOrArgChange: false }
  // );

  // // Lazy query for server search
  // const [
  //   triggerServerSearch,
  //   { data: serverSearchResult, isFetching: isSearching },
  // ] = useLazyGetAllProfileQuery();

  // // Match helper
  // const matchesProfile = (p: any, searchText?: string) => {
  //   const searchLower = (searchText || "").toLowerCase();
  //   const fullName = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();
  //   console.log("p", p);

  //   const matchesSearch =
  //     !searchLower ||
  //     fullName.includes(searchLower) ||
  //     p.email?.toLowerCase().includes(searchLower) ||
  //     p.staffId?.toLowerCase().includes(searchLower);

  //   const matchesDepartment =
  //     filterDepartment === "all" || p.department === filterDepartment;

  //   const matchesStatus =
  //     !statusFilter || p.status?.toLowerCase() === statusFilter.toLowerCase();

  //   return matchesSearch && matchesDepartment && matchesStatus;
  // };

  // const locallyFilteredAll = allCachedProfiles.filter((p) =>
  //   matchesProfile(p, debouncedSearch)
  // );
  // const hasLocalMatches = locallyFilteredAll.length > 0;

  // const startIndex = (currentPage - 1) * pageSize;
  // const endIndex = startIndex + pageSize;
  // const paginatedFilteredProfiles = locallyFilteredAll.slice(
  //   startIndex,
  //   endIndex
  // );

  // const isSearchingBackend = shouldSearch && !hasLocalMatches && isSearching;
  // const isLoadingInitialData =
  //   !shouldSearch && !isCacheAvailable && profilesIsLoading;
  // const shouldShowSkeleton = isSearchingBackend || isLoadingInitialData;

  // useEffect(() => {
  //   if (!shouldSearch) return;

  //   if (hasLocalMatches) {
  //     if (currentPage !== 1) {
  //       dispatch(setProfilePagination({ ...profilePagination, page: 1 }));
  //     }
  //     return;
  //   }

  //   dispatch(setProfilePagination({ ...profilePagination, page: 1 }));

  //   const serverParams: any = {
  //     page: 1,
  //     limit: pageSize,
  //   };

  //   if (debouncedSearch.trim()) {
  //     serverParams.search = debouncedSearch.trim();
  //   }

  //   if (filterDepartment !== "all") {
  //     serverParams.department = filterDepartment;
  //   }

  //   if (statusFilter) {
  //     serverParams.status = statusFilter;
  //   }

  //   triggerServerSearch(serverParams);
  // }, [
  //   debouncedSearch,
  //   shouldSearch,
  //   hasLocalMatches,
  //   currentPage,
  //   filterDepartment,
  //   statusFilter,
  // ]);

  // useEffect(() => {
  //   if (!serverSearchResult?.data) return;

  //   const { pagination, data: users } = serverSearchResult.data;
  //   if (pagination) dispatch(setProfilePagination(pagination));
  //   if (Array.isArray(users) && pagination?.page) {
  //     dispatch(setProfileCache({ page: pagination.page, data: users }));
  //   }
  // }, [serverSearchResult]);

  // // Cache base query results
  // useEffect(() => {
  //   if (!profilesRecord?.data || shouldSearch) return;

  //   const { pagination, data: users } = profilesRecord.data;
  //   if (pagination) dispatch(setProfilePagination(pagination));
  //   if (Array.isArray(users) && pagination?.page) {
  //     dispatch(setProfileCache({ page: pagination.page, data: users }));
  //   }
  // }, [profilesRecord, shouldSearch]);

  // const finalProfiles = (() => {
  //   if (shouldSearch) {
  //     if (hasLocalMatches) return paginatedFilteredProfiles;
  //     if (isSearching) return [];
  //     if (serverSearchResult?.data) return serverSearchResult.data.data ?? [];
  //     return [];
  //   }

  //   if (isCacheAvailable) return cachedProfiles;
  //   return profilesRecord?.data?.data ?? [];
  // })();

  // const totalPages = (() => {
  //   if (shouldSearch) {
  //     return Math.ceil(locallyFilteredAll.length / pageSize);
  //   } else {
  //     return (
  //       profilePagination?.pages || profilesRecord?.data?.pagination?.pages || 1
  //     );
  //   }
  // })();
  const {
    finalData: finalProfiles,
    totalPages,
    isSearching,
    isBaseLoading,
    shouldShowSkeleton,
    shouldSearch,
    shouldSkip,
  } = useSmartPaginatedResource({
    useBaseQuery: useGetAllProfileQuery,
    useLazyQuery: useLazyGetAllProfileQuery,
    cache: profileCache,
    pagination: profilePagination,
    setPagination: setProfilePagination,
    setCache: setProfileCache,
    searchTerm,
    filtersApplied:
      !!searchTerm || filterDepartment !== "all" || !!statusFilter,

    // ✅ buildParams ensures backend gets correct filters
    buildParams: (page, limit) => ({
      page,
      limit,
      search: searchTerm?.trim() || undefined,
      department: filterDepartment !== "all" ? filterDepartment : undefined,
      status: statusFilter || undefined,
    }),

    filterFn: (p, searchText) => {
      const s = searchText.toLowerCase();
      const fullName = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();

      const matchesSearch =
        !s ||
        fullName.includes(s) ||
        p.email?.toLowerCase().includes(s) ||
        p.staffId?.toLowerCase().includes(s);

      const matchesDept =
        filterDepartment === "all" || p.department === filterDepartment;

      const profileStatus = (p.status || "").toLowerCase().trim();
      const activeStatus = statusFilter
        ? statusFilter.toLowerCase().trim()
        : "";

      const matchesStatus = !activeStatus || profileStatus === activeStatus;

      return matchesSearch && matchesDept && matchesStatus;
    },
  });

  // const {
  //   finalData: finalProfiles,
  //   totalPages,
  //   isSearching,
  //   isBaseLoading,
  //   shouldShowSkeleton,
  //   shouldSearch,
  //   shouldSkip,
  // } = useSmartPaginatedResource({
  //   useBaseQuery: useGetAllProfileQuery,
  //   useLazyQuery: useLazyGetAllProfileQuery,
  //   cache: profileCache,
  //   pagination: profilePagination,
  //   setPagination: setProfilePagination,
  //   setCache: setProfileCache,
  //   searchTerm,
  //   filtersApplied:
  //     !!searchTerm || filterDepartment !== "all" || !!statusFilter,
  //   // filterFn: (p, searchText) => {
  //   //   const s = searchText.toLowerCase();
  //   //   const fullName = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();
  //   //   const matchesSearch =
  //   //     !s ||
  //   //     fullName.includes(s) ||
  //   //     p.email?.toLowerCase().includes(s) ||
  //   //     p.staffId?.toLowerCase().includes(s);

  //   //   const matchesDept =
  //   //     filterDepartment === "all" || p.department === filterDepartment;
  //   //   console.log("statusFilter", statusFilter);
  //   //   console.log("p.status", p.status);
  //   //   const matchesStatus =
  //   //     !statusFilter ||
  //   //     p.status?.toLowerCase().trim() === statusFilter.toLowerCase().trim();

  //   //   console.log("matchesStatus", matchesStatus);

  //   //   return matchesSearch && matchesDept && matchesStatus;
  //   // },
  //   filterFn: (p, searchText) => {
  //     const s = searchText.toLowerCase();
  //     const fullName = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();

  //     const matchesSearch =
  //       !s ||
  //       fullName.includes(s) ||
  //       p.email?.toLowerCase().includes(s) ||
  //       p.staffId?.toLowerCase().includes(s);

  //     const matchesDept =
  //       filterDepartment === "all" || p.department === filterDepartment;

  //     // ✅ Normalize and compare safely
  //     const profileStatus = (p.status || "").toLowerCase().trim();
  //     const activeStatus = statusFilter
  //       ? statusFilter.toLowerCase().trim()
  //       : "";

  //     const matchesStatus = !activeStatus || profileStatus === activeStatus;

  //     // Debug
  //     console.log("statusFilter:", statusFilter);
  //     console.log("p.status:", p.status);
  //     console.log("matchesStatus:", matchesStatus);

  //     return matchesSearch && matchesDept && matchesStatus;
  //   },
  //   buildParams: (page, limit) => ({
  //   page,
  //   limit,
  //   search: searchTerm?.trim() || undefined,
  //   department: filterDepartment !== "all" ? filterDepartment : undefined,
  //   status: statusFilter || undefined,
  // }),
  // });


  // const {} = useGetDepartmentsQuery(
  //   { page: currentDepartmentPage, limit: departmentsPagination.limit },
  //   { skip: shouldSkip }
  // );

  // const {} = useGetClassLevelQuery(
  //   { page: currentClasslevelPage, limit: classlevelPagination.limit },
  //   { skip: shouldSkip }
  // );

  const {  } = useGetLastStaffIdQuery(undefined, {
    skip: shouldSkip,
  });

  const { } = useGetProfileQuery(
    undefined,
    {
      skip: shouldSkip,
    }
  );

  const {} = useGetDepartmentsQuery(
    { page: currentDepartmentPage, limit: departmentsPagination.limit },
    { skip: shouldSkip }
  );

  const {} = useGetClassLevelQuery(
    { page: currentClasslevelPage, limit: classlevelPagination.limit },
    { skip: shouldSkip }
  );

  const {data} = useGetTeamleadQuery(
    undefined,
    { skip: shouldSkip }
  );
  // console.log("get-teamlead", data)

  useEffect(() => {
    if (!user?._id) return;

    const socket = connectNotificationSocket(user._id.toString());

    socket.on("birthday:new", (payload: IBirthdayAnalytics) => {
      dispatch(updateBirthdayAnalytics(payload));
    });

    return () => {
      socket.off("birthday:new");
    };
  }, [user?._id, dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await loginMutation({ email, password }).unwrap();
      toast({
        title: "2FA code sent to your email",
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Login failed");
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const verify2fa = async (email: string, code: string): Promise<boolean> => {
    dispatch(setIsLoading(true));

    try {
      const result = await verify2FA({ email, code }).unwrap();

      dispatch(setCredentials({ user: result.data.user }));
      dispatch(setFormData(result.data.user));

      toast({
        title: "Login Successful",
        description: `Welcome, ${result.data.user.firstName}!`,
      });

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Login failed");
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const setNewPassword = async (
    newPassword: string,
    passwordConfig: PasswordConfig,
    temporaryPassword: string,
    token: string
  ): Promise<boolean> => {
    dispatch(setIsLoading(true));

    try {
      await newSetPassword({
        newPassword,
        passwordConfig,
        temporaryPassword,
        token,
      }).unwrap();
      toast({
        title: "Password set successfully",
        description: "You can now log in.",
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Set new password failed"
      );
      toast({
        title: "Password Set Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const reqestNewPassword = async (email: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await requestPassword({ email }).unwrap();
      toast({
        title: "Password Reset Initiated",
        description: "Check your email for further instructions",
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Password request failed"
      );

      toast({
        title: "Password Request Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await resetPasswordMutation({ email }).unwrap();
      toast({
        title: "Password Reset Initiated",
        description: "Check your email for further instructions",
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Password reset failed");

      toast({
        title: "Password Reset Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const resend2fa = async (email: string): Promise<boolean> => {
    dispatch(setIsLoading(true));
    try {
      await resendPassword({ email }).unwrap();
      toast({
        title: "Password Resend Initiated",
        description: "Check your email for further instructions",
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Password resend failed");

      toast({
        title: "Password Resend Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const resendInvite = async (email: string): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      await resendIviteLink({ email }).unwrap();
      toast({
        title: "User Invited",
        description: `${email} has been invited.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "User resend-invite failed"
      );

      toast({
        title: "Resend Invite Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createCompanyWithAdim = async (
    data: CreateCompanyDTO
  ): Promise<boolean> => {
    try {
      await createCompany(data).unwrap();
      toast({
        title: "Company Created",
        description: `${data.companyName} has been created.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(
        error,
        "Company creation failed"
      );

      toast({
        title: "Company Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  const inviteUser = async (userData: Partial<User>): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      const inviteResponse = await inviteUserMutation(userData).unwrap();
      dispatch(setBulkEmployees(inviteResponse.data.user));
      toast({
        title: "User Invited",
        description: `${userData.email} has been invited.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "User invite failed");

      toast({
        title: "Invite Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const bulkInviteUsers = async (formData: FormData): Promise<boolean> => {
    dispatch(setLoading(true));
    try {
      const bulkResponse = await bulkInviteUsersMutation(formData).unwrap();
      if (bulkResponse) {
        toast({
          title: "Bulk Invite Sent",
          description: "Multiple users invited successfully.",
        });
      }

      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Bulk invite failed");

      toast({
        title: "Bulk Invite Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await logoutUser({}).unwrap();
      dispatch(logoutAction());
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      dispatch(clearActivityCache()),
        dispatch(clearEmployeeCache()),
        dispatch(clearAttenadanceCache()),
        // Purge persisted storage (this clears redux-persist cache)
        dispatch(baseApi.util.resetApiState());
      await persistor.purge();

      toast({
        title: "Logged Out",
        description:
          response?.message || "You have been successfully logged out.",
      });
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Logout failed");
      toast({
        title: "Logout Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const hasRole = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.some((role) => user.role.includes(role));
  };

  return {
    user,
    // profileRecord,
    shouldShowSkeleton,
    shouldSearch,
    cachedEmployees: finalProfiles,
    totalPages,
    isLoading,
    error: error || "",
    // profileError,
    isAuthenticated,
    // profilesIsLoading,
    login,
    resetPassword,
    reqestNewPassword,
    resend2fa,
    verify2fa,
    logout,
    resendInvite,
    setNewPassword,
    createCompanyWithAdim,
    inviteUser,
    bulkInviteUsers,
    hasRole,
    clearError: () => dispatch(clearError()),
  };
};
