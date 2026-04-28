# 🧪 Phase 1 Testing Guide

## Prerequisites
- ✅ Docker MSSQL running
- ✅ Docker MinIO running  
- ✅ `.env` configured with correct credentials
- ✅ Prisma schema synced with database

---

## ✅ Testing Checklist

### 1️⃣ **Start Dev Server**
```bash
npm run dev
```
Expected: Server starts on http://localhost:3000

---

### 2️⃣ **Setup Admin User**
```
1. Visit http://localhost:3000/setup
2. Click "กดเพื่อสร้าง User niti.admin"
3. Expect: "✅ สร้าง niti.admin (Pass: 123456) สำเร็จ!"
```

---

### 3️⃣ **Test Login Page**
```
1. Visit http://localhost:3000/login
2. Enter:
   - Username: niti.admin
   - Password: 123456
3. Click "เข้าสู่ระบบ"
4. Expect: Redirect to /dashboard
```

---

### 4️⃣ **Test Protected Route**
```
1. Visit http://localhost:3000/dashboard (protected)
2. Expect: Should show contracts dashboard
3. Try visiting WITHOUT login:
   - Open new incognito/private window
   - Visit http://localhost:3000/dashboard
   - Expect: Redirect to /login
```

---

### 5️⃣ **Test API: GET /api/auth/me**
```bash
# From terminal (with active login session):
curl -X GET http://localhost:3000/api/auth/me

Expected Response:
{
  "success": true,
  "data": {
    "id": "1",
    "name": "niti.admin",
    "email": null
  }
}

# Without session:
Expected: 401 Unauthorized
```

---

### 6️⃣ **Test API: POST /api/auth/logout**
```bash
curl -X POST http://localhost:3000/api/auth/logout

Expected Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 7️⃣ **Test Session Persistence**
```
1. Login with niti.admin / 123456
2. Refresh page (F5) - should stay logged in
3. Close browser completely
4. Reopen - should redirect to login
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check MSSQL running: `docker ps` |
| "User not found" on login | Run /setup page to create admin |
| 401 Unauthorized on /api/auth/me | Make sure you're logged in (browser session) |
| Protected route shows 403 | Check NextAuth session configuration |

---

## ✨ Expected Results

After all tests pass:
- ✅ Admin user created
- ✅ Login/Logout works
- ✅ Protected routes redirect unauthenticated users
- ✅ Session persists across page refreshes
- ✅ /api/auth/me returns current user
- ✅ /api/auth/logout clears session

**Then proceed to Phase 2: Contract APIs** 🚀
