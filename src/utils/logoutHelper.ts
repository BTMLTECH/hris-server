// // utils/logoutHelper.ts

// import { toast } from '@/hooks/use-toast';
// import { authApi } from '@/store/slices/auth/authApi';
// import { logout, setIsLoading } from '@/store/slices/auth/authSlice';
// import { AppDispatch } from '@/store/store';

// export const performLogout = async (dispatch: AppDispatch) => {
//   dispatch(setIsLoading(true));

//   try {
//     await dispatch(authApi.endpoints.logoutUser.initiate({})).unwrap();
//     dispatch(logout());

//     toast({
//       title: 'Logged Out',
//       description: 'You have been successfully logged out.',
//     });
//   } catch (error: any) {
//     toast({
//       title: 'Logout Error',
//       description: error?.message || 'Logout failed.',
//       variant: 'destructive',
//     });
//   } finally {
//     dispatch(setIsLoading(false));
//   }
// };
