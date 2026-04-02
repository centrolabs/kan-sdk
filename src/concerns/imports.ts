import type { ImportResult } from "../types";
import type { KanClient } from "../client";

export interface ImportTrelloBoardsInput {
  boardIds: string[];
  workspacePublicId: string;
}

export class ImportsConcern {
  constructor(private client: KanClient) {}

  /**
   * Imports boards from Trello into a workspace.
   * @param input - The Trello board IDs and target workspace
   */
  async importTrelloBoards(input: ImportTrelloBoardsInput): Promise<ImportResult> {
    return this.client.post<ImportResult>("/imports/trello/boards", input);
  }
}
