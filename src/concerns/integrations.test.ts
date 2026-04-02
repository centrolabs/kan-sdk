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

describe("IntegrationsConcern", () => {
  test("getTrelloBoards calls GET /integrations/trello/boards", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/integrations/trello/boards", [{ id: "board_1", name: "My Trello Board" }]);

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.integrations.getTrelloBoards();

    expect(mock.calls[0].url).toContain("/integrations/trello/boards");
    expect(result[0].name).toBe("My Trello Board");
    restore();
  });

  test("disconnectTrello posts to /integrations/trello/disconnect", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/integrations/trello/disconnect", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.integrations.disconnectTrello();

    expect(mock.calls[0].url).toContain("/integrations/trello/disconnect");
    expect(mock.calls[0].method).toBe("POST");
    restore();
  });

  test("disconnect posts provider to /integrations/disconnect", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/integrations/disconnect", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.integrations.disconnect("trello");

    expect(mock.calls[0].url).toContain("/integrations/disconnect");
    expect(mock.calls[0].body).toEqual({ provider: "trello" });
    restore();
  });
});
