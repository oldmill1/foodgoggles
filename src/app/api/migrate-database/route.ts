import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    console.log('🔄 Running database migrations...')
    
    // Run Prisma migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    console.log('Migration output:', stdout)
    if (stderr) {
      console.log('Migration warnings:', stderr)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migrations completed successfully!',
      output: stdout,
      warnings: stderr
    })
    
  } catch (error) {
    console.error('❌ Error running migrations:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
