// Common meal entries for different times of day
export interface MealEntry {
  description: string
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export const commonMeals: MealEntry[] = [
  // Breakfast meals
  {
    description: "scrambled eggs with whole wheat toast and avocado",
    timeOfDay: "breakfast"
  },
  {
    description: "oatmeal with berries, banana, and almond butter",
    timeOfDay: "breakfast"
  },
  {
    description: "greek yogurt parfait with granola and mixed berries",
    timeOfDay: "breakfast"
  },
  
  // Lunch meals
  {
    description: "grilled chicken breast with steamed broccoli and brown rice",
    timeOfDay: "lunch"
  },
  {
    description: "quinoa salad with chickpeas, cucumber, tomatoes, and olive oil dressing",
    timeOfDay: "lunch"
  },
  {
    description: "salmon fillet with roasted sweet potatoes and asparagus",
    timeOfDay: "lunch"
  },
  
  // Dinner meals
  {
    description: "baked cod with quinoa pilaf and steamed green beans",
    timeOfDay: "dinner"
  },
  {
    description: "turkey meatballs with whole wheat pasta and marinara sauce",
    timeOfDay: "dinner"
  },
  
  // Snacks
  {
    description: "apple slices with almond butter",
    timeOfDay: "snack"
  },
  {
    description: "mixed nuts and dried fruit",
    timeOfDay: "snack"
  }
]

// Function to get a random meal
export function getRandomMeal(): string {
  const randomIndex = Math.floor(Math.random() * commonMeals.length)
  return commonMeals[randomIndex].description
}

// Function to get a random meal for a specific time of day
export function getRandomMealForTime(timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack'): string {
  const mealsForTime = commonMeals.filter(meal => meal.timeOfDay === timeOfDay)
  if (mealsForTime.length === 0) {
    return getRandomMeal() // fallback to any random meal
  }
  const randomIndex = Math.floor(Math.random() * mealsForTime.length)
  return mealsForTime[randomIndex].description
}
