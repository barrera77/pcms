import axios, { AxiosError } from "axios";

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
  async request<T = any, B = any>(
    config: HttpRequest<B>
  ): Promise<HttpResponse<T>> {
    try {
      const response = await axios.request({
        url: config.url,
        method: config.method,
        data: config.body,
        headers: config.headers,
        withCredentials: true,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }
}

// Singleton instance
export const httpClient = new HttpClient();
