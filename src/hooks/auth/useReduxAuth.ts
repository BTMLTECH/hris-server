/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  useBulkInviteUsersMutation,
  useInviteUserMutation,
  useLoginMutation, 
  useLogoutUserMutation, 
  useNewSetPasswordMutation, 
  useRequestPasswordMutation, 
  useResendIviteLinkMutation, 
  useResendPasswordMutation, 
  // useRegisterMutation, 
  useResetPasswordMutation,
  useVerify2faMutation,
} from '@/store/slices/auth/authApi';
import { 
  logout as logoutAction, 
  clearError, 
  setCredentials,
  // initializeFromStorage, 
  setIsLoading
} from '@/store/slices/auth/authSlice';
import { toast } from '@/hooks/use-toast';
import { AuthContextType, PasswordConfig, User } from '@/types/auth';
import { setBulkEmployees, setFormData, setLoading } from '@/store/slices/profile/profileSlice';
import { set } from 'date-fns';
// import { apiSlice } from '@/store/slices/auth/apiSlice';
import { useGetAllProfileQuery, useGetProfileQuery } from '@/store/slices/profile/profileApi';
import { extractErrorMessage } from '@/utils/errorHandler';

export const useReduxAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error , isAuthenticated} = useAppSelector((state) => state.auth);  
  const [loginMutation] = useLoginMutation();
  // const [registerMutation] = useRegisterMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verify2FA] = useVerify2faMutation()
  const [logoutUser] = useLogoutUserMutation();
  const [resendPassword] =  useResendPasswordMutation()
  const [inviteUserMutation] = useInviteUserMutation();
  const [bulkInviteUsersMutation] = useBulkInviteUsersMutation();  
  const [resendIviteLink] = useResendIviteLinkMutation();
  const [newSetPassword] = useNewSetPasswordMutation();
  const [requestPassword] = useRequestPasswordMutation();

      
    const shouldSkipProfile = !isAuthenticated || !user;

    const {
      data: profileRecord,
      isLoading: profileIsLoading,
      error: profileError,
      refetch: refetchProfile,
    } = useGetProfileQuery(undefined, {
      skip: shouldSkipProfile,
    });

      const {
        data: profilesRecord,
        isLoading: profilesIsLoading,
        error: profilesError,
        refetch: refetchAllProfile,
      } = useGetAllProfileQuery(undefined, {
        skip: !user || (user.role !== "hr" && user.role !== "admin") ,
      });



const login = async (email: string, password: string): Promise<boolean> => {
  dispatch(setIsLoading(true));
  try {
    await loginMutation({ email, password }).unwrap();
    toast({
      title: '2FA code sent to your email',
    });
    return true;
  } catch (error) {
  const errorMessage = extractErrorMessage(error, 'Login failed');
  toast({
    title: 'Login Error',
    description: errorMessage,
    variant: 'destructive',
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
      title: 'Login Successful',
      description: `Welcome, ${result.data.user.firstName}!`,
    });

    return true;
  } catch (error: any) {

      const errorMessage = extractErrorMessage(error, 'Login failed');
  toast({
    title: 'Login Error',
    description: errorMessage,
    variant: 'destructive',
  });
  return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};

  const setNewPassword = async (newPassword: string, passwordConfig:PasswordConfig, temporaryPassword: string, token:string): Promise<boolean> => {
   dispatch(setIsLoading(true));
   
    try {
      await newSetPassword({ newPassword, passwordConfig, temporaryPassword , token}).unwrap();
      toast({
        title: 'Password set successfully',
        description: 'You can now log in.',
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Set new password failed');
  toast({
    title: 'Password Set Error',
    description: errorMessage,
    variant: 'destructive',
  });
  return false;
    }finally {
    dispatch(setIsLoading(false));
  }
};

const reqestNewPassword = async (email: string): Promise<boolean> => {  
  dispatch(setIsLoading(true));
    try {
      await requestPassword({ email }).unwrap();
      toast({
        title: 'Password Reset Initiated',
        description: 'Check your email for further instructions',
      });
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, 'Password request failed');

      toast({
        title: 'Password Request Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setIsLoading(false))
    }
  };
  
  const resetPassword = async (email: string): Promise<boolean> => {
    dispatch(setIsLoading(true))
    try {
      await resetPasswordMutation({ email }).unwrap();
      toast({
        title: 'Password Reset Initiated',
        description: 'Check your email for further instructions',
      });
      return true;
    } catch (error) {
 
      const errorMessage = extractErrorMessage(error, 'Password reset failed');

      toast({
        title: 'Password Reset Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setIsLoading(false))
    }
  };

  const resend2fa = async (email: string): Promise<boolean> => {
    dispatch(setIsLoading(true))
    try {
      await resendPassword({ email }).unwrap();
      toast({
        title: 'Password Resend Initiated',
        description: 'Check your email for further instructions',
      });
      return true;
    } catch (error) {

      const errorMessage = extractErrorMessage(error, 'Password resend failed');

      toast({
        title: 'Password Resend Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setIsLoading(false))
    }
  };

  const resendInvite = async (email: string): Promise<boolean> => {
    dispatch(setLoading(true))
    try {
     const success =  await resendIviteLink({email}).unwrap();
      dispatch(setBulkEmployees(success.data.user))
      toast({
        title: 'User Invited',
        description: `${email} has been invited.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'User resend-invite failed');

      toast({
        title: 'Resend Invite Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setLoading(false))
    }
  };
  const inviteUser = async (userData: Partial<User>): Promise<boolean> => {
    dispatch(setLoading(true))
    try {
      const inviteResponse = await inviteUserMutation(userData).unwrap();
      dispatch(setBulkEmployees(inviteResponse.data.user))
      toast({
        title: 'User Invited',
        description: `${userData.email} has been invited.`,
      });
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, 'User invite failed');

      toast({
        title: 'Invite Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setLoading(false))
    }
  };

  const bulkInviteUsers = async (formData: FormData): Promise<boolean> => {
    dispatch(setLoading(true))
    try {
      const bulkResponse = await bulkInviteUsersMutation(formData).unwrap();
      if(bulkResponse){
        refetchAllProfile();
      }

      toast({
        title: 'Bulk Invite Sent',
        description: 'Multiple users invited successfully.',
      });
      return true;
    } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Bulk invite failed');

      toast({
        title: 'Bulk Invite Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
      dispatch(setLoading(false))
    }
  };


const logout = async () => {
  dispatch(setIsLoading(true))
  try {
    const response = await logoutUser({}).unwrap();
    dispatch(logoutAction());
    toast({
      title: 'Logged Out',
      description: response?.message || 'You have been successfully logged out.',
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error, 'Logout failed');
    toast({
      title: 'Logout Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }finally{
      dispatch(setIsLoading(false))
    }
};


  const hasRole = (requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.some(role => user.role.includes(role));
  };

  return {
    user,
    profileRecord,
    // token: user?.token,
    isLoading,
    error: error || '',
    profileError,
    isAuthenticated,
    profilesIsLoading,
    login,
    // register,
    resetPassword,
    reqestNewPassword,
    resend2fa,
    verify2fa,
    logout, 
    resendInvite,
    setNewPassword,
    inviteUser,
    bulkInviteUsers,   
    hasRole,
    clearError: () => dispatch(clearError()),
  };
};
