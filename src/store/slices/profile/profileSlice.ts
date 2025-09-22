// features/profile/profileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateCompanyDTO,
  IAnalytics,
  IClassLevel,
  IDepartment,
  ProfileFormData,
  ProfileState,
} from "@/types/user";
import { profileApi } from "./profileApi";
import {
  blankCompanyFormData,
  blankProfileFormData,
} from "@/constants/blankProfileFormData";
import { act } from "react";
import { IOnboardingTask } from "@/types/auth";

const initialState: ProfileState = {
  isEditing: false,
  isLoading: false,
  error: null,
  isDialogOpen: false,
  isCompanyDialogOpen: false,
  isBulkImportOpen: false,
  selectedEmployee: null,
  showDetailView: false,
  searchTerm: "",
  filterDepartment: "all",
  isProcessingBulk: false,
  bulkEmployees: [],
  classlevel: [],
  formData: blankProfileFormData,
  isEditMode: false,
  isDeleteDialogOpen: false,
  selectedDeleteId: "",
  profilePagination: { total: 0, page: 1, limit: 30, pages: 0 },
  departmentsPagination: { total: 0, page: 1, limit: 30, pages: 0 },
  classlevelPagination: { total: 0, page: 1, limit: 30, pages: 0 },
  profileCache: {},
  departmentsCache: {},
  classlevelCache: {},
  company: "",
  selectedActionId: null,
  isActionDialogOpen: false,
  selectedActionType: null,
  isManageDialogOpen: false,
  analytics: null,
  nextStaffId: "",
  companyFormData: blankCompanyFormData,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setFormData(state, action: PayloadAction<Partial<ProfileFormData>>) {
      state.formData = { ...state.formData, ...action.payload };
    },

    resetFormData(state) {
      state.formData = {
        ...blankProfileFormData,
        staffId: state.formData.staffId,
        departments: state.formData.departments,
        classlevels: state.formData.classlevels,
        position: state.formData.position,
      };
    },

    setSelectedActionId(state, action: PayloadAction<string | null>) {
      state.selectedActionId = action.payload;
    },
    setSelectedActionType(
      state,
      action: PayloadAction<
        | "delete"
        | "terminate"
        | "activate"
        | "training-feedback"
        | "cooperative-staff"
        | "resend-invite"
        | "toggle-status"
        | null
      >
    ) {
      state.selectedActionType = action.payload;
    },

    setIsActionDialogOpen(state, action: PayloadAction<boolean>) {
      state.isActionDialogOpen = action.payload;
    },
    setIsManageDialogOpen(state, action: PayloadAction<boolean>) {
      state.isManageDialogOpen = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },

    setIsBulkImportOpen: (state, action: PayloadAction<boolean>) => {
      state.isBulkImportOpen = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedEmployee(state, action: PayloadAction<ProfileFormData>) {
      state.selectedEmployee = action.payload;
    },
    setShowDetailView(state, action: PayloadAction<boolean>) {
      state.showDetailView = action.payload;
    },
    setSelectedDeleteId(state, action: PayloadAction<string>) {
      state.selectedDeleteId = action.payload;
    },
    setIsDeleteDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDeleteDialogOpen = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilterDepartment(state, action: PayloadAction<string>) {
      state.filterDepartment = action.payload;
    },
    setIsProcessingBulk(state, action: PayloadAction<boolean>) {
      state.isProcessingBulk = action.payload;
    },

    setSelectedDepartment(state, action: PayloadAction<string>) {
      state.formData.selectedDepartment = action.payload;
      if (
        !state.formData.requirements.some(
          (r) => r.department === action.payload
        )
      ) {
        state.formData.requirements.push({
          employee: "",
          department: action.payload,
          tasks: [],
          createdAt: new Date().toISOString(),
        });
      }
    },

    toggleTask(
      state,
      action: PayloadAction<{
        department: string;
        task: Omit<IOnboardingTask, "completed">;
      }>
    ) {
      const { department, task } = action.payload;
      const requirement = state.formData.requirements.find(
        (r) => r.department === department
      );

      if (!requirement) return;

      const existingIndex = requirement.tasks.findIndex(
        (t) => t.name === task.name
      );

      if (existingIndex > -1) {
        // Toggle completion or remove
        requirement.tasks[existingIndex].completed =
          !requirement.tasks[existingIndex].completed;

        if (!requirement.tasks[existingIndex].completed) {
          requirement.tasks.splice(existingIndex, 1);
        }
      } else {
        // Add new completed task
        requirement.tasks.push({ ...task, completed: true });
      }
    },

    setBulkEmployees(state, action: PayloadAction<Partial<ProfileFormData>>) {
      const index = state.bulkEmployees.findIndex(
        (emp) => emp._id === action.payload._id
      );
      if (index !== -1) {
        state.bulkEmployees[index] = action.payload;
      } else {
        state.bulkEmployees.push(action.payload);
      }
    },
    setProfilePagination: (
      state,
      action: PayloadAction<typeof initialState.profilePagination>
    ) => {
      state.profilePagination = action.payload;
    },
    setDepartmentPagination: (
      state,
      action: PayloadAction<typeof initialState.departmentsPagination>
    ) => {
      state.departmentsPagination = action.payload;
    },
    setClasslevelPagination: (
      state,
      action: PayloadAction<typeof initialState.classlevelPagination>
    ) => {
      state.classlevelPagination = action.payload;
    },
    setProfileCache: (
      state,
      action: PayloadAction<{ page: number; data: ProfileFormData[] }>
    ) => {
      state.profileCache[action.payload.page] = action.payload.data;
    },
    setDepartmentsCache: (
      state,
      action: PayloadAction<{ page: number; data: IDepartment[] }>
    ) => {
      state.departmentsCache[action.payload.page] = action.payload.data;
    },
    setClasslevelCache: (
      state,
      action: PayloadAction<{ page: number; data: IClassLevel[] }>
    ) => {
      state.classlevelCache[action.payload.page] = action.payload.data;
    },

    clearEmployeeCache(state) {
      state.profileCache = {};
      state.profilePagination = { page: 1, limit: 10, total: 0, pages: 0 };
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.bulkEmployees = state.bulkEmployees.filter(
        (emp) => emp._id !== action.payload
      );
    },

    setIsCompanyDialogOpen(state, action: PayloadAction<boolean>) {
      state.isCompanyDialogOpen = action.payload;
    },
    setCompanyFormData(
      state,
      action: PayloadAction<Partial<CreateCompanyDTO>>
    ) {
      state.companyFormData = {
        ...state.companyFormData,
        ...action.payload,
        adminData: {
          ...state.companyFormData.adminData,
          ...(action.payload.adminData || {}),
        },
        branding: {
          ...state.companyFormData.branding,
          ...(action.payload.branding || {}),
        },
      };
    },

    resetCompanyFormData(state) {
      state.companyFormData = blankCompanyFormData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(profileApi.endpoints.getLastStaffId.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        profileApi.endpoints.getLastStaffId.matchFulfilled,
        (state, action) => {
          const lastUserId = action.payload.data;
          state.formData.staffId = lastUserId;
        }
      )
      .addMatcher(
        profileApi.endpoints.getLastStaffId.matchRejected,
        (state, action) => {
          state.error = action.error?.message || "Login failed";
          state.isLoading = false;
        }
      );

    builder.addMatcher(
      profileApi.endpoints.getClassLevel.matchFulfilled,
      (state, action) => {
        const classlevels: IClassLevel[] = action.payload.data.data;
        state.company =
          classlevels.length > 0 ? classlevels[0].company : undefined;
        const pagination = action.payload.data?.pagination;
        const page = pagination?.page;
        state.classlevelCache[page] = classlevels;
        state.classlevelPagination = pagination;

        state.formData.classlevels = classlevels;
      }
    );

    builder.addMatcher(
      profileApi.endpoints.getAnalytics.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean;
          data: { analytics: IAnalytics };
        }>
      ) => {
        state.analytics = action.payload.data.analytics;
      }
    );

    builder.addMatcher(
      profileApi.endpoints.getLastStaffId.matchFulfilled,
      (state, action) => {
        state.nextStaffId = action.payload.data;
      }
    );
    builder.addMatcher(
      profileApi.endpoints.getDepartments.matchFulfilled,
      (state, action) => {
        const departments: IDepartment[] = action.payload.data.data;
        state.company =
          departments.length > 0 ? departments[0].company : undefined;
        const pagination = action.payload.data?.pagination;
        const page = pagination?.page;
        state.departmentsCache[page] = departments;
        state.departmentsPagination = pagination;
        state.formData.departments = departments;
      }
    );

    builder.addMatcher(
      profileApi.endpoints.getAllProfile.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    builder
      .addMatcher(
        profileApi.endpoints.getAllProfile.matchFulfilled,
        (state, action) => {
          const users: ProfileFormData[] = action.payload.data.data;
          const pagination = action.payload.data.pagination;
          const page = pagination.page;
          state.profileCache[page] = users;
          state.profilePagination = pagination;
          state.bulkEmployees = users;
        }
      )

      .addMatcher(
        profileApi.endpoints.getAllProfile.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to update profile";
        }
      );

    // Edit Profile matchers
    builder
      .addMatcher(profileApi.endpoints.getProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        profileApi.endpoints.getProfile.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.formData = action.payload.data.user;
        }
      )
      .addMatcher(
        profileApi.endpoints.getProfile.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || "Failed to update profile";
        }
      );

    builder
      .addMatcher(profileApi.endpoints.uploadProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        profileApi.endpoints.uploadProfile.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.formData.profileImage = action.payload.data.profileImage;
        }
      )
      .addMatcher(
        profileApi.endpoints.uploadProfile.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.error?.message || "Failed to upload profile image";
        }
      );
  },
});

export const {
  setIsEditing,
  setFormData,
  resetFormData,
  setLoading,
  setError,
  setIsBulkImportOpen,
  setIsDialogOpen,
  setIsCompanyDialogOpen,

  setSelectedEmployee,
  setShowDetailView,
  setSearchTerm,
  setFilterDepartment,
  setIsProcessingBulk,
  setBulkEmployees,
  setIsEditMode,
  removeEmployee,
  setSelectedDeleteId,
  setIsDeleteDialogOpen,
  clearEmployeeCache,
  setProfileCache,
  setDepartmentsCache,
  setClasslevelCache,
  setProfilePagination,
  setDepartmentPagination,
  setClasslevelPagination,
  toggleTask,
  setSelectedDepartment,
  setIsActionDialogOpen,
  setSelectedActionId,
  setSelectedActionType,
  setIsManageDialogOpen,
  setCompanyFormData,
  resetCompanyFormData,
} = profileSlice.actions;
export default profileSlice.reducer;
