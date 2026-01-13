export interface ServiceCommand<Result = any, Params = any> {
  execute(params: Params): Promise<Result>;
}

export abstract class BaseService<Result, Params> implements ServiceCommand<
  Result,
  Params
> {
  abstract execute(params: Params): Promise<Result>;
}
