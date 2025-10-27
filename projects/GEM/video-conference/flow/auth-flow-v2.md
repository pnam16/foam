# Flow đăng nhập SSO với Microsoft Teams

```
1. User click "Login with Teams" trên web
  ↓
2. **Frontend sử dụng MSAL để login**
  - MSAL popup/redirect đến Microsoft
  - User nhập username/password (hoặc auto nếu đã login MS)
  - Microsoft trả về access_token + id_token cho Frontend
  ↓
3. Frontend nhận được tokens từ MSAL
  ↓
4. **Frontend gửi id_token/access_token cho Backend**
  POST /api/auth/verify
  Body: { token: "eyJ0eXAi..." }
  ↓
5. Backend xử lý:
  - Validate token từ Microsoft
  - Extract user info
  - Tạo/update user trong database
  - Generate JWT token của app
  - Return: { appToken: "xxx", user: {...} }
  ↓
6. Frontend lưu appToken vào localStorage
  ↓
7. **Frontend gọi API tạo Jitsi token**
  POST /api/jitsi/token
  Headers: Authorization: Bearer {appToken}
  Body: { roomName: "meeting-123" }
  ↓
8. Backend:
  - Verify appToken
  - Generate Jitsi JWT token
  - Return: { jitsiToken: "xxx", domain: "meet.jit.si" }
  ↓
9. Frontend khởi tạo Jitsi với token
  ↓
10. User join meeting thành công
```

## Detailed Authentication Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant M as Microsoft (Entra ID)
  participant B as Backend

  U->>F: Click "Login with Teams"
  F->>F: MSAL popup/redirect to Microsoft
  F->>M: Request Microsoft Login
  M->>U: User enters credentials (or auto if logged in MS)
  M->>F: Return access_token + id_token
  F->>F: Process tokens from MSAL
  F->>B: POST /api/auth/verify<br/>Body: { token: "eyJ0eXAi..." }
  B->>M: Validate token with Microsoft
  M-->>B: Token validation response
  B->>B: Extract user info from token
  B->>B: Generate app JWT token
  B-->>F: Return { appToken: "xxx", user: {...} }
  F->>F: Store appToken in localStorage
  F-->>U: User logged in successfully
  U->>F: Click "Join Meeting"
  F->>B: POST /api/jitsi/token<br/>Headers: Authorization: Bearer {appToken}<br/>Body: { roomName: "meeting-123" }
  B->>B: Verify appToken
  B->>B: Generate Jitsi JWT token
  B-->>F: Return { jitsiToken: "xxx", domain: "meet.jit.si" }
  F->>F: Initialize Jitsi with token
  F-->>U: User joins meeting successfully
```
