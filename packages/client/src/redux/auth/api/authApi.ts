import { loginService } from "@/app/application/services/auth/login";
import { logoutService } from "@/app/application/services/auth/logout";
import { meService } from "@/app/application/services/auth/me";
import { refreshTokenService } from "@/app/application/services/auth/refresh-token";
import { api } from "@/redux/api/api";
import { AuthTags } from "@/redux/auth/types/tags";
import type { UserRole } from "@pcms/pcms-common";

interface LoginRequest {
  userName: string;
  password: string;
}

interface LoginResponse {
  message: string;
}

interface User {
  sub: string;
  userName: string;
  role: UserRole;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //LOGIN
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (params) => ({
        service: loginService,
        params,
      }),
      invalidatesTags: [AuthTags.USER],
    }),

    //CURRENT USER (/auth/me)
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        service: meService,
      }),
      providesTags: [AuthTags.USER],
      keepUnusedDataFor: 0,
    }),

    //REFRESH TOKEN
    refreshToken: builder.mutation<{ message: string }, void>({
      query: () => ({
        service: refreshTokenService,
      }),
    }),

    //LOGOUT
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        service: logoutService,
      }),
      invalidatesTags: [AuthTags.USER],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
