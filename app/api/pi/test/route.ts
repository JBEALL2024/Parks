import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Pi API routes are working',
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.PI_API_KEY,
      apiUrl: process.env.PI_API_URL || 'https://api.minepi.com'
    }
  })
}

export async function POST() {
  return NextResponse.json({
    status: 'OK',
    message: 'POST endpoint working',
    timestamp: new Date().toISOString()
  })
}
