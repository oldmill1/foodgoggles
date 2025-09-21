'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentMeal {
  id: string
  slugId: string
  calories: number
  proteins: number
  carbohydrates: number
  fats: number
  sugars: number
  notes: string
  slug: string
  timestamp: string
}

// Function to get emoji based on meal type and time
function getMealEmoji(slug: string): string {
  if (slug.includes('snack')) {
    return '🍎'
  } else if (slug.includes('morning')) {
    return '🌅'
  } else if (slug.includes('afternoon')) {
    return '☀️'
  } else if (slug.includes('evening')) {
    return '🍽️'
  } else if (slug.includes('night')) {
    return '🌙'
  } else {
    return '🍽️'
  }
}

// Function to get background color based on meal type
function getMealBgColor(slug: string): string {
  if (slug.includes('snack')) {
    return 'bg-green-100'
  } else if (slug.includes('morning')) {
    return 'bg-yellow-100'
  } else if (slug.includes('afternoon')) {
    return 'bg-orange-100'
  } else if (slug.includes('evening')) {
    return 'bg-purple-100'
  } else if (slug.includes('night')) {
    return 'bg-blue-100'
  } else {
    return 'bg-gray-100'
  }
}

// Function to format slug into a readable meal name
function formatMealName(slug: string): string {
  // Convert "turkey-avocado-wrap-mixed-greens" to "Turkey Avocado Wrap Mixed Greens"
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface RecentMealsProps {
  userId?: string
}

export default function RecentMeals({ userId }: RecentMealsProps) {
  const [meals, setMeals] = useState<RecentMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      // Show empty state when not logged in
      setMeals([])
      setLoading(false)
      return
    }

    const fetchRecentMeals = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/recent-meals')
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent meals')
        }
        
        const data = await response.json()
        setMeals(data)
      } catch (err) {
        console.error('Error fetching recent meals:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMeals()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <div className="flex items-center mb-6">
          <img src="/assets/fruit.jpg" alt="Fruit" className="w-8 h-8 mr-3" />
          <Link href="/log" className="text-xl font-semibold text-gray-800 font-inter hover:text-blue-600 transition-colors duration-200 cursor-pointer">
            Recent Meals
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-inter">Loading...</h4>
                <p className="text-sm text-gray-500 font-light font-inter">Please wait</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <div className="flex items-center mb-6">
          <img src="/assets/fruit.jpg" alt="Fruit" className="w-8 h-8 mr-3" />
          <Link href="/log" className="text-xl font-semibold text-gray-800 font-inter hover:text-blue-600 transition-colors duration-200 cursor-pointer">
            Recent Meals
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 font-inter">Error loading meals</h4>
                <p className="text-sm text-gray-500 font-light font-inter">Please try again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <div className="flex items-center mb-6">
          <img src="/assets/fruit.jpg" alt="Fruit" className="w-8 h-8 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800 font-inter">Recent Meals</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-inter">No meals logged yet</h4>
                <p className="text-sm text-gray-500 font-light font-inter">Start logging your meals!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <div className="flex items-center mb-6">
        <img src="/assets/fruit.jpg" alt="Fruit" className="w-8 h-8 mr-3" />
        <Link href="/log" className="text-xl font-semibold text-gray-800 font-inter hover:text-blue-600 transition-colors duration-200 cursor-pointer">
          Recent Meals
        </Link>
      </div>
      
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-12 h-12 ${getMealBgColor(meal.slug)} rounded-full flex items-center justify-center mr-3`}>
                <img src="/assets/food.png" alt="Food" className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <Link 
                  href={`/logs/${meal.slugId}`}
                  className="text-lg font-normal text-gray-800 font-inter hover:text-blue-600 transition-colors duration-200 cursor-pointer mb-2 block"
                >
                  {formatMealName(meal.slug)}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg text-gray-500 font-medium font-inter">🥑 {Math.round(meal.fats)}g</span>
                  <span className="text-lg text-gray-500 font-medium font-inter">⚡ {Math.round(meal.carbohydrates)}g</span>
                  <span className="text-lg text-gray-500 font-medium font-inter">💪 {Math.round(meal.proteins)}g</span>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-gray-600 font-inter">{Math.round(meal.calories)}</div>
              <div className="text-sm text-gray-500 font-medium font-inter">kcal</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
