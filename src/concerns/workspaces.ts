import type {
  Workspace,
  WorkspaceMember,
  InviteLink,
  CursorPagination,
  CursorPaginatedResponse,
  Board,
  Card,
} from "../types";
import type { KanClient } from "../client";

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  slug?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  slug?: string;
  description?: string;
  showEmailsToMembers?: boolean;
  weekStartDay?: 0 | 1 | 6;
}

export interface InviteMemberInput {
  email: string;
}

export interface SearchBoardsInput extends CursorPagination {
  q: string;
}

export class WorkspacesConcern {
  constructor(private client: KanClient) {}

  async list(): Promise<Workspace[]> {
    return this.client.get<Workspace[]>("/workspaces");
  }

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    return this.client.post<Workspace>("/workspaces", input);
  }

  async getByPublicId(workspacePublicId: string): Promise<Workspace> {
    return this.client.get<Workspace>(`/workspaces/${workspacePublicId}`);
  }

  async getBySlug(workspaceSlug: string): Promise<Workspace> {
    return this.client.get<Workspace>(`/workspaces/${workspaceSlug}`);
  }

  async update(
    workspacePublicId: string,
    input: UpdateWorkspaceInput
  ): Promise<Workspace> {
    return this.client.put<Workspace>(
      `/workspaces/${workspacePublicId}`,
      input
    );
  }

  async delete(workspacePublicId: string): Promise<void> {
    await this.client.delete<void>(`/workspaces/${workspacePublicId}`);
  }

  async listMembers(workspacePublicId: string): Promise<WorkspaceMember[]> {
    return this.client.get<WorkspaceMember[]>(
      `/workspaces/${workspacePublicId}/members`
    );
  }

  async inviteMember(
    workspacePublicId: string,
    input: InviteMemberInput
  ): Promise<void> {
    await this.client.post<void>(
      `/workspaces/${workspacePublicId}/members/invite`,
      input
    );
  }

  async removeMember(
    workspacePublicId: string,
    memberPublicId: string
  ): Promise<void> {
    await this.client.delete<void>(
      `/workspaces/${workspacePublicId}/members/${memberPublicId}`
    );
  }

  async listBoards(
    workspacePublicId: string,
    params?: { type?: "regular" | "template" }
  ): Promise<Board[]> {
    return this.client.get<Board[]>(
      `/workspaces/${workspacePublicId}/boards`,
      params?.type ? { type: params.type } : undefined
    );
  }

  async searchCards(
    workspacePublicId: string,
    input: SearchBoardsInput
  ): Promise<CursorPaginatedResponse<Card>> {
    const params: Record<string, string> = { q: input.q };
    if (input.cursor) params.cursor = input.cursor;
    if (input.limit) params.limit = String(input.limit);
    return this.client.get<CursorPaginatedResponse<Card>>(
      `/workspaces/${workspacePublicId}/search/cards`,
      params
    );
  }

  async searchBoards(
    workspacePublicId: string,
    input: SearchBoardsInput
  ): Promise<CursorPaginatedResponse<Board>> {
    const params: Record<string, string> = { q: input.q };
    if (input.cursor) params.cursor = input.cursor;
    if (input.limit) params.limit = String(input.limit);
    return this.client.get<CursorPaginatedResponse<Board>>(
      `/workspaces/${workspacePublicId}/search`,
      params
    );
  }

  async checkSlugAvailable(
    workspaceSlug: string
  ): Promise<{ isAvailable: boolean; isReserved: boolean }> {
    return this.client.get<{ isAvailable: boolean; isReserved: boolean }>(
      `/workspaces/check-slug-availability`,
      { workspaceSlug }
    );
  }

  async getActiveInviteLink(workspacePublicId: string): Promise<InviteLink> {
    return this.client.get<InviteLink>(
      `/workspaces/${workspacePublicId}/invite`
    );
  }

  async createInviteLink(workspacePublicId: string): Promise<InviteLink> {
    return this.client.post<InviteLink>(
      `/workspaces/${workspacePublicId}/invites`
    );
  }

  async deactivateInviteLink(workspacePublicId: string): Promise<void> {
    await this.client.delete<void>(
      `/workspaces/${workspacePublicId}/invites`
    );
  }

  async getInviteInfo(inviteCode: string): Promise<InviteLink> {
    return this.client.get<InviteLink>(`/invites/${inviteCode}`);
  }

  async acceptInvite(inviteCode: string): Promise<Workspace> {
    return this.client.post<Workspace>(`/invites/accept`, { inviteCode });
  }
}
