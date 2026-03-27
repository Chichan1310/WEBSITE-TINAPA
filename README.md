# PTL Best Tinapa Website 🚀

## Full-Stack E-Commerce with CI/CD

**Live Demo:** [Vercel Deploy](https://your-vercel-url.vercel.app)

### Features
- 📱 Responsive modern UI
- 🐟 Products catalog (API-driven)
- 📝 Contact form (backend)
- 🔐 **Admin Dashboard** (CRUD products, password: `admin123`)
- ✅ **CI/CD**: GitHub Actions + Jest tests + Vercel deploy

### Tech Stack
```
Frontend: HTML/CSS/JS
Backend: Node.js/Express
Data: JSON file
Tests: Jest + Supertest
CI/CD: GitHub Actions → Vercel
```

## Quick Start 🏃‍♂️

```bash
npm install
npm start
# http://localhost:3000
```

**Dev:** `npm run dev`

**Test:** `npm test` ✅

## Admin Dashboard
- URL: `/admin.html`
- Password: `admin123`
- Features: Add/Edit/Delete products, image upload, search/filter, pagination

## CI/CD Pipeline 🔄
```
Push/PR main → GitHub Actions:
1. npm ci + npm test (Jest)
2. Tests pass → vercel --prod
3. Fail → Blocked + error report
```

**Secrets:** VERCEL_TOKEN + PROJECT_ID in GitHub

## Development
- Edit `public/` for UI
- `data/products.json` for products
- `tests/` for new tests
- Push → Auto deploy!

## Deployment to Vercel
1. Connect GitHub repo to Vercel
2. Add secrets (above)
3. Push = Live update

Enjoy! 🎣✨
