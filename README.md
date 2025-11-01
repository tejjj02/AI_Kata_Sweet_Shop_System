# Sweet Shop Management System 🍬

A simple inventory management system for a sweet shop, built using Test-Driven Development (TDD).

## Features

- ✅ Add new sweets with details (ID, name, category, price, quantity)
- ✅ Delete sweets from inventory
- ✅ View all available sweets
- ✅ Search sweets by name, category, or price range
- ✅ Purchase sweets (decreases quantity)
- ✅ Restock sweets (increases quantity)

## Technology Stack

- **Node.js** - Runtime environment
- **PostgreSQL** - Database
- **Jest** - Testing framework
- **pg** - PostgreSQL client for Node.js

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sweet-shop-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create the database:
```bash
# Log into PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sweet_shop;
```

5. Run database schema:
```bash
psql -U postgres -d sweet_shop -f src/database/schema.sql
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Running the Application

```bash
npm start
```

## Project Structure

```
sweet-shop-system/
├── src/
│   ├── models/          # Data models
│   ├── database/        # Database connection and schema
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   └── app.js          # Application entry point
├── tests/
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
└── package.json
```

## Development Approach

This project follows **Test-Driven Development (TDD)**:
1. Write a failing test
2. Write minimal code to pass the test
3. Refactor while keeping tests green

## License

ISC
