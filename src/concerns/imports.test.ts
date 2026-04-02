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

describe("ImportsConcern", () => {
  test("importTrelloBoards posts board IDs and workspace to /imports/trello/boards", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/imports/trello/boards", { boardsCreated: 3 });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.imports.importTrelloBoards({
      boardIds: ["trello_1", "trello_2", "trello_3"],
      workspacePublicId: "ws_1",
    });

    expect(mock.calls[0].url).toContain("/imports/trello/boards");
    expect(mock.calls[0].body).toEqual({
      boardIds: ["trello_1", "trello_2", "trello_3"],
      workspacePublicId: "ws_1",
    });
    expect(result.boardsCreated).toBe(3);
    restore();
  });
});
