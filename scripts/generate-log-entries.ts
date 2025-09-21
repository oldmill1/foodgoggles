#!/usr/bin/env tsx

/**
 * Generate Realistic Log Entries Script
 * 
 * This script creates 20 realistic meal log entries for the test user
 * spread over the past 6 weeks with realistic gaps between entries.
 * This simulates real user behavior where people don't log every single day.
 * 
 * Usage: npx tsx scripts/generate-log-entries.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Realistic meal templates with varied nutritional profiles
const mealTemplates = [
  // Breakfast options
  {
    fats: 8.2,
    sugars: 12.4,
    carbohydrates: 45.6,
    proteins: 18.7,
    calories: 320,
    notes: 'Greek yogurt with berries, granola, and honey',
    slug: 'greek-yogurt-berries-granola-honey',
  },
  {
    fats: 12.1,
    sugars: 6.8,
    carbohydrates: 38.9,
    proteins: 22.3,
    calories: 380,
    notes: 'Avocado toast with scrambled eggs and spinach',
    slug: 'avocado-toast-scrambled-eggs-spinach',
  },
  {
    fats: 6.7,
    sugars: 15.2,
    carbohydrates: 52.4,
    proteins: 15.8,
    calories: 340,
    notes: 'Oatmeal with banana, walnuts, and almond milk',
    slug: 'oatmeal-banana-walnuts-almond-milk',
  },
  
  // Lunch options
  {
    fats: 14.8,
    sugars: 8.9,
    carbohydrates: 42.1,
    proteins: 28.5,
    calories: 450,
    notes: 'Grilled chicken salad with quinoa, vegetables, and olive oil dressing',
    slug: 'grilled-chicken-salad-quinoa-vegetables',
  },
  {
    fats: 11.3,
    sugars: 12.7,
    carbohydrates: 58.2,
    proteins: 24.1,
    calories: 420,
    notes: 'Turkey and avocado wrap with mixed greens',
    slug: 'turkey-avocado-wrap-mixed-greens',
  },
  {
    fats: 9.6,
    sugars: 6.4,
    carbohydrates: 48.7,
    proteins: 26.8,
    calories: 380,
    notes: 'Salmon fillet with brown rice and steamed broccoli',
    slug: 'salmon-brown-rice-steamed-broccoli',
  },
  
  // Dinner options
  {
    fats: 16.2,
    sugars: 9.8,
    carbohydrates: 52.3,
    proteins: 32.1,
    calories: 520,
    notes: 'Grilled steak with sweet potato and asparagus',
    slug: 'grilled-steak-sweet-potato-asparagus',
  },
  {
    fats: 13.7,
    sugars: 11.4,
    carbohydrates: 61.8,
    proteins: 28.9,
    calories: 480,
    notes: 'Pasta with marinara sauce, lean ground beef, and parmesan',
    slug: 'pasta-marinara-lean-beef-parmesan',
  },
  {
    fats: 10.4,
    sugars: 7.2,
    carbohydrates: 45.6,
    proteins: 31.2,
    calories: 410,
    notes: 'Baked cod with roasted vegetables and quinoa',
    slug: 'baked-cod-roasted-vegetables-quinoa',
  },
  
  // Snack options
  {
    fats: 7.8,
    sugars: 18.6,
    carbohydrates: 38.4,
    proteins: 12.3,
    calories: 280,
    notes: 'Apple slices with almond butter and dark chocolate',
    slug: 'apple-slices-almond-butter-dark-chocolate',
  },
  {
    fats: 5.9,
    sugars: 14.2,
    carbohydrates: 42.1,
    proteins: 8.7,
    calories: 260,
    notes: 'Mixed berries with cottage cheese and honey',
    slug: 'mixed-berries-cottage-cheese-honey',
  },
  {
    fats: 9.1,
    sugars: 8.3,
    carbohydrates: 35.7,
    proteins: 16.4,
    calories: 290,
    notes: 'Hummus with carrot sticks and whole grain crackers',
    slug: 'hummus-carrot-sticks-whole-grain-crackers',
  },
  
  // Indulgent options (less frequent)
  {
    fats: 22.4,
    sugars: 28.7,
    carbohydrates: 68.9,
    proteins: 18.2,
    calories: 580,
    notes: 'Cheeseburger with fries and a milkshake',
    slug: 'cheeseburger-fries-milkshake',
  },
  {
    fats: 19.8,
    sugars: 24.1,
    carbohydrates: 72.3,
    proteins: 15.6,
    calories: 540,
    notes: 'Pizza slice with pepperoni and extra cheese',
    slug: 'pizza-pepperoni-extra-cheese',
  },
];

function getRandomMeal() {
  return mealTemplates[Math.floor(Math.random() * mealTemplates.length)];
}

function generateRandomTimestamps(count: number, weeksBack: number = 6): Date[] {
  const now = new Date();
  const sixWeeksAgo = new Date(now.getTime() - (weeksBack * 7 * 24 * 60 * 60 * 1000));
  
  const timestamps: Date[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random time within the 6-week period
    const randomTime = sixWeeksAgo.getTime() + Math.random() * (now.getTime() - sixWeeksAgo.getTime());
    const date = new Date(randomTime);
    
    // Randomize the time of day (more likely during meal times)
    const hour = Math.random() < 0.3 ? 7 + Math.random() * 2 : // Breakfast 7-9 AM
                 Math.random() < 0.6 ? 11 + Math.random() * 3 : // Lunch 11 AM - 2 PM
                 Math.random() < 0.8 ? 17 + Math.random() * 3 : // Dinner 5-8 PM
                 19 + Math.random() * 4; // Evening snacks 7-11 PM
    
    date.setHours(Math.floor(hour), Math.floor(Math.random() * 60), 0, 0);
    
    timestamps.push(date);
  }
  
  // Sort timestamps chronologically
  return timestamps.sort((a, b) => a.getTime() - b.getTime());
}

async function generateLogEntries() {
  console.log('📝 Generating realistic log entries...');
  
  try {
    // Find the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (!testUser) {
      console.log('❌ Test user not found. Please run install-test-user.ts first.');
      return;
    }
    
    console.log('👤 Found test user:', testUser.email);
    
    // Generate 20 random timestamps over the past 6 weeks
    const timestamps = generateRandomTimestamps(20, 6);
    
    console.log('📅 Generated timestamps spanning', 
      Math.round((timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime()) / (1000 * 60 * 60 * 24)), 
      'days');
    
    // Create log entries
    const logEntries = [];
    for (let i = 0; i < 20; i++) {
      const meal = getRandomMeal();
      const logEntry = await prisma.logEntry.create({
        data: {
          ...meal,
          userId: testUser.id,
          timestamp: timestamps[i],
        }
      });
      logEntries.push(logEntry);
    }
    
    // Display summary
    const totalCalories = logEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const avgCaloriesPerEntry = Math.round(totalCalories / logEntries.length);
    
    console.log('\n📊 Log Entries Summary:');
    console.log(`   Total entries: ${logEntries.length}`);
    console.log(`   Date range: ${timestamps[0].toLocaleDateString()} - ${timestamps[timestamps.length - 1].toLocaleDateString()}`);
    console.log(`   Total calories: ${totalCalories}`);
    console.log(`   Average per entry: ${avgCaloriesPerEntry} calories`);
    
    // Show some sample entries
    console.log('\n🍽️  Sample entries:');
    logEntries.slice(0, 3).forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.timestamp.toLocaleDateString()} - ${entry.notes} (${entry.calories} cal)`);
    });
    
    console.log('\n✅ Log entries generated successfully!');
    console.log('💡 This simulates realistic user behavior with gaps between logging days');
    
  } catch (error) {
    console.error('❌ Error generating log entries:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateLogEntries();
