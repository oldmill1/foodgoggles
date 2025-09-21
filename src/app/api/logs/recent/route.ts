import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get total count for pagination
    const totalCount = await prisma.logEntry.count({
      where: {
        userId: userId
      }
    })

    const logEntries = await prisma.logEntry.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        timestamp: 'desc' // Most recent first
      },
      take: limit,
      skip: offset
    })

    return NextResponse.json({ 
      logEntries: logEntries.map(entry => ({
        id: entry.id,
        slugId: entry.slugId,
        calories: entry.calories,
        fats: entry.fats,
        sugars: entry.sugars,
        carbohydrates: entry.carbohydrates,
        proteins: entry.proteins,
        notes: entry.notes,
        slug: entry.slug,
        timestamp: entry.timestamp.toISOString()
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
        hasPrevious: offset > 0
      }
    })
  } catch (error) {
    console.error('Error fetching log entries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
