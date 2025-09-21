# Database Management Scripts

This folder contains utility scripts for managing the Food Goggles database.

## Scripts

### `wipe-db.ts`
Completely wipes the database and recreates the schema from scratch.

**Usage:**
```bash
npx tsx scripts/wipe-db.ts
# or
npm run db:wipe
```

**What it does:**
- Deletes the SQLite database file
- Runs Prisma migrations to recreate the schema
- Generates a fresh Prisma client

### `install-test-user.ts`
Creates a test user with sample data in an empty database.

**Usage:**
```bash
npx tsx scripts/install-test-user.ts
# or
npm run db:seed
```

**What it does:**
- Creates a test user account (`test@example.com` / `testpassword123`)
- Adds sample nutritional goals
- Adds sample meal log entries
- Checks that the database is empty before proceeding

### `generate-log-entries.ts`
Creates 20 realistic meal log entries for the test user spread over the past 6 weeks.

**Usage:**
```bash
npx tsx scripts/generate-log-entries.ts
# or
npm run db:logs
```

**What it does:**
- Generates 20 meal entries with realistic nutritional data
- Spreads entries over 6 weeks with realistic gaps (simulating real user behavior)
- Uses varied meal types (breakfast, lunch, dinner, snacks)
- Randomizes timestamps and meal times
- Provides summary statistics

## Prerequisites

Make sure you have the required dependencies installed:
```bash
npm install
```

## Typical Workflow

1. **Reset everything:**
   ```bash
   npm run db:wipe
   ```

2. **Add test user and basic data:**
   ```bash
   npm run db:seed
   ```

3. **Add realistic log entries (optional):**
   ```bash
   npm run db:logs
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Notes

- The wipe script will permanently delete all data
- The test user script will only run on an empty database
- Both scripts use the existing Prisma client and migrations
