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

describe("CardsConcern", () => {
  // ── CRUD ──────────────────────────────────────────────────────────────────

  test("create posts correct body to /cards", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards", {
      publicId: "card_1", title: "Hello", description: "Desc", listPublicId: "lst_1",
      boardPublicId: "brd_1", position: 0, createdAt: "", updatedAt: "",
    });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.create({
      title: "Hello",
      description: "Desc",
      listPublicId: "lst_1",
      labelPublicIds: ["lbl_1"],
      memberPublicIds: ["usr_1"],
      position: "start",
      dueDate: "2025-01-01",
    });

    expect(mock.calls[0].body).toEqual({
      title: "Hello",
      description: "Desc",
      listPublicId: "lst_1",
      labelPublicIds: ["lbl_1"],
      memberPublicIds: ["usr_1"],
      position: "start",
      dueDate: "2025-01-01",
    });
    restore();
  });

  test("get calls /cards/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/cards/card_1", { publicId: "card_1", title: "Card", listPublicId: "lst_1", boardPublicId: "brd_1", position: 0, createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.get("card_1");

    expect(mock.calls[0].url).toContain("/cards/card_1");
    restore();
  });

  test("update puts with partial body", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/cards/card_1", { publicId: "card_1", title: "Updated", listPublicId: "lst_1", boardPublicId: "brd_1", position: 1, createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.update("card_1", { title: "Updated", position: 1 });

    expect(mock.calls[0].body).toEqual({ title: "Updated", position: 1 });
    expect(mock.calls[0].method).toBe("PUT");
    restore();
  });

  test("delete calls DELETE /cards/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/cards/card_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.delete("card_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/cards/card_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  // ── Activities ─────────────────────────────────────────────────────────────

  test("getActivities passes pagination params", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerGet("/cards/card_1/activities", { items: [], hasMore: false });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.getActivities({ cardPublicId: "card_1", cursor: "cur_1", limit: 10 });

    expect(mock.calls[0].url).toContain("/cards/card_1/activities");
    expect(mock.calls[0].url).toContain("cursor=cur_1");
    expect(mock.calls[0].url).toContain("limit=10");
    restore();
  });

  // ── Comments ───────────────────────────────────────────────────────────────

  test("addComment posts to /cards/:id/comments", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/comments", { publicId: "cmt_1", cardPublicId: "card_1", userPublicId: "usr_1", content: "Nice!", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.addComment("card_1", { comment: "Nice!" });

    expect(mock.calls[0].url).toContain("/cards/card_1/comments");
    expect(mock.calls[0].body).toEqual({ comment: "Nice!" });
    restore();
  });

  test("updateComment puts /comments/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPut("/comments/cmt_1", { publicId: "cmt_1", cardPublicId: "card_1", userPublicId: "usr_1", content: "Updated!", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.updateComment("cmt_1", { comment: "Updated!" });

    expect(mock.calls[0].url).toContain("/comments/cmt_1");
    expect(mock.calls[0].body).toEqual({ comment: "Updated!" });
    restore();
  });

  test("deleteComment calls DELETE /comments/:id", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/comments/cmt_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.deleteComment("cmt_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/comments/cmt_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  // ── Checklists ─────────────────────────────────────────────────────────────

  test("addChecklist posts to /cards/:id/checklists", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/checklists", { publicId: "chk_1", cardPublicId: "card_1", name: "Checklist", createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.addChecklist("card_1", { name: "Checklist" });

    expect(mock.calls[0].url).toContain("/cards/card_1/checklists");
    expect(mock.calls[0].body).toEqual({ name: "Checklist" });
    restore();
  });

  test("updateChecklistItem patches nested item path", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPatch("/cards/card_1/checklists/chk_1/items/item_1", { publicId: "item_1", checklistPublicId: "chk_1", text: "Done", isChecked: true, position: 0, createdAt: "", updatedAt: "" });

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.updateChecklistItem("card_1", "chk_1", "item_1", { text: "Done", isChecked: true });

    expect(mock.calls[0].url).toContain("/cards/card_1/checklists/chk_1/items/item_1");
    expect(mock.calls[0].body).toEqual({ text: "Done", isChecked: true });
    restore();
  });

  test("deleteChecklistItem calls DELETE on nested item path", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/cards/card_1/checklists/chk_1/items/item_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.deleteChecklistItem("card_1", "chk_1", "item_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/cards/card_1/checklists/chk_1/items/item_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  // ── Members ─────────────────────────────────────────────────────────────────

  test("addMember posts memberPublicId to /cards/:id/members", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/members", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.addMember("card_1", "usr_1");

    expect(mock.calls[0].url).toContain("/cards/card_1/members");
    expect(mock.calls[0].body).toEqual({ memberPublicId: "usr_1" });
    restore();
  });

  test("removeMember calls DELETE /cards/:id/members/:mid", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/cards/card_1/members/usr_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.removeMember("card_1", "usr_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/cards/card_1/members/usr_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  // ── Labels ──────────────────────────────────────────────────────────────────

  test("addLabel posts labelPublicId to /cards/:id/labels", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/labels", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.addLabel("card_1", "lbl_1");

    expect(mock.calls[0].url).toContain("/cards/card_1/labels");
    expect(mock.calls[0].body).toEqual({ labelPublicId: "lbl_1" });
    restore();
  });

  test("removeLabel calls DELETE /cards/:id/labels/:lblId", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/cards/card_1/labels/lbl_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.removeLabel("card_1", "lbl_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/cards/card_1/labels/lbl_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });

  // ── Attachments ─────────────────────────────────────────────────────────────

  test("generateUploadUrl posts filename, contentType, size", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/attachments/upload-url", { url: "https://s3.example.com/...", key: "uploads/file.pdf" });

    const kan = createKan({ apiKey: "kan_test" });
    const result = await kan.cards.generateUploadUrl("card_1", {
      filename: "file.pdf",
      contentType: "application/pdf",
      size: 1024,
    });

    expect(mock.calls[0].url).toContain("/cards/card_1/attachments/upload-url");
    expect(mock.calls[0].body).toEqual({ filename: "file.pdf", contentType: "application/pdf", size: 1024 });
    expect(result.url).toBe("https://s3.example.com/...");
    restore();
  });

  test("confirmAttachment posts key, filename, contentType, size", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerPost("/cards/card_1/attachments/confirm", {});

    const kan = createKan({ apiKey: "kan_test" });
    await kan.cards.confirmAttachment("card_1", {
      key: "uploads/file.pdf",
      filename: "file.pdf",
      contentType: "application/pdf",
      size: 1024,
    });

    expect(mock.calls[0].url).toContain("/cards/card_1/attachments/confirm");
    expect(mock.calls[0].body).toEqual({
      key: "uploads/file.pdf",
      filename: "file.pdf",
      contentType: "application/pdf",
      size: 1024,
    });
    restore();
  });

  test("deleteAttachment calls DELETE /cards/:id/attachments/:attId", async () => {
    const mock = createMockFetch();
    const restore = withMock(mock);
    mock.registerDelete("/cards/card_1/attachments/att_1", undefined, 204);

    const kan = createKan({ apiKey: "kan_test" });
    await expect(kan.cards.deleteAttachment("card_1", "att_1")).resolves.toBeUndefined();

    expect(mock.calls[0].url).toContain("/cards/card_1/attachments/att_1");
    expect(mock.calls[0].method).toBe("DELETE");
    restore();
  });
});
