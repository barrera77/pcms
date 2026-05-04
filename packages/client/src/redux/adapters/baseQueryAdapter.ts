import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { ServiceCommand } from "@/app/application/domain/common/command/ServiceCommand";

export const baseQueryAdapter: BaseQueryFn
  { service: ServiceCommand<any, any>; params?: unknown },
  unknown,
  { message: string }
> = async ({ service, params }) => {
  try {
    const result = await service.execute(params);
    return { data: result };
  } catch (error: any) {
    return {
      error: { message: error?.message ?? "Unknown fetch error" },
    };
  }