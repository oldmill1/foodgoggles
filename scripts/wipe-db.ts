#!/usr/bin/env tsx

/**
 * Database Wipe Script
 * 
 * This script completely wipes the database by:
 * 1. Dropping all tables
 * 2. Running Prisma migrations to recreate the schema
 * 
 * Usage: npx tsx scripts/wipe-db.ts
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

async function wipeDatabase() {
  console.log('🗑️  Starting database wipe...');
  
  try {
    // Check if we're using PostgreSQL or SQLite
    const databaseUrl = process.env.DATABASE_URL || '';
    const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');
    
    if (isPostgreSQL) {
      // For PostgreSQL: Truncate all tables
      console.log('🗑️  Clearing PostgreSQL tables...');
      await prisma.$executeRaw`TRUNCATE TABLE users, goals, log_entries CASCADE;`;
      console.log('✅ PostgreSQL tables cleared');
    } else {
      // For SQLite: Drop the database file
      console.log('📁 Dropping SQLite database file...');
      const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      
      try {
        const fs = require('fs');
        if (fs.existsSync(dbPath)) {
          fs.unlinkSync(dbPath);
          console.log('✅ SQLite database file deleted');
        } else {
          console.log('ℹ️  SQLite database file does not exist');
        }
      } catch (error) {
        console.log('⚠️  Could not delete SQLite database file:', error);
      }
    }
    
    // Only run migrations for SQLite (PostgreSQL tables are already there)
    if (!isPostgreSQL) {
      console.log('🔄 Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
    }
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('✅ Database wipe completed successfully!');
    console.log('📊 Database is now empty and ready for fresh data');
    
  } catch (error) {
    console.error('❌ Error wiping database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
wipeDatabase();
