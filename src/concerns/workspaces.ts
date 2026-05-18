import type {
  Workspace,
  WorkspaceMember,
  InviteLink,
  Board,
  WorkspaceSearchResult,
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

export interface SearchInput {
  query: string;
  limit?: number;
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

  // Server has a single combined search returning boards + cards as a
  // discriminated union (item.type === "board" | "card"). The result is a
  // flat array capped by `limit` (default 20, max 50) — there is no cursor
  // pagination on this endpoint.
  async search(
    workspacePublicId: string,
    input: SearchInput
  ): Promise<WorkspaceSearchResult[]> {
    const params: Record<string, string> = { query: input.query };
    if (input.limit !== undefined) params.limit = String(input.limit);
    return this.client.get<WorkspaceSearchResult[]>(
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
