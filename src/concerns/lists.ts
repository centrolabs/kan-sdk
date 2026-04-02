import type { KanList } from "../types";
import type { KanClient } from "../client";

export interface CreateListInput {
  name: string;
  boardPublicId: string;
}

export class ListsConcern {
  constructor(private client: KanClient) {}

  /**
   * Creates a new list on a board.
   * @param input - The list creation input
   */
  async create(input: CreateListInput): Promise<KanList> {
    return this.client.post<KanList>("/lists", input);
  }

  /**
   * Deletes a list.
   * @param listPublicId - The public ID of the list to delete
   */
  async delete(listPublicId: string): Promise<void> {
    await this.client.delete<void>(`/lists/${listPublicId}`);
  }
}
