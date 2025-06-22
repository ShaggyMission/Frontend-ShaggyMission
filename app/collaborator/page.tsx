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
      } catch {
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
              <h2 className="text-3xl font-bold text-black mb-4">Find Your Perfect Companion</h2>
              <p className="text-black/80 text-lg">Browse our available pets and find your new best friend</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border border-orange-300 rounded-lg"
                >
                  <div className="aspect-square relative">
                    <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-black font-semibold">
                      <span>{pet.name}</span>
                      <span className="text-sm font-normal text-orange-600">{pet.age}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-black/70 mb-4">{pet.description}</p>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold transition-colors duration-200">
                      <Heart className="mr-2 h-4 w-4 text-orange-700" />
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
              <h2 className="text-3xl font-bold text-black mb-4">Support Our Mission</h2>
              <p className="text-black/80 text-lg">Your donation helps us care for animals in need</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[25, 50, 100].map((amount) => (
                <Card
                  key={amount}
                  className="text-center hover:shadow-lg transition-shadow border border-orange-300 rounded-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-600 font-extrabold">${amount}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black/70 mb-4">
                      {amount === 25 && "Provides food for a pet for one week"}
                      {amount === 50 && "Covers medical checkup for one animal"}
                      {amount === 100 && "Sponsors a pet's care for one month"}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold transition-colors duration-200">
                      Donate ${amount}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      case "register":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Register a Pet</h2>
              <p className="text-black/80 text-lg">Help us find homes for animals in need</p>
            </div>
            <Card className="max-w-2xl mx-auto border border-orange-300 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-black font-semibold">Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pet Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter pet name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pet Type</label>
                    <select
                      className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Age</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Breed</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter breed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us about this pet..."
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold transition-colors duration-200">
                  <UserPlus className="mr-2 h-4 w-4 text-orange-700" />
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
    return <div className="text-center p-10 text-black">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl font-bold text-orange-900 select-none">Shaggy Mission</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-orange-800 font-semibold select-none">Welcome, {user.firstName}!</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white transition-colors duration-200"
              >
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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:shadow-none border-r border-orange-200`}
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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium
                      ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                          : "text-orange-800 hover:bg-orange-100"
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${activeSection === item.id ? "text-white" : "text-orange-600"}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{renderContent()}</main>
      </div>
    </div>
  )
}
