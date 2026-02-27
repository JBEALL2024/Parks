"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Tent, TreePine, Car, Home, Filter, Star, Navigation, PawPrint, Users, Scissors, BedDouble, Wrench, Phone, Clock, Upload, ImageIcon, Award, Coins, ShoppingCart, Zap, Globe, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { authenticatePiUser, createUserToAppPayment, createAppToUserPayment } from "@/lib/pi-sdk"
import { PiAd } from "@/components/pi-ad"
import { PiSdkLoader } from "@/components/pi-sdk-loader"

const regions = [
  { id: "north-america", label: "North America", countries: ["USA", "Canada", "Mexico"] },
  { id: "europe", label: "Europe", countries: ["UK", "France", "Germany", "Italy", "Spain", "Switzerland"] },
  { id: "africa", label: "Africa", countries: ["South Africa", "Kenya", "Tanzania", "Morocco", "Egypt", "Botswana"] },
  { id: "asia", label: "Asia", countries: ["China", "Japan", "Thailand", "India", "Nepal", "Indonesia"] },
  { id: "oceania", label: "Oceania", countries: ["Australia", "New Zealand", "Fiji"] },
  { id: "south-america", label: "South America", countries: ["Brazil", "Argentina", "Chile", "Peru", "Ecuador"] },
]

const globalLocations: Record<string, any[]> = {
  "USA": [
    {
      id: 1,
      name: "Yellowstone National Park",
      type: "National Park",
      location: "Wyoming, USA",
      distance: "245 miles",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      amenities: ["Camping", "Hiking", "Wildlife", "Geysers"],
      price: "Free",
      piReward: 50,
    },
    {
      id: 2,
      name: "Pine Valley Campground",
      type: "Campground",
      location: "Colorado, USA",
      distance: "45 miles",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop",
      amenities: ["RV Sites", "Showers", "Fire Pits", "Lake Access"],
      price: "$25/night",
      piReward: 30,
    },
  ],
  "China": [
    {
      id: 101,
      name: "Zhangjiajie National Forest Park",
      type: "National Park",
      location: "Hunan, China",
      distance: "320 km",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop",
      amenities: ["Cable Cars", "Hiking", "Glass Bridge", "Scenic Views"],
      price: "¥248",
      piReward: 60,
    },
    {
      id: 102,
      name: "Jiuzhaigou Valley",
      type: "National Park",
      location: "Sichuan, China",
      distance: "450 km",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1534097374470-cea5447f2e5f?w=600&h=400&fit=crop",
      amenities: ["Lakes", "Waterfalls", "Hiking", "Photography"],
      price: "¥169",
      piReward: 55,
    },
  ],
  "South Africa": [
    {
      id: 201,
      name: "Kruger National Park",
      type: "National Park",
      location: "Mpumalanga, South Africa",
      distance: "420 km",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
      amenities: ["Safari", "Wildlife", "Camping", "Lodges"],
      price: "R400",
      piReward: 70,
    },
    {
      id: 202,
      name: "Table Mountain National Park",
      type: "National Park",
      location: "Cape Town, South Africa",
      distance: "25 km",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop",
      amenities: ["Hiking", "Cable Car", "Scenic Views", "Beaches"],
      price: "R365",
      piReward: 45,
    },
  ],
  "Kenya": [
    {
      id: 203,
      name: "Maasai Mara National Reserve",
      type: "National Park",
      location: "Narok, Kenya",
      distance: "280 km",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop",
      amenities: ["Safari", "Wildlife Migration", "Hot Air Balloons", "Camping"],
      price: "KSh 1500",
      piReward: 80,
    },
  ],
  "Australia": [
    {
      id: 301,
      name: "Kakadu National Park",
      type: "National Park",
      location: "Northern Territory, Australia",
      distance: "250 km",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?w=600&h=400&fit=crop",
      amenities: ["Aboriginal Culture", "Waterfalls", "Wildlife", "Camping"],
      price: "AUD $40",
      piReward: 50,
    },
  ],
  "Brazil": [
    {
      id: 401,
      name: "Iguazu National Park",
      type: "National Park",
      location: "Parana, Brazil",
      distance: "640 km",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1589394882722-0f5a4782a88b?w=600&h=400&fit=crop",
      amenities: ["Waterfalls", "Hiking", "Boat Tours", "Wildlife"],
      price: "R$ 89",
      piReward: 65,
    },
  ],
}

const categories = [
  { id: "national", label: "National Parks", icon: TreePine, color: "bg-emerald-600" },
  { id: "state", label: "State Parks", icon: TreePine, color: "bg-teal-600" },
  { id: "camping", label: "Campgrounds", icon: Tent, color: "bg-amber-600" },
  { id: "primitive", label: "Primitive", icon: Tent, color: "bg-orange-700" },
  { id: "rest", label: "Rest Areas", icon: Car, color: "bg-stone-600" },
  { id: "rentals", label: "Rentals", icon: Home, color: "bg-sky-700" },
  { id: "pets", label: "Pet Services", icon: PawPrint, color: "bg-rose-600" },
  { id: "private", label: "Private Spots", icon: Users, color: "bg-indigo-700" },
]

const featuredLocations = [
  {
    id: 1,
    name: "Yellowstone National Park",
    type: "National Park",
    location: "Wyoming, USA",
    distance: "245 miles",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    amenities: ["Camping", "Hiking", "Wildlife", "Geysers"],
    price: "Free",
    piReward: 50,
  },
  {
    id: 2,
    name: "Pine Valley Campground",
    type: "Campground",
    location: "Colorado, USA",
    distance: "45 miles",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop",
    amenities: ["RV Sites", "Showers", "Fire Pits", "Lake Access"],
    price: "$25/night",
    piReward: 30,
  },
  {
    id: 3,
    name: "Mountain View Rest Area",
    type: "Rest Area",
    location: "Utah, USA",
    distance: "12 miles",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    amenities: ["Restrooms", "Picnic Tables", "Scenic Views"],
    price: "Free",
    piReward: 15,
  },
  {
    id: 4,
    name: "Wilderness Primitive Site",
    type: "Primitive Camping",
    location: "Montana, USA",
    distance: "78 miles",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    amenities: ["No Facilities", "Hiking Access", "Stargazing"],
    price: "Free",
    piReward: 40,
  },
]

const nearbyLocations = [
  { name: "Grand Canyon NP", distance: "89 miles", type: "National Park" },
  { name: "Desert Oasis RV Park", distance: "23 miles", type: "Campground" },
  { name: "Highway 40 Rest Stop", distance: "15 miles", type: "Rest Area" },
  { name: "Mountain Cabin Rental", distance: "34 miles", type: "Rental" },
]

const petGuidelines = [
  {
    location: "National Parks",
    rule: "Pets must be on leash (6 ft max)",
    details: "Allowed on paved roads, developed areas. Not on trails or backcountry.",
  },
  {
    location: "State Parks",
    rule: "Varies by state - check regulations",
    details: "Most allow pets on leash. Some have pet-friendly trails and beaches.",
  },
  {
    location: "Campgrounds",
    rule: "Pets welcome with restrictions",
    details: "Keep on leash, clean up after, quiet hours apply to barking.",
  },
  {
    location: "Primitive Camping",
    rule: "Generally pet-friendly",
    details: "Follow Leave No Trace principles. Wildlife safety precautions required.",
  },
]

const petServices = [
  {
    id: 1,
    name: "Happy Trails Pet Boarding",
    type: "Overnight Boarding",
    location: "Nearby - 5.2 miles",
    rating: 4.9,
    price: "$45/night",
    icon: BedDouble,
    amenities: ["Climate Controlled", "Daily Play", "Medication Admin"],
    hours: "24/7 Drop-off",
  },
  {
    id: 2,
    name: "Wilderness Dog Sitters",
    type: "Pet Sitting",
    location: "Nearby - 3.8 miles",
    rating: 4.7,
    price: "$35/visit",
    icon: Users,
    amenities: ["Home Visits", "Walks", "Overnight Available"],
    hours: "6 AM - 10 PM",
  },
  {
    id: 3,
    name: "Adventure Paws Grooming",
    type: "Grooming",
    location: "Nearby - 7.1 miles",
    rating: 4.8,
    price: "$50-$80",
    icon: Scissors,
    amenities: ["Full Service", "Nail Trim", "De-Shedding"],
    hours: "8 AM - 6 PM",
  },
]

const privateAgreements = [
  {
    id: 1,
    name: "Mountain View Private RV Spot",
    type: "RV/Camper Parking",
    location: "Colorado, USA",
    distance: "12 miles",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&h=400&fit=crop",
    price: "$30/night",
    host: "John & Sarah",
    amenities: ["Electric Hookup", "Water", "Wifi", "Fire Pit"],
    description: "Quiet spot on 5 acres with mountain views. Full hookups available.",
  },
  {
    id: 2,
    name: "Forest Guest House",
    type: "Guest House",
    location: "Oregon, USA",
    distance: "28 miles",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&h=400&fit=crop",
    price: "$75/night",
    host: "Lisa M.",
    amenities: ["Full Kitchen", "Private Bathroom", "Hiking Access", "Pet Friendly"],
    description: "Cozy guest house surrounded by forest. Perfect for nature lovers.",
  },
  {
    id: 3,
    name: "Riverside Cabin Retreat",
    type: "Cabin",
    location: "Montana, USA",
    distance: "45 miles",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    price: "$90/night",
    host: "Mike T.",
    amenities: ["River Access", "Fishing", "Wood Stove", "Solar Power"],
    description: "Off-grid cabin by the river. Truly remote and peaceful experience.",
  },
]

const serviceResources = [
  {
    id: 1,
    name: "RV Repair & Maintenance",
    category: "Repair Services",
    location: "8.5 miles away",
    rating: 4.6,
    icon: Wrench,
    services: ["Engine Work", "AC/Heating", "Plumbing", "Electrical"],
    contact: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Trail Equipment Rentals",
    category: "Gear Rentals",
    location: "4.2 miles away",
    rating: 4.8,
    icon: Tent,
    services: ["Camping Gear", "Kayaks", "Bikes", "Fishing Equipment"],
    contact: "(555) 234-5678",
  },
  {
    id: 3,
    name: "Outdoor Supply Store",
    category: "Supplies",
    location: "6.7 miles away",
    rating: 4.7,
    icon: Home,
    services: ["Camping Supplies", "Food/Snacks", "Maps", "First Aid"],
    contact: "(555) 345-6789",
  },
]

// Marketplace Products - These change based on location/park
const getLocationGear = (locationType: string) => {
  const gearByType: Record<string, any[]> = {
    "National Park": [
      {
        id: "np-1",
        name: "Trail Hiking Boots - Waterproof",
        price: 89.99,
        piPrice: 125.50,
        image: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=300&h=300&fit=crop",
        featured: true,
        stock: 15,
      },
      {
        id: "np-2",
        name: "National Parks Annual Pass",
        price: 80.00,
        piPrice: 112.00,
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop",
        featured: true,
        stock: 50,
      },
      {
        id: "np-3",
        name: "Wildlife Photography Guide Book",
        price: 24.99,
        piPrice: 35.00,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop",
        featured: false,
        stock: 30,
      },
    ],
    "Campground": [
      {
        id: "cg-1",
        name: "4-Person Camping Tent",
        price: 159.99,
        piPrice: 224.00,
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop",
        featured: true,
        stock: 8,
      },
      {
        id: "cg-2",
        name: "Portable Camp Stove Kit",
        price: 45.99,
        piPrice: 64.50,
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=300&h=300&fit=crop",
        featured: true,
        stock: 20,
      },
      {
        id: "cg-3",
        name: "LED Camping Lantern Set (3-Pack)",
        price: 29.99,
        piPrice: 42.00,
        image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=300&h=300&fit=crop",
        featured: true,
        stock: 25,
      },
    ],
    "Primitive Camping": [
      {
        id: "pc-1",
        name: "Survival Multi-Tool Kit",
        price: 34.99,
        piPrice: 49.00,
        image: "https://images.unsplash.com/photo-1565025196422-a4389c2c4a32?w=300&h=300&fit=crop",
        featured: true,
        stock: 12,
      },
      {
        id: "pc-2",
        name: "Water Purification Tablets (50ct)",
        price: 19.99,
        piPrice: 28.00,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
        featured: true,
        stock: 40,
      },
      {
        id: "pc-3",
        name: "Emergency Fire Starter Kit",
        price: 14.99,
        piPrice: 21.00,
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=300&h=300&fit=crop",
        featured: true,
        stock: 35,
      },
    ],
  }
  
  return gearByType[locationType] || gearByType["Campground"]
}

export default function ParksApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")
  const [userPiBalance, setUserPiBalance] = useState(1250.75)
  const [piUser, setPiUser] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("USA")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [walletConfigured, setWalletConfigured] = useState(true) // Assume true, will update on error

  // Initialize Pi SDK on mount
  useEffect(() => {
    const initPi = async () => {
      const user = await authenticatePiUser()
      setPiUser(user)
      console.log("[v0] Pi user authenticated:", user)
    }
    initPi()
  }, [])

  // Request geolocation
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
          console.log("[v0] Location granted:", position.coords)
        },
        (error) => {
          console.error("[v0] Location error:", error)
          setLocationPermission("denied")
        }
      )
    }
  }

  // Get locations for selected country
  const getDisplayLocations = () => {
    return globalLocations[selectedCountry] || globalLocations["USA"]
  }

  // Handle product purchase with Pi
  const handlePurchaseWithPi = async (product: any) => {
    if (paymentProcessing) {
      alert("Please wait for the current payment to complete")
      return
    }
    
    setPaymentProcessing(true)
    console.log("[v0] Purchase initiated for:", product.name)
    
    try {
      const paymentId = await createUserToAppPayment(
        product.piPrice,
        product.name,
        product.id
      )

      if (paymentId) {
        // Update balance (in production, get from backend)
        setUserPiBalance(prev => prev - product.piPrice)
        setLastTransaction(`-${product.piPrice} π (${product.name})`)
        console.log("[v0] Purchase completed successfully")
        setWalletConfigured(true) // Payment worked, wallet is configured
      } else {
        setWalletConfigured(false) // Payment failed, likely wallet issue
      }
    } catch (error) {
      console.error("[v0] Purchase error:", error)
      const errorMsg = error instanceof Error ? error.message : ''
      if (errorMsg.includes('wallet') || errorMsg.includes('not setup')) {
        setWalletConfigured(false)
      }
    } finally {
      setPaymentProcessing(false)
    }
  }

  // Handle 1 Pi donation to support the app
  const handleDonation = async () => {
    if (paymentProcessing) {
      alert("Please wait for the current payment to complete")
      return
    }

    setPaymentProcessing(true)
    try {
      const paymentId = await createUserToAppPayment(
        1,
        "Support PARKS App",
        "donation-support"
      )

      if (paymentId) {
        setUserPiBalance(prev => prev - 1)
        setLastTransaction("-1 π (Donation)")
      }
    } catch (error) {
      console.error("[v0] Donation error:", error)
    } finally {
      setPaymentProcessing(false)
    }
  }

  // Handle content upload reward
  const handleContentReward = async (contentType: string, views: number) => {
    if (paymentProcessing) {
      alert("Please wait for the current transaction to complete")
      return
    }
    
    setPaymentProcessing(true)
    const rewardAmount = Math.floor(views * 0.1) // 0.1 Pi per view
    console.log("[v0] Sending reward:", rewardAmount, "Pi")
    
    try {
      const success = await createAppToUserPayment(
        piUser?.uid || "demo-user",
        rewardAmount,
        `${contentType} views reward`
      )

      if (success) {
        setUserPiBalance(prev => prev + rewardAmount)
        setLastTransaction(`+${rewardAmount} π (Content Reward)`)
        console.log("[v0] Reward claimed successfully")
      }
    } catch (error) {
      console.error("[v0] Reward error:", error)
    } finally {
      setPaymentProcessing(false)
    }
  }

  return (
    <>
      <PiSdkLoader />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
        {/* Hero Header with Background */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950 text-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1200&h=400&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        
        <div className="relative px-4 py-6">
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-balance">PARKS</h1>
              <p className="text-xs text-emerald-100 mt-1">Global Explorer</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-right bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 min-w-[110px]">
                <div className="flex items-center gap-1.5 justify-end">
                  <Coins className={`h-4 w-4 text-amber-400 ${paymentProcessing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-semibold">{userPiBalance.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-emerald-100">
                  {paymentProcessing ? 'Processing...' : 'Pi Balance'}
                </p>
                {lastTransaction && !paymentProcessing && (
                  <p className="text-[9px] text-amber-300 mt-0.5 animate-pulse">
                    {lastTransaction}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 text-xs backdrop-blur-md"
                onClick={requestLocation}
              >
                <Target className="h-3 w-3 mr-1" />
                {locationPermission === "granted" ? "Located" : "Find Me"}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search parks, trails, campgrounds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 py-3 w-full bg-white/95 backdrop-blur-sm border-white/20 text-gray-800 placeholder:text-gray-500"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 text-emerald-700 bg-transparent">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-2 py-2 bg-white/80 backdrop-blur-sm border-b border-emerald-100 overflow-x-auto sticky top-0 z-40">
          <TabsList className="inline-flex w-full min-w-max bg-emerald-100/50">
            <TabsTrigger value="discover" className="flex-1 min-w-[90px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Discover</TabsTrigger>
            <TabsTrigger value="nearby" className="flex-1 min-w-[90px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Nearby</TabsTrigger>
            <TabsTrigger value="upload" className="flex-1 min-w-[90px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Upload</TabsTrigger>
            <TabsTrigger value="pets" className="flex-1 min-w-[80px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Pets</TabsTrigger>
            <TabsTrigger value="private" className="flex-1 min-w-[80px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Private</TabsTrigger>
            <TabsTrigger value="services" className="flex-1 min-w-[90px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Services</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="discover" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-6">
              {/* Wallet Setup Warning */}
              {!walletConfigured && (
                <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Coins className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Wallet Setup Required</h3>
                        <p className="text-sm text-white/90 mb-2">
                          To accept Pi payments, configure your app wallet at developers.minepi.com
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-7 text-xs"
                          onClick={() => window.open('https://developers.minepi.com', '_blank')}
                        >
                          Setup Wallet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Global Country Selector */}
              <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5" />
                    <h3 className="font-semibold">Explore Parks Worldwide</h3>
                  </div>
                  
                  {/* Quick Select Popular */}
                  <div className="mb-3 pb-3 border-b border-white/20">
                    <p className="text-xs font-medium text-emerald-100 mb-2">Popular Destinations</p>
                    <div className="flex flex-wrap gap-2">
                      {["USA", "China", "South Africa", "Australia", "Brazil"].map((country) => (
                        <Button
                          key={country}
                          size="sm"
                          variant={selectedCountry === country ? "default" : "outline"}
                          className={`text-xs h-8 ${
                            selectedCountry === country
                              ? "bg-amber-500 text-white hover:bg-amber-600 border-0"
                              : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                          }`}
                          onClick={() => setSelectedCountry(country)}
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {country}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <div key={region.id}>
                        <p className="text-xs font-medium text-emerald-100 mb-1">{region.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {region.countries.map((country) => (
                            <Button
                              key={country}
                              size="sm"
                              variant={selectedCountry === country ? "default" : "outline"}
                              className={`text-xs h-7 ${
                                selectedCountry === country
                                  ? "bg-white text-emerald-700 hover:bg-white/90"
                                  : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                              }`}
                              onClick={() => setSelectedCountry(country)}
                            >
                              {country}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current: <strong>{selectedCountry}</strong></span>
                      {locationPermission === "granted" && userLocation && (
                        <Badge className="bg-amber-500 text-white border-0">
                          <Target className="h-3 w-3 mr-1" />
                          GPS Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Globe className="h-3 w-3" />
                      <span className="text-emerald-100">
                        {Object.keys(globalLocations).length} countries • {regions.length} regions covered
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Donation Card */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-amber-500 rounded-xl shadow-md">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-amber-900">Support PARKS</h3>
                      <p className="text-xs text-amber-700">Help keep this guide free for everyone</p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-800 mb-4 leading-relaxed">
                    PARKS is a free, community-driven resource. A 1 Pi donation helps cover hosting, map data, and ongoing updates for parks worldwide.
                  </p>
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md"
                    disabled={paymentProcessing}
                    onClick={handleDonation}
                  >
                    <Coins className={`h-4 w-4 mr-2 ${paymentProcessing ? "animate-spin" : ""}`} />
                    {paymentProcessing ? "Processing..." : "Donate 1 Pi to Support"}
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-emerald-900">Categories</h2>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-emerald-100">
                        <CardContent className="p-4 flex items-center space-x-3">
                          <div className={`p-3 rounded-xl ${category.color} shadow-md`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-sm text-emerald-900">{category.label}</span>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Pi Ad Network Banner */}
              <PiAd adSlot="parks-category-banner" format="banner" />

              {/* Featured Locations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-emerald-900">
                    Featured in {selectedCountry}
                  </h2>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Coins className="h-3 w-3 mr-1" />
                    Earn Pi
                  </Badge>
                </div>
                <div className="space-y-6">
                  {getDisplayLocations().map((location) => {
                    const locationGear = getLocationGear(location.type)
                    return (
                      <div key={location.id} className="space-y-3">
                        <Card className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-emerald-100 overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={location.image || "/placeholder.svg"}
                                alt={location.name}
                                width={600}
                                height={400}
                                className="w-full h-56 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <Badge className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-900 border-0 shadow-md">
                                {location.type}
                              </Badge>
                              <Badge className="absolute top-3 right-3 bg-emerald-600 text-white border-0 shadow-md">
                                {location.price}
                              </Badge>
                              <div className="absolute bottom-3 right-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                                <Coins className="h-3 w-3" />
                                +{location.piReward} Pi
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-emerald-900 text-balance">{location.name}</h3>
                                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                  <span className="text-sm ml-1 font-semibold text-amber-800">{location.rating}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-emerald-700 mb-3">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{location.location}</span>
                                <span className="text-sm ml-2 text-emerald-600">• {location.distance}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {location.amenities.slice(0, 4).map((amenity) => (
                                  <Badge key={amenity} variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Featured Gear Banner - 3 Product Ad Slots */}
                        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-amber-700" />
                                <h4 className="font-semibold text-sm text-amber-900">Featured Gear for {location.type}</h4>
                              </div>
                              <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                <Zap className="h-3 w-3 mr-1" />
                                Pay with Pi
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              {locationGear.map((product) => (
                                <Card key={product.id} className="bg-white border-amber-100 hover:shadow-md transition-shadow">
                                  <CardContent className="p-2">
                                    <div className="relative mb-2">
                                      <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={100}
                                        height={100}
                                        className="w-full h-20 object-cover rounded-md"
                                      />
                                      {product.stock < 10 && (
                                        <Badge className="absolute top-1 right-1 text-[9px] px-1 py-0 bg-red-500">
                                          {product.stock} left
                                        </Badge>
                                      )}
                                    </div>
                                    <h5 className="font-medium text-[10px] text-emerald-900 mb-1 line-clamp-2 leading-tight">
                                      {product.name}
                                    </h5>
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[9px]">
                                        <span className="text-gray-500 line-through">${product.price}</span>
                                        <div className="flex items-center gap-0.5 font-semibold text-amber-700">
                                          <Coins className="h-2.5 w-2.5" />
                                          {product.piPrice}
                                        </div>
                                      </div>
                                      <Button 
                                        size="sm" 
                                        className="w-full h-6 text-[9px] bg-amber-600 hover:bg-amber-700"
                                        onClick={() => handlePurchaseWithPi(product)}
                                        disabled={paymentProcessing}
                                      >
                                        <Coins className={`h-2.5 w-2.5 mr-1 ${paymentProcessing ? 'animate-spin' : ''}`} />
                                        {paymentProcessing ? 'Wait...' : 'Buy Now'}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pi Ad Network Rectangle */}
              <PiAd adSlot="parks-discover-footer" format="rectangle" />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="nearby" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-emerald-900">Nearby Locations</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 hover:text-white"
                  onClick={requestLocation}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {locationPermission === "granted" ? "Refresh GPS" : "Use GPS"}
                </Button>
              </div>

              {/* Location Status */}
              {locationPermission === "granted" && userLocation && (
                <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0 text-white">
                  <CardContent className="p-3 flex items-center gap-3">
                    <Target className="h-5 w-5 animate-pulse" />
                    <div>
                      <p className="font-semibold text-sm">GPS Location Active</p>
                      <p className="text-xs text-emerald-100">
                        Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    <Badge className="ml-auto bg-amber-500 text-white border-0">
                      {selectedCountry}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {locationPermission === "denied" && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-3">
                    <p className="text-sm text-amber-800">
                      Location access denied. Please enable GPS to see nearby locations.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Map Placeholder */}
              <Card className="overflow-hidden border-emerald-200">
                <CardContent className="p-0">
                  <div 
                    className="h-56 relative flex items-center justify-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm" />
                    <div className="text-center z-10">
                      <MapPin className="h-12 w-12 mx-auto mb-2 text-white drop-shadow-lg" />
                      <p className="text-white font-semibold text-lg drop-shadow-md">Interactive Map View</p>
                      <p className="text-sm text-emerald-50 drop-shadow">
                        {locationPermission === "granted" ? "Showing locations near you" : "Tap GPS to enable"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Locations in {selectedCountry}
                </h3>
                <div className="space-y-3">
                  {getDisplayLocations().map((location) => (
                    <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-emerald-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-xl">
                            <TreePine className="h-5 w-5 text-emerald-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-emerald-900">{location.name}</h3>
                            <p className="text-sm text-emerald-600">{location.type}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              <span className="text-xs text-emerald-700">{location.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="text-sm font-semibold text-emerald-700">{location.distance}</p>
                            <Badge variant="outline" className="text-xs mt-1 border-amber-300 text-amber-700">
                              <Coins className="h-2 w-2 mr-1" />
                              +{location.piReward}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700">
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-6">
              {/* Pi Rewards Info */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-500 rounded-2xl shadow-lg">
                      <Coins className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-amber-900 mb-2">Earn Pi Rewards</h3>
                      <p className="text-sm text-amber-800 leading-relaxed mb-3">
                        Share your adventures! Upload photos and videos to earn Pi cryptocurrency based on views and engagement.
                      </p>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="text-center bg-white/60 rounded-lg p-3">
                          <ImageIcon className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <p className="text-xs font-semibold text-amber-900">Photos</p>
                          <p className="text-xs text-amber-700">5-15 Pi</p>
                        </div>
                        <div className="text-center bg-white/60 rounded-lg p-3">
                          <ImageIcon className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <p className="text-xs font-semibold text-amber-900">Videos</p>
                          <p className="text-xs text-amber-700">20-50 Pi</p>
                        </div>
                        <div className="text-center bg-white/60 rounded-lg p-3">
                          <ImageIcon className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <p className="text-xs font-semibold text-amber-900">Per View</p>
                          <p className="text-xs text-amber-700">0.1 Pi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Section */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-emerald-900">Upload Content</h2>
                <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-emerald-900 mb-2">Share Your Experience</h3>
                      <p className="text-sm text-emerald-700 mb-4 text-pretty">
                        Upload photos or videos of your favorite parks and locations
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pi Ad Network in Upload Section */}
              <PiAd adSlot="parks-upload-banner" format="leaderboard" />

              {/* Your Contributions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-emerald-900">Your Contributions</h2>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Award className="h-3 w-3 mr-1" />
                    Top Creator
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-white/90 backdrop-blur-sm border-emerald-100">
                    <CardContent className="p-4 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                      <p className="text-2xl font-bold text-emerald-900">127</p>
                      <p className="text-xs text-emerald-600">Photos Uploaded</p>
                      <div className="mt-2 flex items-center justify-center gap-1 text-amber-600">
                        <Coins className="h-3 w-3" />
                        <span className="text-xs font-semibold">+635 Pi</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 backdrop-blur-sm border-emerald-100">
                    <CardContent className="p-4 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                      <p className="text-2xl font-bold text-emerald-900">43</p>
                      <p className="text-xs text-emerald-600">Videos Uploaded</p>
                      <div className="mt-2 flex items-center justify-center gap-1 text-amber-600">
                        <Coins className="h-3 w-3" />
                        <span className="text-xs font-semibold">+1,720 Pi</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Uploads with Rewards */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-emerald-900">Recent Uploads - Claim Your Rewards</h3>
                <div className="space-y-3">
                  {[
                    { id: 1, type: "Photo", views: 245, earned: 24.5 },
                    { id: 2, type: "Video", views: 892, earned: 89.2 },
                    { id: 3, type: "Photo", views: 156, earned: 15.6 },
                  ].map((upload) => (
                    <Card key={upload.id} className="bg-white/90 backdrop-blur-sm border-emerald-100">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={`https://images.unsplash.com/photo-${1500000000000 + upload.id * 10000000}?w=200&h=200&fit=crop`}
                                alt={`Upload ${upload.id}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-emerald-900">{upload.type} Upload</p>
                              <p className="text-xs text-emerald-600">{upload.views} views</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Coins className="h-3 w-3 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-700">
                                  {upload.earned} Pi earned
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => handleContentReward(upload.type, upload.views)}
                            disabled={paymentProcessing}
                          >
                            <Coins className={`h-3 w-3 mr-1 ${paymentProcessing ? 'animate-spin' : ''}`} />
                            {paymentProcessing ? 'Wait...' : 'Claim'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[4, 5, 6, 7, 8, 9].map((item) => (
                    <div key={item} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-${1500000000000 + item * 10000000}?w=200&h=200&fit=crop`}
                        alt={`Upload ${item}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 right-1 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5">
                        <Coins className="h-2 w-2" />
                        +{5 + item * 2}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pets" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div 
              className="relative p-4 space-y-6"
              style={{
                backgroundImage: "linear-gradient(to bottom, rgba(16, 185, 129, 0.05), transparent)",
              }}
            >
              {/* Pet Guidelines */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-rose-100 rounded-xl mr-2">
                    <PawPrint className="h-5 w-5 text-rose-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900">Pet Guidelines & Rules</h2>
                </div>
                <div className="space-y-3">
                  {petGuidelines.map((guideline, index) => (
                    <Card key={index} className="bg-white/90 backdrop-blur-sm border-rose-100">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 text-emerald-900">{guideline.location}</h3>
                        <Badge variant="secondary" className="mb-2 bg-rose-100 text-rose-800 border-rose-200">
                          {guideline.rule}
                        </Badge>
                        <p className="text-sm text-emerald-700 leading-relaxed">{guideline.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pet Services */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-emerald-900">Pet Services Nearby</h2>
                <div className="space-y-3">
                  {petServices.map((service) => {
                    const ServiceIcon = service.icon
                    return (
                      <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-rose-100">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-rose-100 rounded-xl shadow-sm">
                                <ServiceIcon className="h-5 w-5 text-rose-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-emerald-900">{service.name}</h3>
                                <p className="text-sm text-emerald-600">{service.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span className="text-sm ml-1 font-semibold text-amber-800">{service.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-emerald-600 mb-2 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {service.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {service.amenities.slice(0, 2).map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-rose-600">{service.price}</p>
                              <p className="text-xs text-emerald-600">{service.hours}</p>
                            </div>
                          </div>
                          <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="private" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-indigo-100 rounded-xl mr-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900">Private Property Agreements</h2>
                </div>
                <p className="text-sm text-emerald-700 mb-4 leading-relaxed">
                  Rent spots on private property for RV parking, camping, or stay in guest houses and cabins.
                </p>
              </div>

              <div className="space-y-4">
                {privateAgreements.map((spot) => (
                  <Card key={spot.id} className="cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-indigo-100 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={spot.image || "/placeholder.svg"}
                          alt={spot.name}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-indigo-900 border-0 shadow-md">
                          {spot.type}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-indigo-600 text-white border-0 shadow-md">
                          {spot.price}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-base text-emerald-900 text-balance">{spot.name}</h3>
                          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span className="text-sm ml-1 font-semibold text-amber-800">{spot.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-emerald-600 mb-2">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">Host: {spot.host}</span>
                        </div>
                        <div className="flex items-center text-emerald-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{spot.location}</span>
                          <span className="text-sm ml-2">• {spot.distance}</span>
                        </div>
                        <p className="text-sm text-emerald-700 mb-3 leading-relaxed">{spot.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {spot.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                          Request Booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-indigo-600 rounded-2xl mx-auto w-fit mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-indigo-900">Host Your Property</h3>
                  <p className="text-sm text-indigo-700 mb-4 leading-relaxed text-pretty">
                    Have land or a guest space? List it for travelers and earn income!
                  </p>
                  <Button variant="outline" size="sm" className="bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-300">
                    Become a Host
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-xl mr-2">
                    <Wrench className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-emerald-900">Services & Resources</h2>
                </div>
                <Button variant="outline" size="sm" className="bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 hover:text-white">
                  <Navigation className="h-4 w-4 mr-2" />
                  GPS
                </Button>
              </div>

              {/* Map Placeholder */}
              <Card className="overflow-hidden border-emerald-200">
                <CardContent className="p-0">
                  <div 
                    className="h-64 relative"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-emerald-900/30 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {serviceResources.map((service, index) => (
                        <div
                          key={service.id}
                          className="absolute cursor-pointer transition-transform hover:scale-125"
                          style={{
                            top: `${30 + index * 20}%`,
                            left: `${25 + index * 20}%`,
                          }}
                        >
                          <div className="bg-white rounded-full p-3 shadow-xl border-4 border-emerald-500 relative">
                            {(() => {
                              const ServiceIcon = service.icon
                              return <ServiceIcon className="h-6 w-6 text-emerald-700" />
                            })()}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                      <p className="text-white font-bold text-lg drop-shadow-lg">Interactive Service Map</p>
                      <p className="text-sm text-emerald-50 drop-shadow">Tap markers to view service details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-emerald-900">Nearby Services</h3>
                {serviceResources.map((service) => {
                  const ServiceIcon = service.icon
                  return (
                    <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-emerald-100">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
                            <ServiceIcon className="h-6 w-6 text-emerald-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-bold text-sm text-emerald-900">{service.name}</h3>
                                <p className="text-xs text-emerald-600">{service.category}</p>
                              </div>
                              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span className="text-xs ml-1 font-semibold text-amber-800">{service.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-emerald-600 mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="text-xs">{service.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {service.services.slice(0, 3).map((item) => (
                                <Badge key={item} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                <Phone className="h-3 w-3 mr-1" />
                                {service.contact}
                              </Button>
                              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                <Navigation className="h-3 w-3 mr-1" />
                                Navigate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3 flex items-center text-red-900">
                    <Clock className="h-5 w-5 mr-2 text-red-600" />
                    Emergency Services
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-white/60 p-2 rounded-lg">
                      <span className="text-emerald-900">Park Rangers:</span>
                      <span className="font-bold text-red-700">(555) 911-PARK</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-2 rounded-lg">
                      <span className="text-emerald-900">Roadside Assistance:</span>
                      <span className="font-bold text-red-700">(555) ROAD-911</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-2 rounded-lg">
                      <span className="text-emerald-900">Medical Emergency:</span>
                      <span className="font-bold text-red-700">911</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
