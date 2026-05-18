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

describe("WorkspacesConcern", () => {
  test("list calls GET /workspaces", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces", []);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.list();

    expect(mock.calls[0].url).toContain("/workspaces");
    expect(mock.calls[0].method).toBe("GET");
    restore();
  });

  test("create posts correct body to /workspaces", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/workspaces", { publicId: "ws_1", name: "WS", slug: "ws", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.create({ name: "WS", slug: "ws", description: "Desc" });

    expect(mock.calls[0].body).toEqual({ name: "WS", slug: "ws", description: "Desc" });
    restore();
  });

  test("getByPublicId calls correct path", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/ws_abc", { publicId: "ws_abc", name: "WS", slug: "ws", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.getByPublicId("ws_abc");

    expect(mock.calls[0].url).toContain("/workspaces/ws_abc");
    restore();
  });

  test("getBySlug calls /workspaces/:slug", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/my-ws", { publicId: "ws_1", name: "WS", slug: "my-ws", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.getBySlug("my-ws");

    expect(mock.calls[0].url).toContain("/workspaces/my-ws");
    restore();
  });

  test("update puts with partial body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/workspaces/ws_1", { publicId: "ws_1", name: "New Name", slug: "ws", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.update("ws_1", { name: "New Name", weekStartDay: 1 });

    expect(mock.calls[0].body).toEqual({ name: "New Name", weekStartDay: 1 });
    expect(mock.calls[0].method).toBe("PUT");
    restore();
  });

  test("delete calls DELETE /workspaces/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/workspaces/ws_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.delete("ws_1");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  test("listMembers calls /workspaces/:id/members", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/ws_1/members", []);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.listMembers("ws_1");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/members");
    restore();
  });

  test("inviteMember posts email", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/workspaces/ws_1/members/invite", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.inviteMember("ws_1", { email: "alice@example.com" });

    expect(mock.calls[0].body).toEqual({ email: "alice@example.com" });
    restore();
  });

  test("removeMember calls DELETE /workspaces/:id/members/:mid", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/workspaces/ws_1/members/mem_99", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.removeMember("ws_1", "mem_99");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/members/mem_99");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  test("listBoards calls /workspaces/:id/boards with optional type filter", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/ws_1/boards", []);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.listBoards("ws_1", { type: "template" });

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/boards");
    expect(mock.calls[0].url).toContain("type=template");
    restore();
  });

  test("search calls /workspaces/:id/search with query+limit", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/ws_1/search", []);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.search("ws_1", { query: "backend", limit: 30 });

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/search");
    expect(mock.calls[0].url).toContain("query=backend");
    expect(mock.calls[0].url).toContain("limit=30");
    restore();
  });

  test("checkSlugAvailable calls /workspaces/check-slug-availability with workspaceSlug", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/check-slug-availability", { isAvailable: true, isReserved: false });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.workspaces.checkSlugAvailable("my-slug");

    expect(mock.calls[0].url).toContain("/workspaces/check-slug-availability");
    expect(mock.calls[0].url).toContain("workspaceSlug=my-slug");
    expect(result).toEqual({ isAvailable: true, isReserved: false });
    restore();
  });

  test("getActiveInviteLink calls GET /workspaces/:id/invite", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/workspaces/ws_1/invite", { id: 1, inviteCode: "abc", inviteLink: "http://link", isActive: true });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.getActiveInviteLink("ws_1");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/invite");
    restore();
  });

  test("createInviteLink calls POST /workspaces/:id/invites", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/workspaces/ws_1/invites", { id: 1, inviteCode: "abc", inviteLink: "http://link", isActive: true });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.createInviteLink("ws_1");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/invites");
    expect(mock.calls[0].method).toBe("POST");
    restore();
  });

  test("deactivateInviteLink calls DELETE /workspaces/:id/invites", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/workspaces/ws_1/invites", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.deactivateInviteLink("ws_1");

    expect(mock.calls[0].url).toContain("/workspaces/ws_1/invites");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  test("getInviteInfo calls GET /invites/:code", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/invites/code_123", { id: 1, inviteCode: "code_123", inviteLink: "", isActive: true });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.getInviteInfo("code_123");

    expect(mock.calls[0].url).toContain("/invites/code_123");
    restore();
  });

  test("acceptInvite calls POST /invites/accept with inviteCode body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/invites/accept", { publicId: "ws_1", name: "Joined", slug: "joined", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.workspaces.acceptInvite("code_123");

    expect(mock.calls[0].url).toContain("/invites/accept");
    expect(mock.calls[0].method).toBe("POST");
    expect(mock.calls[0].body).toEqual({ inviteCode: "code_123" });
    restore();
  });
});
