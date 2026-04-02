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

describe("ListsConcern", () => {
  test("create posts correct body to /lists", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/lists", { publicId: "lst_1", name: "To Do", boardPublicId: "brd_1", position: 0, createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.lists.create({ name: "To Do", boardPublicId: "brd_1" });

    expect(mock.calls[0].body).toEqual({ name: "To Do", boardPublicId: "brd_1" });
    restore();
  });

  test("delete calls DELETE /lists/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/lists/lst_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.lists.delete("lst_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/lists/lst_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });
});
