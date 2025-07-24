/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEditProfileMutation, useUploadProfileMutation, useGetProfileQuery, useDeleteProfileMutation, useGetAllProfileQuery } from "@/store/slices/profile/profileApi";
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
 
const editProfile = async (profile: any): Promise<boolean> => {
  dispatch(setLoading(true));
  try {
    const result = await editProfileMutation(profile).unwrap();  
    if (result?.data) {
      dispatch(setFormData(result.data)); 
      dispatch(setBulkEmployees(result.data))
    }

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
    // Await the result of the mutation and unwrap the response
    const success = await uploadProfileMutation(formData).unwrap();

    // If successful, trigger the success toast
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
      await deleteProfileMutation(id).unwrap();
      toast({ title: 'Profile deleted successfully' });
      // Optional: dispatch logout or redirect
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

  return {
    profile: formData,
    isProfileLoading: isLoading,
    profileError: error,
    uploadIsLoading,
    editProfile,
    uploadProfile,
    deleteProfile,
  };
};
