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

export interface Card {
  publicId: string;
  title: string;
  description: string | null;
  listPublicId: string;
  boardPublicId: string;
  index: number;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CardActivity {
  publicId: string;
  cardPublicId: string;
  userPublicId: string;
  action: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
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
