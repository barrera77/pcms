import { activateUserService } from "@/app/application/services/user/Activate.service";
import { api } from "@/redux/api/api";

interface ActivateUserRequest {
  token: string;
  password: string;
}

interface ActivateUserResponse {
  message: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    activateUser: builder.mutation<ActivateUserResponse, ActivateUserRequest>({
      query: (params) => ({
        service: activateUserService,
        params,
      }),
    }),
  }),
});

export const { useActivateUserMutation } = userApi;
