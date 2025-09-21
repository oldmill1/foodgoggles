import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    const slugId = id

    if (!slugId || typeof slugId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid log entry ID' },
        { status: 400 }
      )
    }

    const logEntry = await prisma.logEntry.findUnique({
      where: { slugId: slugId }
    })

    if (!logEntry) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    // Check if the log entry belongs to the authenticated user
    if (logEntry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: logEntry.id,
      slugId: logEntry.slugId,
      calories: logEntry.calories,
      fats: logEntry.fats,
      sugars: logEntry.sugars,
      carbohydrates: logEntry.carbohydrates,
      proteins: logEntry.proteins,
      notes: logEntry.notes,
      slug: logEntry.slug,
      timestamp: logEntry.timestamp.toISOString()
    })
  } catch (error) {
    console.error('Error fetching log entry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
