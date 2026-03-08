# API Specification

**Base URL:** `http://localhost:3000`  
**Swagger:** `http://localhost:3000/api`  
**Format:** JSON  
**Version:** 1.0.0

---

## Response Format

All endpoints return a unified response envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": { }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | `true` on success, `false` on error |
| `message` | string | Human-readable status message |
| `data` | object / array / null | The response payload |

---

## Error Format

```json
{
  "statusCode": 404,
  "message": "User with id 5 not found",
  "error": "Not Found"
}
```

---

## Enums

### UserRole
| Value | Description |
|-------|-------------|
| `USER` | Standard user (default) |
| `ADMIN` | Administrator |

### PostStatus
| Value | Description |
|-------|-------------|
| `DRAFT` | Post is not yet published (default) |
| `PUBLISHED` | Post is publicly visible |

---

## Users

### GET /users
Get all users.

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "username": "alice_smith",
      "email": "alice@example.com",
      "role": "USER",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### GET /users/:id
Get a single user by ID.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | User ID |

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 1,
    "username": "alice_smith",
    "email": "alice@example.com",
    "role": "USER",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`**
```json
{
  "statusCode": 404,
  "message": "User with id 5 not found",
  "error": "Not Found"
}
```

---

### POST /users
Create a new user.

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | ✅ | Min length: 3, must be unique |
| `email` | string | ✅ | Valid email format |
| `role` | `UserRole` | ❌ | Default: `USER` |

```json
{
  "username": "alice_smith",
  "email": "alice@example.com",
  "role": "USER"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": 1,
    "username": "alice_smith",
    "email": "alice@example.com",
    "role": "USER",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `409`** — Username already taken
```json
{
  "statusCode": 409,
  "message": "Username already exists",
  "error": "Conflict"
}
```

---

### PUT /users/:id
Update an existing user. All fields are optional.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | User ID |

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | ❌ | Min length: 3 |
| `email` | string | ❌ | Valid email format |
| `role` | `UserRole` | ❌ | `USER` or `ADMIN` |

```json
{
  "email": "newemail@example.com"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Updated",
  "data": {
    "id": 1,
    "username": "alice_smith",
    "email": "newemail@example.com",
    "role": "USER",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — User not found

---

### DELETE /users/:id
Delete a user and cascade-delete all their posts and comments.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | User ID |

**Response `200`**
```json
{
  "success": true,
  "message": "Deleted",
  "data": {
    "id": 1,
    "username": "alice_smith",
    "email": "alice@example.com",
    "role": "USER",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — User not found

---

## Posts

### GET /posts
Get all posts.

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "My first post",
      "content": "Content of the post",
      "status": "DRAFT",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### GET /posts/:id
Get a single post by ID.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Post ID |

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My first post",
    "content": "Content of the post",
    "status": "DRAFT",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Post not found

---

### GET /posts/user/:userId
Get all posts written by a specific user.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `userId` | number | User ID |

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "My first post",
      "content": "Content of the post",
      "status": "PUBLISHED",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### POST /posts
Create a new post.

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `userId` | number | ✅ | Must reference an existing user |
| `title` | string | ✅ | Min length: 3 |
| `content` | string | ✅ | Min length: 10 |
| `status` | `PostStatus` | ❌ | Default: `DRAFT` |

```json
{
  "userId": 1,
  "title": "My first post",
  "content": "Content of the post goes here",
  "status": "DRAFT"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My first post",
    "content": "Content of the post goes here",
    "status": "DRAFT",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — User not found

---

### PUT /posts/:id
Update an existing post. All fields are optional.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Post ID |

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `userId` | number | ❌ | Must reference an existing user |
| `title` | string | ❌ | Min length: 3 |
| `content` | string | ❌ | Min length: 10 |
| `status` | `PostStatus` | ❌ | `DRAFT` or `PUBLISHED` |

```json
{
  "status": "PUBLISHED"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Updated",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My first post",
    "content": "Content of the post goes here",
    "status": "PUBLISHED",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Post not found

---

### DELETE /posts/:id
Delete a post and cascade-delete all its comments.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Post ID |

**Response `200`**
```json
{
  "success": true,
  "message": "Deleted",
  "data": {
    "id": 1,
    "userId": 1,
    "title": "My first post",
    "content": "Content of the post goes here",
    "status": "PUBLISHED",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Post not found

---

## Comments

### GET /comments
Get all comments, optionally filtered by post.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `postId` | number | ❌ | Filter comments by post ID |

**Example:** `GET /comments?postId=1`

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "userId": 1,
      "content": "Nice post!",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### GET /comments/:id
Get a single comment by ID.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Comment ID |

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "Nice post!",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Comment not found

---

### GET /comments/user/:userId
Get all comments made by a specific user.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `userId` | number | User ID |

**Response `200`**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "userId": 2,
      "content": "Nice post!",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### POST /comments
Create a new comment.

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `postId` | number | ✅ | Must reference an existing post |
| `userId` | number | ✅ | Must reference an existing user |
| `content` | string | ✅ | Min length: 1 |

```json
{
  "postId": 1,
  "userId": 1,
  "content": "Nice post!"
}
```

**Response `201`**
```json
{
  "success": true,
  "message": "Created",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "Nice post!",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Post or User not found

---

### PUT /comments/:id
Update an existing comment. All fields are optional.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Comment ID |

**Request Body**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `postId` | number | ❌ | Must reference an existing post |
| `userId` | number | ❌ | Must reference an existing user |
| `content` | string | ❌ | Min length: 1 |

```json
{
  "content": "Updated comment text"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Updated",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "Updated comment text",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Comment not found

---

### DELETE /comments/:id
Delete a comment by ID.

**Path Parameters**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Comment ID |

**Response `200`**
```json
{
  "success": true,
  "message": "Deleted",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "Nice post!",
    "createdAt": "2026-03-08T10:00:00.000Z"
  }
}
```

**Response `404`** — Comment not found

---

## Cascade Behaviour

| Action | Cascade Effect |
|--------|----------------|
| `DELETE /users/:id` | Deletes all posts and comments by that user |
| `DELETE /posts/:id` | Deletes all comments on that post |
| `DELETE /comments/:id` | No cascade |

---

## HTTP Status Code Summary

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded |
| `201` | Created — resource successfully created |
| `400` | Bad Request — validation failed |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — duplicate unique field (e.g. username) |
| `500` | Internal Server Error |
