import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '@/types/auth';
import { authApi } from './authApi';
// import { tokenUtils } from '@/utils/tokenUtils';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  code?: string | null;
  isAuthenticated: boolean,
  
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  code: null,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
      logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },   

    
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true; 
    },
     updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login matchers
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false; 
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Login failed';
      });

 

    // 2FA matchers
    builder
      .addMatcher(authApi.endpoints.verify2fa?.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verify2fa?.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addMatcher(authApi.endpoints.verify2fa?.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || '2FA verification failed';
      });

          // INVITE USER
    builder
      .addMatcher(authApi.endpoints.inviteUser.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.inviteUser.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.inviteUser.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Invite user failed';
      });

    // BULK INVITE USERS
    builder
      .addMatcher(authApi.endpoints.bulkInviteUsers.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.bulkInviteUsers.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.bulkInviteUsers.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Bulk invite failed';
      });
      
  },
});

export const { logout, clearError,setIsLoading, setError, setCredentials, updateUser
  
  //  initializeFromStorage 
  } = authSlice.actions;
export default authSlice.reducer;
