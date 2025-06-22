"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Gift, UserPlus, LogOut, Menu, X } from "lucide-react"

interface User {
  firstName?: string
  lastName?: string
  email?: string
}

export default function CollaboratorPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("adopt")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const pets = [
    {
      id: 1,
      name: "Buddy",
      type: "Dog",
      age: "2 years",
      image: "/placeholder.svg?height=300&width=300",
      description: "Friendly golden retriever looking for a loving home",
    },
    {
      id: 2,
      name: "Luna",
      type: "Cat",
      age: "1 year",
      image: "/placeholder.svg?height=300&width=300",
      description: "Playful kitten who loves to cuddle",
    },
    {
      id: 3,
      name: "Max",
      type: "Dog",
      age: "3 years",
      image: "/placeholder.svg?height=300&width=300",
      description: "Energetic border collie perfect for active families",
    },
    {
      id: 4,
      name: "Whiskers",
      type: "Cat",
      age: "4 years",
      image: "/placeholder.svg?height=300&width=300",
      description: "Calm and gentle cat who enjoys quiet moments",
    },
    {
      id: 5,
      name: "Rocky",
      type: "Dog",
      age: "5 years",
      image: "/placeholder.svg?height=300&width=300",
      description: "Loyal companion who loves long walks",
    },
    {
      id: 6,
      name: "Mittens",
      type: "Cat",
      age: "2 years",
      image: "/placeholder.svg?height=300&width=300",
      description: "Adorable tabby cat with white paws",
    },
  ]

  const sidebarItems = [
    { id: "adopt", label: "Adopt", icon: Heart },
    { id: "donate", label: "Donate", icon: Gift },
    { id: "register", label: "Register Pet", icon: UserPlus },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "adopt":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Companion</h2>
              <p className="text-gray-600 text-lg">Browse our available pets and find your new best friend</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{pet.name}</span>
                      <span className="text-sm font-normal text-gray-500">{pet.age}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4">{pet.description}</p>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      <Heart className="mr-2 h-4 w-4" />
                      Adopt {pet.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case "donate":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Support Our Mission</h2>
              <p className="text-gray-600 text-lg">Your donation helps us care for animals in need</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-600">$25</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Provides food for a pet for one week</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Donate $25
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-600">$50</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Covers medical checkup for one animal</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Donate $50
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-600">$100</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Sponsors a pet's care for one month</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Donate $100
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "register":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Register a Pet</h2>
              <p className="text-gray-600 text-lg">Help us find homes for animals in need</p>
            </div>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter pet name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter breed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us about this pet..."
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Pet
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Shaggy Mission</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none border-r`}
        >
          <div className="p-6 pt-20 lg:pt-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  )
}
