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
    // Disconnect any existing connections
    await prisma.$disconnect();
    
    // Drop the database file (for SQLite)
    console.log('📁 Dropping database file...');
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    
    try {
      const fs = require('fs');
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('✅ Database file deleted');
      } else {
        console.log('ℹ️  Database file does not exist');
      }
    } catch (error) {
      console.log('⚠️  Could not delete database file:', error);
    }
    
    // Run Prisma migrations to recreate the schema
    console.log('🔄 Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
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
