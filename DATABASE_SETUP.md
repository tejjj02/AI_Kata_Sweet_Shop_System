# PostgreSQL Database Setup Guide for Sweet Shop System

## Installation Complete? Great! Now let's create the database:

### Method 1: Using pgAdmin (Visual Tool)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Enter your master password if prompted
3. In the left sidebar, expand **Servers** > **PostgreSQL 16**
4. Right-click on **Databases** > **Create** > **Database**
5. Enter database name: `sweet_shop`
6. Click **Save**

### Method 2: Using Command Line (psql)

1. Open Command Prompt or PowerShell as Administrator
2. Run these commands:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create the database
CREATE DATABASE sweet_shop;

# Verify it was created
\l

# Exit
\q
```

### Method 3: Using Our Automated Script (Easiest!)

After creating the database with either method above, run:

```powershell
npm run setup-db
```

This will automatically create all tables and insert sample data.

---

## Troubleshooting

### If `psql` command not found:
Add PostgreSQL to your PATH:
- Default location: `C:\Program Files\PostgreSQL\16\bin`
- Add this to your System Environment Variables PATH

### If connection fails:
1. Check PostgreSQL service is running:
   - Open Services (Win + R, type `services.msc`)
   - Find "postgresql-x64-16"
   - Make sure it's Running

2. Verify your password in `.env` file matches the password you set during installation

---

## Next Steps

Once database is created, we'll run the schema file to create the tables!
