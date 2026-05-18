import type { KanList } from "../types";
import type { KanClient } from "../client";

export interface CreateListInput {
  name: string;
  boardPublicId: string;
}

export interface UpdateListInput {
  name?: string;
  index?: number;
}

export class ListsConcern {
  constructor(private client: KanClient) {}

  async create(input: CreateListInput): Promise<KanList> {
    return this.client.post<KanList>("/lists", input);
  }

  async update(listPublicId: string, input: UpdateListInput): Promise<KanList> {
    return this.client.put<KanList>(`/lists/${listPublicId}`, input);
  }

  async delete(listPublicId: string): Promise<void> {
    await this.client.delete<void>(`/lists/${listPublicId}`);
  }
}
