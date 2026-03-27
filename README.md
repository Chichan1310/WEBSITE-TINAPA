# PTL Best Tinapa Website 🚀

## Full-Stack E-Commerce with CI/CD Pipeline

**Live Demo:** Update after deploy | [GitHub](https://github.com/Chichan1310/WEBSITE-TINAPA)

### ✨ Features
- 📱 Responsive modern UI with glassmorphism
- 🐟 Dynamic products catalog (API)
- 📧 Contact form (server logging)
- 🔐 **Admin Dashboard** - CRUD, upload, filter/pagination (admin123)
- ✅ **CI/CD Pipeline** - Jest tests + Vercel auto-deploy
- 🎨 Background screens, animations

### 🛠 Tech Stack
```
Frontend: HTML/CSS/JS
Backend: Express.js API
Storage: JSON + file uploads
Testing: Jest + Supertest (3+ tests)
CI/CD: GitHub Actions → Vercel Serverless
```

## 🚀 Local Development

```bash
git clone https://github.com/Chichan1310/WEBSITE-TINAPA.git
cd WEBSITE-TINAPA
npm install
npm start
# Open http://localhost:3000
```

```
Dev: npm run dev (hot reload)
Test: npm test ✅
```

## 👨‍💼 Admin Panel Guide
```
URL: /admin.html
Password: admin123

✅ Add/Edit/Delete products
✅ Image upload (/uploads)
✅ Search + category filter (fish/meat)
✅ Responsive dashboard + sidebar
```

## 🔄 CI/CD - GitHub Actions
```
Trigger: Push/PR → main branch

Job 1: TEST
  - npm ci
  - npm test (fail = blocked)

Job 2: DEPLOY (test pass only)
  - vercel --prod --token $VERCEL_TOKEN
```

**Status Badge:** ![CI](https://github.com/Chichan1310/WEBSITE-TINAPA/workflows/CI/badge.svg) ![CD](https://github.com/Chichan1310/WEBSITE-TINAPA/workflows/CD/badge.svg)

### 🔑 GitHub Secrets Required
| Secret | Value | Get From |
|--------|-------|----------|
| `VERCEL_TOKEN` | `vercel_...` | vercel.com/account/tokens |
| `VERCEL_PROJECT_ID` | `prj_wrFMr5qGYBucTYI7fcXKtzbnhE5O` | Vercel Settings/General |

**Billing Issue:** github.com/settings/billing → Add payment (free tier)

## 📁 Project Structure
```
.
├── server.js - API endpoints
├── public/
│   ├── admin.html - Dashboard
│   ├── css/admin-dashboard.css - Glass UI
│   └── js/admin-dashboard.js - Logic
├── data/products.json - Data (w/ categories)
├── tests/server.test.js - API tests
├── .github/workflows/ci-cd.yml - Pipeline
└── README.md
```

## 🤝 Collaboration (Professor)
1. Repo Settings > Collaborators > Add email
2. Push to main → Auto test/deploy
3. PRs tested before merge

## 🧪 Running Tests
```bash
npm test
# PASS: Products API ✓ Contact ✓ Admin auth ✓
```

## 🚀 Vercel Production
1. Connect GitHub repo (vercel.com)
2. Add secrets above
3. Push main = Live update (~1min)

**Billing Locked?** Make repo public (unlimited minutes) or add card.

## 📈 Next Steps
- Add more tests (`tests/*.test.js`)
- Email integration (nodemailer)
- Database (PlanetScale/Mongo)
- Auth (JWT)

**Built for Academic Excellence | Tests Gate Production! 🎓**

**Chichan1310/WEBSITE-TINAPA** - CI/CD Ready ✨
