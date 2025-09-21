import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '../../../lib/auth'

const prisma = new PrismaClient()

export interface TodaySummaryResponse {
  mealsLogged: number
  totalCalories: number
  totalProtein: number
  totalCarbohydrates: number
  totalFats: number
  totalSugars: number
}

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get today's date range (start and end of today)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

    // Fetch all log entries for today
    const todayEntries = await prisma.logEntry.findMany({
      where: {
        userId: user.id,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Calculate totals
    const summary: TodaySummaryResponse = {
      mealsLogged: todayEntries.length,
      totalCalories: todayEntries.reduce((sum, entry) => sum + entry.calories, 0),
      totalProtein: todayEntries.reduce((sum, entry) => sum + entry.proteins, 0),
      totalCarbohydrates: todayEntries.reduce((sum, entry) => sum + entry.carbohydrates, 0),
      totalFats: todayEntries.reduce((sum, entry) => sum + entry.fats, 0),
      totalSugars: todayEntries.reduce((sum, entry) => sum + entry.sugars, 0),
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching today\'s summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today\'s summary' },
      { status: 500 }
    )
  }
}
