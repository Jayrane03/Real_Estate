# Database Schema

## Database
MongoDB

## Collections

### 1. users

Stores administrator authentication and user information.

```text
users
├── _id: ObjectId
├── name: String
├── email: String (unique)
├── password: String (hashed)
├── role: String
├── createdAt: Date
└── updatedAt: Date
```

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique user ID |
| `name` | String | Yes | Admin name |
| `email` | String | Yes | Unique login email |
| `password` | String | Yes | Hashed password |
| `role` | String | Yes | User role, e.g. `admin` |
| `createdAt` | Date | Yes | Account creation date |
| `updatedAt` | Date | Yes | Last update date |

---

### 2. content

Stores CMS-managed website sections.

```text
content
├── _id: ObjectId
├── section: String
├── title: String
├── description: String
├── image: String
├── data: Object
├── status: String
├── seo: Object
├── createdAt: Date
└── updatedAt: Date
```

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique content ID |
| `section` | String | Yes | Website section identifier |
| `title` | String | No | Section title |
| `description` | String | No | Section description |
| `image` | String | No | Image URL |
| `data` | Object | No | Additional section-specific data |
| `status` | String | Yes | `draft` / `published` |
| `seo` | Object | No | SEO metadata |
| `createdAt` | Date | Yes | Creation date |
| `updatedAt` | Date | Yes | Last update date |

---

### 3. inquiries

Stores enquiries submitted through the website.

```text
inquiries
├── _id: ObjectId
├── name: String
├── email: String
├── phone: String
├── message: String
├── status: String
├── createdAt: Date
└── updatedAt: Date
```

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Unique inquiry ID |
| `name` | String | Yes | Customer name |
| `email` | String | Yes | Customer email |
| `phone` | String | Yes | Contact number |
| `message` | String | Yes | Inquiry message |
| `status` | String | Yes | Inquiry status |
| `createdAt` | Date | Yes | Submission date |
| `updatedAt` | Date | Yes | Last update date |

---

### 4. activityLogs

Stores administrative activities for auditing.

```text
activityLogs
├── _id: ObjectId
├── userId: ObjectId
├── action: String
├── entity: String
├── entityId: ObjectId
├── details: String
└── createdAt: Date
```

**Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Yes | Log ID |
| `userId` | ObjectId | Yes | Admin who performed the action |
| `action` | String | Yes | Action performed |
| `entity` | String | Yes | Affected resource |
| `entityId` | ObjectId | No | ID of affected resource |
| `details` | String | No | Additional information |
| `createdAt` | Date | Yes | Time of activity |

---

## Relationships

```text
users
  │
  │ 1
  │
  ├──────────────< activityLogs
  │                     │
  │                     └── entityId → affected resource
  │
  │

content
  │
  └── CMS website sections


inquiries
  │
  └── Website enquiry submissions
```

## Authentication

Admin authentication uses JWT.

```text
Admin Login
    ↓
users collection
    ↓
Password verification
    ↓
JWT generated
    ↓
JWT sent to client
    ↓
Protected API requests
```

Passwords are stored as hashed values and are never stored as plain text.

## CMS Publishing

Content records support two states:

```text
draft
published
```

Only published content is displayed on the public website.

## Indexes

Recommended indexes:

```text
users.email → unique index
content.section → index
content.status → index
inquiries.email → index
inquiries.status → index
activityLogs.userId → index
activityLogs.createdAt → index
```