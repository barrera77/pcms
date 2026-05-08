import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export interface TwoFaSetupResult {
  qrCodeDataUrl: string;
  secret?: string;
}

export class TwoFaSetup extends BaseService<TwoFaSetupResult, void> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(): Promise<TwoFaSetupResult> {
    const response = await httpClient.request<TwoFaSetupResult>({
      url: this.apiUrl,
      method: "POST",
    });
    return response.data;
  }
}

export const twoFaSetupService = new TwoFaSetup("auth/2fa/setup");
