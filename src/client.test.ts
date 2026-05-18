import { describe, test, expect } from "bun:test";
import { createKan } from "./index";
import { createMockFetch } from "./test-utils";

function withMock(mock: ReturnType<typeof createMockFetch>) {
  const original = globalThis.fetch;
  // @ts-expect-error - mock
  globalThis.fetch = mock;
  return () => {
    globalThis.fetch = original;
  };
}

describe("KanClient", () => {
  describe("auth header", () => {
    test("sets x-api-key on every request", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/health", { status: "ok", database: "ok", storage: "ok" });

      const kan = createKan({ apiKey: "kan_secret" });
      await kan.health.check();

      expect(mock.calls[0].headers["x-api-key"]).toBe("kan_secret");
      restore();
    });

    test("sets Content-Type header on mutations", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerPost("/workspaces", { publicId: "ws_1", name: "W", slug: "w", createdAt: "", updatedAt: "" });

      const kan = createKan({ apiKey: "kan_test" });
      await kan.workspaces.create({ name: "W", slug: "w" });

      expect(mock.calls[0].headers["content-type"]).toBe("application/json");
      restore();
    });
  });

  describe("base URL", () => {
    test("uses kan.bn by default", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/health", { status: "ok", database: "ok", storage: "ok" });

      const kan = createKan({ apiKey: "kan_test" });
      await kan.health.check();

      expect(mock.calls[0].url).toBe("https://kan.bn/api/v1/health");
      restore();
    });

    test("uses custom baseUrl when provided", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/health", { status: "ok", database: "ok", storage: "ok" });

      const kan = createKan({ apiKey: "kan_test", baseUrl: "https://self-hosted.example.com/api/v1" });
      await kan.health.check();

      expect(mock.calls[0].url).toBe("https://self-hosted.example.com/api/v1/health");
      restore();
    });
  });

  describe("error handling", () => {
    async function expectThrows(kan: ReturnType<typeof createKan>, fn: () => Promise<any>, name: string, statusCode: number) {
      try {
        await fn();
        expect().fail(`Expected ${name} to be thrown`);
      } catch (err: any) {
        expect(err.name).toBe(name);
        expect(err.statusCode).toBe(statusCode);
      }
    }

    test("throws BadRequestError on 400", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 400, { message: "Invalid input", code: "BAD_REQUEST", issues: [] });

      const kan = createKan({ apiKey: "kan_test" });
      await expectThrows(kan, () => kan.health.check(), "BadRequestError", 400);
      restore();
    });

    test("throws UnauthorizedError on 401", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 401, { message: "Token missing", code: "UNAUTHORIZED", issues: [] });

      const kan = createKan({ apiKey: "kan_test" });
      await expectThrows(kan, () => kan.health.check(), "UnauthorizedError", 401);
      restore();
    });

    test("throws ForbiddenError on 403", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 403, { message: "Insufficient access", code: "FORBIDDEN", issues: [] });

      const kan = createKan({ apiKey: "kan_test" });
      await expectThrows(kan, () => kan.health.check(), "ForbiddenError", 403);
      restore();
    });

    test("throws NotFoundError on 404", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 404, { message: "Not found", code: "NOT_FOUND", issues: [] });

      const kan = createKan({ apiKey: "kan_test" });
      await expectThrows(kan, () => kan.health.check(), "NotFoundError", 404);
      restore();
    });

    test("throws InternalServerError on 500", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 500, { message: "Server error", code: "INTERNAL_SERVER_ERROR", issues: [] });

      const kan = createKan({ apiKey: "kan_test" });
      await expectThrows(kan, () => kan.health.check(), "InternalServerError", 500);
      restore();
    });

    test("KanError carries code, statusCode, and issues", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerError("/health", "GET", 403, { message: "Forbidden", code: "FORBIDDEN", issues: [{ message: "no access" }] });

      const kan = createKan({ apiKey: "kan_test" });
      try {
        await kan.health.check();
      } catch (err: any) {
        expect(err.code).toBe("FORBIDDEN");
        expect(err.statusCode).toBe(403);
        expect(err.issues).toEqual([{ message: "no access" }]);
      } finally {
        restore();
      }
    });
  });

  describe("query parameters", () => {
    test("appends query params to URL", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/workspaces/ws_1/boards", []);

      const kan = createKan({ apiKey: "kan_test" });
      await kan.workspaces.listBoards("ws_1", { type: "template" });

      expect(mock.calls[0].url).toContain("type=template");
      restore();
    });

    test("omits undefined query params", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/workspaces/ws_1/boards", []);

      const kan = createKan({ apiKey: "kan_test" });
      await kan.workspaces.listBoards("ws_1", {});

      expect(mock.calls[0].url).not.toContain("type=");
      restore();
    });
  });

  describe("request body", () => {
    test("JSON-stringifies POST body", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerPost("/workspaces", { publicId: "ws_new", name: "WS", slug: "ws", createdAt: "", updatedAt: "" });

      const kan = createKan({ apiKey: "kan_test" });
      await kan.workspaces.create({ name: "WS", slug: "ws", description: "A workspace" });

      expect(mock.calls[0].body).toEqual({ name: "WS", slug: "ws", description: "A workspace" });
      restore();
    });

    test("JSON-stringifies PATCH body", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerPatch("/checklists/items/item_1", { publicId: "item_1", checklistPublicId: "chk_1", title: "Done", completed: true, index: 0, createdAt: "", updatedAt: "" });

      const kan = createKan({ apiKey: "kan_test" });
      await kan.cards.updateChecklistItem("item_1", { title: "Done", completed: true });

      expect(mock.calls[0].body).toEqual({ title: "Done", completed: true });
      restore();
    });

    test("does not send body on GET requests", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerGet("/health", { status: "ok", database: "ok", storage: "ok" });

      const kan = createKan({ apiKey: "kan_test" });
      await kan.health.check();

      expect(mock.calls[0].body).toBeUndefined();
      restore();
    });
  });

  describe("204 No Content", () => {
    test("delete returns void without parsing body", async () => {
      const mock = createMockFetch();
      const restore = withMock(mock);
      mock.registerDelete("/workspaces/ws_1", undefined, 204);

      const kan = createKan({ apiKey: "kan_test" });
      expect(kan.workspaces.delete("ws_1")).resolves.toBeUndefined();
      restore();
    });
  });
});
