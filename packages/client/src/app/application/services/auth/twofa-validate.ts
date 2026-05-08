import { BaseService } from "@/app/application/domain/common/command/ServiceCommand";
import { httpClient } from "@/app/infra/http/HttpClient";

export interface TwoFaCodeParams {
  code: string;
}
export interface TwoFaValidateResult {
  message: string;
}

export class TwoFaValidate extends BaseService<
  TwoFaValidateResult,
  TwoFaCodeParams
> {
  constructor(private readonly apiUrl: string) {
    super();
  }

  async execute(params: TwoFaCodeParams): Promise<TwoFaValidateResult> {
    const response = await httpClient.request<
      TwoFaValidateResult,
      TwoFaCodeParams
    >({
      url: this.apiUrl,
      method: "POST",
      body: params,
    });
    return response.data;
  }
}

export const twoFaValidateService = new TwoFaValidate("auth/2fa/validate");
