# Nebula Backend (NestJS API)

This is the backend API for the Nebula E-commerce Platform, built with NestJS, Prisma, and PostgreSQL.

## 🛠️ Technologies

- **NestJS** - Progressive Node.js framework for building efficient, reliable, and scalable server-side applications
- **Prisma** - Modern database toolkit for Node.js and TypeScript, used as an ORM
- **PostgreSQL** - Powerful, open-source object-relational database system
- **JWT** - For secure authentication and authorization
- **Swagger** - For API documentation and testing

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
API_PREFIX="api/v1"
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES="jpg,jpeg,png,webp"
```

### 3. Database Setup

Generate Prisma client, push your schema to the database, and seed initial data:

```bash
npx prisma generate
npx prisma db push --force-reset
npx prisma db seed
```

### 4. Create Required Directories

Ensure directories for uploads are in place:

```bash
mkdir -p uploads/products
```

### 5. Start the Development Server

```bash
npm run start:dev
```

The API will be available at:

- **Base URL:** http://localhost:3001/api/v1
- **Swagger Docs:** http://localhost:3001/api/v1/docs

## 📋 API Reference

The backend API is extensively documented via Swagger. For full details, please refer to the Swagger documentation at http://localhost:3001/api/v1/docs once the backend server is running.

### 🔐 Authentication APIs

```
POST    /auth/register          # Register new user
POST    /auth/login             # User login
GET     /auth/profile           # Get user profile
PUT     /auth/profile           # Update user profile
PUT     /auth/password          # Change password
DELETE  /auth/account           # Delete user account
GET     /auth/orders            # User's order history
```

### 👥 User Management APIs (Admin)

```
GET     /users                  # Get all users (Admin)
GET     /users/:id              # Get user by ID (Admin)
```

### 📦 Product Management APIs

```
# Public endpoints
GET     /products               # Get all products (with search, filters)
GET     /products/featured      # Get featured products
GET     /products/:slug         # Get product by slug
GET     /products/variants/:id  # Get specific variant

# Admin endpoints
POST    /products               # Create product (Admin)
PUT     /products/:id           # Update product (Admin)
DELETE  /products/:id           # Delete product (Admin)
PATCH   /products/:id/status    # Update product status (Admin)
POST    /products/bulk          # Bulk operations (Admin)
GET     /products/low-stock     # Low stock products (Admin)
```

### 🏷️ Category Management APIs

```
# Public endpoints
GET     /categories             # Get all categories
GET     /categories/tree        # Get category tree
GET     /categories/:slug       # Get category with products

# Admin endpoints
POST    /categories             # Create category (Admin)
PUT     /categories/:id         # Update category (Admin)
DELETE  /categories/:id         # Delete category (Admin)
```

### ⚙️ Options & Variants APIs (Admin)

```
# Options
GET     /options                # Get all options
POST    /options                # Create option (Admin)
GET     /options/:id            # Get option by ID
PUT     /options/:id            # Update option (Admin)
DELETE  /options/:id            # Delete option (Admin)

# Option Values
POST    /options/:id/values     # Add value to option (Admin)
GET     /options/:id/values     # Get option values
PUT     /option-values/:id      # Update option value (Admin)
DELETE  /option-values/:id      # Delete option value (Admin)
```

### 🛒 Cart Management APIs

```
GET     /cart                   # Get user cart
POST    /cart/items             # Add item to cart
PUT     /cart/items/:id         # Update cart item
DELETE  /cart/items/:id         # Remove cart item
DELETE  /cart                   # Clear cart
```

### 📋 Order Management APIs

```
# Customer endpoints
POST    /orders                 # Create order
GET     /orders                 # Get user orders
GET     /orders/:id             # Get order by ID
PUT     /orders/:id/cancel      # Cancel order
GET     /orders/history         # Paginated order history
GET     /orders/tracking/:num   # Track order

# Admin endpoints
PUT     /orders/:id/status      # Update order status (Admin)
POST    /orders/:id/refund      # Process refund (Admin)
GET     /orders/statistics      # Order statistics (Admin)
```

### ❤️ Wishlist APIs

```
GET     /wishlist               # Get user wishlist
POST    /wishlist/items/:productId # Add to wishlist
DELETE  /wishlist/items/:id     # Remove from wishlist
```

### ⭐ Reviews APIs

```
POST    /products/:id/reviews   # Create product review
GET     /products/:id/reviews   # Get product reviews
PUT     /reviews/:id            # Update user review
DELETE  /reviews/:id            # Delete user review
GET     /reviews/pending        # Pending reviews (Admin)
```

### 📍 Address Management APIs

```
GET     /addresses              # Get user addresses
POST    /addresses              # Create address
GET     /addresses/:id          # Get address by ID
PUT     /addresses/:id          # Update address
DELETE  /addresses/:id          # Delete address
```

### 🎫 Coupon Management APIs

```
# Customer endpoints
POST    /coupons/validate       # Validate coupon code

# Admin endpoints
GET     /coupons                # Get all coupons (Admin)
POST    /coupons                # Create coupon (Admin)
GET     /coupons/:id            # Get coupon by ID (Admin)
DELETE  /coupons/:id            # Delete coupon (Admin)
```

### 🚚 Shipping APIs

```
POST    /shipping/rates         # Calculate shipping rates
```

### 🔍 Search & Filter APIs

```
GET     /search/products        # Advanced product search
GET     /search/autocomplete    # Product autocomplete
GET     /search/price-range     # Get price range
GET     /search/filters/:categoryId # Get category filters
```

### 📊 Inventory Management APIs (Admin)

```
PUT     /inventory/variants/:id/stock     # Update variant stock
POST    /inventory/stock-adjustment      # Bulk stock adjustment
GET     /inventory/report                # Inventory report
GET     /inventory/adjustments           # Stock adjustment history
```

### 📈 Admin Analytics APIs

```
GET     /admin/dashboard        # Dashboard statistics
GET     /admin/sales-report     # Sales analytics
GET     /admin/customers        # Customer analytics
```

### 📁 File Upload APIs (Admin)

```
POST    /upload/images          # Upload single image
POST    /upload/images/multiple # Upload multiple images
DELETE  /upload/images/:filename # Delete image
```

## 🧪 API Testing Examples

Once your backend is running, you can use these curl commands to test some of the core functionalities:

### Register a new user

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login with seeded admin

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Search products

```bash
curl "http://localhost:3001/api/v1/search/products?q=shirt&minPrice=10&maxPrice=50"
```

### Get featured products

```bash
curl "http://localhost:3001/api/v1/products/featured"
```

### Add to cart (requires authentication token)

```bash
curl -X POST http://localhost:3001/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

## 🗄️ Database Models Summary

Here's a high-level overview of the main database models powering the Nebula platform:

- **Core Models:** User, Product, ProductVariant, Category, Order
- **Commerce Models:** CartItem, WishlistItem, Review, Coupon, Refund
- **Admin Models:** StockAdjustment, Option, OptionValue, Address

## 📝 Scripts

Available npm scripts:

```bash
npm run start:dev      # Start development server
npm run start:prod     # Start production server
npm run build          # Build the application
npm run test           # Run tests
npm run test:e2e       # Run end-to-end tests
npm run prisma:reset   # Reset database
npm run prisma:seed    # Seed database
```

## 🔒 Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting for production
- Use HTTPS in production
- Regularly update dependencies

## 🚀 Deployment

For production deployment:

1. Set NODE_ENV to "production"
2. Use a secure JWT_SECRET
3. Configure your production database URL
4. Set up proper logging
5. Implement monitoring and health checks

## 🐛 Troubleshooting

**Database Connection Issues:**

- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database credentials

**Port Already in Use:**

- Change PORT in .env file
- Kill existing processes using the port

**Prisma Issues:**

- Run `npx prisma generate` after schema changes
- Use `npx prisma db push` to sync database
