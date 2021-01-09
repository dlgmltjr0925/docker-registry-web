export interface ApiResult<T = Record<string, unknown>> {
  status: number;
  message?: string;
  data: T;
}
