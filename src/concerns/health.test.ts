import { describe, test, expect } from "bun:test";
import { createKan } from "../index";
import { createMockFetch } from "../test-utils";

function withMock(mock: ReturnType<typeof createMockFetch>) {
  const original = globalThis.fetch;
  // @ts-expect-error - mock
  globalThis.fetch = mock;
  return () => {
    globalThis.fetch = original;
  };
}

describe("HealthConcern", () => {
  test("check calls GET /health", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/health", { status: "ok", database: "ok", storage: "ok" });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.health.check();

    expect(mock.calls[0].url).toContain("/health");
    expect(result.status).toBe("ok");
    expect(result.database).toBe("ok");
    expect(result.storage).toBe("ok");
    restore();
  });

  test("check returns storage: 'not_configured' when S3 is not set up", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/health", { status: "ok", database: "ok", storage: "not_configured" });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.health.check();

    expect(result.storage).toBe("not_configured");
    restore();
  });
});
