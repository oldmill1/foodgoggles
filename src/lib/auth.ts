import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('user-session')?.value

    if (!sessionId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true }
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
