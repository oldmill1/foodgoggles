import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('user-session')?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true }
    })

    if (!user) {
      // Clear invalid session
      cookieStore.delete('user-session')
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}
