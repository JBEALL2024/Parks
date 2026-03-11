import { NextRequest, NextResponse } from 'next/server'

// Pi Platform API endpoint
const PI_API_URL = process.env.PI_API_URL || 'https://api.minepi.com'
const PI_API_KEY = process.env.PI_API_KEY

// Basic allow-list validation for payment IDs to prevent unsafe URL paths
function isValidPaymentId(paymentId: unknown): paymentId is string {
  if (typeof paymentId !== 'string') {
    return false
  }

  // Allow only alphanumerics, dashes and underscores, with a reasonable length limit
  const PAYMENT_ID_REGEX = /^[A-Za-z0-9_-]{1,128}$/
  return PAYMENT_ID_REGEX.test(paymentId)
}

export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid } = await request.json()
    
    if (!isValidPaymentId(paymentId)) {
      console.warn('[v0] Invalid paymentId received for completion:', paymentId)
      return NextResponse.json(
        { success: false, error: 'Invalid paymentId' },
        { status: 400 }
      )
    }
    
    console.log('[v0] Payment completion requested:', paymentId, 'txid:', txid)
    
    if (!PI_API_KEY) {
      console.log('[v0] No PI_API_KEY - running in demo mode')
      return NextResponse.json({ 
        success: true, 
        paymentId,
        txid,
        message: 'Payment completed (demo mode)',
        demo: true
      })
    }
    
    // Call Pi Platform API to complete payment
    console.log('[v0] Calling Pi API to complete payment...')
    const response = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('[v0] Pi API completion failed:', result)
      throw new Error(result.message || `Pi API error: ${response.statusText}`)
    }
    
    console.log('[v0] Payment completed successfully:', result)
    
    // Here you would:
    // 1. Update your database with the completed payment
    // 2. Deliver the purchased item to the user
    // 3. Update user's order history
    
    return NextResponse.json({ 
      success: true, 
      paymentId,
      txid,
      result 
    })
  } catch (error) {
    console.error('[v0] Payment completion error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
