import type { ApiError, ClientOptions } from "./types";
import { buildError } from "./errors";

const DEFAULT_BASE_URL = "https://kan.bn/api/v1";

export class KanClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>("GET", path, undefined, params);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };

    const init: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined && method !== "GET") {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    if (!response.ok) {
      throw buildError(response.status, json as ApiError);
    }

    return json as T;
  }
}
