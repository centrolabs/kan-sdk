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

describe("UsersConcern", () => {
  test("me calls GET /users/me", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/users/me", { publicId: "usr_1", email: "alice@example.com", name: "Alice" });

    const kan = createKan({ apiKey: "kan_test" });
    const user = await kan.users.me();

    expect(mock.calls[0].url).toContain("/users/me");
    expect(user.email).toBe("alice@example.com");
    restore();
  });

  test("update puts /users/me with partial body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/users/me", { publicId: "usr_1", email: "alice@example.com", name: "Alice Updated", image: "https://avatar.url" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.users.update({ name: "Alice Updated", image: "https://avatar.url" });

    expect(mock.calls[0].body).toEqual({ name: "Alice Updated", image: "https://avatar.url" });
    expect(mock.calls[0].method).toBe("PUT");
    restore();
  });
});
