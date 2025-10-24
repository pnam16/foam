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

### Trường hợp A — FE login bằng MSAL rồi đổi sang jitsi-token

```mermaid
sequenceDiagram
  participant U as User
  participant F as FE
  participant M as Microsoft (Entra ID)
  participant B as BE
  participant DB as Database

  U->>F: Click "Login with Microsoft"
  F->>M: MSAL login (PKCE) → /authorize

  F->>B: POST /api/auth/exchange
  Note over F,B: Body: { id_token, access_token? }<br/>Hoặc Header: Authorization: Bearer {id_token}

  B->>B: Verify id_token (signature, iss, aud, exp, tid)
  alt access_token được gửi kèm
      B->>M: (optional) OBO exchange / token introspection<br/>hoặc call Graph để verify
  end
  B->>DB: Upsert user (by oid/objectId or preferred_username)
  DB-->>B: OK
  B->>B: Generate app JWT (jitsi-token)
  B-->>F: 200 { appToken, userInfo }
  F->>F: Save appToken (localStorage) + giữ MSAL cache
  F-->>U: Đăng nhập xong → Join Jitsi meeting
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
