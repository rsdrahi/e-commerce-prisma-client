ShopSphere — Full-Stack E-Commerce Platform
ShopSphere is a full-stack e-commerce web application built with Next.js, TypeScript, Tailwind CSS, Express.js, Prisma, and PostgreSQL.
The application provides a complete shopping flow for customers and a separate admin dashboard for managing products, categories, users, and orders.

🚀 Live Demo
Frontend: https://first-e-commerce-ten.vercel.app
Backend API: https://prisma-express-ts.vercel.app

✨ Features
👤 Customer Features
* User registration and login
* JWT-based authentication
* Browse all products
* View product details
* Browse products by category
* Featured products on the homepage
* Product images
* Add products to cart
* View and manage cart items
* Proceed to checkout
* Create orders
* View personal order history
* User profile

🛠️ Admin Features
* Admin dashboard
* Manage products (Add, update, and delete products)
* Product image management
* Manage categories
* View registered users
* View customer orders
* Order management
* Customer orders are displayed separately from cart activity

🔐 Authentication & Authorization
The application uses JWT-based authentication.
* Customers can access shopping and order features.
* Admin users can access admin-only routes.
* Protected routes prevent unauthorized access.
* Admin permissions are handled separately from normal users.

🧰 Tech Stack
Frontend
* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router
* Vercel

Backend
* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL (Neon)
* JWT
* bcrypt
* CORS
* dotenv

📁 Project Structure
Frontend
└── first-e-commerce
    ├── src
    │   ├── app
    │   │   ├── admin
    │   │   ├── cart
    │   │   ├── categories
    │   │   ├── login
    │   │   ├── orders
    │   │   ├── products
    │   │   ├── profile
    │   │   └── register
    │   ├── components
    │   ├── hooks
    │   ├── services
    │   └── ...
    ├── public
    ├── .env
    └── package.json

Backend
└── prisma-express-ts
    ├── src
    │   ├── server.ts
    │   ├── routes
    │   ├── controllers
    │   └── ...
    ├── prisma
    │   └── schema.prisma
    ├── .env
    └── package.json

⚙️ Environment Variables
Frontend
Create a .env file:
NEXT_PUBLIC_API_URL=http://localhost:5000

For production:
NEXT_PUBLIC_API_URL=https://prisma-express-ts.vercel.app

Backend
Create a .env file:
DATABASE_URL="your-postgresql-database-url"
PORT=5000
JWT_SECRET="your-jwt-secret"
FRONTEND_URL="your-frontend-url"

Never commit .env files or expose database credentials, JWT secrets, or other private keys.

💻 Run Locally
1. Clone the frontend
git clone <your-frontend-repository-url>
cd first-e-commerce
npm install

2. Start the frontend
npm run dev
Frontend will run at: http://localhost:3000

3. Clone the backend
git clone <your-backend-repository-url>
cd prisma-express-ts
npm install

4. Configure the backend
Add the required environment variables to .env.
Make sure PostgreSQL is available and the database URL is correct.

5. Generate Prisma Client
npx prisma generate

6. Run database migrations
npx prisma migrate deploy

7. Start the backend
npm run dev
Backend will run at: http://localhost:5000

🔄 Application Flow
Customer
   │
   ├── Register / Login
   │
   ├── Browse Products
   │       ├── Featured Products
   │       └── Categories
   │
   ├── Product Details
   │
   ├── Add to Cart
   │
   ├── Proceed to Checkout
   │
   └── View Orders
   │
   ▼
Backend API
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL / Neon

Admin flow:
Admin Login ──► Admin Dashboard ──► Manage Products, Categories, Users & Orders

🛒 Cart & Order System
* Cart activity belongs to the individual customer.
* When a customer adds a product to the cart, the item appears only in that customer's cart. Other customers and admins cannot see private cart activity.
* When the customer proceeds to checkout:
  - An order is created.
  - The customer can see the order in the Orders page.
  - The admin can see the customer's order in the Admin Orders page.

📦 API Overview
The backend provides APIs for Authentication, Products, Categories, Users, Cart, and Orders.
Examples:
* GET /api/products
* GET /api/categories

🌐 Deployment
Backend
* The Express backend is deployed on Vercel.
* Production API: https://prisma-express-ts.vercel.app
* The production database uses PostgreSQL hosted with Neon.

Frontend
* The Next.js frontend is deployed on Vercel.
* Production website: https://first-e-commerce-ten.vercel.app

🔒 Security Notes
* Passwords are hashed using bcrypt.
* Authentication uses JWT.
* Environment variables are used for sensitive configuration.
* Database credentials are not stored in source code.
* Admin-only functionality is protected by authorization checks.
* CORS is configured for frontend/backend communication.

📌 Important
This project is intended as a production-style full-stack e-commerce application and demonstrates:
* Full-stack development
* REST API development
* Database integration
* Authentication and authorization
* CRUD operations
* Cart and order management
* Admin dashboard
* Cloud deployment
* PostgreSQL with Prisma
* Next.js frontend development

👨‍💻 Author
Rasheduzzaman Rahi
Frontend Web Developer | Full-Stack Developer

Portfolio: https://rsdrahi.vercel.app
GitHub: https://github.com/rsdrahi