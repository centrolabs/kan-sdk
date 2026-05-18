import type { TrelloBoard } from "../types";
import type { KanClient } from "../client";

export type DisconnectProvider = "trello" | "github";

export class IntegrationsConcern {
  constructor(private client: KanClient) {}

  async getTrelloBoards(): Promise<TrelloBoard[]> {
    return this.client.get<TrelloBoard[]>("/integrations/trello/boards");
  }

  async disconnect(provider: DisconnectProvider): Promise<void> {
    await this.client.post<void>("/integration/disconnect", { provider });
  }
}
