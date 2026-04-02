import type { Board } from "../types";
import type { KanClient } from "../client";

export interface CreateBoardInput {
  name: string;
  workspacePublicId: string;
  description?: string;
  type?: "regular" | "template";
}

export interface UpdateBoardInput {
  name?: string;
  description?: string;
}

export class BoardsConcern {
  constructor(private client: KanClient) {}

  /**
   * Retrieves a board by its public ID.
   * @param boardPublicId - The public ID of the board
   */
  async getByPublicId(boardPublicId: string): Promise<Board> {
    return this.client.get<Board>(`/boards/${boardPublicId}`);
  }

  /**
   * Retrieves a board by its slug.
   * @param slug - The slug of the board
   */
  async getBySlug(slug: string): Promise<Board> {
    return this.client.get<Board>(`/boards/slug/${slug}`);
  }

  /**
   * Creates a new board.
   * @param input - The board creation input
   */
  async create(input: CreateBoardInput): Promise<Board> {
    return this.client.post<Board>("/boards", input);
  }

  /**
   * Updates an existing board.
   * @param boardPublicId - The public ID of the board to update
   * @param input - The fields to update
   */
  async update(boardPublicId: string, input: UpdateBoardInput): Promise<Board> {
    return this.client.put<Board>(`/boards/${boardPublicId}`, input);
  }

  /**
   * Deletes a board.
   * @param boardPublicId - The public ID of the board to delete
   */
  async delete(boardPublicId: string): Promise<void> {
    await this.client.delete<void>(`/boards/${boardPublicId}`);
  }

  /**
   * Checks whether a board slug is available.
   * @param slug - The slug to check
   */
  async checkSlugAvailable(slug: string): Promise<{ available: boolean }> {
    return this.client.get<{ available: boolean }>(`/boards/${slug}/available`);
  }
}
