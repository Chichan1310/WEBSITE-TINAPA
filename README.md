# PTL Best Tinapa in Bulacan - Full-Stack Website with CI/CD

## 📱 Live Preview
Update with Vercel URL after deployment

## 🎯 Features
- **Responsive Design** - Works on all devices
- **Products API** - Dynamic catalog from JSON
- **Contact Form** - Backend submission 
- **Admin Dashboard** - Complete CRUD operations
- **Image Upload** - Product photos
- **Search & Filter** - Category-based (Fish/Meat)
- **Pagination** - Professional UI
- **CI/CD Pipeline** - Automated testing & deployment

## 🛠 Technology Stack
- **Backend:** Node.js + Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** JSON database + Multer file uploads
- **Testing:** Jest + Supertest
- **Deployment:** Vercel Serverless
- **CI/CD:** GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- GitHub account
- Vercel account (optional for deploy)

### Installation
```bash
git clone https://github.com/Chichan1310/WEBSITE-TINAPA.git
cd WEBSITE-TINAPA
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000)

### Scripts
```bash
npm run dev    # Development with hot reload
npm test       # Run Jest tests
npm start      # Production server
```

## 🧪 Testing
```bash
npm test
```
**3 Passing Tests:**
- `/api/products` returns array
- `/api/contact` POST success
- `/api/admin/products` auth fail (401)

## 👨‍💼 Admin Dashboard
**Access:** `/admin.html`  
**Password:** `admin123`

**Capabilities:**
- ➕ Add new products with images
- ✏️ Edit existing products
- 🗑️ Delete products
- 🔍 Search products
- 📂 Filter by category (Fish/Meat)
- 📄 Pagination (8 per page)
- 📱 Fully responsive

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow Trigger
Push or Pull Request to `main` branch

### Jobs
1. **Test** - Always runs
   ```
   checkout → npm ci → npm test
   FAIL = Pipeline stops
   ```
2. **Deploy** - Only if tests pass + main branch
   ```
   vercel --prod --token $VERCEL_TOKEN
   ```

### GitHub Secrets Setup
| Name                | Value                          | Source                        |
|---------------------|--------------------------------|-------------------------------|
| VERCEL_TOKEN       | `vercel_xxxxxxxxxxxxxxxxxxx`   | vercel.com/account/tokens     |
| VERCEL_PROJECT_ID  | `prj_wrFMr5qGYBucTYI7fcXKtzbnhE5O` | Vercel project Settings/General |

### Status Badges
![Tests](https://github.com/Chichan1310/WEBSITE-TINAPA/workflows/Test/badge.svg)
![Deploy](https://github.com/Chichan1310/WEBSITE-TINAPA/workflows/Deploy/badge.svg)

## 👥 Collaboration Setup
1. **Professor Access:** Repository Settings → Collaborators → Add collaborator
2. **Contributions:** Push to `main` = automatic test + deploy
3. **Review:** Pull Requests automatically tested

## 📁 File Structure
```
WEBSITE-TINAPA/
├── server.js                 # Express API server
├── public/                   # Frontend static files
│   ├── admin.html            # Admin dashboard
│   ├── css/admin-dashboard.css # Admin styles (glassmorphism)
│   └── js/admin-dashboard.js   # Admin JavaScript
├── data/
│   └── products.json         # Products database
├── tests/
│   └── server.test.js        # API tests
├── .github/workflows/
│   └── ci-cd.yml             # GitHub Actions pipeline
├── package.json              # Dependencies + scripts
└── README.md                 # This file!
```

## ⚙️ Vercel Deployment
1. Import GitHub repo to Vercel Dashboard
2. Add GitHub Secrets (table above)
3. Push to main → Automatic production deployment

## 🔧 Troubleshooting
**Git Push Auth:** Windows Credential Manager → Remove GitHub entries
**Billing Locked:** github.com/settings/billing → Verify payment
**Tests Fail:** Check `npm test` locally first

## 📈 Future Enhancements
- [ ] Database (PostgreSQL/MongoDB)
- [ ] User authentication (JWT)
- [ ] Payment integration
- [ ] More test coverage
- [ ] Docker containerization

---

**Academic Excellence Project | Automated CI/CD | Ready for Production! 🎓✨**

Made with ❤️ by Chichan1310
