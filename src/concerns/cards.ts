import type {
  Card,
  CardActivity,
  Checklist,
  ChecklistItem,
  Comment,
  AttachmentUploadUrl,
  CursorPagination,
  CursorPaginatedResponse,
} from "../types";
import type { KanClient } from "../client";

export interface CreateCardInput {
  title: string;
  description?: string;
  listPublicId: string;
  labelPublicIds?: string[];
  memberPublicIds?: string[];
  position?: "start" | "end";
  dueDate?: string | null;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  listPublicId?: string;
  labelPublicIds?: string[];
  memberPublicIds?: string[];
  position?: number;
  dueDate?: string | null;
}

export interface GetCardActivitiesInput extends CursorPagination {
  cardPublicId: string;
}

export interface CreateCommentInput {
  comment: string;
}

export interface UpdateCommentInput {
  comment: string;
}

export interface CreateChecklistInput {
  name: string;
}

export interface UpdateChecklistItemInput {
  text?: string;
  isChecked?: boolean;
}

export interface GenerateUploadUrlInput {
  filename: string;
  contentType: string;
  size: number;
}

export interface ConfirmAttachmentInput {
  key: string;
  filename: string;
  contentType: string;
  size: number;
}

export class CardsConcern {
  constructor(private client: KanClient) {}

  /**
   * Creates a new card.
   * @param input - The card creation input
   */
  async create(input: CreateCardInput): Promise<Card> {
    return this.client.post<Card>("/cards", input);
  }

  /**
   * Retrieves a card by its public ID.
   * @param cardPublicId - The public ID of the card
   */
  async get(cardPublicId: string): Promise<Card> {
    return this.client.get<Card>(`/cards/${cardPublicId}`);
  }

  /**
   * Updates an existing card.
   * @param cardPublicId - The public ID of the card to update
   * @param input - The fields to update
   */
  async update(cardPublicId: string, input: UpdateCardInput): Promise<Card> {
    return this.client.put<Card>(`/cards/${cardPublicId}`, input);
  }

  /**
   * Deletes a card.
   * @param cardPublicId - The public ID of the card to delete
   */
  async delete(cardPublicId: string): Promise<void> {
    await this.client.delete<void>(`/cards/${cardPublicId}`);
  }

  /**
   * Retrieves paginated activities for a card.
   * @param input - The card public ID and optional pagination params
   */
  async getActivities(
    input: GetCardActivitiesInput
  ): Promise<CursorPaginatedResponse<CardActivity>> {
    const params: Record<string, string> = {};
    if (input.cursor) params.cursor = input.cursor;
    if (input.limit) params.limit = String(input.limit);
    return this.client.get<CursorPaginatedResponse<CardActivity>>(
      `/cards/${input.cardPublicId}/activities`,
      params
    );
  }

  // ── Comments ───────────────────────────────────────────────────────────────

  /**
   * Adds a comment to a card.
   * @param cardPublicId - The public ID of the card
   * @param input - The comment content
   */
  async addComment(
    cardPublicId: string,
    input: CreateCommentInput
  ): Promise<Comment> {
    return this.client.post<Comment>(
      `/cards/${cardPublicId}/comments`,
      input
    );
  }

  /**
   * Updates an existing comment.
   * @param commentPublicId - The public ID of the comment to update
   * @param input - The new content
   */
  async updateComment(
    commentPublicId: string,
    input: UpdateCommentInput
  ): Promise<Comment> {
    return this.client.put<Comment>(`/comments/${commentPublicId}`, input);
  }

  /**
   * Deletes a comment.
   * @param commentPublicId - The public ID of the comment to delete
   */
  async deleteComment(commentPublicId: string): Promise<void> {
    await this.client.delete<void>(`/comments/${commentPublicId}`);
  }

  // ── Checklists ─────────────────────────────────────────────────────────────

  /**
   * Adds a checklist to a card.
   * @param cardPublicId - The public ID of the card
   * @param input - The checklist name
   */
  async addChecklist(
    cardPublicId: string,
    input: CreateChecklistInput
  ): Promise<Checklist> {
    return this.client.post<Checklist>(
      `/cards/${cardPublicId}/checklists`,
      input
    );
  }

  /**
   * Updates a checklist item.
   * @param cardPublicId - The public ID of the card
   * @param checklistPublicId - The public ID of the checklist
   * @param itemPublicId - The public ID of the item to update
   * @param input - The fields to update (text and/or checked state)
   */
  async updateChecklistItem(
    cardPublicId: string,
    checklistPublicId: string,
    itemPublicId: string,
    input: UpdateChecklistItemInput
  ): Promise<ChecklistItem> {
    return this.client.patch<ChecklistItem>(
      `/cards/${cardPublicId}/checklists/${checklistPublicId}/items/${itemPublicId}`,
      input
    );
  }

  /**
   * Deletes a checklist item.
   * @param cardPublicId - The public ID of the card
   * @param checklistPublicId - The public ID of the checklist
   * @param itemPublicId - The public ID of the item to delete
   */
  async deleteChecklistItem(
    cardPublicId: string,
    checklistPublicId: string,
    itemPublicId: string
  ): Promise<void> {
    await this.client.delete<void>(
      `/cards/${cardPublicId}/checklists/${checklistPublicId}/items/${itemPublicId}`
    );
  }

  // ── Members ─────────────────────────────────────────────────────────────────

  /**
   * Adds a member to a card.
   * @param cardPublicId - The public ID of the card
   * @param memberPublicId - The public ID of the member to add
   */
  async addMember(cardPublicId: string, memberPublicId: string): Promise<void> {
    await this.client.post<void>(`/cards/${cardPublicId}/members`, {
      memberPublicId,
    });
  }

  /**
   * Removes a member from a card.
   * @param cardPublicId - The public ID of the card
   * @param memberPublicId - The public ID of the member to remove
   */
  async removeMember(
    cardPublicId: string,
    memberPublicId: string
  ): Promise<void> {
    await this.client.delete<void>(
      `/cards/${cardPublicId}/members/${memberPublicId}`
    );
  }

  // ── Labels ──────────────────────────────────────────────────────────────────

  /**
   * Adds a label to a card.
   * @param cardPublicId - The public ID of the card
   * @param labelPublicId - The public ID of the label to add
   */
  async addLabel(cardPublicId: string, labelPublicId: string): Promise<void> {
    await this.client.post<void>(`/cards/${cardPublicId}/labels`, {
      labelPublicId,
    });
  }

  /**
   * Removes a label from a card.
   * @param cardPublicId - The public ID of the card
   * @param labelPublicId - The public ID of the label to remove
   */
  async removeLabel(cardPublicId: string, labelPublicId: string): Promise<void> {
    await this.client.delete<void>(
      `/cards/${cardPublicId}/labels/${labelPublicId}`
    );
  }

  // ── Attachments ─────────────────────────────────────────────────────────────

  /**
   * Generates a presigned URL for uploading an attachment to S3.
   * @param cardPublicId - The public ID of the card
   * @param input - The file metadata (filename, contentType, size)
   */
  async generateUploadUrl(
    cardPublicId: string,
    input: GenerateUploadUrlInput
  ): Promise<AttachmentUploadUrl> {
    return this.client.post<AttachmentUploadUrl>(
      `/cards/${cardPublicId}/attachments/upload-url`,
      input
    );
  }

  /**
   * Confirms an attachment upload and saves it to the database.
   * @param cardPublicId - The public ID of the card
   * @param input - The confirmed file metadata
   */
  async confirmAttachment(
    cardPublicId: string,
    input: ConfirmAttachmentInput
  ): Promise<void> {
    await this.client.post<void>(
      `/cards/${cardPublicId}/attachments/confirm`,
      input
    );
  }

  /**
   * Deletes an attachment from a card.
   * @param cardPublicId - The public ID of the card
   * @param attachmentPublicId - The public ID of the attachment to delete
   */
  async deleteAttachment(
    cardPublicId: string,
    attachmentPublicId: string
  ): Promise<void> {
    await this.client.delete<void>(
      `/cards/${cardPublicId}/attachments/${attachmentPublicId}`
    );
  }
}
