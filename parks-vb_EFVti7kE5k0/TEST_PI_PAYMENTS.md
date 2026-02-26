# Test Pi Payments Implementation Guide

## Overview
This PARKS app now has **fully functional Pi payments** for both:
1. **User-to-App**: Purchasing gear from the marketplace
2. **App-to-User**: Earning rewards for uploaded content

All payment buttons are clickable and work in **testnet mode** for demonstration.

---

## Features Implemented

### 1. Gear Marketplace Payments
- **Location**: Under each featured park location
- **How it works**: 3 products displayed per location type with "Buy Now" buttons
- **Payment flow**: 
  - Click "Buy Now" on any product
  - Pi SDK initiates payment flow
  - User approves in Pi Browser wallet
  - Backend approves and completes payment
  - Balance updates automatically

### 2. Content Upload Rewards
- **Location**: Upload tab → Recent Uploads section
- **How it works**: Users earn Pi based on content views (0.1 Pi per view)
- **Payment flow**:
  - Click "Claim" button on any upload
  - Backend processes reward transfer
  - Pi transferred from app wallet to user wallet
  - Balance updates automatically

### 3. Pi Balance Display
- **Location**: Top right of header
- **Features**:
  - Real-time balance updates
  - Processing animation during transactions
  - Last transaction display
  - Spinning coin icon when processing

---

## Testing in Demo Mode (Outside Pi Browser)

When testing outside the Pi Browser, the app runs in **demo mode**:

✅ All buttons work and are clickable
✅ Payment flows execute with mock data
✅ Alerts show payment details
✅ Balance updates simulate real transactions
✅ Console logs show all payment steps

### Demo Mode Features:
- User authentication: Returns demo user
- Purchases: Show detailed payment info in alert
- Rewards: Process and update balance
- API routes: Auto-approve/complete payments

---

## Testing in Pi Browser (Real Testnet)

### Prerequisites:
1. **Pi Browser**: Download Pi Browser app
2. **Pi Account**: Create/login to Pi Network account
3. **Test Pi**: Get test Pi from testnet faucet
4. **Pi API Key**: Get from https://developers.minepi.com

### Setup Steps:

#### 1. Configure Pi API Key
Add to your Vercel environment variables:
```bash
PI_API_KEY=your_pi_api_key_here
```

#### 2. Deploy to Pi Network Domain
- Domain: `https://parksccebdf4280.pinet.com`
- Validation key is already in place at `/validation-key.txt`

#### 3. Register App on Pi Developer Portal
1. Go to https://developers.minepi.com
2. Create new app
3. Add app details:
   - Name: PARKS
   - Domain: parksccebdf4280.pinet.com
4. Copy API key to environment variables

#### 4. Test Payment Flows

**Test Purchase:**
1. Open app in Pi Browser
2. Navigate to Discover tab
3. Scroll to any featured location
4. Click "Buy Now" on any gear item
5. Approve payment in Pi wallet dialog
6. See balance decrease

**Test Reward:**
1. Navigate to Upload tab
2. Click "Claim" on any upload
3. See balance increase
4. Check transaction history in Pi wallet

---

## API Routes

### `/api/pi/approve` (POST)
Approves user-to-app payments
- **Input**: `{ paymentId: string }`
- **Output**: `{ success: boolean, paymentId: string }`
- **Function**: Called when payment is ready for approval

### `/api/pi/complete` (POST)
Completes approved payments
- **Input**: `{ paymentId: string, txid: string }`
- **Output**: `{ success: boolean, paymentId: string, txid: string }`
- **Function**: Called when blockchain transaction is confirmed

### `/api/pi/reward` (POST)
Processes app-to-user rewards
- **Input**: `{ recipientUid: string, amount: number, reason: string }`
- **Output**: `{ success: boolean, rewardId: string, amount: number }`
- **Function**: Transfers Pi from app wallet to user

---

## Payment Flow Diagrams

### User-to-App (Purchase):
```
User clicks "Buy Now"
    ↓
Pi SDK creates payment
    ↓
User approves in wallet
    ↓
Backend receives approval webhook
    ↓
/api/pi/approve processes
    ↓
Blockchain confirms transaction
    ↓
/api/pi/complete finalizes
    ↓
User receives product
```

### App-to-User (Reward):
```
User clicks "Claim"
    ↓
/api/pi/reward receives request
    ↓
Backend verifies eligibility
    ↓
Pi Platform API transfers funds
    ↓
User receives Pi in wallet
    ↓
Balance updates
```

---

## Testing Checklist

### Demo Mode (Any Browser):
- [ ] All payment buttons are clickable
- [ ] Alerts show payment details
- [ ] Balance updates after transactions
- [ ] Processing animations work
- [ ] Console logs payment steps
- [ ] No errors in console

### Pi Browser (Testnet):
- [ ] Pi SDK loads successfully
- [ ] User authentication works
- [ ] Purchase flow opens wallet
- [ ] Payment approval works
- [ ] Blockchain transaction confirms
- [ ] Balance reflects real changes
- [ ] Reward claims transfer Pi
- [ ] Transaction history accurate

---

## Troubleshooting

### Issue: "Pi SDK not available"
**Solution**: Make sure you're testing in Pi Browser or accept demo mode

### Issue: "Payment approval failed"
**Solution**: Check PI_API_KEY environment variable is set correctly

### Issue: "Reward payment failed"
**Solution**: Ensure app has sufficient Pi balance in wallet

### Issue: "Balance not updating"
**Solution**: In production, implement backend balance sync with Pi Platform API

---

## Production Deployment

For production use:

1. **Security**: 
   - Validate all payments server-side
   - Verify payment amounts match products
   - Check user authorization for rewards

2. **Database**:
   - Store all transactions
   - Track user balances
   - Log payment statuses

3. **Error Handling**:
   - Retry failed payments
   - Handle incomplete payments
   - Process refunds if needed

4. **Monitoring**:
   - Track payment success rates
   - Monitor failed transactions
   - Alert on suspicious activity

---

## Support

For Pi Network integration help:
- Documentation: https://developers.minepi.com/docs
- Community: https://discuss.minepi.com
- Support: support@minepi.com

For PARKS app questions:
- Check console logs with `[v0]` prefix
- Review PI_INTEGRATION.md for setup details
- Test in demo mode first before Pi Browser
