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
  description: string;
  listPublicId: string;
  labelPublicIds: string[];
  memberPublicIds: string[];
  position: "start" | "end";
  dueDate?: string | null;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  listPublicId?: string;
  index?: number;
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

export interface UpdateChecklistInput {
  name: string;
}

export interface CreateChecklistItemInput {
  title: string;
}

export interface UpdateChecklistItemInput {
  title?: string;
  completed?: boolean;
  index?: number;
}

export interface GenerateUploadUrlInput {
  filename: string;
  contentType: string;
  size: number;
}

export interface ConfirmAttachmentInput {
  s3Key: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
}

export class CardsConcern {
  constructor(private client: KanClient) {}

  async create(input: CreateCardInput): Promise<Card> {
    return this.client.post<Card>("/cards", input);
  }

  async get(cardPublicId: string): Promise<Card> {
    return this.client.get<Card>(`/cards/${cardPublicId}`);
  }

  async update(cardPublicId: string, input: UpdateCardInput): Promise<Card> {
    return this.client.put<Card>(`/cards/${cardPublicId}`, input);
  }

  async delete(cardPublicId: string): Promise<void> {
    await this.client.delete<void>(`/cards/${cardPublicId}`);
  }

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

  async addComment(
    cardPublicId: string,
    input: CreateCommentInput
  ): Promise<Comment> {
    return this.client.post<Comment>(
      `/cards/${cardPublicId}/comments`,
      input
    );
  }

  async updateComment(
    commentPublicId: string,
    input: UpdateCommentInput
  ): Promise<Comment> {
    return this.client.put<Comment>(`/comments/${commentPublicId}`, input);
  }

  async deleteComment(commentPublicId: string): Promise<void> {
    await this.client.delete<void>(`/comments/${commentPublicId}`);
  }

  // ── Checklists ─────────────────────────────────────────────────────────────

  async addChecklist(
    cardPublicId: string,
    input: CreateChecklistInput
  ): Promise<Checklist> {
    return this.client.post<Checklist>(
      `/cards/${cardPublicId}/checklists`,
      input
    );
  }

  async updateChecklist(
    checklistPublicId: string,
    input: UpdateChecklistInput
  ): Promise<Checklist> {
    return this.client.put<Checklist>(
      `/checklists/${checklistPublicId}`,
      input
    );
  }

  async deleteChecklist(checklistPublicId: string): Promise<void> {
    await this.client.delete<void>(`/checklists/${checklistPublicId}`);
  }

  async addChecklistItem(
    checklistPublicId: string,
    input: CreateChecklistItemInput
  ): Promise<ChecklistItem> {
    return this.client.post<ChecklistItem>(
      `/checklists/${checklistPublicId}/items`,
      input
    );
  }

  async updateChecklistItem(
    checklistItemPublicId: string,
    input: UpdateChecklistItemInput
  ): Promise<ChecklistItem> {
    return this.client.patch<ChecklistItem>(
      `/checklists/items/${checklistItemPublicId}`,
      input
    );
  }

  async deleteChecklistItem(checklistItemPublicId: string): Promise<void> {
    await this.client.delete<void>(
      `/checklists/items/${checklistItemPublicId}`
    );
  }

  // ── Members ─────────────────────────────────────────────────────────────────

  // Server endpoint is a toggle: returns `{ newMember: true }` if the member was
  // just added, or `{ newMember: false }` if it was already present and got removed.
  async toggleMember(
    cardPublicId: string,
    workspaceMemberPublicId: string
  ): Promise<{ newMember: boolean }> {
    return this.client.put<{ newMember: boolean }>(
      `/cards/${cardPublicId}/members/${workspaceMemberPublicId}`
    );
  }

  // ── Labels ──────────────────────────────────────────────────────────────────

  // Server endpoint is a toggle: returns `{ newLabel: true }` if the label was
  // just added, or `{ newLabel: false }` if it was already present and got removed.
  async toggleLabel(
    cardPublicId: string,
    labelPublicId: string
  ): Promise<{ newLabel: boolean }> {
    return this.client.put<{ newLabel: boolean }>(
      `/cards/${cardPublicId}/labels/${labelPublicId}`
    );
  }

  // ── Attachments ─────────────────────────────────────────────────────────────

  async generateUploadUrl(
    cardPublicId: string,
    input: GenerateUploadUrlInput
  ): Promise<AttachmentUploadUrl> {
    return this.client.post<AttachmentUploadUrl>(
      `/cards/${cardPublicId}/attachments/upload-url`,
      input
    );
  }

  async confirmAttachment(
    cardPublicId: string,
    input: ConfirmAttachmentInput
  ): Promise<void> {
    await this.client.post<void>(
      `/cards/${cardPublicId}/attachments/confirm`,
      input
    );
  }

  async deleteAttachment(attachmentPublicId: string): Promise<void> {
    await this.client.delete<void>(`/attachments/${attachmentPublicId}`);
  }
}
