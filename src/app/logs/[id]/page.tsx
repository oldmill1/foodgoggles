'use client'

import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import LoginModal from '../../../components/LoginModal'
import LogMealModal from '../../../components/LogMealModal'

const prisma = new PrismaClient()

interface LogEntryPageProps {
  params: {
    id: string
  }
}

interface User {
  id: string
  email: string
}

export default function LogEntryPage({ params }: LogEntryPageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logEntry, setLogEntry] = useState<any>(null)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    fetchLogEntry()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLogEntry = async () => {
    const { id } = await params
    const slugId = id
    
    if (!slugId || typeof slugId !== 'string') {
      notFound()
    }

    try {
      const response = await fetch(`/api/logs/${slugId}`)
      if (!response.ok) {
        notFound()
      }
      const data = await response.json()
      setLogEntry(data)
    } catch (error) {
      console.error('Error fetching log entry:', error)
      notFound()
    }
  }

  const handleLogMealClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsLogModalOpen(true)
  }

  const handleAuthClick = () => {
    if (user) {
      handleLogout()
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLoginSuccess = () => {
    checkAuthStatus()
  }

  // Helper function to check if nutrition values are in healthy ranges
  const isHealthyValue = (nutrient: string, value: number): boolean => {
    const ranges = {
      calories: { min: 200, max: 800 }, // Reasonable meal range
      protein: { min: 15, max: 60 }, // Good protein range for a meal
      carbohydrates: { min: 20, max: 100 }, // Reasonable carb range
      fats: { min: 5, max: 35 }, // Healthy fat range
      sugars: { min: 0, max: 25 } // Low sugar is better
    }
    
    const range = ranges[nutrient as keyof typeof ranges]
    return value >= range.min && value <= range.max
  }

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const formatMealName = (slug: string): string => {
    // Convert "turkey-avocado-wrap-mixed-greens" to "Turkey Avocado Wrap Mixed Greens"
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isLoading || !logEntry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto min-w-0">
        <Header 
          onLogMealClick={handleLogMealClick} 
          onAuthClick={handleAuthClick}
          isLoggedIn={!!user}
          userEmail={user?.email}
        />

        <main className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {formatMealName(logEntry.slug)}
          </h1>
          <p className="text-gray-600 text-lg">
            Logged on {formatTimestamp(logEntry.timestamp)}
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Nutrition Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <img 
                  src="/assets/fruit.jpg" 
                  alt="Fruit bowl" 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h2 className="text-2xl md:text-3xl font-normal text-gray-900 text-center mb-2 tracking-tight font-inter">
                  Nutrition Breakdown
                </h2>
              </div>

              {/* Desktop Grid Layout for Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🔥</span>
                    <span className="text-gray-700 font-semibold text-xl md:text-2xl">Calories</span>
                    {isHealthyValue('calories', logEntry.calories) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl md:text-3xl">{logEntry.calories}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">kcal</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💪</span>
                    <span className="text-gray-700 font-semibold text-xl md:text-2xl">Protein</span>
                    {isHealthyValue('protein', logEntry.proteins) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl md:text-3xl">{logEntry.proteins}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">⚡</span>
                    <span className="text-gray-700 font-semibold text-xl md:text-2xl">Carbohydrates</span>
                    {isHealthyValue('carbohydrates', logEntry.carbohydrates) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl md:text-3xl">{logEntry.carbohydrates}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🥑</span>
                    <span className="text-gray-700 font-semibold text-xl md:text-2xl">Fats</span>
                    {isHealthyValue('fats', logEntry.fats) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl md:text-3xl">{logEntry.fats}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🍯</span>
                    <span className="text-gray-700 font-semibold text-xl md:text-2xl">Sugars</span>
                    {isHealthyValue('sugars', logEntry.sugars) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-2xl md:text-3xl">{logEntry.sugars}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>
              </div>

              {logEntry.notes && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Notes</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{logEntry.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Actions */}
            <div className="pt-0 pb-6 px-6">
              <div className="space-y-3">
                <Link
                  href="/"
                  className="w-full flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer"
                >
                  <div className="flex items-center gap-4 bg-white rounded-full shadow-md px-8 py-3">
                    <img 
                      src="/assets/hamburger.png" 
                      alt="Log Another Meal" 
                      className="w-8 h-8 transition-opacity duration-200 opacity-100" 
                    />
                    <span 
                      className="text-lg font-semibold font-inter transition-opacity duration-200 opacity-100" 
                      style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                    >
                      Log Another Meal
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

        <LogMealModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} userId={user?.id} />
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
    </div>
  )
}
