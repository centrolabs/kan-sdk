import type { Board } from "../types";
import type { KanClient } from "../client";

export interface CreateBoardInput {
  name: string;
  workspacePublicId: string;
  lists: string[];
  labels: string[];
  type?: "regular" | "template";
  sourceBoardPublicId?: string;
}

export interface UpdateBoardInput {
  name?: string;
  slug?: string;
  visibility?: "public" | "private";
  favorite?: boolean;
  isArchived?: boolean;
}

export interface GetBoardBySlugInput {
  workspaceSlug: string;
  boardSlug: string;
}

export class BoardsConcern {
  constructor(private client: KanClient) {}

  async getByPublicId(boardPublicId: string): Promise<Board> {
    return this.client.get<Board>(`/boards/${boardPublicId}`);
  }

  async getBySlug(input: GetBoardBySlugInput): Promise<Board> {
    return this.client.get<Board>(
      `/workspaces/${input.workspaceSlug}/boards/${input.boardSlug}`
    );
  }

  async create(input: CreateBoardInput): Promise<Board> {
    const { workspacePublicId, ...body } = input;
    return this.client.post<Board>(
      `/workspaces/${workspacePublicId}/boards`,
      body
    );
  }

  async update(boardPublicId: string, input: UpdateBoardInput): Promise<Board> {
    return this.client.put<Board>(`/boards/${boardPublicId}`, input);
  }

  async delete(boardPublicId: string): Promise<void> {
    await this.client.delete<void>(`/boards/${boardPublicId}`);
  }

  async checkSlugAvailable(
    boardPublicId: string,
    boardSlug: string
  ): Promise<{ isReserved: boolean }> {
    return this.client.get<{ isReserved: boolean }>(
      `/boards/${boardPublicId}/check-slug-availability`,
      { boardSlug }
    );
  }
}
