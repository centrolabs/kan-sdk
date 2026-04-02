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

describe("LabelsConcern", () => {
  test("create posts correct body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/labels", { publicId: "lbl_1", name: "Bug", colourCode: "#ff0000", boardPublicId: "brd_1" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.labels.create({ name: "Bug", boardPublicId: "brd_1", colourCode: "#ff0000" });

    expect(mock.calls[0].body).toEqual({ name: "Bug", boardPublicId: "brd_1", colourCode: "#ff0000" });
    restore();
  });

  test("get calls /labels/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/labels/lbl_1", { publicId: "lbl_1", name: "Bug", colourCode: "#ff0000", boardPublicId: "brd_1" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.labels.get("lbl_1");

    expect(mock.calls[0].url).toContain("/labels/lbl_1");
    restore();
  });

  test("update patches with partial body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/labels/lbl_1", { publicId: "lbl_1", name: "Critical Bug", colourCode: "#cc0000", boardPublicId: "brd_1" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.labels.update("lbl_1", { name: "Critical Bug", colourCode: "#cc0000" });

    expect(mock.calls[0].body).toEqual({ name: "Critical Bug", colourCode: "#cc0000" });
    expect(mock.calls[0].method).toBe("PUT");
    restore();
  });

  test("delete calls DELETE /labels/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/labels/lbl_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.labels.delete("lbl_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/labels/lbl_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });
});
