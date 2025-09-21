'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import TodaySummary from '../components/TodaySummary'
import RecentMeals from '../components/RecentMeals'
import CaloriesEaten from '../components/CaloriesEaten'
import WeeklyTrends from '../components/WeeklyTrends'
import FoodInsights from '../components/FoodInsights'
import LogMealModal from '../components/LogMealModal'
import GoalModal from '../components/GoalModal'
import LoginModal from '../components/LoginModal'

interface User {
  id: string
  email: string
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [goalUpdateTrigger, setGoalUpdateTrigger] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
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

  const handleLogMealClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleGoalModalClick = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setIsGoalModalOpen(true)
  }

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false)
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

  const handleGoalUpdated = () => {
    // Trigger a refresh of the CaloriesEaten component
    setGoalUpdateTrigger(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto min-w-0">
        <Header 
          onLogMealClick={handleLogMealClick} 
          onAuthClick={handleAuthClick}
          isLoggedIn={!!user}
          userEmail={user?.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Left Column - Today's Summary */}
          <div className="md:col-span-1 lg:col-span-1 animate-landing">
            <TodaySummary userId={user?.id} />
            <RecentMeals userId={user?.id} />
          </div>

          {/* Middle Column - Calories Eaten */}
          <div className="md:col-span-1 lg:col-span-1 animate-landing" style={{animationDelay: '0.1s'}}>
            <CaloriesEaten onGoalIconClick={handleGoalModalClick} key={goalUpdateTrigger} userId={user?.id} />
          </div>

          {/* Right Column - Weekly Trends and Food Insights */}
          <div className="md:col-span-2 lg:col-span-1 animate-landing" style={{animationDelay: '0.2s'}}>
            <WeeklyTrends userId={user?.id} />
            <FoodInsights userId={user?.id} />
          </div>
        </div>
      </div>

      <LogMealModal isOpen={isModalOpen} onClose={handleCloseModal} userId={user?.id} />
      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={handleCloseGoalModal}
        goalType="calories"
        onGoalUpdated={handleGoalUpdated}
        userId={user?.id}
      />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
