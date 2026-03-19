# SLZ GLOBAL Furniture Store

A furniture e-commerce website where customers can browse products and place orders via email. Admin can add and delete products through a secure admin panel.

## Features

- **Customer Features:**
  - Browse furniture products
  - View product details
  - Place orders via email
  - Search and sort products

- **Admin Features:**
  - Secure login with JWT authentication
  - Add new products with image upload
  - Delete products
  - View product statistics

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Supabase (Database & Storage)
- JWT for authentication
- Bootstrap 5 for UI

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/wlwuntefesaxpzmjzend
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to execute the SQL

### 2. Storage Setup

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it `product-images`
4. Check **Public bucket** option
5. Click **Create bucket**

### 3. Update Admin Email

Edit `assets/js/supabase-config.js` and change the admin email:
```javascript
const ADMIN_EMAIL = "your-email@example.com";
```

### 4. Deploy

Host the files on any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

## File Structure

```
slz/
├── index.html              # Homepage
├── shop.html               # Product listing (dynamic)
├── product-detail.html     # Single product with email order
├── database-setup.sql      # Supabase SQL setup
├── admin/
│   ├── login.html          # Admin login
│   ├── products.html       # Product management
│   └── assets/             # Admin panel assets
└── assets/
    ├── css/                # Stylesheets
    ├── js/
    │   ├── supabase-config.js   # Supabase configuration
    │   ├── product-service.js   # Product API functions
    │   └── ...
    └── images/             # Static images
```

## How It Works

### For Customers

1. Visit the shop page (`shop.html`)
2. Browse available furniture products
3. Click on a product to view details
4. Fill in the order form with your information
5. Click "Send Order via Email" to open your email client
6. Send the pre-filled email to complete your order

### For Admin

1. Go to `/admin/login.html`
2. Login with credentials (default: admin / admin123)
3. Add new products with name, price, description, and image
4. Delete products as needed
5. Products appear immediately on the shop

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the password after first login by updating the hash in the database.

## API Endpoints (Supabase)

The application uses Supabase REST API:

- `GET /rest/v1/products` - List all products
- `GET /rest/v1/products?id=eq.{id}` - Get single product
- `POST /rest/v1/products` - Add product (admin)
- `DELETE /rest/v1/products?id=eq.{id}` - Delete product (admin)

## Customization

### Change Store Name
Edit the HTML files to replace "SLZ GLOBAL" with your store name.

### Change Email Address
1. Edit `product-detail.html` - Update mailto link
2. Edit footer in all pages - Update contact info

### Add More Categories
Edit `admin/products.html` and update the category dropdown.

## Security Notes

- Admin authentication uses simple JWT stored in localStorage
- For production, consider implementing server-side authentication
- Supabase RLS (Row Level Security) is enabled for data protection
- Never expose your Supabase service_role key in client-side code

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project uses the SLZ GLOBAL template. Modify as needed for your business.

---

For support, contact: orders@slzglobal.com
