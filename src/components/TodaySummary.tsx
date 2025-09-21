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

interface TodaySummaryProps {
  userId?: string
}

export default function TodaySummary({ userId }: TodaySummaryProps) {
  const [summary, setSummary] = useState<TodaySummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setLoading(false)
      return
    }

    const fetchTodaySummary = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/today-summary')
        
        if (!response.ok) {
          throw new Error('Failed to fetch today&apos;s summary')
        }
        
        const data = await response.json()
        setSummary(data)
      } catch (err) {
        console.error('Error fetching today&apos;s summary:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTodaySummary()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 font-inter">Today&apos;s Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-light text-gray-700 font-inter">Loading...</span>
            <span className="text-2xl font-bold text-gray-400 font-inter">-</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 font-inter">Today&apos;s Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-light text-red-600 font-inter">Error loading data</span>
            <span className="text-2xl font-bold text-red-400 font-inter">!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 font-inter">Today&apos;s Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Meals Logged</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">{summary?.mealsLogged || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Protein</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">{Math.round(summary?.totalProtein || 0)}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Carbohydrates</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">{Math.round(summary?.totalCarbohydrates || 0)}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-light text-gray-700 font-inter">Fats</span>
          <span className="text-2xl font-bold text-gray-600 font-inter">{Math.round(summary?.totalFats || 0)}g</span>
        </div>
      </div>
    </div>
  )
}
