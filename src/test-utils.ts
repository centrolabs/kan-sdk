// Fetch mock utilities for testing

export interface MockCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface MockHandler {
  match: (url: string, method: string) => boolean;
  getResponse: () => Response;
}

export function createMockFetch() {
  const calls: MockCall[] = [];
  const handlers: MockHandler[] = [];

  const parseBody = (init?: RequestInit): unknown => {
    if (!init?.body) return undefined;
    try {
      return JSON.parse(init.body as string);
    } catch {
      return init.body;
    }
  };

  const mock = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : (input as Request).url;
    const headers: Record<string, string> = {};
    if (init?.headers) {
      for (const [k, v] of Object.entries(init.headers as Record<string, string>)) {
        headers[k.toLowerCase()] = v;
      }
    }

    calls.push({
      url,
      method: (init?.method ?? "GET").toUpperCase(),
      headers,
      body: parseBody(init),
    });

    const handler = handlers.find((h) => h.match(url, init?.method ?? "GET"));
    if (!handler) {
      return new Response(
        JSON.stringify({ message: "Unhandled", code: "INTERNAL_SERVER_ERROR" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return a fresh response each call so .json() can be called multiple times
    return handler.getResponse();
  };

  mock.calls = calls;

  mock.register = (
    url: string | RegExp,
    method: string,
    status: number,
    body: unknown
  ) => {
    handlers.push({
      match(u: string, m: string) {
        const methodMatch = m.toUpperCase() === method.toUpperCase();
        if (url instanceof RegExp) return methodMatch && url.test(u);
        return methodMatch && u.includes(url);
      },
      getResponse: () =>
        new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" },
        }),
    });
  };

  mock.registerGet = (url: string | RegExp, body: unknown, status = 200) =>
    mock.register(url, "GET", status, body);
  mock.registerPost = (url: string | RegExp, body: unknown, status = 200) =>
    mock.register(url, "POST", status, body);
  mock.registerPatch = (url: string | RegExp, body: unknown, status = 200) =>
    mock.register(url, "PATCH", status, body);
  mock.registerPut = (url: string | RegExp, body: unknown, status = 200) =>
    mock.register(url, "PUT", status, body);
  mock.registerDelete = (url: string | RegExp, body?: unknown, status = 200) =>
    mock.register(url, "DELETE", status, body ?? {});

  mock.registerError = (url: string | RegExp, method: string, status: number, body: unknown) =>
    mock.register(url, method, status, body);

  mock.clear = () => {
    calls.length = 0;
    handlers.length = 0;
  };

  return mock;
}
