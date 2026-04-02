# kan-sdk

Unofficial SDK for [kan.bn](https://kan.bn), a project management and kanban API.

## Installation

```bash
npm install kan-sdk
# or
bun add kan-sdk
```

## Bootstrapping

1. **Get an API key** from your kan.bn dashboard (Settings → API Keys).

2. **Initialize the client:**

```typescript
import { createKan } from "kan-sdk";

const kan = createKan({ apiKey: "kan_xxxxx" });
```

3. **Make your first request:**

```typescript
// List your workspaces
const workspaces = await kan.workspaces.list();

// Get the authenticated user
const me = await kan.users.me();

// Check API health
const health = await kan.health.check();
```

### Self-Hosted / Custom Base URL

The API can be pointed at a self-hosted instance:

```typescript
const kan = createKan({
  apiKey: "kan_xxxxx",
  baseUrl: "https://your-self-hosted-kan.example.com/api/v1",
});
```

## SDK Structure

The SDK is organized into **concerns** (feature modules), each exposing a set of related methods:

| Concern | Description |
|---------|-------------|
| `kan.workspaces` | Workspace CRUD, members, invites, search |
| `kan.boards` | Board CRUD |
| `kan.lists` | List CRUD |
| `kan.cards` | Card CRUD, comments, checklists, labels, attachments |
| `kan.labels` | Label CRUD |
| `kan.users` | Current user profile |
| `kan.health` | API health check |
| `kan.integrations` | Trello integration |
| `kan.imports` | Import from Trello |

## Quick Examples

### Workspaces and Boards

```typescript
// Create a workspace
const workspace = await kan.workspaces.create({
  name: "My Workspace",
  slug: "my-workspace",
});

// Create a board
const board = await kan.boards.create({
  name: "Sprint Board",
  workspacePublicId: workspace.publicId,
});
```

### Cards and Lists

```typescript
// Create a list
const list = await kan.lists.create({
  name: "To Do",
  boardPublicId: board.publicId,
});

// Create a card
const card = await kan.cards.create({
  title: "Implement auth",
  listPublicId: list.publicId,
  description: "Add JWT-based authentication",
  dueDate: "2026-04-15",
});

// Add a comment
await kan.cards.addComment(card.publicId, { content: "Working on this!" });

// Add a checklist
const checklist = await kan.cards.addChecklist(card.publicId, { name: "Tasks" });
```

### Search

```typescript
// Search cards within a workspace
const cards = await kan.workspaces.searchCards(workspace.publicId, {
  q: "authentication",
  limit: 10,
});

// Search boards
const boards = await kan.workspaces.searchBoards(workspace.publicId, {
  q: "sprint",
});
```

## Full API Reference

All 57 SDK methods are documented in [FUNCTIONS.md](./FUNCTIONS.md), including complete parameter and return types, endpoint paths, and example usage for every method.

## Error Handling

All errors are typed and extend `KanError`. Catch specific error types for targeted handling:

```typescript
import {
  createKan,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "kan-sdk";

const kan = createKan({ apiKey: "kan_xxxxx" });

try {
  const card = await kan.cards.get("invalid-id");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Card not found");
  } else if (error instanceof UnauthorizedError) {
    console.log("Invalid API key");
  } else if (error instanceof BadRequestError) {
    console.log("Bad request:", error.message);
  } else {
    throw error;
  }
}
```

| Error Type | Status Code |
|------------|-------------|
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `InternalServerError` | 500 |

## TypeScript

This SDK is written in TypeScript and ships with full type definitions. No `@types/*` needed. It also ships CJS and ESM builds.

## License

MIT
