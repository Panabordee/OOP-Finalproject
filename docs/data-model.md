# Data Model Documentation

---

## Overview

This application uses an **in-memory + JSON file persistence** strategy. All data is loaded into memory on startup from `.json` files in the `/data` directory and written back on every mutation.

There are three core entities: **User**, **Post**, and **Comment**, connected through foreign key references.

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    User     │ 1───* │    Post     │ 1───* │    Comment      │
│─────────────│       │─────────────│       │─────────────────│
│ id          │       │ id          │       │ id              │
│ username    │       │ userId (FK) │       │ postId (FK)     │
│ email       │       │ title       │       │ userId (FK)     │
│ createdAt   │       │ content     │       │ content         │
│ createdAt   │       │ status      │       │ createdAt       │
└─────────────┘       │ createdAt   │       └─────────────────┘
                      └─────────────┘
```

- A **User** can write many **Posts**
- A **User** can write many **Comments**
- A **Post** can have many **Comments**

---

## Entities

### User

Represents a registered user of the system.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `number` | ✅ | Auto-incremented, unique | Primary key |
| `username` | `string` | ✅ | Min length: 3, unique | Display name |
| `email` | `string` | ✅ | Valid email format | Contact email |
| `createdAt` | `Date` | ✅ | Set on creation | Timestamp |

**Example record**
```json
{
  "id": 1,
  "username": "alice_smith",
  "email": "alice@example.com",
  "createdAt": "2026-03-08T10:00:00.000Z"
}
```

---

### Post

Represents a post written by a user.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `number` | ✅ | Auto-incremented, unique | Primary key |
| `userId` | `number` | ✅ | Must reference existing `User.id` | Foreign key → User |
| `title` | `string` | ✅ | Min length: 3 | Post title |
| `content` | `string` | ✅ | Min length: 10 | Post body |
| `status` | `PostStatus` | ✅ | Enum: `DRAFT`, `PUBLISHED` | Visibility state, default `DRAFT` |
| `createdAt` | `Date` | ✅ | Set on creation | Timestamp |

**Example record**
```json
{
  "id": 1,
  "userId": 1,
  "title": "My first post",
  "content": "Content of the post goes here",
  "status": "DRAFT",
  "createdAt": "2026-03-08T10:00:00.000Z"
}
```

---

### Comment

Represents a comment left by a user on a post.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `number` | ✅ | Auto-incremented, unique | Primary key |
| `postId` | `number` | ✅ | Must reference existing `Post.id` | Foreign key → Post |
| `userId` | `number` | ✅ | Must reference existing `User.id` | Foreign key → User |
| `content` | `string` | ✅ | Min length: 1 | Comment body |
| `createdAt` | `Date` | ✅ | Set on creation | Timestamp |

**Example record**
```json
{
  "id": 1,
  "postId": 1,
  "userId": 2,
  "content": "Nice post!",
  "createdAt": "2026-03-08T10:00:00.000Z"
}
```

---

## Enums

### PostStatus

| Value | Description |
|-------|-------------|
| `DRAFT` | Post is not publicly visible — default on creation |
| `PUBLISHED` | Post is publicly visible |

---

## Relationships

| Relationship | Type | FK Field | Description |
|--------------|------|----------|-------------|
| User → Post | One-to-Many | `Post.userId` | A user can author many posts |
| User → Comment | One-to-Many | `Comment.userId` | A user can write many comments |
| Post → Comment | One-to-Many | `Comment.postId` | A post can have many comments |

---

## Cascade Behaviour

Deletions propagate through the relationship chain to maintain referential integrity:

| Trigger | Cascades To | Effect |
|---------|-------------|--------|
| Delete **User** | Posts | All posts by that user are deleted |
| Delete **User** | Comments | All comments by that user are deleted |
| Delete **Post** | Comments | All comments on that post are deleted |
| Delete **Comment** | — | No cascade |

---

## Persistence

Data is stored as JSON files in the `/data` directory at the project root.

| Entity | File |
|--------|------|
| User | `data/users.json` |
| Post | `data/posts.json` |
| Comment | `data/comments.json` |

Each file follows this structure:

```json
{
  "items": [ ...array of entity records... ],
  "nextId": 4
}
```

`nextId` tracks the next available auto-increment ID and is persisted so it survives server restarts.

---

## ID Generation

Each service maintains its own `idSeq` counter in memory, initialised from `nextId` in the corresponding JSON file on startup. It increments by 1 with every successful `create` call. IDs are **never reused**, even after deletion.