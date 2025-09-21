'use client'

import { useState, useEffect } from 'react'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  goalType: string
  onGoalUpdated: (newValue: number) => void
  userId?: string
}

interface GoalData {
  id?: string
  type: string
  value: number
  isDefault: boolean
}

export default function GoalModal({ isOpen, onClose, goalType, onGoalUpdated, userId }: GoalModalProps) {
  const [goal, setGoal] = useState<GoalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newValue, setNewValue] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchGoal()
    }
  }, [isOpen, goalType])

  const fetchGoal = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/goals?type=${goalType}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch goal')
      }
      
      const data = await response.json()
      setGoal(data)
      setNewValue(data.value.toString())
    } catch (err) {
      console.error('Error fetching goal:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const value = parseFloat(newValue)
      if (isNaN(value) || value <= 0) {
        setError('Please enter a valid positive number')
        return
      }

      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: goalType,
          value: value
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save goal')
      }

      const updatedGoal = await response.json()
      setGoal(updatedGoal)
      onGoalUpdated(value)
      onClose()
    } catch (err) {
      console.error('Error saving goal:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'calories':
        return 'Calories'
      case 'protein':
        return 'Protein'
      case 'carbs':
        return 'Carbohydrates'
      case 'fats':
        return 'Fats'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const getGoalTypeUnit = (type: string) => {
    switch (type) {
      case 'calories':
        return 'kcal'
      case 'protein':
      case 'carbs':
      case 'fats':
        return 'g'
      default:
        return ''
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="rounded-2xl pt-6 px-4 pb-4 w-full max-w-md mx-4 relative" 
        style={{backgroundColor: '#fefbf7', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'}}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
        >
          <img 
            src="/assets/apple.png" 
            alt="Close" 
            className="w-6 h-6"
          />
        </button>
        
        <div className="mb-4 text-center">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/assets/goal.png" 
              alt="Goal" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <h2 className="text-3xl font-normal text-gray-900 tracking-tight font-inter text-left">
              Set {getGoalTypeLabel(goalType)} Goal
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600 font-inter">Loading...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter ${getGoalTypeLabel(goalType).toLowerCase()} goal`}
                className="w-full h-16 p-4 rounded-lg resize-none focus:outline-none text-black text-xl font-inter"
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
                min="1"
                step="1"
              />
              <div className="text-right mt-2 text-gray-500 font-inter text-sm">
                {getGoalTypeUnit(goalType)}
              </div>
            </div>

            {goal?.isDefault && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800 font-inter">
                  <strong>Default Value:</strong> This goal hasn't been set yet. The current value ({goal.value} {getGoalTypeUnit(goalType)}) is a default.
                </div>
              </div>
            )}

            {error && (
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 mb-4 shadow-sm backdrop-blur-sm animate-in slide-in-from-top-2 fade-in-0 duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-in zoom-in-50 duration-200 delay-100"></div>
                  <p className="text-amber-800 text-sm font-medium font-inter leading-snug animate-in slide-in-from-left-2 fade-in-0 duration-300 delay-150">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <div 
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  newValue.trim() && !isNaN(parseFloat(newValue)) && parseFloat(newValue) > 0
                    ? 'hover:scale-110 cursor-pointer' 
                    : 'cursor-not-allowed opacity-50'
                }`}
                onClick={newValue.trim() && !isNaN(parseFloat(newValue)) && parseFloat(newValue) > 0 ? handleSave : undefined}
              >
                {saving ? (
                  <>
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span 
                      className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 opacity-100" 
                      style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                    >
                      Saving...
                    </span>
                  </>
                ) : (
                  <>
                    <img 
                      src="/assets/goal.png" 
                      alt="Save Goal" 
                      className={`w-10 h-10 transition-opacity duration-200 ${
                        newValue.trim() && !isNaN(parseFloat(newValue)) && parseFloat(newValue) > 0 ? 'opacity-100' : 'opacity-60'
                      }`} 
                    />
                    <span 
                      className={`text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 ${
                        newValue.trim() && !isNaN(parseFloat(newValue)) && parseFloat(newValue) > 0 ? 'opacity-100' : 'opacity-60'
                      }`} 
                      style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                    >
                      Save Goal
                    </span>
                  </>
                )}
              </div>
              
              <div 
                className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer"
                onClick={handleClose}
              >
                <img 
                  src="/assets/apple.png" 
                  alt="Cancel" 
                  className="w-10 h-10 transition-opacity duration-200 opacity-100" 
                />
                <span 
                  className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 opacity-100" 
                  style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                >
                  Cancel
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
