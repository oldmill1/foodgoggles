'use client'

import { useState, useEffect } from 'react'

interface TodaySummaryData {
  mealsLogged: number
  totalCalories: number
  totalProtein: number
  totalCarbohydrates: number
  totalFats: number
  totalSugars: number
}

interface CaloriesEatenProps {
  onGoalIconClick: () => void
  userId?: string
}

export default function CaloriesEaten({ onGoalIconClick, userId }: CaloriesEatenProps) {
  const [summary, setSummary] = useState<TodaySummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [goalCalories, setGoalCalories] = useState<number | null>(null) // Start as null
  const [goalLoading, setGoalLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      // Show empty state when not logged in
      setSummary({
        mealsLogged: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbohydrates: 0,
        totalFats: 0,
        totalSugars: 0
      })
      setGoalCalories(3500) // Default goal
      setLoading(false)
      setGoalLoading(false)
      return
    }

    fetchTodaySummary()
    fetchGoal()
  }, [userId])

  const fetchTodaySummary = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/today-summary')
      
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s summary')
      }
      
      const data = await response.json()
      setSummary(data)
    } catch (err) {
      console.error('Error fetching today\'s summary:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchGoal = async () => {
    try {
      setGoalLoading(true)
      const response = await fetch('/api/goals?type=calories')
      
      if (!response.ok) {
        throw new Error('Failed to fetch goal')
      }
      
      const data = await response.json()
      setGoalCalories(data.value)
    } catch (err) {
      console.error('Error fetching goal:', err)
      // Set default value if API fails
      setGoalCalories(3500)
    } finally {
      setGoalLoading(false)
    }
  }


  // Calculate progress percentage
  const currentCalories = summary?.totalCalories || 0
  const progressPercentage = goalCalories ? Math.min((currentCalories / goalCalories) * 100, 100) : 0

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <img src="/assets/flame.jpg" alt="Flame" className="w-8 h-8 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800 font-inter">Calories Eaten</h2>
        </div>
        
        <div className="text-left mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2 font-inter">Loading... <span className="text-lg text-gray-500 font-light font-inter">kcal</span></div>
          
          {/* Progress Bar and Goal Icon */}
          <div className="flex items-center mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-5 shadow-inner relative mr-3">
              <div 
                className="h-5 rounded-full relative overflow-hidden transition-all duration-1200 ease-out" 
                style={{
                  width: `${progressPercentage}%`,
                  background: 'linear-gradient(to bottom, #86efac, #6ee7b7)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-full"></div>
              </div>
            </div>
            <img 
            src="/assets/goal.png" 
            alt="Goal" 
            className="w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={onGoalIconClick}
          />
          </div>
          <div className="flex justify-between text-lg text-gray-500 font-inter">
            <span>Goal: <span className="font-bold">0%</span></span>
            <span>{goalCalories ? goalCalories.toLocaleString() : '...'} kcal</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <img src="/assets/flame.jpg" alt="Flame" className="w-8 h-8 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800 font-inter">Calories Eaten</h2>
        </div>
        
        <div className="text-left mb-6">
          <div className="text-4xl font-bold text-red-600 mb-2 font-inter">Error <span className="text-lg text-gray-500 font-light font-inter">kcal</span></div>
          
          {/* Progress Bar and Goal Icon */}
          <div className="flex items-center mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-5 shadow-inner relative mr-3">
              <div 
                className="h-5 rounded-full relative overflow-hidden transition-all duration-1200 ease-out" 
                style={{
                  width: `${progressPercentage}%`,
                  background: 'linear-gradient(to bottom, #fca5a5, #f87171)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-full"></div>
              </div>
            </div>
            <img 
            src="/assets/goal.png" 
            alt="Goal" 
            className="w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={onGoalIconClick}
          />
          </div>
          <div className="flex justify-between text-lg text-gray-500 font-inter">
            <span>Goal: <span className="font-bold">0%</span></span>
            <span>{goalCalories ? goalCalories.toLocaleString() : '...'} kcal</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <img src="/assets/flame.jpg" alt="Flame" className="w-8 h-8 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 font-inter">Calories Eaten</h2>
      </div>
      
      <div className="text-left mb-6">
        <div className="text-4xl font-bold text-gray-800 mb-2 font-inter">{currentCalories.toLocaleString()} <span className="text-lg text-gray-500 font-light font-inter">kcal</span></div>
        
        {/* Progress Bar and Goal Icon */}
        <div className="flex items-center mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-5 shadow-inner relative mr-3">
            <div 
              className="h-5 rounded-full relative overflow-hidden transition-all duration-1200 ease-out" 
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(to bottom, #86efac, #6ee7b7)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
              <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-full"></div>
            </div>
          </div>
          <img 
            src="/assets/goal.png" 
            alt="Goal" 
            className="w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={onGoalIconClick}
          />
        </div>
        <div className="flex justify-between text-lg text-gray-500 font-inter">
          <span>Goal: <span className="font-bold">{Math.round(progressPercentage)}%</span></span>
          <span>{goalCalories ? goalCalories.toLocaleString() : '...'} kcal</span>
        </div>
      </div>

    </div>
  )
}
