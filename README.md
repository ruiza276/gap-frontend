# GapInMyResume

A full-stack portfolio/resume web app that lets you document and showcase your career timeline — including the gaps. Visitors can browse timeline entries, search them with AI, and send you contact messages. You manage everything through a REST API.

---

## What It Does

- **Timeline** — create, edit, and display career entries with optional file/image attachments
- **AI Search** — visitors can search the timeline using natural language (powered by Google Gemini, routed server-side)
- **Contact Form** — visitors can leave messages; you can view, mark as read, and delete them
- **File Storage** — images and documents are stored in Azure Blob Storage
- **Database** — all data lives in Azure Cosmos DB (NoSQL)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7 |
| Frontend hosting | Netlify |
| Serverless functions | Netlify Functions (Node.js) |
| Backend API | ASP.NET Core 8 (C#) |
| Backend hosting | Azure App Service |
| Database | Azure Cosmos DB |
| File storage | Azure Blob Storage |
| AI | Google Gemini API (gemini-flash-latest) |
| Tests | xUnit, Moq, FluentAssertions |

---

## Project Structure

```
gapinmyresume-dev/
├── gap-frontend/                   # React app + Netlify Functions  ← you are here
│   ├── public/
│   ├── src/
│   │   ├── components/             # UI components (Header, Footer, Timeline, etc.)
│   │   ├── services/
│   │   │   ├── apiService.js       # All HTTP calls to the backend API
│   │   │   └── apiCache.js         # Client-side cache with TTL
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Helper functions
│   │   └── App.jsx                 # Root component + routing
│   └── netlify/
│       └── functions/
│           └── ai-search.js        # Serverless function — calls Google Gemini server-side
│
└── GapInMyResume.API/              # ASP.NET Core backend (separate repo)
    ├── Controllers/
    │   ├── FilesController.cs      # File upload/download endpoints
    │   ├── MessagesController.cs   # Visitor messages endpoints
    │   └── TimelineController.cs   # Timeline CRUD endpoints
    ├── Services/
    │   ├── BlobStorageService.cs   # Azure Blob Storage wrapper
    │   ├── CosmosDbService.cs      # Azure Cosmos DB wrapper
    │   └── UsageMonitoringService.cs # Free-tier usage tracker
    ├── Models/
    │   ├── TimelineItem.cs
    │   └── VisitorMessage.cs
    ├── Middleware/
    │   └── UsageTrackingMiddleware.cs
    └── Program.cs                  # App startup, DI, middleware pipeline
```

---

## Prerequisites

Before you start, make sure you have these installed:

- [Node.js 18+](https://nodejs.org/) — for the frontend
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) — for the backend
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) — to run the frontend with serverless functions locally
- An **Azure account** with:
  - An Azure Cosmos DB account and database
  - An Azure Blob Storage account with two containers (`images` and `textfiles`)
- A **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com) (no credit card required)

---

## Local Setup

### 1. Clone both repos

```bash
git clone https://github.com/ruiza276/GapInMyResume.API
git clone https://github.com/ruiza276/gap-frontend
```

### 2. Set up backend secrets

The backend needs your Azure connection strings. We use `dotnet user-secrets` so they never end up in a file that could be committed.

```bash
cd GapInMyResume.API

# One-time setup (only needed the first time on a new machine)
dotnet user-secrets init

# Set your Azure secrets
dotnet user-secrets set "BlobStorage:ConnectionString" "your-blob-connection-string-here"
dotnet user-secrets set "CosmosDb:ConnectionString" "your-cosmosdb-connection-string-here"
```

> **Where do I find these?**
> - Blob Storage: Azure Portal → your Storage Account → "Access keys" → copy the full connection string
> - Cosmos DB: Azure Portal → your Cosmos DB account → "Keys" → copy the Primary Connection String

Your secrets are stored in `~/.microsoft/usersecrets/` on your machine — outside the project folder, so they can never be accidentally committed to git.

### 3. Set up frontend environment

In the `gap-frontend/` folder, create a file called `.env.local`:

```
REACT_APP_API_BASE_URL=http://localhost:5156
GEMINI_API_KEY=your-gemini-api-key-here
```

> **Note:** `GEMINI_API_KEY` does NOT have the `REACT_APP_` prefix on purpose — that prefix would cause React to embed the key in the browser bundle where anyone could steal it. Instead, the key is only read by the Netlify Function running on the server.

### 4. Install frontend dependencies

```bash
cd gap-frontend
npm install
```

### 5. Run the backend

```bash
cd GapInMyResume.API
dotnet run
```

The API will be available at `http://localhost:5156`. You can browse the full API docs at `http://localhost:5156/swagger`.

### 6. Run the frontend

Use `netlify dev` instead of `npm start` — this runs both the React app and the serverless AI function together:

```bash
cd gap-frontend
netlify dev
```

The app will open at `http://localhost:8888`.

> **Why not `npm start`?** Running `npm start` alone starts React but not the Netlify Functions. The AI search feature calls `/.netlify/functions/ai-search`, which only exists when you run `netlify dev`.

---

## API Endpoints

Base URL (local): `http://localhost:5156`

### Timeline
| Method | Path | What it does |
|---|---|---|
| GET | `/api/timeline` | Get all timeline items |
| GET | `/api/timeline/{id}` | Get a single item |
| GET | `/api/timeline/date/{date}` | Get items by date |
| POST | `/api/timeline` | Create a new item (supports file upload) |
| PUT | `/api/timeline/{id}` | Update an item |
| DELETE | `/api/timeline/{id}` | Delete an item |

### Messages (visitor contact form)
| Method | Path | What it does |
|---|---|---|
| GET | `/api/messages` | Get all messages |
| POST | `/api/messages` | Submit a new message |
| DELETE | `/api/messages/{id}` | Delete a message |
| PUT | `/api/messages/{id}/mark-read` | Mark a message as read |
| GET | `/api/messages/stats` | Get message statistics |

### Files
| Method | Path | What it does |
|---|---|---|
| POST | `/api/files/upload-image` | Upload an image (max 5MB, jpg/png/gif/webp) |
| POST | `/api/files/upload-text` | Upload a text file (max 2MB, txt/md/json/csv) |
| GET | `/api/files/download/{container}/{filename}` | Download a file |
| GET | `/api/files/info/{container}` | List files in a container |

### Other
| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/swagger` | Interactive API docs (dev only) |

---

## Running Tests

```bash
cd GapInMyResume.API.Tests
dotnet test
```

The test suite includes:
- **Unit tests** for all controllers and services (with mocked dependencies)
- **Integration tests** that spin up the full API in-memory
- **Performance/load tests**

---

## Deployment

### Backend → Azure App Service

The backend is deployed to Azure App Service. The connection strings are set as **Application Settings** in the Azure Portal (not in any file):

1. Azure Portal → App Service → Configuration → Application Settings
2. Add `BlobStorage__ConnectionString` and `CosmosDb__ConnectionString`
   - Note the double underscore `__` — that's how Azure maps flat env vars to nested JSON config

### Frontend → Netlify

1. Connect your `gap-frontend` GitHub repo to Netlify
2. Set the environment variable in Netlify: Site Settings → Environment Variables → add `GEMINI_API_KEY`
3. Netlify auto-deploys on every push to `main`

---

## Secrets — What Goes Where

Never put real keys in files that get committed to git.

| Secret | Local dev | Production |
|---|---|---|
| Azure Blob connection string | `dotnet user-secrets` | Azure App Service → Application Settings |
| Azure Cosmos DB connection string | `dotnet user-secrets` | Azure App Service → Application Settings |
| Gemini API key | `.env.local` (gitignored) | Netlify → Environment Variables |
