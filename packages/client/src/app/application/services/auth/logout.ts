import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export class Logout extends BaseService<{ message: string }, void> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(): Promise<{ message: string }> {
    const response = await httpClient.request<{ message: string }>({
      url: this.apiUrl,
      method: "POST",
    });

    return response.data;
  }
}

export const logoutService = new Logout("/api/auth/logout");
