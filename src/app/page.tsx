'use client'

import { useState } from 'react'
import Header from '../components/Header'
import TodaySummary from '../components/TodaySummary'
import RecentMeals from '../components/RecentMeals'
import CaloriesEaten from '../components/CaloriesEaten'
import WeeklyTrends from '../components/WeeklyTrends'
import FoodInsights from '../components/FoodInsights'
import LogMealModal from '../components/LogMealModal'
import GoalModal from '../components/GoalModal'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [goalUpdateTrigger, setGoalUpdateTrigger] = useState(0)

  const handleLogMealClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleGoalModalClick = () => {
    setIsGoalModalOpen(true)
  }

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false)
  }

  const handleGoalUpdated = () => {
    // Trigger a refresh of the CaloriesEaten component
    setGoalUpdateTrigger(prev => prev + 1)
  }

  return (
    <div className="p-6" style={{backgroundColor: '#fefbf7'}}>
      <div className="max-w-7xl mx-auto min-w-0">
        <Header onLogMealClick={handleLogMealClick} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Left Column - Today's Summary */}
          <div className="md:col-span-1 lg:col-span-1 animate-landing">
            <TodaySummary />
            <RecentMeals />
          </div>

          {/* Middle Column - Calories Eaten */}
          <div className="md:col-span-1 lg:col-span-1 animate-landing" style={{animationDelay: '0.1s'}}>
            <CaloriesEaten onGoalIconClick={handleGoalModalClick} key={goalUpdateTrigger} />
          </div>

          {/* Right Column - Weekly Trends and Food Insights */}
          <div className="md:col-span-2 lg:col-span-1 animate-landing" style={{animationDelay: '0.2s'}}>
            <WeeklyTrends />
            <FoodInsights />
          </div>
        </div>
      </div>

      <LogMealModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={handleCloseGoalModal}
        goalType="calories"
        onGoalUpdated={handleGoalUpdated}
      />
    </div>
  )
}
