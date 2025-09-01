/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEditProfileMutation, useUploadProfileMutation, useGetProfileQuery, useDeleteProfileMutation, useGetAllProfileQuery, useTerminateProfileMutation, useActivateProfileMutation, useGetAnalyticsQuery } from "@/store/slices/profile/profileApi";
import { toast } from "../use-toast";
import { ProfileContextType, ProfileFormData } from "@/types/user";
import { setBulkEmployees, setFormData, setLoading } from "@/store/slices/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { extractErrorMessage } from "@/utils/errorHandler";



export const useReduxProfile= (): ProfileContextType => {
  const dispatch = useAppDispatch();

  const { formData, isLoading, error } = useAppSelector((state) => state.profile);    
  const { user } = useAppSelector((state) => state.auth);
  const [editProfileMutation, {isLoading:editProfileIsLoading}] = useEditProfileMutation();
  const [uploadProfileMutation, {isLoading:uploadIsLoading}] = useUploadProfileMutation();
  const [deleteProfileMutation] = useDeleteProfileMutation();  
  const [terminateProfile] = useTerminateProfileMutation();
  const [activateProfile] = useActivateProfileMutation();

  const {data} = useGetAnalyticsQuery( {},
 { skip: !user});

 
const editProfile = async (profile: any): Promise<boolean> => {
  dispatch(setLoading(true));
  try {
    const result = await editProfileMutation(profile).unwrap();   
    toast({ title: 'Profile updated successfully',
     });
    return true;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Profile Update Error');
    toast({
      title: 'Profile Update Error',
      description: errorMessage,
      variant: 'destructive',
    });
    return false;
  }finally{
    dispatch(setLoading(false));
  }
};


const uploadProfile = async (formData: FormData): Promise<boolean> => {
  dispatch(setLoading(true));

  try {
    const success = await uploadProfileMutation(formData).unwrap();

    if (success) {
      toast({
        title: 'Profile picture uploaded successfully',
        description: 'Your profile picture has been updated.',
      });
      return true;
    }
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Failed to upload profile picture');

    toast({
      title: 'Upload Error',
      description: errorMessage,
      variant: 'destructive',
    });
    return false;
  }finally{
    dispatch(setLoading(false));
  }
};

  const deleteProfile = async (id: string): Promise<boolean> => {
  dispatch(setLoading(true));

    try {
      const success = await deleteProfileMutation(id).unwrap();
      if(success){

        toast({ title: 'Profile deleted successfully' });  
   
      }
      return true;
    } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Failed to delete profile');
      toast({
        title: 'Delete Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
    dispatch(setLoading(false));
  }
  };

  const profileTerminate = async (id: string): Promise<boolean> => {
  dispatch(setLoading(true));

    try {
      await terminateProfile(id).unwrap();
      toast({ title: 'Profile terminated successfully' });
      return true;
    } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Failed to terminate profile');

      toast({
        title: 'Terminate Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
    dispatch(setLoading(false));
  }
  };
  const profileActivate = async (id: string): Promise<boolean> => {
  dispatch(setLoading(true));

    try {
      await activateProfile(id).unwrap();
      toast({ title: 'Profile terminated successfully' });
      return true;
    } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Failed to terminate profile');

      toast({
        title: 'Terminate Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }finally{
    dispatch(setLoading(false));
  }
  };

  return {
    profile: formData,
    isProfileLoading: isLoading,
    profileError: error,
    uploadIsLoading,
    editProfile,
    uploadProfile,
    deleteProfile,
    profileTerminate,
    profileActivate
  };
};
