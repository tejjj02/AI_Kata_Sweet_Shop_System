# Kata Sweet Shop Management System 🍬

A comprehensive inventory management system for a sweet shop, built using Test-Driven Development (TDD) methodology. This project includes a complete backend API with PostgreSQL database and a beautiful React-based user interface.

## 🌟 Features

### Backend Features
- ✅ **CRUD Operations**: Add, view, update, and delete sweets
- ✅ **Smart Search**: Find sweets by name, category, or price range
- ✅ **Inventory Management**: Purchase sweets (decreases quantity) and restock items
- ✅ **Stock Validation**: Automatic validation to prevent overselling
- ✅ **RESTful API**: 11 comprehensive endpoints for all operations
- ✅ **Data Validation**: Robust validation at model and service levels

### Frontend Features
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout
- 📊 **Dashboard**: Real-time statistics (total sweets, in-stock, out-of-stock, inventory value)
- 🔍 **Search & Filter**: Search by name and filter by category
- ➕ **Add Sweets**: Interactive form with validation
- ✏️ **Edit Mode**: In-place editing with save/cancel options
- 💰 **Quick Actions**: Purchase and restock with simple prompts
- 🎯 **Visual Indicators**: Color-coded stock status and category badges
- ⚡ **Real-time Updates**: Automatic refresh after each operation

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js v5.1.0** - Web application framework
- **PostgreSQL** - Relational database
- **pg v8.11.3** - PostgreSQL client for Node.js
- **CORS v2.8.5** - Cross-origin resource sharing

### Testing
- **Jest v29.7.0** - Testing framework
- **68 Tests**: 58 unit tests + 10 integration tests

### Frontend
- **React 18** - UI library (via CDN)
- **Vanilla JavaScript** - No build process required
- **CSS Grid & Flexbox** - Responsive layout

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - For version control

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/tejjj02/AI_Kata_Sweet_Shop_System.git
cd AI_Kata_Sweet_Shop_System
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- express (v5.1.0)
- cors (v2.8.5)
- pg (v8.11.3)
- jest (v29.7.0)

### 3. Database Setup

#### Option A: Automated Setup (Recommended)
```bash
npm run setup-db
```

This command will:
- Create the `sweet_shop` database
- Create the `sweets` table with proper schema
- Insert sample data (10 sweets)

#### Option B: Manual Setup

1. Log into PostgreSQL:
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE sweet_shop;
\q
```

3. Run the schema file:
```bash
psql -U postgres -d sweet_shop -f src/database/schema.sql
```

### 4. Verify Database Connection

The application uses these default credentials:
- **Host**: localhost
- **Port**: 5432
- **Database**: sweet_shop
- **User**: postgres
- **Password**: 1234

If your PostgreSQL setup uses different credentials, update `src/database/connection.js`.

## 🧪 Running Tests

### Run All Tests (68 tests)
```bash
npm test
```

Expected output:
```
Test Suites: 4 passed, 4 total
Tests:       68 passed, 68 total
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Breakdown

- **Unit Tests** (58 tests):
  - `Sweet.test.js` - 15 tests for model validation
  - `SweetRepository.test.js` - 15 tests for data access layer
  - `SweetService.test.js` - 28 tests for business logic

- **Integration Tests** (10 tests):
  - `sweetShop.integration.test.js` - Full stack tests with real database

## 💻 Running the Application

### Start the Backend API

```bash
npm run api
```

The API server will start at: `http://localhost:3000`

You should see:
```
🚀 Sweet Shop API server is running on port 3000
```

### Start the Frontend UI

Simply open the `client/index.html` file in your browser:

**Option 1**: Double-click the file
**Option 2**: Right-click → Open with → Your preferred browser
**Option 3**: Drag and drop into browser

The UI will automatically connect to the API at `http://localhost:3000/api`.

## 📁 Project Structure

```
AI_Kata_Sweet_Shop_System/
├── src/
│   ├── models/
│   │   └── Sweet.js              # Sweet model with validation
│   ├── database/
│   │   ├── connection.js         # PostgreSQL connection pool
│   │   └── schema.sql            # Database schema and sample data
│   ├── repositories/
│   │   └── SweetRepository.js    # Data access layer (CRUD operations)
│   ├── services/
│   │   └── SweetService.js       # Business logic layer
│   └── api/
│       ├── server.js             # Express server setup
│       └── routes.js             # API endpoints
├── tests/
│   ├── unit/
│   │   ├── Sweet.test.js         # Model tests (15 tests)
│   │   ├── SweetRepository.test.js # Repository tests (15 tests)
│   │   └── SweetService.test.js  # Service tests (28 tests)
│   └── integration/
│       └── sweetShop.integration.test.js # Integration tests (10 tests)
├── client/
│   ├── index.html                # React UI (single-page app)
│   └── README.md                 # UI documentation
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

### Sweet Management
- `GET /sweets` - Get all sweets
- `GET /sweets/:id` - Get sweet by ID
- `POST /sweets` - Create new sweet
- `PUT /sweets/:id` - Update sweet
- `DELETE /sweets/:id` - Delete sweet

### Search Operations
- `GET /sweets/search/category/:category` - Search by category
- `GET /sweets/search/name/:name` - Search by name
- `GET /sweets/search/price?min=X&max=Y` - Search by price range

### Inventory Operations
- `POST /sweets/:id/purchase` - Purchase sweet (body: `{ "quantity": number }`)
- `POST /sweets/:id/restock` - Restock sweet (body: `{ "quantity": number }`)
- `GET /sweets/:id/stock` - Check stock status

### Example Request

```javascript
// Create a new sweet
fetch('http://localhost:3000/api/sweets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Dark Chocolate Bar',
    category: 'chocolate',
    price: 2.99,
    quantity: 50
  })
})
```

## 🎯 Using the UI

### Dashboard
View real-time statistics at the top of the page:
- Total Sweets count
- In Stock items (quantity > 0)
- Out of Stock items
- Total Inventory Value

### Adding Sweets
1. Fill in the form with sweet details
2. Click "Add Sweet"
3. The new sweet appears in the list

### Editing Sweets
1. Click "Edit" button on any sweet card
2. Modify the fields
3. Click "Save" or "Cancel"

### Deleting Sweets
1. Click "Delete" button
2. Confirm the deletion
3. Sweet is removed from inventory

### Searching
- Use the search bar to find sweets by name
- Use category filter to show specific categories

### Purchase & Restock
- Click "Purchase" and enter quantity to buy
- Click "Restock" and enter quantity to add stock

## 🧪 Test-Driven Development (TDD) Approach

This project was built using TDD methodology following the **Red-Green-Refactor** cycle:

### The TDD Cycle

1. **🔴 RED**: Write a failing test
   - Write a test that describes what you want the code to do
   - Run the test and watch it fail (expected)

2. **🟢 GREEN**: Make the test pass
   - Write the minimum code necessary to pass the test
   - Focus on functionality, not perfection

3. **🔵 REFACTOR**: Improve the code
   - Clean up the code while keeping tests green
   - Remove duplication, improve readability

### Why TDD?

- ✅ **Confidence**: Every feature is tested before deployment
- ✅ **Design**: Tests drive better API design
- ✅ **Documentation**: Tests serve as living documentation
- ✅ **Regression**: Catch bugs before they reach production
- ✅ **Refactoring**: Safely improve code with test safety net

### Project Development Phases

1. **Phase 1**: Project setup with Jest and PostgreSQL
2. **Phase 2**: Sweet model with validation (15 tests)
3. **Phase 3**: Repository layer with CRUD operations (30 tests total)
4. **Phase 4**: Service layer with business logic (58 tests total)
5. **Phase 5**: Integration tests with real database (68 tests total)
6. **Phase 6**: RESTful API with Express.js
7. **Phase 7**: React UI for user interaction

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: "database 'sweet_shop' does not exist"
```bash
# Run database setup
npm run setup-db
```

**Error**: "password authentication failed"
```javascript
// Update credentials in src/database/connection.js
password: 'your_postgres_password'
```

### API Server Issues

**Error**: "Port 3000 is already in use"
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Test Failures

**Error**: "Jest tests timeout"
```bash
# Ensure database is running
npm run setup-db

# Run tests again
npm test
```

## 📊 Sample Data

The database is seeded with 10 sample sweets:
- 4 Chocolates (Dark, Milk, White, Truffle)
- 3 Candies (Gummy Bears, Lollipops, Hard Candy)
- 3 Pastries (Chocolate Croissant, Cinnamon Roll, Danish)

Prices range from $0.50 to $4.99 with varying quantities.

## 🤝 Contributing

This project was built as a learning exercise using TDD methodology. Feel free to fork and experiment!

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ using Test-Driven Development

---

**Note**: Make sure PostgreSQL is running and the API server is started before opening the UI.
