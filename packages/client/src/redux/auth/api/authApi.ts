import { loginService } from "@/app/application/services/auth/login";
import { logoutService } from "@/app/application/services/auth/logout";
import { meService } from "@/app/application/services/auth/me";
import { refreshTokenService } from "@/app/application/services/auth/refresh-token";
import {
  TwoFaSetupResult,
  twoFaSetupService,
} from "@/app/application/services/auth/twofa-setup";
import { twoFaValidateService } from "@/app/application/services/auth/twofa-validate";
import { twoFaVerifyService } from "@/app/application/services/auth/twofa-verify";
import { api } from "@/redux/api/api";
import { AuthTags } from "@/redux/auth/types/tags";
import type { UserRole } from "@pcms/pcms-common";

interface LoginRequest {
  userName: string;
  password: string;
}

interface LoginResponse {
  message: string;
  requiresTwoFactor: boolean;
  requiresTwoFactorSetup: boolean;
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
      extraOptions: {
        maxRetries: 0,
      },
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
      invalidatesTags: [],
    }),

    twoFaSetup: builder.mutation<TwoFaSetupResult, void>({
      query: () => ({ service: twoFaSetupService }),
    }),

    twoFaVerify: builder.mutation<{ message: string }, { code: string }>({
      query: (params) => ({ service: twoFaVerifyService, params }),
    }),

    twoFaValidate: builder.mutation<{ message: string }, { code: string }>({
      query: (params) => ({ service: twoFaValidateService, params }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useTwoFaSetupMutation,
  useTwoFaVerifyMutation,
  useTwoFaValidateMutation,
} = authApi;
