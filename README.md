🛍️ DressUp — Full-Stack Streetwear E-Commerce Platform

DressUp is a modern, full-stack e-commerce web application built for a premium streetwear brand.
It features a clean, dark UI, complete admin management, secure authentication, and a scalable backend architecture.

The project is designed to closely resemble real-world production systems used in modern e-commerce platforms.

✨ Features
🧑‍💻 User Features

Browse products by category

View featured products on the home page

Product detail pages with images, pricing, and variants (sizes)

Add products to cart with size & quantity

Persistent cart using localStorage

Secure checkout with authentication

Order placement with shipping details

Order success confirmation

View personal order history

🛠️ Admin Features

Secure admin authentication

Add, update, activate/deactivate products

Upload multiple product images

Manage product variants (size & stock)

Create, update, activate/deactivate categories

Upload category display images

Mark products as featured

View and manage all orders

Soft delete support for categories

🧱 Tech Stack
Frontend

React.js (Vite)

React Router

Tailwind CSS

Axios

LocalStorage (cart & auth persistence)

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Zod (request validation)

Other Tools

Postman (API testing)

Cloudinary / Image Upload Service

Git & GitHub

📁 Project Structure
DressUp/
├── client/                     # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Login/Register
│   │   ├── lib/                # API, auth, cart helpers
│   │   └── App.jsx
│
├── server/                     # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── schemas/                # Zod validation
│   └── server.js
│
└── README.md

🔐 Authentication & Authorization

JWT-based authentication

Tokens stored securely in localStorage

Axios interceptor automatically attaches Authorization header

Role-based access control:

user

admin

Protected admin routes (products, categories, orders)

🧾 Product & Category Model Overview
Product

Title

Slug

Description

Price / Compare-At Price

Category reference

Images (multiple)

Variants (size + stock)

Featured flag

Active flag

Category

Name

Slug

Optional image (display picture)

Active flag

Soft delete support

🖼️ Image Uploads

Supports image uploads for:

Products

Categories

Multiple image uploads supported for products

Images stored via upload service (e.g., Cloudinary)

URLs stored in MongoDB

🛒 Order Flow

User adds items to cart

Cart persists via localStorage

Checkout requires login

Shipping details collected

Order created in database with product snapshots

Cart cleared after successful order

Order success page displayed

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/yourusername/dressup.git
cd dressup

2️⃣ Backend Setup
cd server
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_SECRET=xxxx


Run backend:

npm run dev

3️⃣ Frontend Setup
cd client
npm install
npm run dev

🧪 API Testing

All APIs tested using Postman

Proper status codes and error handling

Input validation via Zod

🎨 UI & Design

Dark, premium streetwear aesthetic

Glassmorphism & gradient accents

Responsive layout (mobile → desktop)

Smooth hover transitions

Modern card-based layout

📈 Future Enhancements

Payment gateway integration (Stripe / Razorpay)

Wishlist functionality

Search & filtering

Product reviews & ratings

Admin dashboard analytics

Email notifications

SSR / SEO optimization

👤 Author

Jawad Bin Hamid
Full-Stack Developer
Passionate about building scalable, production-ready web applications.

📜 License

This project is for learning and portfolio purposes.
You’re free to explore, modify, and improve it.
