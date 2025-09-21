#!/usr/bin/env tsx

/**
 * Test User Installation Script
 * 
 * This script creates a test user with sample data in an empty database:
 * 1. Creates a test user account
 * 2. Adds sample goals
 * 3. Adds sample meal log entries
 * 
 * Usage: npx tsx scripts/install-test-user.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function installTestUser() {
  console.log('👤 Installing test user...');
  
  try {
    // Check if any users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('⚠️  Database is not empty. Found', existingUsers, 'existing users.');
      console.log('💡 Run wipe-db.ts first to start with a clean database.');
      return;
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
      }
    });
    
    console.log('✅ Test user created:', testUser.email);
    
    // Create sample goals
    const goals = [
      { type: 'calories', value: 2000 },
      { type: 'protein', value: 150 },
      { type: 'carbs', value: 250 },
      { type: 'fats', value: 65 },
    ];
    
    for (const goal of goals) {
      await prisma.goal.create({
        data: {
          ...goal,
          userId: testUser.id,
        }
      });
    }
    
    console.log('🎯 Sample goals created');
    
    // Create sample meal log entries
    const sampleMeals = [
      {
        fats: 12.5,
        sugars: 8.2,
        carbohydrates: 45.3,
        proteins: 22.1,
        calories: 380,
        notes: 'Grilled chicken breast with quinoa and steamed broccoli',
        slug: 'grilled-chicken-quinoa-broccoli',
      },
      {
        fats: 8.7,
        sugars: 15.4,
        carbohydrates: 67.8,
        proteins: 18.9,
        calories: 420,
        notes: 'Salmon fillet with sweet potato and asparagus',
        slug: 'salmon-sweet-potato-asparagus',
      },
      {
        fats: 6.2,
        sugars: 12.1,
        carbohydrates: 52.4,
        proteins: 15.7,
        calories: 320,
        notes: 'Greek yogurt with berries and granola',
        slug: 'greek-yogurt-berries-granola',
      },
      {
        fats: 14.8,
        sugars: 6.9,
        carbohydrates: 38.2,
        proteins: 28.3,
        calories: 450,
        notes: 'Turkey burger with avocado and side salad',
        slug: 'turkey-burger-avocado-salad',
      },
      {
        fats: 9.1,
        sugars: 18.7,
        carbohydrates: 58.9,
        proteins: 12.4,
        calories: 380,
        notes: 'Pasta with marinara sauce and lean ground beef',
        slug: 'pasta-marinara-lean-beef',
      }
    ];
    
    for (const meal of sampleMeals) {
      await prisma.logEntry.create({
        data: {
          ...meal,
          userId: testUser.id,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
        }
      });
    }
    
    console.log('🍽️  Sample meal entries created');
    
    // Display summary
    const userCount = await prisma.user.count();
    const goalCount = await prisma.goal.count();
    const mealCount = await prisma.logEntry.count();
    
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Goals: ${goalCount}`);
    console.log(`   Meal Entries: ${mealCount}`);
    
    console.log('\n✅ Test user installation completed successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpassword123');
    
  } catch (error) {
    console.error('❌ Error installing test user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
installTestUser();
