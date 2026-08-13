# E-Commerce Product Catalog & Order Management System

A full-stack e-commerce application built with Java, Spring Boot, and React. Users can browse
products, manage a cart, and place orders. Admins can manage the product catalog and update
order status.

## Tech stack

- **Backend:** Java 17, Spring Boot, Spring Data JPA (Hibernate), Spring Security, JWT, MySQL, Maven
- **Frontend:** React.js, React Router, Axios, Vite

## Features

- User registration and login (JWT authentication)
- Role-based access: CUSTOMER and ADMIN
- Product catalog with search and category filtering
- Cart management (add, update quantity, remove)
- Order placement — converts cart into an order and reduces product stock
- Order history for customers
- Admin dashboard: add/delete products, view all orders, update order status

## Project structure

\```
ecommerce-springboot-react/
├── backend/     Spring Boot REST API
└── frontend/    React single-page application
\```

## Getting started

### Backend

1. Create a MySQL database (or let it auto-create — see `application.properties`).
2. Update `backend/src/main/resources/application.properties` with your MySQL username,
   password, and a long random JWT secret.
3. From `backend/`, run:
   \```
   mvn spring-boot:run
   \```
4. API runs on `http://localhost:8080`.

### Frontend

1. From `frontend/`, install dependencies:
   \```
   npm install
   \```
2. Start the dev server:
   \```
   npm run dev
   \```
3. App runs on `http://localhost:5173`.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/products` | List products (supports `search`, `categoryId`) |
| GET | `/api/products/{id}` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/{id}` | Update product (admin) |
| DELETE | `/api/products/{id}` | Delete product (admin) |
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/{itemId}` | Update item quantity |
| DELETE | `/api/cart/{itemId}` | Remove item from cart |
| POST | `/api/orders` | Place order from cart |
| GET | `/api/orders` | Current user's order history |
| GET | `/api/admin/orders` | All orders (admin) |
| PATCH | `/api/admin/orders/{id}/status` | Update order status (admin) |

## Notes

- First user to register is a CUSTOMER by default; promote to ADMIN directly in the database
  (`UPDATE users SET role='ADMIN' WHERE email='you@example.com';`) to access the admin dashboard.
- This is a learning/portfolio project — before deploying publicly, replace the JWT secret,
  add rate limiting, and validate all admin-only routes server-side (already scaffolded via
  Spring Security's `hasRole("ADMIN")`).

## Author

Uday Kiran Talari
