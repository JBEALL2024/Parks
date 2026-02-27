# Pi Network Testnet Wallet Setup Guide

## Error: "Wallet is not setup for the app testnet yet"

This error occurs when your Pi app doesn't have a configured wallet for accepting payments on testnet.

## Solution: Configure Your App Wallet

### Step 1: Access Pi Developer Portal
1. Go to **https://developers.minepi.com**
2. Sign in with your Pi Network account
3. Navigate to your app dashboard

### Step 2: Find Your App
1. Look for your app: **PARKS** (or the app ID you registered)
2. Click on the app to open its settings

### Step 3: Configure Payments
1. In the left sidebar, click **"Payments"** or **"Wallet"**
2. You should see options for:
   - **Mainnet Wallet** (production)
   - **Testnet Wallet** (for testing)

### Step 4: Set Up Testnet Wallet
1. Click **"Configure Testnet Wallet"** or similar button
2. The system will generate a testnet wallet for your app
3. You may need to:
   - Accept terms and conditions
   - Verify your developer account
   - Complete any required KYC steps

### Step 5: Get Your Wallet Address
1. Once configured, you'll see your app's testnet wallet address
2. This looks like: `G...` (a long string starting with G)
3. Copy this address for reference

### Step 6: Fund Testnet Wallet (Optional)
For app-to-user payments (rewards), you'll need test Pi:
1. Visit **https://developers.minepi.com/faucet**
2. Request testnet Pi for your app wallet
3. Wait for confirmation

### Step 7: Update Environment Variables
Make sure your app has the correct API key:
```
PI_API_KEY=your_production_api_key_here
```

Get your API key from:
https://developers.minepi.com/dashboard → App Settings → API Keys

## Testing Payments

### User-to-App Payments (Purchases)
- Users buy gear/items with their Pi
- User must have testnet Pi in their wallet
- Get test Pi from: https://developers.minepi.com/faucet

### App-to-User Payments (Rewards)
- App sends Pi rewards to users
- Requires app wallet to be funded
- Set up in the payments configuration

## Common Issues

### Issue 1: "Wallet not configured"
**Solution:** Complete Steps 1-5 above

### Issue 2: "Insufficient balance"
**Solution:** 
- For users: Get test Pi from faucet
- For app: Fund your app wallet from faucet

### Issue 3: "Payment not approved"
**Solution:** 
- Check your PI_API_KEY is correct
- Ensure API key has payment permissions
- Verify app is in testnet mode

### Issue 4: "Invalid payment"
**Solution:**
- Check payment amount is positive
- Verify memo/metadata format
- Ensure product IDs are valid

## Verification Checklist

Before testing payments, verify:

- [ ] App registered at developers.minepi.com
- [ ] Testnet wallet configured for app
- [ ] PI_API_KEY environment variable set
- [ ] User has testnet Pi (for purchases)
- [ ] App wallet funded (for rewards)
- [ ] App deployed and accessible in Pi Browser

## Support Resources

- **Pi Developer Portal:** https://developers.minepi.com
- **Pi Developer Docs:** https://developers.minepi.com/docs
- **Pi Developer Discord:** https://discord.gg/PiNetwork
- **Payment Flow Guide:** https://developers.minepi.com/docs/payments

## Current App Configuration

**App Name:** PARKS
**App URL:** https://parksccebdf4280.pinet.com
**Payment Features:**
- User-to-App: Buy camping gear with Pi
- App-to-User: Earn Pi for uploading content
- Pi Ad Network: Display Pi network ads

## Next Steps After Setup

Once your wallet is configured:

1. **Test in Pi Browser:** Open app in Pi Browser (not regular browser)
2. **Click Payment Button:** Try purchasing an item
3. **Approve Payment:** Follow the Pi payment flow
4. **Verify Transaction:** Check payment appears in dashboard
5. **Test Rewards:** Try claiming content upload rewards

## Notes

- Testnet Pi has no real value - it's for testing only
- Always test payments on testnet before mainnet
- Wallet configuration is per-app, not per-developer
- Each app needs its own wallet setup
- Testnet and mainnet wallets are separate

---

Need help? Check the Pi Developer docs or ask in the Pi Developer community!
