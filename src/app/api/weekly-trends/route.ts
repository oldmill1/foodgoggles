import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get the start of the week (7 days ago)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 7)

    // Fetch log entries for the past 7 days
    const logEntries = await prisma.logEntry.findMany({
      where: {
        userId: userId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Group entries by day and sum calories and protein
    const dailyData: { [key: string]: { calories: number, protein: number } } = {}
    
    // Initialize all 7 days with 0 values
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dayName = days[date.getDay()]
      dailyData[dayName] = { calories: 0, protein: 0 }
    }

    // Sum calories and protein for each day
    logEntries.forEach(entry => {
      const dayName = days[entry.timestamp.getDay()]
      dailyData[dayName].calories += entry.calories
      dailyData[dayName].protein += entry.proteins
    })

    // Smooth out zeros by using averages for days with no data
    const chartData = days.map((day, index) => {
      let calories = dailyData[day].calories
      let protein = dailyData[day].protein
      
      // If this day has no data (0), calculate average from surrounding days
      if (calories === 0) {
        const surroundingDays = []
        
        // Check previous day
        if (index > 0) {
          const prevDay = days[index - 1]
          if (dailyData[prevDay].calories > 0) {
            surroundingDays.push(dailyData[prevDay].calories)
          }
        }
        
        // Check next day
        if (index < days.length - 1) {
          const nextDay = days[index + 1]
          if (dailyData[nextDay].calories > 0) {
            surroundingDays.push(dailyData[nextDay].calories)
          }
        }
        
        // If we have surrounding data, use average
        if (surroundingDays.length > 0) {
          calories = Math.round(surroundingDays.reduce((sum, val) => sum + val, 0) / surroundingDays.length)
        }
      }
      
      // Same logic for protein
      if (protein === 0) {
        const surroundingProtein = []
        
        if (index > 0) {
          const prevDay = days[index - 1]
          if (dailyData[prevDay].protein > 0) {
            surroundingProtein.push(dailyData[prevDay].protein)
          }
        }
        
        if (index < days.length - 1) {
          const nextDay = days[index + 1]
          if (dailyData[nextDay].protein > 0) {
            surroundingProtein.push(dailyData[nextDay].protein)
          }
        }
        
        if (surroundingProtein.length > 0) {
          protein = Math.round((surroundingProtein.reduce((sum, val) => sum + val, 0) / surroundingProtein.length) * 10) / 10
        }
      }
      
      return {
        day: day.substring(0, 1), // First letter of day name
        calories,
        protein,
        fullDay: day,
        isSmoothed: dailyData[day].calories === 0 || dailyData[day].protein === 0
      }
    })

    // Debug logging
    console.log('=== WEEKLY TRENDS DEBUG ===')
    console.log('User ID:', userId)
    console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString())
    console.log('Total log entries found:', logEntries.length)
    console.log('Daily data:', dailyData)
    console.log('Chart data:', chartData)
    console.log('==========================')

    return NextResponse.json({ 
      success: true, 
      data: chartData,
      totalEntries: logEntries.length
    })

  } catch (error) {
    console.error('Weekly trends error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
