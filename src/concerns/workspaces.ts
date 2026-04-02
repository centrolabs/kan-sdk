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
  slug: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

export interface InviteMemberInput {
  email: string;
}

export interface SearchBoardsInput extends CursorPagination {
  q: string;
}

export class WorkspacesConcern {
  constructor(private client: KanClient) {}

  /**
   * Lists all workspaces accessible to the authenticated user.
   */
  async list(): Promise<Workspace[]> {
    return this.client.get<Workspace[]>("/workspaces");
  }

  /**
   * Creates a new workspace.
   * @param input - The workspace creation input
   */
  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    return this.client.post<Workspace>("/workspaces", input);
  }

  /**
   * Retrieves a workspace by its public ID.
   * @param workspacePublicId - The public ID of the workspace
   */
  async getByPublicId(workspacePublicId: string): Promise<Workspace> {
    return this.client.get<Workspace>(`/workspaces/${workspacePublicId}`);
  }

  /**
   * Retrieves a workspace by its slug.
   * @param slug - The slug of the workspace
   */
  async getBySlug(slug: string): Promise<Workspace> {
    return this.client.get<Workspace>(`/workspaces/slug/${slug}`);
  }

  /**
   * Updates an existing workspace.
   * @param workspacePublicId - The public ID of the workspace to update
   * @param input - The fields to update
   */
  async update(
    workspacePublicId: string,
    input: UpdateWorkspaceInput
  ): Promise<Workspace> {
    return this.client.patch<Workspace>(
      `/workspaces/${workspacePublicId}`,
      input
    );
  }

  /**
   * Deletes a workspace.
   * @param workspacePublicId - The public ID of the workspace to delete
   */
  async delete(workspacePublicId: string): Promise<void> {
    await this.client.delete<void>(`/workspaces/${workspacePublicId}`);
  }

  /**
   * Lists all members of a workspace.
   * @param workspacePublicId - The public ID of the workspace
   */
  async listMembers(workspacePublicId: string): Promise<WorkspaceMember[]> {
    return this.client.get<WorkspaceMember[]>(
      `/workspaces/${workspacePublicId}/members`
    );
  }

  /**
   * Invites a member to a workspace by email.
   * @param workspacePublicId - The public ID of the workspace
   * @param input - The invite input containing the email address
   */
  async inviteMember(
    workspacePublicId: string,
    input: InviteMemberInput
  ): Promise<void> {
    await this.client.post<void>(
      `/workspaces/${workspacePublicId}/members/invite`,
      input
    );
  }

  /**
   * Removes a member from a workspace.
   * @param workspacePublicId - The public ID of the workspace
   * @param memberPublicId - The public ID of the member to remove
   */
  async removeMember(
    workspacePublicId: string,
    memberPublicId: string
  ): Promise<void> {
    await this.client.delete<void>(
      `/workspaces/${workspacePublicId}/members/${memberPublicId}`
    );
  }

  /**
   * Lists all boards in a workspace.
   * @param workspacePublicId - The public ID of the workspace
   * @param params - Optional filter (e.g., by board type)
   */
  async listBoards(
    workspacePublicId: string,
    params?: { type?: "regular" | "template" }
  ): Promise<Board[]> {
    return this.client.get<Board[]>(
      `/workspaces/${workspacePublicId}/boards`,
      params?.type ? { type: params.type } : undefined
    );
  }

  /**
   * Searches for cards within a workspace.
   * @param workspacePublicId - The public ID of the workspace
   * @param input - The search query and optional pagination
   */
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

  /**
   * Searches for boards within a workspace.
   * @param workspacePublicId - The public ID of the workspace
   * @param input - The search query and optional pagination
   */
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

  /**
   * Checks whether a workspace slug is available.
   * @param slug - The slug to check
   */
  async checkSlugAvailable(slug: string): Promise<{ available: boolean }> {
    return this.client.get<{ available: boolean }>(
      `/workspaces/slug/${slug}/available`
    );
  }

  /**
   * Retrieves the active invite link for a workspace.
   * @param workspacePublicId - The public ID of the workspace
   */
  async getActiveInviteLink(workspacePublicId: string): Promise<InviteLink> {
    return this.client.get<InviteLink>(
      `/workspaces/${workspacePublicId}/invite`
    );
  }

  /**
   * Creates a new invite link for a workspace.
   * @param workspacePublicId - The public ID of the workspace
   */
  async createInviteLink(workspacePublicId: string): Promise<InviteLink> {
    return this.client.post<InviteLink>(
      `/workspaces/${workspacePublicId}/invite`
    );
  }

  /**
   * Deactivates the current invite link for a workspace.
   * @param workspacePublicId - The public ID of the workspace
   */
  async deactivateInviteLink(workspacePublicId: string): Promise<void> {
    await this.client.delete<void>(
      `/workspaces/${workspacePublicId}/invite`
    );
  }

  /**
   * Retrieves invite information by its code.
   * @param code - The invite code
   */
  async getInviteInfo(code: string): Promise<InviteLink> {
    return this.client.get<InviteLink>(`/workspaces/${code}/invite`);
  }

  /**
   * Accepts a workspace invite and joins the workspace.
   * @param code - The invite code
   */
  async acceptInvite(code: string): Promise<Workspace> {
    return this.client.post<Workspace>(`/workspaces/${code}/invite/accept`);
  }
}
