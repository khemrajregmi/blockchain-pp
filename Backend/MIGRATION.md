# Playmate Database Migration Guide

This guide explains how to run database migrations for the Playmate application.

## Overview

The Playmate application uses MongoDB with Mongoose ODM. The migration scripts handle:

- ✅ Initial database setup
- ✅ Population of sports types data
- ✅ Database schema creation (automatic via Mongoose)
- ✅ Connection verification

## Available Commands

### 1. Basic Migration
```bash
npm run migrate
```
This runs the core migration script that:
- Connects to MongoDB using environment variables
- Creates initial sports types (Football, Basketball, Tennis, Cricket, Baseball, Volleyball, Rugby, Hockey)
- Displays current database status

### 2. Migration with Runner (Recommended)
```bash
npm run migrate:runner
```
This runs the migration with additional checks:
- Verifies dependencies are installed
- Checks for .env file
- Runs the migration with better error handling
- Provides detailed feedback

### 3. Direct Migration Script
```bash
node migrate.js
```
Direct execution of the migration script.

### 4. Test Migration Results
```bash
npm run test:migration
```
Verifies that the migration completed successfully by:
- Checking sports data exists
- Verifying expected sports are present
- Displaying database collection status

## Database Collections

After migration, your database will have these collections:

| Collection | Purpose | Sample Data |
|------------|---------|-------------|
| `SportsTypes` | Available sports | Football, Basketball, Tennis, etc. |
| `UserInfo` | User accounts | User profiles and authentication |
| `TeamInfo` | Team data | Team details and settings |
| `TeamMembers` | Team membership | User-team relationships |
| `UserFriends` | Friend connections | Friend requests and relationships |
| `EventDetails` | Event information | Games, matches, activities |
| `UserEvents` | Event participation | User event status |
| `ImageDetails` | File uploads | Profile pictures, team logos |

## Environment Configuration

Ensure your `.env` file contains:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Base URL for file uploads
BASE_URL=http://127.0.0.1:8000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
# ... other email settings
```

## Migration Status

✅ **Current Status**: Migration system implemented and tested

- Database connection: Working
- Sports data: 8 sports types created
- API endpoints: All responding correctly
- Frontend integration: Connected and loading

## Troubleshooting

### Connection Issues
If you get connection errors:
1. Check your `MONGODB_URL` in `.env`
2. Verify MongoDB Atlas credentials
3. Ensure network access is configured in MongoDB Atlas

### Permission Issues
If you get authentication errors:
1. Verify MongoDB user credentials
2. Check database user permissions
3. Ensure the database user has read/write access

### Missing Data
If sports data is missing:
1. Run `npm run test:migration` to check current state
2. Re-run `npm run migrate` to add missing data
3. Check MongoDB Atlas dashboard for data visibility

## Development Workflow

1. **First-time setup**:
   ```bash
   npm install
   npm run migrate:runner
   npm run test:migration
   ```

2. **Verify migration**:
   ```bash
   curl http://localhost:8000/getSports
   ```

3. **Reset and re-migrate** (if needed):
   - Manually clear collections in MongoDB Atlas
   - Run `npm run migrate` again

## API Verification

After migration, test these endpoints:

- `GET /getSports` - Should return 8 sports types
- `POST /register` - Should allow user registration
- `POST /login-user` - Should allow user login

## Notes

- Migration is **idempotent**: Running it multiple times won't create duplicates
- Sports data will only be added if the collection is empty
- The migration script automatically handles database connection cleanup
- All schemas are created automatically when the application starts
