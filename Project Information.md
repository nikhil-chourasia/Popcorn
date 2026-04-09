# 🍿 Popcorn — Project Information

> A watch-together party web app. Stream movies from your Google Drive with friends in a synchronized room.

---

## 🗂 File Structure

```
Popcorn/
├── frontend/                  # Next.js app (v16.2.2, React 19)
│   └── src/app/               # App Router pages & layouts
├── backend/                   # Go proxy server (not yet scaffolded)
├── ledger/
│   ├── logs/                  # Markdown logs per major feature
│   └── info/                  # Markdown explainer files (tutor-style)
└── Project Information.md     # ← this file
```

---

## 🎨 Color Scheme — Popcorn 2

| Name         | Hex       | Role                         |
|--------------|-----------|------------------------------|
| Deep Black   | `#080808` | Primary background           |
| Charcoal     | `#1A1A1A` | Card / surface background    |
| Orange       | `#F06820` | Primary accent / brand color |
| Dark Orange  | `#D95810` | Hover / dim accent           |
| Off-white    | `#F5F6F8` | Primary text                 |
| Slate        | `#8B929C` | Muted / secondary text       |

---

## 🧱 Tech Stack

| Layer       | Technology               | Status        |
|-------------|--------------------------|---------------|
| Frontend    | Next.js 16.2.2 + React 19| Scaffolded    |
| Backend     | Go (proxy server)         | Not started   |
| Real-time   | Socket.IO                 | Not started   |
| Database    | MongoDB (metadata)        | Not started   |
| Cache/Auth  | Redis (OAuth tokens)      | Not started   |
| Auth        | Google OAuth 2.0          | Not started   |
| Storage     | Google Drive API          | Not started   |

---

## 🔄 Core User Flow

1. **Login** — User authenticates via Google OAuth 2.0
2. **Library** — App fetches movie files from the user's Google Drive
3. **Room Creation** — User selects a movie and creates a party room
4. **Join** — Other users join the room via a Socket Junction (Socket.IO)
5. **Stream** — Movie is streamed through a Go proxy server into the socket junction
6. **Watch Together** — Playback is synchronized across all participants

---

## 📦 Frontend Dependencies

| Package          | Version   | Purpose                         |
|------------------|-----------|---------------------------------|
| `next`           | 16.2.2    | React framework (App Router)    |
| `react`          | 19.2.4    | UI library                      |
| `react-dom`      | 19.2.4    | DOM renderer                    |
| `tailwindcss`    | ^4        | Utility CSS (dev dep)           |
| `eslint`         | ^9        | Linting                         |

> **Planned additions:** `socket.io-client`, `framer-motion`, `lucide-react`, ShadCN UI components

---

## 🔗 Reference Links

| Resource                      | URL                                                                         |
|-------------------------------|-----------------------------------------------------------------------------|
| Google OAuth (Go)             | https://pkg.go.dev/golang.org/x/oauth2                                      |
| Google Drive API (Go)         | https://pkg.go.dev/google.golang.org/api/drive/v3                           |
| Gorilla WebSocket             | https://pkg.go.dev/github.com/gorilla/websocket                             |
| Google Drive API Overview     | https://developers.google.com/workspace/drive/api/guides/about-sdk          |
| OAuth 2.0 for Google APIs     | https://developers.google.com/identity/protocols/oauth2                     |
| Next.js Docs                  | https://nextjs.org/docs                                                     |
| ShadCN UI                     | https://ui.shadcn.com/docs                                                  |
| HTTP Range Requests (MDN)     | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests    |
| Lucide Icons                  | https://lucide.dev/guide/react/                                             |
| Framer Motion                 | https://motion.dev/docs/react                                               |

---

## 📋 Rules & Conventions

1. **Project Information.md** — Keep this file updated with all current project info.
2. **Ledger Logs** — Write logs in `ledger/logs/` named after major features (e.g., `auth.md`, `streaming.md`).
3. **Implementation Plan First** — Always draft an implementation plan before building anything.
4. **Teach Before You Build** — Write explainer files in `ledger/info/` before implementing features. Build only on explicit instruction.
5. **Next.js Note** — This project uses Next.js 16.x which may have breaking changes vs. training data. Always check `node_modules/next/dist/docs/` before writing code.

---

## 🗒 Ledger Index

### Logs (`ledger/logs/`)
_No logs yet — will be created as features are built._

### Info / Explainers (`ledger/info/`)
| File                            | Topic                                         |
|---------------------------------|-----------------------------------------------|
| `project-overview.md`           | High-level architecture explainer             |
| `oauth.md`                      | Google OAuth 2.0 — full flow, setup, tokens   |
| `oauth-implementation-guide.md` | Step-by-step code guide for OAuth (Go + Next) |
