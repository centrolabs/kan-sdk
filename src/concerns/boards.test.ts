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

describe("BoardsConcern", () => {
  test("getByPublicId calls /boards/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/boards/brd_1", { publicId: "brd_1", name: "Board", slug: "board", workspacePublicId: "ws_1", type: "regular", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.boards.getByPublicId("brd_1");

    expect(mock.calls[0].url).toContain("/boards/brd_1");
    restore();
  });

  test("getBySlug calls /boards/slug/:slug", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/boards/slug/my-board", { publicId: "brd_1", name: "Board", slug: "my-board", workspacePublicId: "ws_1", type: "regular", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.boards.getBySlug("my-board");

    expect(mock.calls[0].url).toContain("/boards/slug/my-board");
    restore();
  });

  test("create posts correct body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/boards", { publicId: "brd_new", name: "New Board", slug: "new-board", workspacePublicId: "ws_1", type: "regular", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.boards.create({ name: "New Board", workspacePublicId: "ws_1", type: "template", description: "A board" });

    expect(mock.calls[0].body).toEqual({ name: "New Board", workspacePublicId: "ws_1", type: "template", description: "A board" });
    restore();
  });

  test("update puts with partial body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/boards/brd_1", { publicId: "brd_1", name: "Renamed", slug: "board", workspacePublicId: "ws_1", type: "regular", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.boards.update("brd_1", { name: "Renamed", description: "New desc" });

    expect(mock.calls[0].body).toEqual({ name: "Renamed", description: "New desc" });
    expect(mock.calls[0].method).toBe("PUT");
    restore();
  });

  test("delete calls DELETE /boards/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/boards/brd_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.boards.delete("brd_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/boards/brd_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  test("checkSlugAvailable calls /boards/:slug/available", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/boards/my-slug/available", { available: false });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.boards.checkSlugAvailable("my-slug");

    expect(result).toEqual({ available: false });
    restore();
  });
});
