# PTL Best Tinapa Website 🚀

## Full-Stack E-Commerce with CI/CD Pipeline

**Live Demo:** [Vercel](https://your-project.vercel.app) | [GitHub](https://github.com/Chichan1310/WEBSITE-TINAPA)

### ✨ Features
- 📱 **Responsive Design** - Mobile-first UI
- 🐟 **Products Catalog** - Dynamic API fetching
- 📧 **Contact Form** - Backend processing + logging
- 🔐 **Admin Dashboard** - Full CRUD, upload, pagination/filter (pass: `admin123`)
- ✅ **Automated CI/CD** - Tests + Vercel deploy
- 🎨 **Modern Styling** - Gradients, glassmorphism

### 🛠 Tech Stack
```
Frontend: HTML5/CSS3/Vanilla JS
Backend: Node.js/Express.js
Storage: JSON + Multer uploads
Testing: Jest + Supertest
CI/CD: GitHub Actions → Vercel
Deployment: Serverless (Vercel)
```

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/Chichan1310/WEBSITE-TINAPA.git
cd WEBSITE-TINAPA
npm install

# Development
npm run dev     # nodemon

# Production
npm start       # http://localhost:3000

# Tests
npm test        # Jest (3+ tests pass)
```

## 👨‍💼 Admin Panel
```
URL: http://localhost:3000/admin.html
Password: admin123

Features:
- Add/Edit/Delete products w/ images
- Search + Category filter (fish/meat)
- Pagination (8/page)
- Responsive dashboard
```

## 🔄 CI/CD Pipeline (GitHub Actions)
```
Trigger: Push/PR to main
1. Checkout code
2. npm ci (clean install)
3. npm test (Jest) ← FAIL = BLOCKED
4. vercel --prod (deploy) ← PASS ONLY
```

![Pipeline](https://github.com/Chichan1310/WEBSITE-TINAPA/actions/workflows/ci-cd.yml/badge.svg)

**Secrets Required (GitHub Settings > Secrets):**
| Name | Value | Source |
|------|-------|--------|
| `VERCEL_TOKEN` | `vercel_...` | vercel.com/account/tokens |
| `VERCEL_PROJECT_ID` | `prj_wrFMr5qGYBucTYI7fcXKtzbnhE5O` | Vercel project Settings/General |

## 📚 Project Structure
```
.
├── server.js           # Express API
├── public/             # Static frontend
│   ├── admin.html      # Dashboard
│   ├── css/admin-*.css
│   └── js/admin-dashboard.js
├── data/products.json  # Products + categories
├── tests/server.test.js # Jest API tests
├── .github/workflows/  # CI/CD YAML
└── package.json        # Deps + scripts
```

## 🤝 Collaboration
- Professor: Added as collaborator? Settings > Collaborators
- Push to main → Auto test/deploy
- PRs → Tests before merge

## 🔧 Customization
```
Products: data/products.json
UI: public/*
New Tests: tests/*.test.js → npm test
New Features: server.js routes
Deploy: git push = live
```

## 📈 Tests Coverage
```
npm test
✓ GET /api/products → Array
✓ POST /api/contact → Success
✓ Admin auth fail → 401
```

## 🚀 Production Deploy
1. Vercel GitHub connected
2. Secrets set
3. `git push main` → Live in ~1min

**Billing Note:** GitHub Actions free tier 2k min/month. Check billing if locked.

---

**Built with ❤️ for PTL Best Tinapa | Tests 100% 🚀**
