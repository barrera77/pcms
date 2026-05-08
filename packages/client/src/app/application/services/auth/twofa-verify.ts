import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export interface TwoFaCodeParams {
  code: string;
}
export interface TwoFaVerifyResult {
  message: string;
}

export class TwoFaVerify extends BaseService<
  TwoFaVerifyResult,
  TwoFaCodeParams
> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(): Promise<TwoFaVerifyResult> {
    const response = await httpClient.request<TwoFaVerifyResult>({
      url: this.apiUrl,
      method: "POST",
    });
    return response.data;
  }
}

export const twoFaVerifyService = new TwoFaVerify("auth/2fa/verify");
