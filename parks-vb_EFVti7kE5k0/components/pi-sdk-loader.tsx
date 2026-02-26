"use client"

import { useEffect } from "react"
import Script from "next/script"

export function PiSdkLoader() {
  useEffect(() => {
    // Log when Pi SDK is available
    const checkPiSdk = () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        if (window.Pi) {
          console.log("[v0] Pi SDK loaded and ready")
        } else {
          console.log("[v0] Running in demo mode - Pi SDK not available")
        }
      }
    }

    checkPiSdk()
  }, [])

  return (
    <>
      {/* Pi SDK will be automatically loaded in Pi Browser */}
      {/* This script tag is for reference - Pi Browser injects the SDK */}
      <Script
        id="pi-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Pi Browser injects window.Pi before any scripts run.
            // Only install the demo shim when we are NOT inside Pi Browser
            // so we never shadow the real SDK.
            if (typeof window.Pi === 'undefined') {
              console.log("Running outside Pi Browser - demo mode active");
              window._piDemoMode = true;
              // Do NOT install a fake window.Pi here.
              // createUserToAppPayment checks for window.Pi and shows a
              // demo alert when it is absent, which is the correct behaviour
              // outside of Pi Browser.
            } else {
              console.log("Pi Browser detected - real Pi SDK is available");
              window._piDemoMode = false;
            }
          `,
        }}
      />
    </>
  )
}
