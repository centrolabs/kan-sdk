// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code: string;
  issues: Array<{ message: string }>;
}

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface CursorPagination {
  cursor?: string;
  limit?: number;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export interface Workspace {
  publicId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  publicId: string;
  userId: string;
  name: string;
  email: string;
  image?: string;
  role: WorkspaceRole;
}

export type WorkspaceRole = "owner" | "admin" | "member";

export interface InviteLink {
  id: number;
  inviteCode: string;
  inviteLink: string;
  isActive: boolean;
  expiresAt?: string;
}

// ─── Board ───────────────────────────────────────────────────────────────────

export interface Board {
  publicId: string;
  name: string;
  slug: string;
  description?: string;
  workspacePublicId: string;
  type: "regular" | "template";
  createdAt: string;
  updatedAt: string;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface KanList {
  publicId: string;
  name: string;
  boardPublicId: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

// Returned by `cards.create()`. The server's create endpoint only echoes the
// new public ID — the full card record is not part of the response.
export interface CardCreated {
  publicId: string;
}

// Returned by `cards.update()`.
export interface CardUpdated {
  publicId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
}

// Returned by `cards.get()`. Full nested detail with related entities loaded
// inline (labels, attachments, checklists w/ items, members, parent list +
// board + workspace context, and the recent activity log).
export interface CardDetail {
  publicId: string;
  title: string;
  description: string | null;
  cardNumber: number | null;
  dueDate: string | null;
  createdBy: string | null;
  labels: Label[];
  attachments: Attachment[];
  checklists: ChecklistWithItems[];
  members: CardMember[];
  list: CardListContext;
  activities: CardActivity[];
}

export interface CardMember {
  publicId: string;
  email: string;
  user: { id: string | null; name: string | null } | null;
}

export interface CardListContext {
  publicId: string;
  name: string;
  board: {
    publicId: string;
    name: string;
    labels: Label[];
    lists: Array<{ publicId: string; name: string }>;
    workspace: {
      publicId: string;
      cardPrefix: string;
      members: WorkspaceMember[];
    };
  };
}

export interface CardActivity {
  publicId: string;
  type: string;
  createdAt: string;
  fromIndex: number | null;
  toIndex: number | null;
  fromTitle: string | null;
  toTitle: string | null;
  fromDescription: string | null;
  toDescription: string | null;
  fromDueDate: string | null;
  toDueDate: string | null;
  fromList: { publicId: string; name: string; index: number } | null;
  toList: { publicId: string; name: string; index: number } | null;
  label: { publicId: string; name: string } | null;
  member: {
    publicId: string;
    user: { name: string | null; email: string } | null;
  } | null;
  user: { name: string | null; email: string } | null;
  comment: {
    publicId: string;
    comment: string;
    createdBy: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  } | null;
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export interface Checklist {
  publicId: string;
  cardPublicId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  publicId: string;
  checklistPublicId: string;
  title: string;
  completed: boolean;
  index: number;
  createdAt: string;
  updatedAt: string;
}

// Shape inlined under `CardDetail.checklists`.
export interface ChecklistWithItems {
  publicId: string;
  name: string;
  index: number;
  items: Array<{
    publicId: string;
    title: string;
    completed: boolean;
    index: number;
  }>;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  publicId: string;
  cardPublicId: string;
  userPublicId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Label ────────────────────────────────────────────────────────────────────

export interface Label {
  publicId: string;
  name: string;
  colourCode?: string;
  workspacePublicId: string;
}

// ─── Attachment ───────────────────────────────────────────────────────────────

export interface AttachmentUploadUrl {
  url: string;
  key: string;
}

export interface Attachment {
  publicId: string;
  cardPublicId: string;
  s3Key: string;
  originalFilename: string | null;
  contentType: string;
  size: number | null;
  url: string | null;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  publicId: string;
  email: string;
  name: string;
  image?: string;
  stripeCustomerId?: string;
  apiKey?: string;
}

// ─── Integrations ─────────────────────────────────────────────────────────────

export interface IntegrationProvider {
  id: string;
  name: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok" | "error";
  database: "ok" | "error";
  storage: "ok" | "error" | "not_configured";
}

// ─── Import ───────────────────────────────────────────────────────────────────

export interface ImportResult {
  boardsCreated: number;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export type WorkspaceSearchResult =
  | {
      type: "board";
      publicId: string;
      title: string;
      description: string | null;
      slug: string;
      createdAt: string;
      updatedAt: string | null;
    }
  | {
      type: "card";
      publicId: string;
      title: string;
      description: string | null;
      boardPublicId: string;
      boardName: string;
      listName: string;
      cardNumber: number | null;
      createdAt: string;
      updatedAt: string | null;
    };
