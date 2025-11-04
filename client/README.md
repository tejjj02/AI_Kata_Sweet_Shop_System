# 🍬 Kata Sweet Shop React UI

## Quick Start

### 1. Start the API Server
```powershell
npm run api
```

The API will run on `http://localhost:3000`

### 2. Open the UI
Simply open the `client/index.html` file in your browser:
- **Windows**: Double-click the file or right-click → Open with → Browser
- **Or navigate to**: `file:///c:/Users/dmont/OneDrive/Desktop/AI Kata Sweet Shop System/client/index.html`

## Features

### ✨ Modern React UI
- **Beautiful gradient design** with smooth animations
- **Responsive layout** - works on desktop and mobile
- **Real-time updates** with the API
- **No build process needed** - uses CDN React

### 📊 Dashboard Statistics
- Total sweets count
- In-stock items
- Out-of-stock items
- Total inventory value

### 🛠️ CRUD Operations
- ✅ **Create** - Add new sweets with form validation
- ✅ **Read** - View all sweets in a beautiful grid
- ✅ **Update** - Edit sweet details inline
- ✅ **Delete** - Remove sweets with confirmation

### 🔍 Search & Filter
- Search by sweet name
- Search by category
- Real-time filtering

### 📦 Inventory Management
- **Purchase** - Decrease quantity with validation
- **Restock** - Increase quantity
- **Stock Status** - Visual indicators for in-stock/out-of-stock

### 🎨 Visual Features
- Category badges (Chocolate, Candy, Pastry)
- Color-coded stock status
- Hover effects on cards
- Success/Error alerts
- Loading states

## How to Use

### Adding a Sweet
1. Fill in the form on the left:
   - Name
   - Category (chocolate, candy, or pastry)
   - Price
   - Quantity
2. Click "Add Sweet"

### Editing a Sweet
1. Click the "Edit" button on any sweet card
2. Form will populate with sweet data
3. Modify the values
4. Click "Update Sweet"

### Purchasing
1. Click "Purchase" on any sweet
2. Enter quantity to purchase
3. System validates stock availability

### Restocking
1. Click "Restock" on any sweet
2. Enter quantity to add
3. Stock updates immediately

### Deleting
1. Click "Delete" on any sweet
2. Confirm deletion
3. Sweet is removed

## Screenshots

### Main Dashboard
- Clean, modern interface
- Gradient purple background
- White cards with shadows
- Grid layout for sweets

### Form Section
- Left sidebar with form
- Dropdown for categories
- Number inputs for price/quantity
- Submit button with gradient

### Sweet Cards
- Category badges at top
- Sweet name as heading
- Price and quantity displayed
- Stock status indicator
- Action buttons at bottom

## Technical Details

### Technologies Used
- **React 18** - via CDN (no build needed!)
- **Babel Standalone** - JSX transformation
- **Fetch API** - HTTP requests
- **CSS Grid & Flexbox** - Responsive layout
- **ES6+** - Modern JavaScript

### API Integration
All operations connect to: `http://localhost:3000/api`

### Browser Compatibility
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Modern browsers with ES6 support

## Troubleshooting

### "Error loading sweets"
- Make sure API server is running (`npm run api`)
- Check that database is set up (`npm run setup-db`)

### CORS Errors
- API has CORS enabled by default
- If issues persist, check browser console

### UI Not Updating
- Refresh the page
- Check browser console for errors
- Verify API is responding at `http://localhost:3000/api/sweets`

## Future Enhancements

Possible additions:
- 🔐 User authentication
- 📱 Progressive Web App (PWA)
- 🌙 Dark mode toggle
- 📈 Charts and analytics
- 🖼️ Image uploads for sweets
- 🛒 Shopping cart feature
- 💳 Payment integration

## Notes

This is a **single-page application** (SPA) using React via CDN. No build process or npm dependencies needed for the frontend - just open the HTML file!

Perfect for:
- Learning React basics
- Quick prototyping
- Demo purposes
- Educational projects
