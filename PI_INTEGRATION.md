# PARKS App - Pi Network Integration Guide

## Overview
This app is fully integrated with Pi Network's testnet for payments, ads, and rewards.

## Features Implemented

### 1. User-to-App Payments (Product Purchases)
- **Featured Gear Marketplace**: 3 product ad slots under each park location
- Products change based on park type (National Parks, Campgrounds, etc.)
- Each product has a "Buy Now" button with Pi payment integration
- Prices shown in both USD and Pi cryptocurrency

### 2. App-to-User Payments (Content Rewards)
- Users earn Pi for uploading photos and videos
- Rewards based on views: 0.1 Pi per view
- "Claim" buttons in Upload tab to receive Pi rewards
- Real-time balance updates shown in header

### 3. Pi Ad Network Integration
- Pi Ad Network plugin integrated with 3 ad slots:
  - `parks-category-banner` - After categories section
  - `parks-discover-footer` - Bottom of discover tab
  - `parks-upload-banner` - In upload section
- Placeholders show when not in Pi Browser
- Ready for Pi Network Ad approval

## Testing in Pi Browser

### Testnet Mode
The app automatically detects if it's running in Pi Browser:
- **In Pi Browser**: Uses real Pi SDK for payments
- **Outside Pi Browser**: Falls back to demo mode with alerts

### Test Payment Flow
1. Browse to any featured location
2. View the 3 featured gear products below
3. Click "Buy Now" on any product
4. Pi Browser will show payment confirmation
5. Approve payment in testnet
6. Balance updates automatically

### Test Reward Flow
1. Go to Upload tab
2. Click "Claim" on any uploaded content
3. Receive Pi based on views
4. Balance increases in header

## Files Modified

### Core Integration Files
- `/lib/pi-sdk.ts` - Pi SDK wrapper with payment functions
- `/components/pi-sdk-loader.tsx` - Initializes Pi SDK in browser
- `/components/pi-ad.tsx` - Pi Ad Network component
- `/app/page.tsx` - Main app with marketplace and payments

### Key Functions
```typescript
// Authenticate user with Pi Network
authenticatePiUser()

// User purchases product with Pi
createUserToAppPayment(amount, productName, productId)

// App rewards user with Pi
createAppToUserPayment(recipientUid, amount, reason)
```

## Environment Setup

### Required for Production
When deploying to production, you'll need:
1. Pi Network Developer Account
2. App registered on Pi Developer Portal
3. Backend API for payment approval/completion
4. Pi Ad Network approval and ad slot IDs

### Testnet Testing
Currently configured for testnet:
- No backend required for testing
- Payments shown as demo alerts
- Pi SDK loads from Pi Browser automatically

## Domain Validation
Validation key file created at: `/public/validation-key.txt`
Accessible at: `https://parksccebdf4280.pinet.com/validation-key.txt`

## Payment Flow

### User-to-App (Purchases)
1. User clicks "Buy Now" on product
2. `createUserToAppPayment()` called with Pi amount
3. Pi Browser shows payment screen
4. User approves in testnet
5. Payment ID returned
6. (Production: Backend approves & completes)

### App-to-User (Rewards)
1. User uploads content (photos/videos)
2. Content gets views from other users
3. User clicks "Claim" button
4. `createAppToUserPayment()` sends Pi to user
5. (Production: Backend processes transfer via Pi Platform API)

## Marketplace Products

Products are dynamically loaded based on location type:
- **National Parks**: Hiking boots, annual pass, guide books
- **Campgrounds**: Tents, camp stoves, lanterns
- **Primitive Camping**: Survival tools, water purification, fire starters

Each product shows:
- Product image
- Name and description
- USD price (crossed out)
- Pi price (highlighted)
- Stock level
- Buy Now button with Pi payment

## Next Steps for Production

1. **Backend Setup**
   - Create approval endpoint for payments
   - Create completion endpoint for payments
   - Implement user balance tracking
   - Set up webhook handlers

2. **Pi Platform API**
   - Get API key from Pi Developer Portal
   - Implement app-to-user transfers
   - Set up payment verification

3. **Pi Ad Network**
   - Apply for ad network approval
   - Get real ad slot IDs
   - Replace placeholder ads

4. **Testing**
   - Test all payment flows in Pi Browser testnet
   - Verify ad display and clicks
   - Test reward distribution

## Support
For Pi Network integration questions:
- Pi Developer Docs: https://developers.minepi.com
- Pi Platform API: https://developers.minepi.com/api
- Pi Ad Network: Contact Pi Network for access
