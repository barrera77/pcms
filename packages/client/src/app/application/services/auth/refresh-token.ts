import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export class RefreshToken extends BaseService<{ message: string }, void> {
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

//Export singleton instance
export const refreshTokenService = new RefreshToken("/api/auth/refresh");
