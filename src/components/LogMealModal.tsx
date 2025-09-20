'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LogMealModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MealAnalysisResult {
  calories: number
  fats: number
  carbohydrates: number
  protein: number
  sugars: number
  notes: string
}

interface LogEntryResponse {
  id: string
  calories: number
  fats: number
  carbohydrates: number
  protein: number
  sugars: number
  notes: string
  slug: string
  timestamp: string
}

export default function LogMealModal({ isOpen, onClose }: LogMealModalProps) {
  const router = useRouter()
  const [mealText, setMealText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logEntryId, setLogEntryId] = useState<string | null>(null)

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

  // Helper function to check if the analysis result is an error case
  const isErrorCase = (result: MealAnalysisResult): boolean => {
    return result.calories === 0 && 
           result.fats === 0 && 
           result.carbohydrates === 0 && 
           result.protein === 0 && 
           result.sugars === 0
  }

  const analyzeMeal = async (text: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealText: text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze meal')
      }

      const result: LogEntryResponse = await response.json()
      
      console.log('Received result:', result)
      
      // Check if this is an error case (no food items detected)
      if (isErrorCase(result)) {
        setError("No food items found in your description")
        setAnalysisResult(null)
      } else {
        // Store the log entry ID for redirect
        setLogEntryId(result.id)
        setAnalysisResult(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogMeal = () => {
    if (mealText.trim()) {
      analyzeMeal(mealText.trim())
    }
  }

  const handleTestLogging = () => {
    const exampleMeal = "I had a grilled chicken breast with steamed broccoli and brown rice for lunch today."
    setMealText(exampleMeal)
  }

  const handleRandomMeal = () => {
    const randomMeal = "grilled chicken breast with steamed broccoli and brown rice"
    setMealText(randomMeal)
  }

  const resetModal = () => {
    setMealText('')
    setAnalysisResult(null)
    setError(null)
    setIsAnalyzing(false)
    setIsSaving(false)
    setLogEntryId(null)
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    } else {
      // Reset modal state when closed
      resetModal()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-85 flex items-center justify-center z-50">
      <div className="rounded-2xl pt-6 px-4 pb-4 w-full max-w-md mx-4 relative" style={{backgroundColor: '#fefbf7', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'}}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
        >
          <img 
            src="/assets/apple.png" 
            alt="Close" 
            className="w-6 h-6"
          />
        </button>
        <div className="mb-4 text-center">
          {analysisResult && (
            <div className="mb-3">
              <img 
                src="/assets/fruit.jpg" 
                alt="Fruit bowl" 
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
              />
              <h2 className="text-2xl font-normal text-gray-900 mb-2 tracking-tight font-inter">
                Nutrition breakdown
              </h2>
            </div>
          )}
          {!analysisResult && (
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="/assets/fruit.jpg" 
                alt="Fruit bowl" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <h2 className="text-3xl font-normal text-gray-900 tracking-tight font-inter text-left">
                What did you eat?
              </h2>
            </div>
          )}
        </div>
        
        {analysisResult ? (
          <div className="bg-white rounded-lg p-6 mb-4" style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-lg">🔥 Calories</span>
                <div className="flex items-center gap-2">
                  {isHealthyValue('calories', analysisResult.calories) && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">{analysisResult.calories}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">kcal</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-lg">💪 Protein</span>
                <div className="flex items-center gap-2">
                  {isHealthyValue('protein', analysisResult.protein) && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">{analysisResult.protein}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-lg">⚡ Carbohydrates</span>
                <div className="flex items-center gap-2">
                  {isHealthyValue('carbohydrates', analysisResult.carbohydrates) && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">{analysisResult.carbohydrates}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-lg">🥑 Fats</span>
                <div className="flex items-center gap-2">
                  {isHealthyValue('fats', analysisResult.fats) && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">{analysisResult.fats}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-lg">🍯 Sugars</span>
                <div className="flex items-center gap-2">
                  {isHealthyValue('sugars', analysisResult.sugars) && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">{analysisResult.sugars}</span>
                    <span className="font-bold text-gray-900 text-lg ml-1">g</span>
                  </div>
                </div>
              </div>
            </div>
            {analysisResult.notes && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 italic leading-relaxed">{analysisResult.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 mb-4 shadow-sm backdrop-blur-sm animate-in slide-in-from-top-2 fade-in-0 duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-in zoom-in-50 duration-200 delay-100"></div>
                  <p className="text-amber-800 text-sm font-medium font-inter leading-snug animate-in slide-in-from-left-2 fade-in-0 duration-300 delay-150">{error}</p>
                </div>
              </div>
            )}
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
          </>
        )}
        
        <div className="flex justify-center gap-4 mt-4">
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md text-gray-600">
                Analyzing...
              </span>
            </div>
          ) : analysisResult ? (
            <div className="flex gap-4">
              <div 
                className="flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer animate-pulse hover:animate-none"
                onClick={() => {
                  if (logEntryId) {
                    // Show saving state and redirect to log page
                    setIsSaving(true)
                    router.push(`/logs/${logEntryId}`)
                  }
                }}
                style={{
                  animation: 'pulse-glow 2s ease-in-out infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation = 'pulse-glow-hover 1.5s ease-in-out infinite'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation = 'pulse-glow 2s ease-in-out infinite'
                }}
              >
                {isSaving ? (
                  <>
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span 
                      className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 opacity-100" 
                      style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                    >
                      Saving Meal...
                    </span>
                  </>
                ) : (
                  <>
                    <img 
                      src="/assets/hamburger.png" 
                      alt="Log Meal" 
                      className="w-10 h-10 transition-opacity duration-200 opacity-100" 
                    />
                    <span 
                      className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 opacity-100" 
                      style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                    >
                      Log Meal
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
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
              
              <div 
                className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 cursor-pointer"
                onClick={handleRandomMeal}
              >
                <img 
                  src="/assets/hamburger.png" 
                  alt="Random Meal" 
                  className="w-10 h-10 transition-opacity duration-200 opacity-100" 
                />
                <span 
                  className="text-sm font-semibold font-inter px-4 py-0.5 bg-white rounded-full shadow-md transition-opacity duration-200 opacity-100" 
                  style={{color: 'rgba(31, 41, 55, var(--tw-text-opacity, 1))'}}
                >
                  Random
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
