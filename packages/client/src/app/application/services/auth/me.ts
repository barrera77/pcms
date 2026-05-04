import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";
import { UserRole } from "@pcms/pcms-common";

export interface MeResult {
  sub: string;
  userName: string;
  role: UserRole;
}

export class Me extends BaseService<MeResult, void> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(): Promise<MeResult> {
    const response = await httpClient.request<MeResult>({
      url: this.apiUrl,
      method: "GET",
    });

    return response.data;
  }
}

//Export singleton instance
export const meService = new Me("/api/auth/me");
