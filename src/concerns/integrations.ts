import type { TrelloBoard } from "../types";
import type { KanClient } from "../client";

export class IntegrationsConcern {
  constructor(private client: KanClient) {}

  /**
   * Retrieves all boards from Trello.
   */
  async getTrelloBoards(): Promise<TrelloBoard[]> {
    return this.client.get<TrelloBoard[]>("/integrations/trello/boards");
  }

  /**
   * Disconnects the Trello integration.
   */
  async disconnectTrello(): Promise<void> {
    await this.client.post<void>("/integrations/trello/disconnect");
  }

  /**
   * Disconnects an integration by provider name.
   * @param provider - The name of the integration provider
   */
  async disconnect(provider: string): Promise<void> {
    await this.client.post<void>("/integrations/disconnect", { provider });
  }
}
