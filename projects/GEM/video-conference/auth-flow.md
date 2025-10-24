# Flow đăng nhập SSO với Microsoft Teams

## Flow chung

```
┌────────────────────────────┐
│ User open web application  │
└─────────────┬──────────────┘
              │
              ▼
┌──────────────────────────────┐
│ Check localStorage for token │
└─────────────┬────────────────┘
              │
       ┌──────┴──────────┐
       │                 │
       ▼                 ▼
┌──────────────┐   ┌───────────────────────────┐
│ No token     │   │ Token exists               │
│ → Redirect   │   │ Verify with /api/auth/me   │
│ to Login     │   │ Authorization: Bearer JWT  │
└──────────────┘   └──────────────┬────────────┘
                                  │
               ┌──────────────────┴──────────────────┐
               │                                     │
               ▼                                     ▼
   ┌───────────────────────┐            ┌─────────────────────┐
   │ Token valid           │            │ Token expired       │
   │ → User logged in      │            │ → Clear storage     │
   │ → Join meeting        │            │ → Redirect login    │
   └───────────────────────┘            └─────────────────────┘
```

### Trường hợp 1: User chưa đăng nhập app (Login with Teams)

```mermaid
sequenceDiagram
  participant U as 👤 User
  participant F as 🌐 Frontend
  participant B as 🖥️ Backend
  participant M as ☁️ Microsoft Login (Entra ID)

  U->>F: Click "Login with Teams"
  F->>B: GET /api/auth/login
  B-->>U: Redirect → login.microsoftonline.com
  U->>M: Request Microsoft Login
  M-->>U: Detect existing session → skip login
  M-->>B: Redirect /api/auth/callback?code=xxx&state=yyy
  B->>M: Exchange code → access_token, id_token
  B->>B: Handle logic
  B->>F: Redirect with app JWT token
  F->>F: Save token (localStorage)
  F->>U: User logged in → Join Jitsi meeting
```

### Trường hợp 2: User đã có JWT hợp lệ

```mermaid
sequenceDiagram
  participant U as 👤 User
  participant F as 🌐 Frontend
  participant B as 🖥️ Backend

  U->>F: Access web app
  F->>F: Check localStorage for token
  alt Token exists
      F->>B: GET /api/auth/me (Authorization: Bearer token)
      alt Token valid
          B-->>F: Return user info ✅
          F->>U: User logged in → Join Jitsi meeting
      else Token expired
          B-->>F: 401 Unauthorized ❌
          F->>F: Clear token → redirect login
      end
  else No token
      F->>U: Redirect to login page
  end
```
