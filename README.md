# PTL Best Tinapa Website - CI/CD Complete 🚀

## ✅ Status
**Local Server:** Running `npm start` ✓  
**Tests:** `npm test` PASS ✓  
**CI/CD:** Node.js 24, ready for push ✓  
**Public Repo:** Unlimited Actions ✓

## 🎯 Production Features
- 🔐 Admin dashboard (CRUD + upload + filter)
- 📱 Fully responsive design
- 🐟 API-driven products catalog
- 📧 Contact form API
- 📊 Category filtering (fish/meat)
- 📄 Pagination & search

## 🛠 Stack
```
Backend: Node.js 24 | Express.js
Frontend: HTML | CSS | Vanilla JS
Testing: Jest | Supertest
CI/CD: GitHub Actions → Vercel
Storage: JSON | Multer uploads
```

## 🎬 3-Step Start
```bash
npm install
npm start  
# http://localhost:3000
npm test    # 100% pass
```

## 👨‍💼 Admin (admin123)
`/admin.html` → **Full CRUD:**
- ➕ Add product + image
- ✏️ Edit all fields  
- 🗑️ Delete w/ confirm
- 🔍 Live search/filter
- 📱 Mobile dashboard

## 🔄 CI/CD Workflow (.github/workflows/ci-cd.yml)
```
Push/PR main →
TEST: npm ci + npm test → PASS ONLY ↓
DEPLOY: vercel --prod (Vercel secrets)
```

**Updated:** Node.js 24 (no deprecation warnings)

**Secrets (GitHub Settings > Secrets):**
```
VERCEL_TOKEN      vercel_xxxx (vercel.com/tokens)
VERCEL_PROJECT_ID prj_wrFMr5qGYBucTYI7fcXKtzbnhE5O (Vercel settings)
```

## 🚀 CI/CD Pipeline Update (2026)
- Now uses **Node.js 24** for all GitHub Actions workflows.
- Added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to ensure compatibility and remove Node.js 20 deprecation warnings.
- Vercel deployment uses environment variables for secure token/project ID handling.
- To trigger the pipeline, simply push or open a pull request to `main`.

**No more Node.js deprecation warnings!**

## 📊 Tests (npm test)
```
PASS products API ✓
PASS contact form ✓  
PASS admin auth ✓
```

## 🤝 Professor Workflow
1. Add collaborator (Settings > Manage)
2. Push/PR → Auto test/deploy
3. Live URL updates instantly

## 📁 Structure
```
server.js                 ← API
public/admin.html         ← Dashboard
public/js/admin-dashboard.js ← Logic
data/products.json        ← Data (w/ categories)
tests/server.test.js      ← Tests
.github/workflows/ci-cd.yml ← Pipeline
```

## 🔧 Git Push Fix
**Credential Manager → Remove GitHub → push success**

## 🚀 Deploy Live
```
git push origin main
→ Tests run → Vercel live!
```
test check
**Ready for demo & grading! Push to see magic ✨**

---

## 🛡️ Admin Login Credentials
- **Email:** admin@ptl-tinapa.ph
- **Password:** admin123

Use these credentials to access the admin dashboard at `/admin.html`.
