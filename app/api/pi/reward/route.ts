import { NextRequest, NextResponse } from 'next/server'

// Pi Platform API endpoint (testnet)
const PI_API_URL = 'https://api.minepi.com'
const PI_API_KEY = process.env.PI_API_KEY || 'test-api-key'

export async function POST(request: NextRequest) {
  try {
    const { recipientUid, amount, reason, timestamp } = await request.json()
    
    console.log('[v0] Processing reward:', { recipientUid, amount, reason })
    
    // Validate reward amount
    if (amount <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid reward amount' 
      }, { status: 400 })
    }
    
    // In testnet mode without API key, return mock reward
    if (PI_API_KEY === 'test-api-key') {
      console.log('[v0] Test mode: Simulating reward payment')
      const rewardId = `reward-${timestamp}-${Math.random().toString(36).substr(2, 9)}`
      
      return NextResponse.json({ 
        success: true, 
        rewardId,
        recipientUid,
        amount,
        reason,
        message: 'Reward processed (test mode)',
        timestamp: Date.now()
      })
    }
    
    // In production, you would:
    // 1. Verify the user has earned this reward (check views, engagement, etc.)
    // 2. Check if reward was already claimed
    // 3. Use Pi Platform API to transfer Pi from your app's wallet to user
    // 4. Record the transfer in your database
    
    // Example: Create transfer using Pi Platform API
    const transferData = {
      recipient_uid: recipientUid,
      amount: amount,
      memo: `PARKS Reward: ${reason}`,
      metadata: {
        type: 'content_reward',
        reason: reason,
        timestamp: timestamp
      }
    }
    
    const response = await fetch(`${PI_API_URL}/v2/payments/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferData)
    })
    
    if (!response.ok) {
      throw new Error(`Pi API error: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('[v0] Reward transfer successful:', result)
    
    return NextResponse.json({ 
      success: true, 
      rewardId: result.identifier,
      recipientUid,
      amount,
      reason,
      result 
    })
  } catch (error) {
    console.error('[v0] Reward payment error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
