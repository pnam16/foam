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

## Detailed Authentication Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant M as Microsoft (Entra ID)
  participant B as Backend

  Note over U,F: Step 1: User initiates login
  U->>F: Click "Login with Teams"

  Note over F,M: Step 2: Frontend uses MSAL for login
  F->>F: MSAL popup/redirect to Microsoft
  F->>M: Request Microsoft Login
  M->>U: User enters credentials (or auto if logged in MS)
  M->>F: Return access_token + id_token
  Note over F: MSAL handles token storage

  Note over F: Step 3: Frontend receives tokens from MSAL
  F->>F: Process tokens from MSAL

  Note over F,B: Step 4: Frontend sends tokens to Backend
  F->>B: POST /api/auth/verify
  Note over F,B: Body: { token: "eyJ0eXAi..." }

  Note over B,M: Step 5: Backend processing
  B->>M: Validate token with Microsoft
  M-->>B: Token validation response
  B->>B: Extract user info from token
  B->>B: Create/update user in database
  B->>B: Generate app JWT token
  B-->>F: Return { appToken: "xxx", user: {...} }

  Note over F: Step 6: Frontend stores appToken
  F->>F: Store appToken in localStorage
  F-->>U: User logged in successfully

  Note over U,F: Step 7: User wants to join meeting
  U->>F: Click "Join Meeting"

  Note over F,B: Step 8: Frontend calls API to create Jitsi token
  F->>B: POST /api/jitsi/token
  Note over F,B: Headers: Authorization: Bearer {appToken}<br/>Body: { roomName: "meeting-123" }

  Note over B: Step 9: Backend processing
  B->>B: Verify appToken
  B->>B: Generate Jitsi JWT token
  B-->>F: Return { jitsiToken: "xxx", domain: "meet.jit.si" }

  Note over F: Step 10: Frontend initializes Jitsi
  F->>F: Initialize Jitsi with token

  Note over U,F: Step 11: Success
  F-->>U: User joins meeting successfully
```

### Trường hợp A — FE login bằng MSAL rồi đổi sang jitsi-token

```mermaid
sequenceDiagram
  participant U as User
  participant F as FE
  participant M as Microsoft (Entra ID)
  participant B as BE

  U->>F: Click "Login with Microsoft"
  F->>M: Request Microsoft Login
  M->>F: MS token
  M-->>U: Detect existing session → skip login

  F->>B: POST /api/auth/login
  Note over F,B: Has ms_token at header

  B-->>F: Generated Jitsi JWT (jitsi-token)
  F-->>U: User logged in → Join Jitsi meeting
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
