'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface WeeklyTrendsProps {
  userId?: string
}

interface ChartData {
  day: string
  calories: number
  protein: number
  fullDay: string
}

export default function WeeklyTrends({ userId }: WeeklyTrendsProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const fetchWeeklyData = async () => {
      try {
        const response = await fetch(`/api/last-10-days?userId=${userId}`)
        const result = await response.json()
        
        if (result.success) {
          setChartData(result.data)
        }
      } catch (error) {
        console.error('Error fetching last 10 days trends:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklyData()
  }, [userId])

  if (!userId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <img src="/assets/trends.png" alt="Trends" className="w-8 h-8 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800 font-inter">Trends</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-500 font-inter">Log in to view your trends</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <img src="/assets/trends.png" alt="Trends" className="w-8 h-8 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800 font-inter">Trends</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-500 font-inter">Loading trends...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <img src="/assets/trends.png" alt="Trends" className="w-8 h-8 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 font-inter">Trends</h2>
      </div>
      
      {/* Calories Chart */}
      <div className="mb-6">
        <h3 className="text-lg text-gray-600 mb-3 font-inter">Calories</h3>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <YAxis 
                domain={['dataMin - 50', 'dataMax + 50']}
                hide={true}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#ff6b35"
                strokeWidth={3}
                fill="url(#caloriesGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#ff6b35' }}
              />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 18, fill: '#6b7280' }}
                interval={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Protein Chart */}
      <div className="mb-6">
        <h3 className="text-lg text-gray-600 mb-3 font-inter">Protein</h3>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="proteinGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                hide={true}
              />
              <Area
                type="monotone"
                dataKey="protein"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#proteinGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#10b981' }}
              />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 18, fill: '#6b7280' }}
                interval={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
