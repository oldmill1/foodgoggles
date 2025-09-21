import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '../../../lib/auth'

const prisma = new PrismaClient()

export interface RecentMeal {
  id: string
  calories: number
  proteins: number
  carbohydrates: number
  fats: number
  sugars: number
  notes: string
  slug: string
  timestamp: string
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

    // Fetch the last 3 meals ordered by timestamp (most recent first)
    const recentMeals = await prisma.logEntry.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 3,
    })

    // Transform the data to match our interface
    const meals: RecentMeal[] = recentMeals.map(meal => ({
      id: meal.id,
      calories: meal.calories,
      proteins: meal.proteins,
      carbohydrates: meal.carbohydrates,
      fats: meal.fats,
      sugars: meal.sugars,
      notes: meal.notes,
      slug: meal.slug,
      timestamp: meal.timestamp.toISOString(),
    }))

    return NextResponse.json(meals)
  } catch (error) {
    console.error('Error fetching recent meals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent meals' },
      { status: 500 }
    )
  }
}
