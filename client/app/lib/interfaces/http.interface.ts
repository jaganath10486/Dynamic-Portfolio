export interface NextOptions {
  revalidate?: number | false;
}

export interface ApiConfig {
  method: "GET" | "POST" | "DELETE";
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  cacheOptions?: RequestCache;
  nextOptions?: NextOptions;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  ok: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  error?: never;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  message: string;
  error: ApiErrorDetail;
}

export interface ApiErrorDetail {
  message: string;
  statusCode: number;
  errorType: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
