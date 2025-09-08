/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { baseApi } from "../baseApi";


// Define explicit types for request and response payloads
interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  user: any;
  token: string; 
}

interface ResetPasswordData {
 email: string
}


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: 'auth/activate-user',
        method: 'POST',
        body: { activation_token, activation_code },
      }),
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: 'auth/login',
        method: 'POST',
        body: { email, password },
        credentials: 'include' as const,
      }),

    }),

    requestPassword: builder.mutation({
      query: ({ email }) => ({
        url: 'auth/request-password',
        method: 'POST',
        body: { email },
        credentials: 'include' as const,
      }),
    
    }),

    verify2fa: builder.mutation({
      query: ({ email, code }) => ({
        url: 'auth/verify-2fa',
        method: 'POST',
        body: { email, code },
        credentials: 'include' as const,
      }),
      invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),

    resetPassword: builder.mutation({
      query: ({ email }: ResetPasswordData) => ({
        url: 'auth/reset-user-password',
        method: 'PUT',
        body: { email },
        credentials: 'include' as const,
      }),
    }),

    resendPassword: builder.mutation({
      query: ({ email }: ResetPasswordData) => ({
        url: 'auth/resend-password',
        method: 'POST',
        body: { email },
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Profiles'],
    }),  

    newSetPassword: builder.mutation({
      query: ({ newPassword, passwordConfig, temporaryPassword, token }) => ({
        url: 'auth/set-password',
        method: 'POST',
        body: { newPassword, passwordConfig, temporaryPassword , token},
        credentials: 'include' as const,
      }),
      
    }),  

    
    inviteUser: builder.mutation({
      query: (data) => ({
        url: 'auth/invite-user',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),

    resendIviteLink: builder.mutation({
      query: (email) => ({
        url: 'auth/reset-activation',
        method: 'POST',
        body: email,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),

    createCompany: builder.mutation({
      query: (data) => ({
        url: 'auth/owner-create',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),

    bulkInviteUsers: builder.mutation({
      query: (formData) => ({
        url: 'auth/bulk-invite',
        method: 'POST',
        body: formData,
        credentials: 'include' as const,
      }),
      invalidatesTags: [{ type: 'Profiles', id: 'LIST' }],
    }),

 
    logoutUser: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        credentials: 'include' as const,
      }),
      
    }),
  }),
});

export const {
  useActivationMutation,
  useLoginMutation,
  useRequestPasswordMutation,
  useResetPasswordMutation,
  useVerify2faMutation,
  useResendPasswordMutation,
  useLogoutUserMutation,
  useInviteUserMutation,
  useBulkInviteUsersMutation,
  useResendIviteLinkMutation,
  useNewSetPasswordMutation,
  useCreateCompanyMutation

} = authApi;
