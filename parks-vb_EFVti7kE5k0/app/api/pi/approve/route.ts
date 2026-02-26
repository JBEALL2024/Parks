import { NextRequest, NextResponse } from 'next/server'

// Pi Platform API endpoint (use testnet for development)
const PI_API_URL = process.env.PI_API_URL || 'https://api.minepi.com'
const PI_API_KEY = process.env.PI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json()
    
    console.log('[v0] Payment approval requested for:', paymentId)
    
    if (!PI_API_KEY) {
      console.log('[v0] No PI_API_KEY - running in demo mode')
      return NextResponse.json({ 
        success: true, 
        paymentId,
        message: 'Payment approved (demo mode - configure PI_API_KEY for production)',
        demo: true
      })
    }
    
    // Call Pi Platform API to approve payment
    console.log('[v0] Calling Pi API to approve payment...')
    const response = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('[v0] Pi API approval failed:', result)
      throw new Error(result.message || `Pi API error: ${response.statusText}`)
    }
    
    console.log('[v0] Payment approved successfully:', result)
    
    return NextResponse.json({ 
      success: true, 
      paymentId,
      result 
    })
  } catch (error) {
    console.error('[v0] Payment approval error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
