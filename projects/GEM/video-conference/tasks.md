# Các Task Backend cần làm để triển khai MS Teams SSO cho Web App (không phải Teams App)

## Kiến trúc Flow

```
User truy cập Web → Click "Login with Teams" → Microsoft Login →
Backend xác thực → Generate session/JWT → User join Jitsi meeting
```

## TASK 1: Setup Azure AD Application

### 1.1 Đăng ký App trên Azure Portal

- Truy cập Azure Portal → Azure Active Directory → App registrations
- Tạo "New registration"
- Chọn account type: "Accounts in any organizational directory"
- Lưu lại:
  - **Application (client) ID**
  - **Directory (tenant) ID**

### 1.2 Tạo Client Secret

- Vào "Certificates & secrets"
- Tạo "New client secret"
- Lưu lại **Client Secret Value** (chỉ hiện 1 lần)

### 1.3 Cấu hình Redirect URIs

- Vào "Authentication"
- Thêm "Platform" → "Web"
- Add Redirect URIs:
  - `https://yourdomain.com/api/auth/callback` - `http://localhost:3000/api/auth/callback` (dev)
- Enable "ID tokens" và "Access tokens"

### 1.4 Cấu hình API Permissions

- Vào "API permissions"
- Add Microsoft Graph permissions (Delegated):
  - `User.Read`
  - `email`
  - `openid`
  - `profile`
- Click "Grant admin consent"

## TASK 2: Xây dựng Authentication Flow

### 2.1 Endpoint: Initiate Login

```
GET /api/auth/login
```

**Chức năng:**

- Generate state token (CSRF protection)
- Lưu state vào session/cache (Redis)
- Redirect user đến Microsoft login URL

**Response:**

```
Redirect 302 to:
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
  client_id={client_id}
  &response_type=code
  &redirect_uri={redirect_uri}
  &response_mode=query
  &scope=openid%20profile%20email%20User.Read
  &state={random_state}
```

### 2.2 Endpoint: Handle Callback

```
GET /api/auth/callback?code={code}&state={state}
```

**Chức năng:**

- Verify state token (CSRF check)
- Exchange authorization code for tokens
- Validate ID token
- Extract user info
- Create/update user in database
- Generate internal JWT/session
- Redirect to frontend với token

**Logic:**

```javascript
1. Verify state matches
2. POST to Microsoft token endpoint
3. Validate ID token signature & claims
4. Extract user info (oid, email, name)
5. Upsert user to database
6. Generate app JWT token
7. Redirect: https://yourdomain.com/auth/success?token={jwt}
```

### 2.3 Endpoint: Get User Info

```
GET /api/auth/me
Headers: Authorization: Bearer {jwt_token}
```

**Response:**

```json
{
  "id": "uuid",
  "azureOid": "xxx",
  "email": "user@company.com",
  "displayName": "John Doe",
  "avatar": "url"
}
```

### 2.4 Endpoint: Logout

```
POST /api/auth/logout
Headers: Authorization: Bearer {jwt_token}
```

**Chức năng:**

- Invalidate JWT token (blacklist)
- Clear session
- Optional: Redirect to Microsoft logout

## TASK 3: Token Exchange & Validation

### 3.1 Exchange Authorization Code for Tokens

```
POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

client_id={client_id}
&scope=openid profile email User.Read
&code={authorization_code}
&redirect_uri={redirect_uri}
&grant_type=authorization_code
&client_secret={client_secret}
```

**Response từ Microsoft:**

```json
{
  "token_type": "Bearer",
  "scope": "User.Read profile openid email",
  "expires_in": 3599,
  "access_token": "eyJ0eXAi...",
  "id_token": "eyJ0eXAi...",
  "refresh_token": "0.AXEA..."
}
```

### 3.2 Validate ID Token

- Decode JWT token
- Verify signature với Microsoft public keys
- Validate claims:
  - `iss`: `https://login.microsoftonline.com/{tenant}/v2.0`
  - `aud`: phải match với client_id
  - `exp`: token chưa hết hạn
  - `iat`: issued time hợp lý
  - `nonce`: nếu có

### 3.3 Fetch Microsoft Public Keys (JWKS)

```
GET https://login.microsoftonline.com/common/discovery/v2.0/keys
```

**Cache keys:**

- TTL: 24 hours
- Refresh khi gặp unknown kid
- Store trong Redis/Memory

### 3.4 Extract User Info từ ID Token

```javascript
{
  "oid": "00000000-0000-0000-0000-000000000000", // Unique user ID
  "email": "user@company.com",
  "name": "John Doe",
  "preferred_username": "user@company.com",
  "tid": "tenant-id"
}
```

## TASK 4: User Management

### 4.1 Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  azure_oid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  tenant_id VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_azure_oid ON users(azure_oid);
CREATE INDEX idx_users_email ON users(email);
```

### 4.2 Upsert User Logic

```javascript
async function upsertUser(tokenClaims) {
  const user = await db.query(
    `INSERT INTO users (azure_oid, email, display_name, tenant_id, last_login)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (azure_oid)
     DO UPDATE SET
       email = $2,
       display_name = $3,
       last_login = NOW(),
       updated_at = NOW()
     RETURNING *`,
    [tokenClaims.oid, tokenClaims.email, tokenClaims.name, tokenClaims.tid],
  );
  return user;
}
```

## TASK 5: Generate Internal JWT Token

### 5.1 Create JWT for Application

```javascript
const jwt = require("jsonwebtoken");

function generateAppToken(user) {
  const payload = {
    userId: user.id,
    azureOid: user.azure_oid,
    email: user.email,
    displayName: user.display_name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
}
```

### 5.2 Verify JWT Middleware

```javascript
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({error: "No token provided"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({error: "Invalid token"});
  }
}
```

## TASK 6: Jitsi Integration

### 6.1 Generate Jitsi JWT Token

```
POST /api/jitsi/token
Headers: Authorization: Bearer {app_jwt}
Body: {
  "roomName": "meeting-123",
  "moderator": false
}
```

**Logic:**

```javascript
async function generateJitsiToken(req, res) {
  // req.user đã được verify từ middleware
  const {roomName, moderator = false} = req.body;

  const jitsiPayload = {
    context: {
      user: {
        id: req.user.azureOid,
        name: req.user.displayName,
        email: req.user.email,
        avatar: req.user.avatar || "",
      },
    },
    aud: "jitsi",
    iss: process.env.JITSI_APP_ID,
    sub: process.env.JITSI_DOMAIN,
    room: roomName,
    moderator: moderator,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hours
  };

  const jitsiToken = jwt.sign(jitsiPayload, process.env.JITSI_SECRET, {
    algorithm: "HS256",
  });

  return res.json({
    token: jitsiToken,
    roomName: roomName,
    domain: process.env.JITSI_DOMAIN,
    userInfo: {
      displayName: req.user.displayName,
      email: req.user.email,
    },
  });
}
```

### 6.2 Verify User Before Join Meeting

```
GET /api/jitsi/rooms/:roomName/verify
Headers: Authorization: Bearer {app_jwt}
```

**Logic:**

- Verify JWT token valid
- Check user có quyền join room không
- Return room info

## TASK 7: Security Implementation

### 7.1 Environment Variables

```bash
# Azure AD
AZURE_TENANT_ID=common  # hoặc specific tenant ID
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx
AZURE_REDIRECT_URI=https://yourdomain.com/api/auth/callback

# JWT
JWT_SECRET=your-strong-secret-key

# Jitsi
JITSI_DOMAIN=meet.jit.si
JITSI_APP_ID=your-app-id
JITSI_SECRET=your-jitsi-secret

# Session
SESSION_SECRET=your-session-secret
REDIS_URL=redis://localhost:6379

# App
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### 7.2 CORS Configuration

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### 7.3 Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many authentication attempts",
});

app.use("/api/auth/", authLimiter);
```

### 7.4 HTTPS Only

```javascript
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });
}
```

### 7.5 State Token Management (CSRF Protection)

```javascript
const crypto = require("crypto");

function generateState() {
  return crypto.randomBytes(32).toString("hex");
}

// Store state trong Redis với TTL
async function storeState(state) {
  await redis.setex(`auth_state:${state}`, 600, "1"); // 10 minutes
}

// Verify state
async function verifyState(state) {
  const exists = await redis.get(`auth_state:${state}`);
  if (exists) {
    await redis.del(`auth_state:${state}`);
    return true;
  }
  return false;
}
```

## TASK 8: Error Handling

### 8.1 Auth Errors

```javascript
class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

// Error types
const AUTH_ERRORS = {
  INVALID_STATE: {code: "INVALID_STATE", message: "Invalid state parameter"},
  TOKEN_EXCHANGE_FAILED: {
    code: "TOKEN_EXCHANGE_FAILED",
    message: "Failed to exchange token",
  },
  INVALID_TOKEN: {code: "INVALID_TOKEN", message: "Invalid token"},
  TOKEN_EXPIRED: {code: "TOKEN_EXPIRED", message: "Token expired"},
  USER_NOT_FOUND: {code: "USER_NOT_FOUND", message: "User not found"},
};
```

### 8.2 Error Handler Middleware

```javascript
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "AuthError") {
    return res.status(401).json({
      error: err.code,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "Invalid token",
    });
  }

  return res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "Internal server error",
  });
});
```

## TASK 9: Logging & Monitoring

### 9.1 Audit Logging

```javascript
async function logAuthEvent(event, userId, metadata) {
  await db.query(
    `INSERT INTO auth_logs (event_type, user_id, ip_address, user_agent, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [event, userId, metadata.ip, metadata.userAgent, JSON.stringify(metadata)],
  );
}

// Log events
logAuthEvent("LOGIN_SUCCESS", user.id, {
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});
logAuthEvent("LOGIN_FAILED", null, {reason: "Invalid token", ip: req.ip});
logAuthEvent("JITSI_TOKEN_GENERATED", user.id, {roomName: "meeting-123"});
```

### 9.2 Monitoring Metrics

```javascript
// Track metrics
const metrics = {
  loginAttempts: 0,
  loginSuccess: 0,
  loginFailures: 0,
  jitsiTokensGenerated: 0,
};

// Expose metrics endpoint
app.get("/api/metrics", (req, res) => {
  res.json(metrics);
});
```

## TASK 10: Testing

### 10.1 Unit Tests

- Test JWT token generation
- Test token validation
- Test user upsert logic
- Test state generation/verification

### 10.2 Integration Tests

- Test full OAuth flow với Azure AD
- Test callback handling
- Test Jitsi token generation
- Test error scenarios

## TASK 11: Deployment

### 11.1 Docker Setup

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 11.2 Database Migration

```sql
-- Migration script
CREATE TABLE IF NOT EXISTS users (...);
CREATE TABLE IF NOT EXISTS auth_logs (...);
CREATE INDEX IF NOT EXISTS idx_users_azure_oid ON users(azure_oid);
```

---

## Tóm tắt Tech Stack

**Required:**

- Node.js/Python/Java (backend framework)
- JWT library (jsonwebtoken, PyJWT, etc.)
- HTTP client (axios, fetch, requests)
- Database (PostgreSQL/MySQL)
- Redis (cho state management & caching)

**Libraries (Node.js):**

```json
{
  "express": "^4.18.0",
  "jsonwebtoken": "^9.0.0",
  "axios": "^1.4.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express-rate-limit": "^6.7.0",
  "pg": "^8.11.0",
  "redis": "^4.6.0",
  "crypto": "built-in"
}
```

Đây là toàn bộ tasks backend cần làm. Bạn cần làm rõ thêm phần nào không?
