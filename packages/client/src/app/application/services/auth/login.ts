import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export interface LoginParams {
  userName: string;
  password: string;
}

export interface LoginResult {
  message: string;
}

export class Login extends BaseService<LoginResult, LoginParams> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(params: LoginParams): Promise<LoginResult> {
    const response = await httpClient.request<LoginResult, LoginParams>({
      url: this.apiUrl,
      method: "POST",
      body: params,
    });

    return response.data;
  }
}

//Export singleton instance
export const loginService = new Login("/api/auth/login");
