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

    // Fetch log entries for the past 30 days (to ensure we get 10 days with data)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const logEntries = await prisma.logEntry.findMany({
      where: {
        userId: userId,
        timestamp: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        timestamp: 'desc' // Most recent first
      }
    })

    // Group entries by day and sum calories and protein
    const dailyData: { [key: string]: { calories: number, protein: number, date: Date } } = {}
    
    logEntries.forEach(entry => {
      const dateKey = entry.timestamp.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { 
          calories: 0, 
          protein: 0, 
          date: new Date(entry.timestamp.getFullYear(), entry.timestamp.getMonth(), entry.timestamp.getDate())
        }
      }
      
      dailyData[dateKey].calories += entry.calories
      dailyData[dateKey].protein += entry.proteins
    })

    // Get the last 10 days with data, sorted by date
    const daysWithData = Object.values(dailyData)
      .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
      .slice(0, 10) // Take only the last 10 days
      .reverse() // Reverse to show chronologically

    // Convert to chart format
    const chartData = daysWithData.map((dayData, index) => ({
      day: dayData.date.getDate().toString(), // Day of month (10, 12, 14, etc.)
      calories: dayData.calories,
      protein: dayData.protein,
      fullDay: dayData.date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: dayData.date.toISOString().split('T')[0],
      dayNumber: index + 1
    }))

    // Debug logging
    console.log('=== LAST 10 DAYS WITH DATA DEBUG ===')
    console.log('User ID:', userId)
    console.log('Total log entries found:', logEntries.length)
    console.log('Days with data found:', Object.keys(dailyData).length)
    console.log('Last 10 days with data:', chartData)
    console.log('====================================')

    return NextResponse.json({ 
      success: true, 
      data: chartData,
      totalEntries: logEntries.length,
      daysWithData: Object.keys(dailyData).length
    })

  } catch (error) {
    console.error('Last 10 days trends error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
