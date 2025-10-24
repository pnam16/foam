```
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
    B->>B: Check user in database
    alt User exists
        B->>B: UPDATE last_login
    else New user
        B->>B: INSERT new user
    end
    B->>F: Redirect with app JWT token
    F->>F: Save token (localStorage)
    F->>U: User logged in → Join Jitsi meeting
```
