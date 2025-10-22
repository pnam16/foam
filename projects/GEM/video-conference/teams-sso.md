Tổng quan 3 bước triển khai SSO

```
+--------------------+
| 1️⃣ Register App   |
| Azure AD App Reg   |
+--------------------+
           |
           v
+---------------------------+
| 2️⃣ Link to Teams App     |
| Update manifest.json      |
| - clientId (Azure AD ID)  |
| - resource (App URI)      |
+---------------------------+
           |
           v
+-----------------------------+
| 3️⃣ Implement Auth Code     |
| In Tab: get access    |
| token from Teams -> AzureAD |
+-----------------------------+
```

Luồng xác thực trong Teams Tab (Web-based flow)

```
+-----------+             +---------------------+             +-------------------+
| User      |   Sign in   | Microsoft Teams App |  Request    | Azure AD Service  |
| (browser) | ----------> | (Custom Tab)        | ----------> | (Identity Server) |
+-----------+             +---------------------+             +-------------------+
       ^                           |                                     |
       |                           |  Token (Access Token)               |
       |                           <-------------------------------------+
       |                           |
       |  Use token to call Graph  |
       +------------------------------------------------------>+
                                                   Microsoft Graph API
```
