# ~ 🤖 WittyBoard

### AI-Powered Collaborative Whiteboard for Ideas, Diagrams & Visual Planning

WittyBoard is a full-stack **AI-powered collaborative whiteboard platform** that helps users transform ideas into visual plans, diagrams, flowcharts, architecture designs, and interactive boards.

Built with **Next.js, React, TypeScript, Excalidraw, Google Gemini, Clerk, PostgreSQL, and Drizzle ORM**, WittyBoard combines an intuitive whiteboard experience with AI-assisted visual generation and powerful workspace management.

---

## ✨ Highlights

* 🎨 Interactive Excalidraw whiteboard
* 🤖 AI-powered diagram generation with Google Gemini
* 📊 Flowchart & architecture diagram generation
* 🖥️ Web & mobile UI mockup generation
* 📝 Sticky notes, glass notes & task cards
* 😀 Emoji & icon library
* 💾 Automatic whiteboard saving
* 🖼️ PNG image export
* 👤 Secure authentication with Clerk
* 📁 Workspace management
* 🗄️ Archive & restore system
* ⏳ Automatic archive deletion after 7 days
* 🔐 Server-side ownership & authorization checks
* 📊 Workspace usage limits
* 🛡️ AI and API request validation
* ⚡ Modern responsive UI

---

## 📸 Preview

> Add screenshots of your application here.

```text
┌─────────────────────────────────────────────────────────────┐
│                         WittyBoard                           │
│                                                             │
│   ┌──────────┐     ┌───────────────────────────────┐       │
│   │ Tools    │     │                               │       │
│   │          │     │       Interactive Board       │       │
│   │ Shapes   │     │                               │       │
│   │ Notes    │     │    ┌─────┐       ┌─────┐     │       │
│   │ Emoji    │     │    │ Idea│ ─────▶│Plan │     │       │
│   │ AI       │     │    └─────┘       └─────┘     │       │
│   │          │     │                               │       │
│   └──────────┘     └───────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Suggested Screenshots

* 🏠 Dashboard
* 🎨 Whiteboard
* 🤖 SmartWitty AI
* 📊 Generated Diagram
* 📝 Notes & Tasks
* 📁 Workspace Management

---

# 🚀 Why WittyBoard?

Traditional whiteboard applications are great for drawing, but turning an idea into a structured diagram still requires manual work.

WittyBoard introduces **SmartWitty**, an AI assistant that converts natural-language descriptions into structured visual content.

For example:

> **"Create a user authentication flow for a MERN application."**

SmartWitty can generate a visual flow containing:

```text
User
  │
  ▼
Login Page
  │
  ▼
Authentication API
  │
  ├──────────────┐
  ▼              ▼
Success        Failure
  │              │
  ▼              ▼
Dashboard      Error
```

The generated elements are added directly to the Excalidraw canvas and remain fully editable.

---

# 🎯 Core Features

## 🎨 1. Interactive Whiteboard

WittyBoard uses **Excalidraw** as its drawing engine.

Users can create and edit:

* ▭ Rectangles
* ◯ Circles
* ◇ Diamonds
* ➜ Arrows
* ─ Lines
* ✏️ Freehand drawings
* 🔤 Text
* 🖼️ Images

All elements remain selectable and editable directly on the canvas.

---

## 🤖 2. SmartWitty AI Assistant

SmartWitty converts natural-language instructions into visual content.

### Supported Generation Modes

| Mode              | Description                           |
| ----------------- | ------------------------------------- |
| 📊 Diagrams       | Generate structured diagrams          |
| 🔄 Flowcharts     | Create process and workflow diagrams  |
| 🏗️ Architecture  | Generate software/system architecture |
| 🖥️ Web Mockups   | Create web interface concepts         |
| 📱 Mobile Mockups | Create mobile UI concepts             |

The AI generates structured Excalidraw-compatible data containing:

* Shapes
* Text
* Arrows
* Connections
* Colors
* Positions
* Layout information

### AI Reliability

The AI response is:

1. Validated
2. Normalized
3. Converted into Excalidraw elements
4. Added to the current scene

If the external AI service becomes unavailable, WittyBoard can use a **local fallback diagram** instead.

---

# 📝 3. Smart Notes

Users can add different types of notes directly to the board.

### Available Notes

* 🟨 Sticky Note
* 🪟 Glass Note
* ✅ Task Card

Notes behave like normal whiteboard elements.

Users can:

* Move them
* Select them
* Edit them
* Save them
* Export them

---

# 😀 4. Emoji & Icons

The Emoji and Icons tool makes boards more expressive and visually engaging.

### Features

* Frequently used emojis
* Smileys & people
* Objects
* Symbols
* Searchable emojis
* Searchable icons

Inserted emojis and icons become editable whiteboard text elements.

---

# 💾 5. Automatic Saving

WittyBoard automatically saves the current whiteboard at regular intervals.

The saved state includes:

```text
Whiteboard Elements
        │
        ├── Shapes
        ├── Text
        ├── Arrows
        └── Images
        │
        ▼
Application State
        │
        ▼
Uploaded Files
        │
        ▼
Viewport Information
```

A manual **Save** action is also available.

Users receive success or error notifications through toast messages.

---

# 🖼️ 6. Export as PNG

Users can export their current board as an image.

The export includes:

* Current canvas elements
* Background color
* Uploaded files
* Images
* Current board content

The resulting file is downloaded as:

```text
whiteboard.png
```

---

# 📁 7. Workspace Management

Users can create and manage multiple workspaces.

### Workspace Operations

* ➕ Create workspace
* 👀 View workspace
* 🚪 Open workspace
* 📦 Archive workspace
* ♻️ Restore workspace
* 🗑️ Permanently delete expired workspace

Each workspace displays relevant information such as:

* Workspace name
* Creation date
* Current state
* Usage information

---

# 🗄️ 8. Archive System

WittyBoard implements a **soft-delete archive system**.

When a workspace is archived:

```text
Active Workspace
       │
       ▼
   Archived
       │
       ├──── Restore
       │
       └──── 7 Days
               │
               ▼
        Permanent Delete
```

### After Archiving

* The workspace disappears from the active list.
* Its data remains available temporarily.
* The workspace becomes read-only.
* Editing is blocked.
* A seven-day deletion deadline is assigned.

If the workspace is not restored within seven days:

* Project data is permanently deleted.
* Whiteboard data is permanently deleted.
* Workspace credits are recalculated.

---

# 📊 9. Workspace Limits

Each user can create a maximum of:

```text
10 Workspaces
```

The limit includes both:

* Active workspaces
* Archived workspaces

The dashboard displays:

```text
Workspace Usage

████████░░  8 / 10

Remaining Credits: 2
```

Existing users are automatically synchronized with the workspace credit system.

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Next.js      │
                         │    App Router    │
                         └────────┬─────────┘
                                  │
                  ┌───────────────┼────────────────┐
                  │               │                │
                  ▼               ▼                ▼
            ┌──────────┐    ┌───────────┐    ┌──────────┐
            │  Clerk   │    │ Excalidraw │    │  Gemini  │
            │   Auth   │    │ Whiteboard │    │   AI     │
            └──────────┘    └───────────┘    └──────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    API Routes    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Drizzle ORM    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         │      Neon        │
                         └──────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| **Next.js**      | Application framework |
| **React**        | UI development        |
| **TypeScript**   | Type safety           |
| **Tailwind CSS** | Styling               |
| **shadcn/ui**    | UI components         |
| **Lucide React** | Icons                 |

## Whiteboard & AI

| Technology        | Purpose                |
| ----------------- | ---------------------- |
| **Excalidraw**    | Interactive whiteboard |
| **Google Gemini** | AI diagram generation  |

## Backend & Database

| Technology                 | Purpose           |
| -------------------------- | ----------------- |
| **Next.js Route Handlers** | Backend API       |
| **PostgreSQL**             | Primary database  |
| **Neon**                   | Hosted PostgreSQL |
| **Drizzle ORM**            | Database access   |

## Authentication

| Technology | Purpose                          |
| ---------- | -------------------------------- |
| **Clerk**  | Authentication & user management |

---

# 🗃️ Database Schema

## Users

Stores local application user information.

```text
Users
├── id
├── name
├── email
├── credits
└── createdAt
```

The `credits` field represents the user's remaining workspace capacity.

Maximum workspace allowance:

```text
10
```

---

## Projects

Stores workspace metadata.

```text
Projects
├── id
├── projectId
├── projectName
├── userEmail
├── createdAt
├── archivedAt
└── deleteAt
```

### Important Fields

**`archivedAt`**

Indicates when a workspace was archived.

**`deleteAt`**

Stores the permanent deletion deadline.

---

## Whiteboard Data

Stores the latest saved canvas snapshot.

```text
WhiteboardData
├── id
├── projectId
├── elements
├── appState
├── files
└── updatedAt
```

Excalidraw scene data is stored using flexible JSON/JSONB structures because the scene contains nested and dynamic data.

---

# 📂 Project Structure

A simplified project structure:

```text
wittyboard/
│
├── app/
│   ├── api/
│   │   ├── ai/
│   │   ├── cron/
│   │   ├── projects/
│   │   ├── users/
│   │   └── whiteboard/
│   │
│   ├── dashboard/
│   ├── sign-in/
│   ├── sign-up/
│   └── workspace/
│
├── components/
│   ├── ui/
│   ├── whiteboard/
│   ├── notes/
│   └── ai/
│
├── db/
│   ├── schema/
│   └── index.ts
│
├── lib/
│   ├── auth/
│   ├── ai/
│   ├── database/
│   └── utils/
│
├── public/
│
├── drizzle.config.ts
├── middleware.ts
├── package.json
└── README.md
```

---

# 🔌 API Architecture

## AI API

```http
POST /api/ai
```

### Responsibilities

* Authenticate request
* Validate user input
* Generate diagram
* Retry temporary AI failures
* Use fallback templates
* Return structured Excalidraw elements

---

## Projects API

```http
GET    /api/projects
POST   /api/projects
PATCH  /api/projects
DELETE /api/projects
```

### Responsibilities

* List active workspaces
* List archived workspaces
* Create workspaces
* Archive workspaces
* Restore workspaces
* Enforce workspace limits
* Remove expired archives

---

## Users API

```http
POST /api/users
```

### Responsibilities

* Synchronize Clerk users
* Create missing local users
* Recalculate workspace credits
* Return current quota information

---

## Whiteboard API

```http
GET  /api/whiteboard
POST /api/whiteboard
```

### Responsibilities

* Load saved whiteboard
* Save canvas changes
* Validate payload size
* Verify project ownership
* Prevent archived workspace modifications

---

## Archive Cleanup API

```http
GET /api/cron/archive-cleanup
```

### Responsibilities

* Find expired archived workspaces
* Delete whiteboard data
* Delete expired projects
* Recalculate workspace credits

The endpoint is protected using:

```env
CRON_SECRET
```

---

# 🔄 Whiteboard Data Flow

## Loading a Workspace

```text
Workspace Page
      │
      ▼
Initialize Excalidraw
      │
      ▼
GET /api/whiteboard
      │
      ▼
Authenticate User
      │
      ▼
Verify Ownership
      │
      ▼
Fetch Saved Data
      │
      ▼
Restore Excalidraw Scene
      │
      ▼
Enable Hydration
      │
      ▼
Start Autosave
```

The hydration mechanism prevents the initial empty Excalidraw scene from accidentally overwriting existing saved content.

---

# 💾 Saving Flow

```text
User Changes Canvas
        │
        ▼
Update Local State
        │
        ▼
Autosave Timer
        │
        ▼
Collect Excalidraw Scene
        │
        ▼
POST /api/whiteboard
        │
        ▼
Authenticate
        │
        ▼
Verify Ownership
        │
        ▼
Database Upsert
        │
        ▼
Success / Error Toast
```

---

# 🖼️ Export Flow

```text
User Clicks Export
        │
        ▼
Read Current Scene
        │
        ▼
Excalidraw PNG Export
        │
        ▼
Generate Blob
        │
        ▼
Create Object URL
        │
        ▼
Download
        │
        ▼
whiteboard.png
        │
        ▼
Release Object URL
```

---

# 🔐 Security

WittyBoard uses multiple layers of security.

### Authentication

* Clerk authentication
* Protected application routes
* Server-side authentication checks

### Authorization

* Project ownership verification
* Server-side project filtering
* Archived workspace write protection
* API-level access control

### Request Validation

* AI prompt size limits
* Whiteboard payload size limits
* Server-side workspace validation
* API request validation

### Infrastructure

* Protected cron endpoint
* Environment-based secrets
* Database-level ownership filtering

> The application never trusts a project ID supplied by the browser without verifying ownership on the server.

---

# 🌱 Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_postgresql_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_primary_gemini_model
GEMINI_FALLBACK_MODELS=optional_fallback_models

CRON_SECRET=your_archive_cleanup_secret
```

⚠️ **Never commit real secrets to GitHub.**

Add your environment file to `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/wittyboard.git
```

```bash
cd wittyboard
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env.local
```

and add the required environment variables.

---

## 4. Configure Database

Push the database schema:

```bash
npm run db:push
```

Generate Drizzle migrations:

```bash
npm run db:generate
```

---

## 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Development Commands

| Command               | Description                 |
| --------------------- | --------------------------- |
| `npm install`         | Install dependencies        |
| `npm run dev`         | Start development server    |
| `npm run build`       | Create production build     |
| `npm run db:push`     | Push database schema        |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:studio`   | Open Drizzle Studio         |

---

# 🚀 Deployment

Before deploying WittyBoard:

### Environment

* [ ] Configure production Clerk keys
* [ ] Configure PostgreSQL connection
* [ ] Configure Gemini API key
* [ ] Configure `CRON_SECRET`

### Authentication

* [ ] Configure Clerk redirect URLs
* [ ] Test sign-in
* [ ] Test sign-up
* [ ] Test protected routes

### Workspace System

* [ ] Test workspace creation
* [ ] Test 10-workspace limit
* [ ] Test archive
* [ ] Test restore
* [ ] Test automatic deletion

### Application

* [ ] Test whiteboard loading
* [ ] Test autosave
* [ ] Test manual save
* [ ] Test PNG export
* [ ] Test AI generation
* [ ] Test fallback AI behavior

### Production

```bash
npm run build
```

Make sure the production build succeeds before deployment.

---

# ⚠️ Error Handling

WittyBoard handles errors using:

* HTTP status codes
* Toast notifications
* Loading indicators
* Empty states
* Loading skeletons
* Authentication guards
* AI fallback diagrams
* Archived workspace redirects
* API error responses

### Common HTTP Status Codes

| Status | Meaning                         |
| ------ | ------------------------------- |
| `200`  | Request succeeded               |
| `400`  | Invalid request                 |
| `401`  | Authentication required         |
| `403`  | Access denied / workspace limit |
| `404`  | Resource not found              |
| `409`  | Resource state conflict         |
| `413`  | Payload too large               |
| `500`  | Internal server error           |
| `503`  | External AI service unavailable |

---

# 🔮 Future Improvements

Potential improvements planned for WittyBoard:

* 🔑 Replace email-based ownership with immutable Clerk user IDs
* 🔒 Transactional workspace limit enforcement
* 👥 Real-time collaboration
* 🔗 Workspace sharing
* 👤 Role-based permissions
* 📝 Persistent SmartDoc editor
* 🧪 Automated API tests
* 🎭 End-to-end testing
* 🚦 AI request rate limiting
* ⚡ Database indexing
* 🕐 Whiteboard revision history
* 🖼️ Automatic workspace thumbnails
* 🔔 Collaboration notifications
* 💬 Comments and mentions

---

# 🧠 Key Engineering Concepts

WittyBoard demonstrates practical implementation of:

```text
Next.js App Router
        +
React Client Components
        +
TypeScript
        +
REST APIs
        +
Authentication
        +
Authorization
        +
PostgreSQL
        +
Drizzle ORM
        +
Excalidraw
        +
Generative AI
        +
Autosave
        +
Soft Delete
        +
Background Cleanup
```

The project focuses not only on UI development but also on **authentication, authorization, database persistence, API design, state management, error handling, AI integration, and production-oriented architecture**.

---

# 🤝 Contributing

Contributions are welcome!

### Fork the repository

```bash
git fork https://github.com/YOUR_USERNAME/wittyboard
```

### Create a branch

```bash
git checkout -b feature/amazing-feature
```

### Commit your changes

```bash
git commit -m "feat: add amazing feature"
```

### Push your branch

```bash
git push origin feature/amazing-feature
```

Then open a Pull Request.

---

# 📄 License

This project is available under the license specified in the repository.

---

# 👨‍💻 Author

**shivam_gupta951**

Built with ❤️ using:

**Next.js • React • TypeScript • Excalidraw • Google Gemini • Clerk • PostgreSQL • Drizzle ORM • Tailwind CSS**

---

## ⭐ Support

If you find WittyBoard useful, consider giving the repository a ⭐ on GitHub.

It helps the project grow and motivates further development.

---

<div align="center">

### 🧠 Turn Ideas Into Visuals With WittyBoard

**Draw • Think • Generate • Organize • Collaborate**

⭐ Star the repository if you like the project!

</div>
