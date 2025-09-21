import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '../../../lib/auth'

const prisma = new PrismaClient()

// Function to generate slug based on timestamp and calories
function generateSlug(timestamp: Date, calories: number): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = dayNames[timestamp.getDay()]
  
  const hour = timestamp.getHours()
  
  let timePeriod: string
  if (hour >= 5 && hour < 9) {
    timePeriod = 'early-morning'
  } else if (hour >= 9 && hour < 12) {
    timePeriod = 'late-morning'
  } else if (hour >= 12 && hour < 14) {
    timePeriod = 'early-afternoon'
  } else if (hour >= 14 && hour < 17) {
    timePeriod = 'late-afternoon'
  } else if (hour >= 17 && hour < 20) {
    timePeriod = 'early-evening'
  } else if (hour >= 20 && hour < 23) {
    timePeriod = 'late-evening'
  } else {
    timePeriod = 'night'
  }
  
  // Determine if it's a snack (< 100 cal) or meal (>= 100 cal)
  const foodType = calories < 100 ? 'snack' : 'meal'
  
  return `${dayOfWeek} ${timePeriod} ${foodType}`
}

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface MealAnalysisResult {
  calories: number
  fats: number
  carbohydrates: number
  protein: number
  sugars: number
  notes: string
}

export interface LogEntryResponse {
  id: string
  calories: number
  fats: number
  carbohydrates: number
  protein: number
  sugars: number
  notes: string
  slug: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured in environment variables')
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file' },
        { status: 500 }
      )
    }

    const { mealText } = await request.json()

    if (!mealText || typeof mealText !== 'string') {
      console.error('Invalid meal text provided:', { mealText })
      return NextResponse.json(
        { error: 'Meal text is required' },
        { status: 400 }
      )
    }

    console.log('Analyzing meal:', mealText)

    // Use Gemini Flash model for fast, cost-effective analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are a nutrition analysis expert. Analyze the following meal description and return ONLY a JSON object with the nutritional information.

IMPORTANT RULES:
1. Return ONLY valid JSON, no other text
2. All values must be numbers (except notes)
3. Use these default units:
   - calories: kcal
   - fats: grams
   - carbohydrates: grams  
   - protein: grams
   - sugars: grams
4. Be realistic and conservative in your estimates
5. If unsure about quantities, make reasonable assumptions based on typical serving sizes
6. Include helpful notes about the analysis

Meal description: "${mealText}"

Return format:
{
  "calories": number,
  "fats": number,
  "carbohydrates": number,
  "protein": number,
  "sugars": number,
  "notes": "string"
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('Gemini response:', text)

    // Clean the response text - remove markdown code blocks if present
    let cleanText = text.trim()
    
    // Remove markdown code blocks (```json ... ```)
    if (cleanText.startsWith('```json') && cleanText.endsWith('```')) {
      cleanText = cleanText.slice(7, -3).trim() // Remove ```json and ```
    } else if (cleanText.startsWith('```') && cleanText.endsWith('```')) {
      cleanText = cleanText.slice(3, -3).trim() // Remove ``` and ```
    }
    
    console.log('Cleaned response:', cleanText)

    // Parse the JSON response
    let analysis: MealAnalysisResult
    try {
      analysis = JSON.parse(cleanText)
      console.log('Parsed analysis:', analysis)
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanText)
      console.error('Parse error:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse nutrition analysis' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (
      typeof analysis.calories !== 'number' ||
      typeof analysis.fats !== 'number' ||
      typeof analysis.carbohydrates !== 'number' ||
      typeof analysis.protein !== 'number' ||
      typeof analysis.sugars !== 'number' ||
      typeof analysis.notes !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid nutrition analysis format' },
        { status: 500 }
      )
    }

    // Generate timestamp and slug
    const timestamp = new Date()
    const slug = generateSlug(timestamp, analysis.calories)

    // Save the analysis to the database
    const logEntry = await prisma.logEntry.create({
      data: {
        calories: analysis.calories,
        fats: analysis.fats,
        carbohydrates: analysis.carbohydrates,
        proteins: analysis.protein,
        sugars: analysis.sugars,
        notes: analysis.notes,
        slug: slug,
        timestamp: timestamp,
        userId: user.id,
      },
    })

    // Return the log entry with ID for redirect
    const logEntryResponse: LogEntryResponse = {
      id: logEntry.id,
      calories: logEntry.calories,
      fats: logEntry.fats,
      carbohydrates: logEntry.carbohydrates,
      protein: logEntry.proteins,
      sugars: logEntry.sugars,
      notes: logEntry.notes,
      slug: logEntry.slug,
      timestamp: logEntry.timestamp.toISOString(),
    }

    return NextResponse.json(logEntryResponse)
  } catch (error) {
    console.error('Error analyzing meal:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check for specific Gemini API errors
      if (error.message.includes('API key not valid')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your GEMINI_API_KEY in .env.local' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze meal. Please try again.' },
      { status: 500 }
    )
  }
}
