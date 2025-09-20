'use client'

import { useState, useEffect } from 'react'

interface LogMealModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogMealModal({ isOpen, onClose }: LogMealModalProps) {
  const [mealText, setMealText] = useState('')

  const handleLogMeal = () => {
    console.log('Button pressed with:', mealText)
    setMealText('')
    onClose()
  }

  const handleTestLogging = () => {
    const exampleMeal = "I had a grilled chicken breast with steamed broccoli and brown rice for lunch today."
    console.log('Button pressed with:', exampleMeal)
    setMealText('')
    onClose()
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl pt-6 px-4 pb-4 w-full max-w-md mx-4 relative" style={{boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'}}>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-xl font-bold transition-colors duration-200"
        >
          ×
        </button>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight font-inter">Log Your Meal</h2>
          <p className="text-gray-500 text-sm leading-relaxed font-inter">Describe what you ate recently</p>
        </div>
        
        <textarea
          value={mealText}
          onChange={(e) => setMealText(e.target.value)}
          placeholder="grilled chicken breast with steamed broccoli and brown rice"
          className="w-full h-24 p-3 rounded-lg resize-none focus:outline-none text-black"
          style={{
            boxShadow: '0 0 0 1px rgba(156, 163, 175, 0.3)',
            transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 2px rgba(156, 163, 175, 0.3)'
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = '0 0 0 1px rgba(156, 163, 175, 0.3)'
          }}
        />
        
        <div className="flex justify-end mt-0.5">
          <button
            onClick={handleTestLogging}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Test Logging
          </button>
        </div>
        
        <div className="flex justify-center mt-4">
          <div 
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              mealText.trim() 
                ? 'hover:scale-110 cursor-pointer' 
                : 'cursor-not-allowed opacity-50'
            }`}
            onClick={mealText.trim() ? handleLogMeal : undefined}
          >
            <img 
              src="/assets/hamburger.png" 
              alt="Log Meal" 
              className={`w-10 h-10 transition-opacity duration-200 ${
                mealText.trim() ? 'opacity-100' : 'opacity-60'
              }`} 
            />
            <span 
              className={`text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 ${
                mealText.trim() ? 'opacity-100' : 'opacity-60'
              }`} 
              style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
            >
              Log Meal
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
