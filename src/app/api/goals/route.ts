import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface GoalResponse {
  id: string
  type: string
  value: number
  createdAt: string
  updatedAt: string
}

// GET /api/goals?type=calories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter is required' },
        { status: 400 }
      )
    }

    // Find goal by type
    const goal = await prisma.goal.findUnique({
      where: { type }
    })

    if (!goal) {
      // Return default value without creating a record
      const defaultValue = type === 'calories' ? 3500 : 0
      return NextResponse.json({
        type,
        value: defaultValue,
        isDefault: true
      })
    }

    return NextResponse.json({
      id: goal.id,
      type: goal.type,
      value: goal.value,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
      isDefault: false
    })
  } catch (error) {
    console.error('Error fetching goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    )
  }
}

// PUT /api/goals
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, value } = body

    if (!type || value === undefined) {
      return NextResponse.json(
        { error: 'Type and value are required' },
        { status: 400 }
      )
    }

    // Upsert the goal (create if doesn't exist, update if it does)
    const goal = await prisma.goal.upsert({
      where: { type },
      update: { value },
      create: { type, value }
    })

    return NextResponse.json({
      id: goal.id,
      type: goal.type,
      value: goal.value,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}
