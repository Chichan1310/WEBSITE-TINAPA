# PTL Best Tinapa in Bulacan - Business Website

Professional business website for PTL Best Tinapa in Bulacan, a Filipino smoked fish brand.  
This project includes a customer-facing site, a protected admin workflow for product management, and an API-backed product catalog.

## Client Business Overview
PTL Best Tinapa in Bulacan is a local food business focused on premium smoked fish products made using traditional Filipino smoking methods.

### Business Goals
- Promote the brand online with a modern, premium visual identity.
- Showcase available products with images, prices, and descriptions.
- Let admins manage product listings without editing code.
- Provide an easy way for customers to contact and order.

### Target Users
- Local customers looking for quality tinapa.
- Returning buyers who want quick ordering.
- Business owner/admin managing inventory and product updates.

## Website Features

### Customer Side
- Modern homepage with hero, about, gallery, and call-to-action sections.
- Dynamic product listing powered by API data.
- User login flow before checkout.
- Order and payment page with selected product prefill.
- Contact form submission endpoint.

### Admin Side
- Admin login page.
- Admin dashboard for product CRUD:
	- Add product with image upload
	- Edit product details
	- Delete product
- Stock indicator and low-stock warning display.

## Pages
- Home: index.html
- About: about.html
- Products: products.html
- Contact: contact.html
- Payment: payment.html
- User Login: user-login.html
- Admin Entry: admin.html (redirects to admin-login.html)
- Admin Login: admin-login.html
- Admin Dashboard: admin-dashboard.html

## Technology Stack
- Backend: Node.js, Express
- Frontend: HTML, CSS, Vanilla JavaScript
- Testing: Jest, Supertest
- File Uploads: Multer
- Storage: JSON files and local uploads directory
- CI/CD: GitHub Actions with Vercel deployment

## Project Structure
- server.js - Express server and API routes
- public - Static frontend files (pages, CSS, JS, images, uploads)
- data/products.json - Main product data used by API
- data/products-home.json - Additional homepage product data endpoint
- tests/server.test.js - API tests
- .github/workflows/ci-cd.yml - CI/CD pipeline

## API Endpoints

### Public
- GET /api/products
	- Returns all products from data/products.json
- POST /api/contact
	- Accepts name, email, message and appends to contacts.txt

### Admin
- GET /api/admin/products?pass=admin123
	- Returns products if pass is valid
- POST /api/admin/add-product
	- Adds new product (multipart form with image)
- POST /api/admin/edit-product
	- Updates existing product
- POST /api/admin/delete-product
	- Deletes product by id

### Homepage Products API
- GET /api/home-products
- PUT /api/home-products?pass=admin123

## Local Setup

1. Install dependencies

	 npm install

2. Start server

	 npm start

3. Open browser

	 http://localhost:3000

### Development mode

npm run dev

### Run tests

npm test

## Admin Access (Current Demo Credentials)
- Username: admin
- Password: admin123

Admin login page: /admin-login.html  
Admin shortcut: /admin.html

Important: Credentials are currently hardcoded for demo/school project usage.  
For production, move auth to secure backend sessions and hashed passwords.

## Product Management Flow
1. Admin logs in.
2. Admin adds, edits, or deletes products in dashboard.
3. Changes are saved to data/products.json.
4. Updated products appear on both:
	 - Homepage products section
	 - Products page catalog

## Gallery Image Management
To add gallery images:
1. Place image files in public/img.
2. Use consistent names such as gallery1.jpg, gallery2.jpg, etc.
3. Update image references in index.html gallery section if filenames differ.

## CI/CD
The workflow runs from .github/workflows/ci-cd.yml:
- On push and pull request to main:
	- Install dependencies
	- Run tests
- On push to main:
	- Deploy to Vercel

### Required GitHub Secrets
- VERCEL_TOKEN
- VERCEL_PROJECT_ID

## Testing Coverage
Current tests cover:
- Products API response
- Contact form API response
- Unauthorized admin products access

## Notes and Recommendations
- Uploaded product images are stored in public/uploads.
- Keep product image sizes optimized for faster loading.
- Consider adding backend authentication and role-based access for production.
- Consider moving from JSON file storage to a database for scale.

## Maintainer
PTL Best Tinapa Website Project  
Developed for client business presentation, product management, and customer engagement.
