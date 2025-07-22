
import { toast } from '@/hooks/use-toast';
import { getTokens } from '@/utils/cookieUtils';
// import { tokenUtils } from '@/utils/tokenUtils';
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
const ENDPOINT = import.meta.env.VITE_API_BASE_URL;




const baseQuery = fetchBaseQuery({ 
  baseUrl: ENDPOINT,
  credentials: 'include',  
  prepareHeaders: async (headers, {getState, endpoint}) => {

    return headers;
  },
  // prepareHeaders: async (headers, {getState, endpoint}) => {
  //   const excludedRoutes = [
  //     '/register',
  //     '/activate-user',
  //     '/login',
  //     '/verify-2fa',
  //     '/request-user-password',
  //     '/reset-user-password',
  //   ];

  //   const currentUrl = endpoint;

  //   if (!excludedRoutes.some(route => currentUrl.includes(route))) {
  //     const token = tokenUtils.getToken();
  //     console.log("tokenr", token)

  //     if (token) {
  //       headers.set('Authorization', `Bearer ${token}`);
  //     }
  //   }
  //   return headers;
  // },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 429) {
        toast({
        title: "Too many requests. Please try again later!",
      });
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profiles'],
  endpoints: builder => ({
    loadUser: builder.query({
      query: () => ({
        url: 'user/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
  }),
});

// export const {useLoadUserQuery} = apiSlice;
