import { KanClient } from "./client";
import { WorkspacesConcern } from "./concerns/workspaces";
import { BoardsConcern } from "./concerns/boards";
import { ListsConcern } from "./concerns/lists";
import { CardsConcern } from "./concerns/cards";
import { LabelsConcern } from "./concerns/labels";
import { UsersConcern } from "./concerns/users";
import { HealthConcern } from "./concerns/health";
import { IntegrationsConcern } from "./concerns/integrations";
import { ImportsConcern } from "./concerns/imports";
import type { ClientOptions } from "./types";

export * from "./types";
export * from "./errors";
export * from "./concerns/workspaces";
export * from "./concerns/boards";
export * from "./concerns/lists";
export * from "./concerns/cards";
export * from "./concerns/labels";
export * from "./concerns/users";
export * from "./concerns/health";
export * from "./concerns/integrations";
export * from "./concerns/imports";

export interface Kan {
  workspaces: WorkspacesConcern;
  boards: BoardsConcern;
  lists: ListsConcern;
  cards: CardsConcern;
  labels: LabelsConcern;
  users: UsersConcern;
  health: HealthConcern;
  integrations: IntegrationsConcern;
  imports: ImportsConcern;
}

export function createKan(options: ClientOptions): Kan {
  const client = new KanClient(options);

  return {
    workspaces: new WorkspacesConcern(client),
    boards: new BoardsConcern(client),
    lists: new ListsConcern(client),
    cards: new CardsConcern(client),
    labels: new LabelsConcern(client),
    users: new UsersConcern(client),
    health: new HealthConcern(client),
    integrations: new IntegrationsConcern(client),
    imports: new ImportsConcern(client),
  };
}

// Default export for convenience
export default createKan;

// ─── Usage Example ────────────────────────────────────────────────────────────
//
// import { createKan } from "kan-sdk";
//
// const kan = createKan({ apiKey: "kan_xxxxx" });
//
// const workspaces = await kan.workspaces.list();
// const boards = await kan.boards.getBySlug("my-board");
// const card = await kan.cards.create({ title: "Hello", listPublicId: "..." });
// await kan.cards.addComment(card.publicId, { content: "Nice!" });
