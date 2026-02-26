"use client"

import { useEffect, useRef } from "react"

interface PiAdProps {
  adSlot?: string
  format?: "banner" | "rectangle" | "leaderboard"
  className?: string
}

export function PiAd({ adSlot = "parks-app-slot-1", format = "banner", className = "" }: PiAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pi Ad Network integration
    // In production, this would load Pi's ad script
    console.log("[v0] Pi Ad Network slot initialized:", adSlot)

    if (typeof window !== 'undefined' && adContainerRef.current) {
      // @ts-ignore - Pi Ad SDK will be loaded from Pi Browser
      if (window.PiAd) {
        // @ts-ignore
        window.PiAd.display(adSlot, adContainerRef.current)
      } else {
        console.log("[v0] Pi Ad SDK not loaded - showing placeholder")
      }
    }
  }, [adSlot])

  const heightClass = format === "banner" ? "h-[50px]" : format === "leaderboard" ? "h-[90px]" : "h-[250px]"

  return (
    <div
      ref={adContainerRef}
      className={`pi-ad-container ${heightClass} ${className} bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center border border-purple-200`}
      data-ad-slot={adSlot}
      data-ad-format={format}
    >
      <div className="text-center p-4">
        <p className="text-xs font-semibold text-purple-700 mb-1">Pi Ad Network</p>
        <p className="text-[10px] text-purple-600">Slot: {adSlot}</p>
      </div>
    </div>
  )
}
