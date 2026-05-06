import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

export interface HttpRequest<T = any> {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
}

export class HttpClient {
  private api: AxiosInstance;
  private baseUrl = "http://localhost:3000/";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // 🔒 Guard conditions
        const is401 = error.response?.status === 401;
        const isAuthRoute =
          originalRequest?.url?.includes("/auth/login") ||
          originalRequest?.url?.includes("/auth/refresh");

        if (
          is401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isAuthRoute
        ) {
          originalRequest._retry = true;

          try {
            // ✅ Use SAME axios instance config (important)
            await this.api.post("/auth/refresh");

            // Retry original request
            return this.api(originalRequest);
          } catch {
            // ❌ Refresh failed → logout
            window.location.href = "/login";
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async request<T = any, B = any>(
    config: HttpRequest<B>,
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.api.request({
        url: config.url,
        method: config.method,
        data: config.body,
        headers: config.headers,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          (error.response?.data as any)?.message || error.message,
        );
      }
      throw error;
    }
  }
}

export const httpClient = new HttpClient();
