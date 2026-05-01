import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export interface ActivateUserParams {
  token: string;
  password: string;
}

export interface ActivateUserResult {
  message: string;
}

export class ActivateUser extends BaseService<
  ActivateUserResult,
  ActivateUserParams
> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(params: ActivateUserParams): Promise<ActivateUserResult> {
    const response = await httpClient.request<
      ActivateUserResult,
      ActivateUserParams
    >({
      url: this.apiUrl,
      method: "POST",
      body: params,
    });
    return response.data;
  }
}

export const activateUserService = new ActivateUser("/api/user/activate");
