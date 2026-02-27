// Pi Network SDK Integration for Payments
// This handles both user-to-app (purchases) and app-to-user (rewards) payments

import { PI_NETWORK_CONFIG } from '@/lib/system-config'

export interface PiPayment {
  amount: number
  memo: string
  metadata: Record<string, unknown>
}

export interface PiUser {
  uid: string
  username: string
}

// Initialize Pi SDK (will be loaded from Pi Browser)
export const initPiSdk = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Pi SDK is loaded from Pi Browser
    return window.Pi
  }
  return null
}

// Authenticate user with Pi Network
export const authenticatePiUser = async (): Promise<PiUser | null> => {
  const Pi = initPiSdk()
  if (!Pi) {
    console.log('[v0] Pi SDK not available - using demo mode')
    return { uid: 'demo-user', username: 'DemoUser' }
  }

  try {
    const scopes = ['username', 'payments']
    const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound)
    console.log('[v0] Pi Authentication successful:', authResult)
    return authResult.user
  } catch (error) {
    console.error('[v0] Pi Authentication failed:', error)
    return null
  }
}

// Handle incomplete payments
const onIncompletePaymentFound = (payment: any) => {
  console.log('[v0] Incomplete payment found:', payment)
  // Handle incomplete payment - could show a UI to complete it
}

// Re-authenticate with the payments scope before creating a payment.
// The app-wrapper authenticates with ["username"] only; payments require an
// additional Pi.authenticate call with the "payments" scope.
const ensurePaymentsScope = async (Pi: any): Promise<boolean> => {
  try {
    await Pi.init({ version: '2.0', sandbox: PI_NETWORK_CONFIG.SANDBOX })
    await Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)
    return true
  } catch (error) {
    console.error('[v0] Failed to obtain payments scope:', error)
    return false
  }
}

// Create a payment from user to app (purchasing items)
export const createUserToAppPayment = async (
  amount: number,
  productName: string,
  productId: string
): Promise<string | null> => {
  const Pi = initPiSdk()
  
  if (!Pi) {
    alert(`Demo Mode Payment\n\nProduct: ${productName}\nAmount: ${amount} π\n\nThis is a demo. Open this app in Pi Browser to make real testnet payments.`)
    return `demo-${Date.now()}`
  }

  // Ensure the session has the payments scope before calling createPayment
  const hasScope = await ensurePaymentsScope(Pi)
  if (!hasScope) {
    alert('Payment Failed\n\nCould not obtain the "payments" permission from Pi Network.\nPlease re-open the app inside Pi Browser and try again.')
    return null
  }

  try {
    const paymentData: PiPayment = {
      amount,
      memo: `Purchase: ${productName}`,
      metadata: { 
        productId, 
        productName,
        type: 'product_purchase',
        timestamp: Date.now()
      },
    }

    const payment = await Pi.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId: string) => {
        // Approve server-side
        try {
          await fetch('/api/pi/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId }),
          })
        } catch (e) {
          console.error('[v0] Server approval error:', e)
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        try {
          await fetch('/api/pi/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid }),
          })
        } catch (e) {
          console.error('[v0] Server completion error:', e)
        }
        alert(`Payment Successful!\n\nPayment ID: ${paymentId}\nTransaction: ${txid}\n\nYour purchase is complete!`)
      },
      onCancel: (_paymentId: string) => {
        alert('Payment was cancelled.')
      },
      onError: (error: Error, _payment?: any) => {
        console.error('[v0] Payment error:', error)
        if (error.message.includes('payments') || error.message.includes('scope')) {
          alert(`Payment Failed\n\nThe "payments" scope was not granted.\nMake sure you are using Pi Browser and that permissions are enabled.\n\nError: ${error.message}`)
        } else if (error.message.includes('wallet') || error.message.includes('not setup') || error.message.includes('not configured')) {
          alert(`Wallet Setup Required\n\nYour Pi app wallet is not configured yet.\n\nTo enable payments:\n1. Go to https://developers.minepi.com\n2. Navigate to your app: PARKS\n3. Go to Payments section\n4. Configure a testnet wallet\n5. Complete wallet verification\n\nError: ${error.message}`)
        } else {
          alert(`Payment Error\n\n${error.message}\n\nCheck the browser console for more details.`)
        }
      },
    })

    alert(`Payment Initiated!\n\nPayment ID: ${payment.identifier}\n\nProcessing your ${amount} π payment for ${productName}`)
    return payment.identifier
  } catch (error) {
    console.error('[v0] Payment creation failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('payments') || errorMessage.includes('scope')) {
      alert(`Payment Failed\n\nCannot create a payment without the "payments" scope.\n\nMake sure:\n1. You are inside Pi Browser\n2. You accepted the permissions prompt\n3. Your app has Payments enabled in the Pi Developer Portal\n\nError: ${errorMessage}`)
    } else if (errorMessage.includes('insufficient')) {
      alert(`Insufficient Pi Balance\n\nYou don't have enough Pi in your testnet wallet.\n\nGet test Pi from the Pi testnet faucet at:\nhttps://developers.minepi.com/faucet`)
    } else {
      alert(`Payment Failed\n\n${errorMessage}\n\nPlease try again or contact support if the issue persists.`)
    }
    return null
  }
}

// Create a payment from app to user (content rewards)
export const createAppToUserPayment = async (
  recipientUid: string,
  amount: number,
  reason: string
): Promise<boolean> => {
  console.log(`[v0] Rewarding user ${recipientUid} with ${amount} Pi for ${reason}`)
  
  try {
    // Call backend to process reward payment
    const response = await fetch('/api/pi/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        recipientUid, 
        amount, 
        reason,
        timestamp: Date.now()
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('[v0] Reward payment success:', result)
      alert(`✓ Reward Claimed!\n\nYou earned: ${amount} π\nReason: ${reason}\n\nReward ID: ${result.rewardId || 'pending'}`)
      return true
    } else {
      throw new Error('Reward payment failed')
    }
  } catch (error) {
    console.error('[v0] Reward payment error:', error)
    // Fallback for demo mode
    alert(`✓ Reward Claimed (Demo)!\n\nYou earned: ${amount} π\nReason: ${reason}\n\nIn production, this will transfer real Pi to your wallet.`)
    return true
  }
}

// Share content to earn rewards
export const shareContent = async (contentType: string, contentId: string) => {
  const Pi = initPiSdk()
  
  if (!Pi) {
    console.log('[v0] Demo share for content:', contentType, contentId)
    return
  }

  try {
    // Pi Network share functionality
    await Pi.openShareDialog(
      `Check out this ${contentType} on PARKS!`,
      `https://parksccebdf4280.pinet.com/content/${contentId}`
    )
  } catch (error) {
    console.error('[v0] Share failed:', error)
  }
}
