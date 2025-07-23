// features/profile/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileFormData, ProfileState } from '@/types/user';
import { profileApi } from './profileApi';
import { blankProfileFormData } from '@/constants/blankProfileFormData';



const initialState: ProfileState = {
  isEditing: false,
  isLoading: false,
  error: null,
  isDialogOpen: false,
  isBulkImportOpen: false,
  selectedEmployee: null,
  showDetailView: false,
  searchTerm: '',
  filterDepartment: 'all',
  isProcessingBulk: false,
  bulkEmployees: [],
  formData: blankProfileFormData,
  isEditMode: false,
  isDeleteDialogOpen: false,
  selectedDeleteId: ""
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setFormData(state, action: PayloadAction<Partial<ProfileFormData>>) {

      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state, action: PayloadAction<ProfileFormData>) {
      state.formData = blankProfileFormData;
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
    setSelectedEmployee(state, action: PayloadAction<ProfileFormData | null>) {
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

    setBulkEmployees(state, action: PayloadAction<Partial<ProfileFormData>>) {
      const index = state.bulkEmployees.findIndex(emp => emp._id === action.payload._id);
      if (index !== -1) {
        state.bulkEmployees[index] = action.payload; // replace existing
      } else {
        state.bulkEmployees.push(action.payload); // append if new
      }
    },


    removeEmployee: (state, action: PayloadAction<string>) => {
    state.bulkEmployees = state.bulkEmployees.filter(emp => emp._id !== action.payload);
  }

  },
  extraReducers: (builder) => {
    // Get Profile matchers
    builder
      .addMatcher(profileApi.endpoints.getAllProfile.matchPending, (state) => { 
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.getAllProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.bulkEmployees = action.payload.data.data
        })
            
      .addMatcher(profileApi.endpoints.getAllProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to update profile';
   
      })
      // .addMatcher(profileApi.endpoints.getProfile.matchRejected, (state, action) => {
      //   console.log("actionGET", action.payload.data)
      //   state.isLoading = false;
      //  state.formData = initialState.formData;
      //   state.error = action.error?.message || 'Failed to load profile';
      // });
      

    // Edit Profile matchers
    builder
      .addMatcher(profileApi.endpoints.getProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;    
        state.formData = action.payload.data.user; 
      })
      .addMatcher(profileApi.endpoints.getProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to update profile';
      });

    // Edit Profile matchers
    builder
      .addMatcher(profileApi.endpoints.editProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.editProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;    
        state.formData = { ...state.formData, ...action.payload.data }; 
      })
      .addMatcher(profileApi.endpoints.editProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to update profile';
      });

    // Upload Profile matchers (for profile picture upload)
    builder
      .addMatcher(profileApi.endpoints.uploadProfile.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(profileApi.endpoints.uploadProfile.matchFulfilled, (state, action) => {
        state.isLoading = false;
        // Assuming action.payload contains the new profile image URL or object
        state.formData.profileImage = action.payload.data.profileImage;
      })
      .addMatcher(profileApi.endpoints.uploadProfile.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to upload profile image';
      });
  },
});

export const { setIsEditing, setFormData, resetFormData, setLoading, setError, setIsBulkImportOpen, setIsDialogOpen,
  setSelectedEmployee, setShowDetailView,
  setSearchTerm,
  setFilterDepartment,
  setIsProcessingBulk,
  setBulkEmployees,
  setIsEditMode,
  removeEmployee,
  setSelectedDeleteId,
  setIsDeleteDialogOpen,
  
 } = profileSlice.actions;
export default profileSlice.reducer;
