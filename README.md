# PTL Best Tinapa in Bulacan - Business Website

Professional business website for PTL Best Tinapa in Bulacan, a Filipino smoked fish brand.

This project includes:
- Customer-facing pages for brand promotion and product ordering
- Admin dashboard for product management
- API-backed product and analytics data
- CI/CD pipeline with automated testing and deployment

## Client Business Overview
PTL Best Tinapa in Bulacan is a local food business focused on premium smoked fish products made through traditional Filipino smoking methods.

### Business Goals
- Promote the brand with a modern and premium website look
- Showcase products with photos, prices, descriptions, and stock
- Allow admin updates without editing source code
- Make customer ordering and contact flow simple

### Target Users
- Local customers searching for quality tinapa
- Returning buyers who want fast ordering
- Business owner/admin managing product listings and stock

## Core Features

### Customer Side
- Premium homepage design with hero, about, gallery, and CTA sections
- Dynamic product listing from API data
- User login gate before checkout
- Payment page with selected product prefill
- Contact form submission API

### Admin Side
- Admin login page
- Modern admin dashboard UI with sidebar navigation
- Product CRUD (add, edit, delete) with image upload
- Product search and stock badges
- Dashboard analytics charts:
  - Sales trend (monthly)
  - Top products by revenue
  - Low stock trend

## Pages
- Home: `public/index.html`
- About: `public/about.html`
- Products: `public/products.html`
- Contact: `public/contact.html`
- Payment: `public/payment.html`
- User Login: `public/user-login.html`
- Admin Entry: `public/admin.html` (redirects to admin login)
- Admin Login: `public/admin-login.html`
- Admin Dashboard: `public/admin-dashboard.html`

## Tech Stack
- Backend: Node.js + Express
- Frontend: HTML, CSS, Vanilla JavaScript
- Testing: Jest + Supertest
- Uploads: Multer
- Storage: JSON files + local uploads folder
- CI/CD: GitHub Actions + Vercel

## Project Structure
- `server.js` - Express server and API routes
- `public/` - Static pages, JS, CSS, images, uploads
- `data/products.json` - Main product data
- `data/products-home.json` - Homepage product API data
- `data/sales.json` - Analytics chart data
- `tests/server.test.js` - API test suite
- `.github/workflows/ci-cd.yml` - CI/CD pipeline

## API Endpoints

### Public
- `GET /api/products` - Returns all products
- `POST /api/contact` - Saves contact form submissions

### Admin Product Management
- `GET /api/admin/products?pass=admin123`
- `POST /api/admin/add-product`
- `POST /api/admin/edit-product`
- `POST /api/admin/delete-product`

### Analytics
- `GET /api/analytics` - Returns chart-ready analytics payload

### Homepage Products API
- `GET /api/home-products`
- `PUT /api/home-products?pass=admin123`

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
npm start
```

3. Open the website

`http://localhost:3000`

### Development Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

## Admin Access (Demo)
- Username: `admin`
- Password: `admin123`

Admin login URL: `/admin-login.html`  
Admin shortcut URL: `/admin.html`

Note: This auth is currently front-end demo auth. For production, move to secure server-side auth with hashed passwords and sessions.

## Product Update Flow
1. Admin logs in
2. Admin adds/edits/deletes product in dashboard
3. Server writes updates to `data/products.json`
4. Changes appear on:
   - Homepage product section
   - Products page

## Gallery Image Update Guide
1. Add images to `public/img`
2. Use consistent names (`gallery1.jpg`, `gallery2.jpg`, etc.)
3. Update image `src` in `public/index.html` if filenames differ

## CI/CD Pipeline
Workflow file: `.github/workflows/ci-cd.yml`

Pipeline behavior:
- On push/PR to `main`: install dependencies and run tests
- On push to `main`: deploy to Vercel only if tests pass

### Required GitHub Secrets
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`

## Web Engineering Requirement Status

### Requirement Checklist
- CI/CD integrated in existing project: Done
- Collaborator added and accepted: Done
- Collaborator can push to main: Done
- Valid updates auto-reflect on deployed website: Done
- Failed tests reject deployment: Done
- Automatic CI feedback on failures (GitHub checks/logs): Done

## Test Coverage
Current automated tests validate:
- Products API response
- Contact API response
- Admin unauthorized access behavior
- Analytics API response

## Recommendations
- Keep uploaded images optimized to improve page speed
- Add data validation around JSON writes to avoid malformed JSON
- Move from JSON files to a database for production scale
- Implement secure backend authentication for admin/user roles

## Maintainer
PTL Best Tinapa Website Project  
Developed for client business presentation, product management, and customer engagement.
