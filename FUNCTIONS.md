# Kan.bn SDK API Documentation

## Overview

The SDK is structured around **concerns** (feature modules) that group related API actions. The base URL is `https://kan.bn/api/v1`.

**Initialization:**
```typescript
import { createKan } from "kan-sdk";
const kan = createKan({ apiKey: "kan_xxxxx" });
```

---

## API Reference

Complete list of all endpoints exposed by the API with their implementation status in the SDK.

### Attachments

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/cards/{cardPublicId}/attachments/upload-url` | Generate presigned URL for attachment upload | [`cards.generateUploadUrl()`](#cards.generateuploadurl) |
| POST | `/cards/{cardPublicId}/attachments/confirm` | Confirm attachment upload and save to database | [`cards.confirmAttachment()`](#cards.confirmattachment) |
| DEL | `/cards/{cardPublicId}/attachments/{attachmentPublicId}` | Delete an attachment | [`cards.deleteAttachment()`](#cards.deleteattachment) |

### Boards

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| GET | `/boards` | Get all boards | — |
| POST | `/boards` | Create board | [`boards.create()`](#boards.create) |
| GET | `/boards/{boardPublicId}` | Get board by public ID | [`boards.getByPublicId()`](#boards.getbypublicid) |
| PUT | `/boards/{boardPublicId}` | Update board | [`boards.update()`](#boards.update) |
| DEL | `/boards/{boardPublicId}` | Delete board | [`boards.delete()`](#boards.delete) |
| GET | `/boards/slug/{slug}` | Get board by slug | [`boards.getBySlug()`](#boards.getbyslug) |
| GET | `/boards/{slug}/available` | Check if a board slug is available | [`boards.checkSlugAvailable()`](#boards.checkslugavailable) |

### Cards

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/cards` | Create a card | [`cards.create()`](#cards.create) |
| POST | `/cards/{cardPublicId}/comments` | Add a comment to a card | [`cards.addComment()`](#cards.addcomment) |
| PUT | `/cards/{cardPublicId}/comments/{commentPublicId}` | Update a comment | [`cards.updateComment()`](#cards.updatecomment) |
| DEL | `/cards/{cardPublicId}/comments/{commentPublicId}` | Delete a comment | [`cards.deleteComment()`](#cards.deletecomment) |
| PUT | `/cards/{cardPublicId}/labels` | Add or remove a label from a card | [`cards.addLabel()`](#cards.addlabel), [`cards.removeLabel()`](#cards.removelabel) |
| PUT | `/cards/{cardPublicId}/members` | Add or remove a member from a card | [`cards.addMember()`](#cards.addmember), [`cards.removeMember()`](#cards.removemember) |
| GET | `/cards/{cardPublicId}` | Get a card by public ID | [`cards.get()`](#cards.get) |
| PUT | `/cards/{cardPublicId}` | Update a card | [`cards.update()`](#cards.update) |
| DEL | `/cards/{cardPublicId}` | Delete a card | [`cards.delete()`](#cards.delete) |
| GET | `/cards/{cardPublicId}/activities` | Get paginated card activities | [`cards.getActivities()`](#cards.getactivities) |
| POST | `/cards/{cardPublicId}/checklists` | Add a checklist to a card | [`cards.addChecklist()`](#cards.addchecklist) |
| DEL | `/cards/{cardPublicId}/checklists/{checklistPublicId}` | Delete a checklist | — |
| POST | `/cards/{cardPublicId}/checklists/{checklistPublicId}/items` | Add an item to a checklist | — |
| DEL | `/cards/{cardPublicId}/checklists/{checklistPublicId}/items/{itemPublicId}` | Delete a checklist item | [`cards.deleteChecklistItem()`](#cards.deletechecklistitem) |
| PATCH | `/cards/{cardPublicId}/checklists/{checklistPublicId}/items/{itemPublicId}` | Update a checklist item | [`cards.updateChecklistItem()`](#cards.updatechecklistitem) |

### Health

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| GET | `/health` | Health check | [`health.check()`](#health.check) |
| GET | `/health/stats` | Get statistics | — |

### Labels

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| GET | `/labels/{labelPublicId}` | Get a label by public ID | [`labels.get()`](#labels.get) |
| PUT | `/labels/{labelPublicId}` | Update a label | [`labels.update()`](#labels.update) |
| DEL | `/labels/{labelPublicId}` | Delete a label | [`labels.delete()`](#labels.delete) |
| POST | `/labels` | Create a label | [`labels.create()`](#labels.create) |

### Lists

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/lists` | Create a list | [`lists.create()`](#lists.create) |
| PUT | `/lists/{listPublicId}` | Update a list | — |
| DEL | `/lists/{listPublicId}` | Delete a list | [`lists.delete()`](#lists.delete) |

### Workspaces

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/workspaces` | Create a workspace | [`workspaces.create()`](#workspaces.create) |
| GET | `/workspaces` | Get all workspaces | [`workspaces.list()`](#workspaces.list) |
| GET | `/workspaces/{workspacePublicId}` | Get a workspace by public ID | [`workspaces.getByPublicId()`](#workspaces.getbypublicid) |
| PUT | `/workspaces/{workspacePublicId}` | Update a workspace | [`workspaces.update()`](#workspaces.update) |
| DEL | `/workspaces/{workspacePublicId}` | Delete a workspace | [`workspaces.delete()`](#workspaces.delete) |
| GET | `/workspaces/slug/{slug}` | Get a workspace by slug | [`workspaces.getBySlug()`](#workspaces.getbyslug) |
| GET | `/workspaces/{slug}/available` | Check if a workspace slug is available | [`workspaces.checkSlugAvailable()`](#workspaces.checkslugavailable) |
| GET | `/workspaces/{workspacePublicId}/search/cards` | Search cards in a workspace | [`workspaces.searchCards()`](#workspaces.searchcards) |
| GET | `/workspaces/{workspacePublicId}/search/boards` | Search boards in a workspace | [`workspaces.searchBoards()`](#workspaces.searchboards) |
| POST | `/workspaces/{workspacePublicId}/members/invite` | Invite a member to a workspace | [`workspaces.inviteMember()`](#workspaces.invitemember) |
| DEL | `/workspaces/{workspacePublicId}/members/{memberPublicId}` | Delete a member from a workspace | [`workspaces.removeMember()`](#workspaces.removemember) |
| GET | `/workspaces/{workspacePublicId}/members` | Get all workspace members | [`workspaces.listMembers()`](#workspaces.listmembers) |
| GET | `/workspaces/{workspacePublicId}/boards` | Get all boards in a workspace | [`workspaces.listBoards()`](#workspaces.listboards) |
| GET | `/workspaces/{workspacePublicId}/invite` | Get active invite link for workspace | [`workspaces.getActiveInviteLink()`](#workspaces.getactiveinvitelink) |
| POST | `/workspaces/{workspacePublicId}/invite` | Create invite link for workspace | [`workspaces.createInviteLink()`](#workspaces.createinvitelink) |
| DEL | `/workspaces/{workspacePublicId}/invite` | Deactivate invite link for workspace | [`workspaces.deactivateInviteLink()`](#workspaces.deactivateinvitelink) |
| GET | `/workspaces/{code}/invite` | Get invite information by code | [`workspaces.getInviteInfo()`](#workspaces.getinviteinfo) |
| POST | `/workspaces/{code}/invite/accept` | Accept an invite link | [`workspaces.acceptInvite()`](#workspaces.acceptinvite) |

### Integrations

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/integrations/disconnect` | Disconnect integration | [`integrations.disconnect()`](#integrations.disconnect) |
| GET | `/integrations/trello/boards` | Get boards from Trello | [`integrations.getTrelloBoards()`](#integrations.gettrelloboards) |
| POST | `/integrations/trello/disconnect` | Disconnect Trello integration | [`integrations.disconnectTrello()`](#integrations.disconnecttrello) |

### Imports

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| POST | `/imports/trello/boards` | Import boards from Trello | [`imports.importTrelloBoards()`](#imports.importtrelloboards) |

### Users

| Method | Endpoint | Description | Implementation |
|--------|----------|-------------|----------------|
| GET | `/users/me` | Get user | [`users.me()`](#users.me) |
| PUT | `/users/me` | Update user | [`users.update()`](#users.update) |

---

## 1. Workspaces (`kan.workspaces`) <a name="workspaces"></a>

<a name="workspaces.list"></a>
### `list()`
- **Parameters:** None
- **Return Type:** `Promise<Workspace[]>`
- **Endpoint:** `GET /workspaces`
- **Description:** Lists all workspaces accessible to the authenticated user.

<a name="workspaces.create"></a>
### `create(input)`
- **Parameters:** `CreateWorkspaceInput` (object with `name`, `slug`, optional `description`)
- **Return Type:** `Promise<Workspace>`
- **Endpoint:** `POST /workspaces`
- **Description:** Creates a new workspace.

<a name="workspaces.getbypublicid"></a>
### `getByPublicId(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<Workspace>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}`
- **Description:** Retrieves a workspace by its public ID.

<a name="workspaces.getbyslug"></a>
### `getBySlug(slug)`
- **Parameters:** `slug: string`
- **Return Type:** `Promise<Workspace>`
- **Endpoint:** `GET /workspaces/slug/{slug}`
- **Description:** Retrieves a workspace by its slug.

<a name="workspaces.update"></a>
### `update(workspacePublicId, input)`
- **Parameters:** `workspacePublicId: string`, `UpdateWorkspaceInput` (object with optional `name`, `description`)
- **Return Type:** `Promise<Workspace>`
- **Endpoint:** `PUT /workspaces/{workspacePublicId}`
- **Description:** Updates an existing workspace.

<a name="workspaces.delete"></a>
### `delete(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /workspaces/{workspacePublicId}`
- **Description:** Deletes a workspace.

<a name="workspaces.listmembers"></a>
### `listMembers(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<WorkspaceMember[]>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}/members`
- **Description:** Lists all members of a workspace.

<a name="workspaces.invitemember"></a>
### `inviteMember(workspacePublicId, input)`
- **Parameters:** `workspacePublicId: string`, `InviteMemberInput` (object with `email`)
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /workspaces/{workspacePublicId}/members/invite`
- **Description:** Invites a member to a workspace by email.

<a name="workspaces.removemember"></a>
### `removeMember(workspacePublicId, memberPublicId)`
- **Parameters:** `workspacePublicId: string`, `memberPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /workspaces/{workspacePublicId}/members/{memberPublicId}`
- **Description:** Removes a member from a workspace.

<a name="workspaces.listboards"></a>
### `listBoards(workspacePublicId, params?)`
- **Parameters:** `workspacePublicId: string`, optional `params: { type?: "regular" | "template" }`
- **Return Type:** `Promise<Board[]>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}/boards`
- **Description:** Lists all boards in a workspace.

<a name="workspaces.searchcards"></a>
### `searchCards(workspacePublicId, input)`
- **Parameters:** `workspacePublicId: string`, `SearchBoardsInput` (object with `q`, optional `cursor`, `limit`)
- **Return Type:** `Promise<CursorPaginatedResponse<Card>>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}/search/cards`
- **Description:** Searches for cards within a workspace.

<a name="workspaces.searchboards"></a>
### `searchBoards(workspacePublicId, input)`
- **Parameters:** `workspacePublicId: string`, `SearchBoardsInput` (object with `q`, optional `cursor`, `limit`)
- **Return Type:** `Promise<CursorPaginatedResponse<Board>>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}/search`
- **Description:** Searches for boards within a workspace.

<a name="workspaces.checkslugavailable"></a>
### `checkSlugAvailable(slug)`
- **Parameters:** `slug: string`
- **Return Type:** `Promise<{ available: boolean }>`
- **Endpoint:** `GET /workspaces/slug/{slug}/available`
- **Description:** Checks whether a workspace slug is available.

<a name="workspaces.getactiveinvitelink"></a>
### `getActiveInviteLink(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<InviteLink>`
- **Endpoint:** `GET /workspaces/{workspacePublicId}/invite`
- **Description:** Retrieves the active invite link for a workspace.

<a name="workspaces.createinvitelink"></a>
### `createInviteLink(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<InviteLink>`
- **Endpoint:** `POST /workspaces/{workspacePublicId}/invite`
- **Description:** Creates a new invite link for a workspace.

<a name="workspaces.deactivateinvitelink"></a>
### `deactivateInviteLink(workspacePublicId)`
- **Parameters:** `workspacePublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /workspaces/{workspacePublicId}/invite`
- **Description:** Deactivates the current invite link for a workspace.

<a name="workspaces.getinviteinfo"></a>
### `getInviteInfo(code)`
- **Parameters:** `code: string`
- **Return Type:** `Promise<InviteLink>`
- **Endpoint:** `GET /workspaces/{code}/invite`
- **Description:** Retrieves invite information by its code.

<a name="workspaces.acceptinvite"></a>
### `acceptInvite(code)`
- **Parameters:** `code: string`
- **Return Type:** `Promise<Workspace>`
- **Endpoint:** `POST /workspaces/{code}/invite/accept`
- **Description:** Accepts a workspace invite and joins the workspace.

---

## 2. Boards (`kan.boards`) <a name="boards"></a>

<a name="boards.getbypublicid"></a>
### `getByPublicId(boardPublicId)`
- **Parameters:** `boardPublicId: string`
- **Return Type:** `Promise<Board>`
- **Endpoint:** `GET /boards/{boardPublicId}`
- **Description:** Retrieves a board by its public ID.

<a name="boards.getbyslug"></a>
### `getBySlug(slug)`
- **Parameters:** `slug: string`
- **Return Type:** `Promise<Board>`
- **Endpoint:** `GET /boards/slug/{slug}`
- **Description:** Retrieves a board by its slug.

<a name="boards.create"></a>
### `create(input)`
- **Parameters:** `CreateBoardInput` (object with `name`, `workspacePublicId`, optional `description`, optional `type`)
- **Return Type:** `Promise<Board>`
- **Endpoint:** `POST /boards`
- **Description:** Creates a new board.

<a name="boards.update"></a>
### `update(boardPublicId, input)`
- **Parameters:** `boardPublicId: string`, `UpdateBoardInput` (object with optional `name`, `description`)
- **Return Type:** `Promise<Board>`
- **Endpoint:** `PUT /boards/{boardPublicId}`
- **Description:** Updates an existing board.

<a name="boards.delete"></a>
### `delete(boardPublicId)`
- **Parameters:** `boardPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /boards/{boardPublicId}`
- **Description:** Deletes a board.

<a name="boards.checkslugavailable"></a>
### `checkSlugAvailable(slug)`
- **Parameters:** `slug: string`
- **Return Type:** `Promise<{ available: boolean }>`
- **Endpoint:** `GET /boards/{slug}/available`
- **Description:** Checks whether a board slug is available.

---

## 3. Lists (`kan.lists`) <a name="lists"></a>

<a name="lists.create"></a>
### `create(input)`
- **Parameters:** `CreateListInput` (object with `name`, `boardPublicId`)
- **Return Type:** `Promise<KanList>`
- **Endpoint:** `POST /lists`
- **Description:** Creates a new list on a board.

<a name="lists.delete"></a>
### `delete(listPublicId)`
- **Parameters:** `listPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /lists/{listPublicId}`
- **Description:** Deletes a list.

---

## 4. Cards (`kan.cards`) <a name="cards"></a>

<a name="cards.create"></a>
### `create(input)`
- **Parameters:** `CreateCardInput` (object with `title`, `listPublicId`, optional `description`, `labelPublicIds`, `memberPublicIds`, `position`, `dueDate`)
- **Return Type:** `Promise<Card>`
- **Endpoint:** `POST /cards`
- **Description:** Creates a new card.

<a name="cards.get"></a>
### `get(cardPublicId)`
- **Parameters:** `cardPublicId: string`
- **Return Type:** `Promise<Card>`
- **Endpoint:** `GET /cards/{cardPublicId}`
- **Description:** Retrieves a card by its public ID.

<a name="cards.update"></a>
### `update(cardPublicId, input)`
- **Parameters:** `cardPublicId: string`, `UpdateCardInput` (object with optional `title`, `description`, `listPublicId`, `labelPublicIds`, `memberPublicIds`, `position`, `dueDate`)
- **Return Type:** `Promise<Card>`
- **Endpoint:** `PUT /cards/{cardPublicId}`
- **Description:** Updates an existing card.

<a name="cards.delete"></a>
### `delete(cardPublicId)`
- **Parameters:** `cardPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}`
- **Description:** Deletes a card.

<a name="cards.getactivities"></a>
### `getActivities(input)`
- **Parameters:** `GetCardActivitiesInput` (object with `cardPublicId`, optional `cursor`, `limit`)
- **Return Type:** `Promise<CursorPaginatedResponse<CardActivity>>`
- **Endpoint:** `GET /cards/{cardPublicId}/activities`
- **Description:** Retrieves paginated activities for a card.

#### Comments

<a name="cards.addcomment"></a>
### `addComment(cardPublicId, input)`
- **Parameters:** `cardPublicId: string`, `CreateCommentInput` (object with `content`)
- **Return Type:** `Promise<Comment>`
- **Endpoint:** `POST /cards/{cardPublicId}/comments`
- **Description:** Adds a comment to a card.

<a name="cards.updatecomment"></a>
### `updateComment(commentPublicId, input)`
- **Parameters:** `commentPublicId: string`, `UpdateCommentInput` (object with `content`)
- **Return Type:** `Promise<Comment>`
- **Endpoint:** `PUT /cards/{cardPublicId}/comments/{commentPublicId}`
- **Description:** Updates an existing comment.

<a name="cards.deletecomment"></a>
### `deleteComment(commentPublicId)`
- **Parameters:** `commentPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}/comments/{commentPublicId}`
- **Description:** Deletes a comment.

#### Checklists

<a name="cards.addchecklist"></a>
### `addChecklist(cardPublicId, input)`
- **Parameters:** `cardPublicId: string`, `CreateChecklistInput` (object with `name`)
- **Return Type:** `Promise<Checklist>`
- **Endpoint:** `POST /cards/{cardPublicId}/checklists`
- **Description:** Adds a checklist to a card.

<a name="cards.updatechecklistitem"></a>
### `updateChecklistItem(cardPublicId, checklistPublicId, itemPublicId, input)`
- **Parameters:** `cardPublicId: string`, `checklistPublicId: string`, `itemPublicId: string`, `UpdateChecklistItemInput` (object with optional `text`, `isChecked`)
- **Return Type:** `Promise<ChecklistItem>`
- **Endpoint:** `PATCH /cards/{cardPublicId}/checklists/{checklistPublicId}/items/{itemPublicId}`
- **Description:** Updates a checklist item.

<a name="cards.deletechecklistitem"></a>
### `deleteChecklistItem(cardPublicId, checklistPublicId, itemPublicId)`
- **Parameters:** `cardPublicId: string`, `checklistPublicId: string`, `itemPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}/checklists/{checklistPublicId}/items/{itemPublicId}`
- **Description:** Deletes a checklist item.

#### Members

<a name="cards.addmember"></a>
### `addMember(cardPublicId, memberPublicId)`
- **Parameters:** `cardPublicId: string`, `memberPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /cards/{cardPublicId}/members`
- **Description:** Adds a member to a card.

<a name="cards.removemember"></a>
### `removeMember(cardPublicId, memberPublicId)`
- **Parameters:** `cardPublicId: string`, `memberPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}/members/{memberPublicId}`
- **Description:** Removes a member from a card.

#### Labels

<a name="cards.addlabel"></a>
### `addLabel(cardPublicId, labelPublicId)`
- **Parameters:** `cardPublicId: string`, `labelPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /cards/{cardPublicId}/labels`
- **Description:** Adds a label to a card.

<a name="cards.removelabel"></a>
### `removeLabel(cardPublicId, labelPublicId)`
- **Parameters:** `cardPublicId: string`, `labelPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}/labels/{labelPublicId}`
- **Description:** Removes a label from a card.

#### Attachments

<a name="cards.generateuploadurl"></a>
### `generateUploadUrl(cardPublicId, input)`
- **Parameters:** `cardPublicId: string`, `GenerateUploadUrlInput` (object with `filename`, `contentType`, `size`)
- **Return Type:** `Promise<AttachmentUploadUrl>`
- **Endpoint:** `POST /cards/{cardPublicId}/attachments/upload-url`
- **Description:** Generates a presigned URL for uploading an attachment to S3.

<a name="cards.confirmattachment"></a>
### `confirmAttachment(cardPublicId, input)`
- **Parameters:** `cardPublicId: string`, `ConfirmAttachmentInput` (object with `key`, `filename`, `contentType`, `size`)
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /cards/{cardPublicId}/attachments/confirm`
- **Description:** Confirms an attachment upload and saves it to the database.

<a name="cards.deleteattachment"></a>
### `deleteAttachment(cardPublicId, attachmentPublicId)`
- **Parameters:** `cardPublicId: string`, `attachmentPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /cards/{cardPublicId}/attachments/{attachmentPublicId}`
- **Description:** Deletes an attachment from a card.

---

## 5. Labels (`kan.labels`) <a name="labels"></a>

<a name="labels.create"></a>
### `create(input)`
- **Parameters:** `CreateLabelInput` (object with `name`, `boardPublicId`, optional `colourCode`)
- **Return Type:** `Promise<Label>`
- **Endpoint:** `POST /labels`
- **Description:** Creates a new label.

<a name="labels.get"></a>
### `get(labelPublicId)`
- **Parameters:** `labelPublicId: string`
- **Return Type:** `Promise<Label>`
- **Endpoint:** `GET /labels/{labelPublicId}`
- **Description:** Retrieves a label by its public ID.

<a name="labels.update"></a>
### `update(labelPublicId, input)`
- **Parameters:** `labelPublicId: string`, `UpdateLabelInput` (object with optional `name`, `colourCode`)
- **Return Type:** `Promise<Label>`
- **Endpoint:** `PUT /labels/{labelPublicId}`
- **Description:** Updates an existing label.

<a name="labels.delete"></a>
### `delete(labelPublicId)`
- **Parameters:** `labelPublicId: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `DELETE /labels/{labelPublicId}`
- **Description:** Deletes a label.

---

## 6. Users (`kan.users`) <a name="users"></a>

<a name="users.me"></a>
### `me()`
- **Parameters:** None
- **Return Type:** `Promise<User>`
- **Endpoint:** `GET /users/me`
- **Description:** Retrieves the currently authenticated user.

<a name="users.update"></a>
### `update(input)`
- **Parameters:** `UpdateUserInput` (object with optional `name`, `image`)
- **Return Type:** `Promise<User>`
- **Endpoint:** `PUT /users/me`
- **Description:** Updates the currently authenticated user.

---

## 7. Health (`kan.health`) <a name="health"></a>

<a name="health.check"></a>
### `check()`
- **Parameters:** None
- **Return Type:** `Promise<HealthStatus>`
- **Endpoint:** `GET /health`
- **Description:** Returns the health status of the application and its dependencies.

---

## 8. Integrations (`kan.integrations`) <a name="integrations"></a>

<a name="integrations.gettrelloboards"></a>
### `getTrelloBoards()`
- **Parameters:** None
- **Return Type:** `Promise<TrelloBoard[]>`
- **Endpoint:** `GET /integrations/trello/boards`
- **Description:** Retrieves all boards from Trello.

<a name="integrations.disconnecttrello"></a>
### `disconnectTrello()`
- **Parameters:** None
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /integrations/trello/disconnect`
- **Description:** Disconnects the Trello integration.

<a name="integrations.disconnect"></a>
### `disconnect(provider)`
- **Parameters:** `provider: string`
- **Return Type:** `Promise<void>`
- **Endpoint:** `POST /integrations/disconnect`
- **Description:** Disconnects an integration by provider name.

---

## 9. Imports (`kan.imports`) <a name="imports"></a>

<a name="imports.importtrelloboards"></a>
### `importTrelloBoards(input)`
- **Parameters:** `ImportTrelloBoardsInput` (object with `boardIds`, `workspacePublicId`)
- **Return Type:** `Promise<ImportResult>`
- **Endpoint:** `POST /imports/trello/boards`
- **Description:** Imports boards from Trello into a workspace.

---

## Error Handling

All API methods throw typed errors that extend `KanError`:

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `BadRequestError` | 400 | Invalid request parameters |
| `UnauthorizedError` | 401 | Missing or invalid API key |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `InternalServerError` | 500 | Server error |

All error types are exported from `kan-sdk` and can be caught for specific handling.

---

## Summary Statistics

| Category | API Routes | SDK Methods | Implemented | Missing |
|----------|-----------|-------------|-------------|---------|
| Workspaces | 18 | 18 | 18 | 0 |
| Boards | 7 | 6 | 6 | 1 (`/boards` GET) |
| Lists | 3 | 2 | 2 | 1 (`/lists/{id}` PUT) |
| Cards | 18 | 17 | 17 | 1 (`/cards/{id}/checklists/{id}` DEL) |
| Labels | 4 | 4 | 4 | 0 |
| Users | 2 | 2 | 2 | 0 |
| Health | 2 | 1 | 1 | 1 (`stats`) |
| Integrations | 3 | 3 | 3 | 0 |
| Imports | 1 | 1 | 1 | 0 |
| Attachments | 3 | 3 | 3 | 0 |
| **Total** | **61** | **57** | **57** | **4** |

**SDK Implementation:** 57 of 61 API routes have SDK methods.

**Missing from SDK:**
- `GET /boards` - List all boards
- `PUT /lists/{listPublicId}` - Update a list
- `DEL /cards/{cardPublicId}/checklists/{checklistPublicId}` - Delete a checklist
- `GET /health/stats` - Get statistics
