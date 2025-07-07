"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, LogOut, Users, PawPrint, DollarSign, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface UserData {
  role: string
  email: string
  userId: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  updatedAt: string
}

interface Pet {
  _id: string
  name: string
  breed: string
  age: number
  healthStatus: string
  description: string
  location: string
  images: string[]
  createdAt: string
  updatedAt: string
}

interface PetsResponse {
  pets: Pet[]
  currentPage: number
  totalPages?: number
}

interface AdoptionRequest {
  id: string
  userId: string
  petId: string
  message?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  pet?: Pet
  user?: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeSection, setActiveSection] = useState("dashboard")

  // User management states
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [currentUserPage, setCurrentUserPage] = useState(1)

  // Pet states
  const [pets, setPets] = useState<Pet[]>([])
  const [petsLoading, setPetsLoading] = useState(false)
  const [currentPetPage, setCurrentPetPage] = useState(1)
  const [totalPetPages, setTotalPetPages] = useState(1)

  // Pet registration states
  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    healthStatus: "Good",
    description: "",
    location: "",
    images: "",
  })
  const [petFormLoading, setPetFormLoading] = useState(false)
  const [petFormSuccess, setPetFormSuccess] = useState(false)

  // Search states
  const [searchBreed, setSearchBreed] = useState("")
  const [searchResults, setSearchResults] = useState<Pet[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Pet management states
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    breed: "",
    age: "",
    healthStatus: "Good",
    description: "",
    location: "",
    images: "",
  })

  // Adoption states
  const [showAdoptModal, setShowAdoptModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [adoptionMessage, setAdoptionMessage] = useState("")
  const [adoptionLoading, setAdoptionLoading] = useState(false)

  // Admin adoption requests states
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([])
  const [adoptionRequestsLoading, setAdoptionRequestsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }

      try {
        const roleResponse = await fetch(`http://34.232.173.120:3003/roles/user-role/${userId}`)

        if (roleResponse.ok) {
          const roleData = await roleResponse.json()
          setUserData({
            role: roleData.role || "NoRole",
            email: "demo@shaggy-mission.com",
            userId: userId,
          })
        } else {
          setUserData({
            role: "NoRole",
            email: "demo@shaggy-mission.com",
            userId: userId,
          })
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
        setError("Error loading user data")
        setUserData({
          role: "NoRole",
          email: "demo@shaggy-mission.com",
          userId: userId,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [router])

  // Fetch users for admin
  const fetchUsers = async (page = 1) => {
    setUsersLoading(true)
    try {
      const response = await fetch(`http://34.232.173.120:3005/users/list?page=${page}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || data)
        setCurrentUserPage(page)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setUsersLoading(false)
    }
  }

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`http://34.232.173.120:8085/users/${userId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchUsers(currentUserPage) // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  // Fetch pets
  const fetchPets = async (page = 1) => {
    setPetsLoading(true)
    try {
      const response = await fetch(`http://34.235.49.193:3009/pets/list?page=${page}`)
      if (response.ok) {
        const data: PetsResponse = await response.json()
        setPets(data.pets)
        setCurrentPetPage(data.currentPage)
        setTotalPetPages(data.totalPages || 1)
      }
    } catch (error) {
      console.error("Error fetching pets:", error)
    } finally {
      setPetsLoading(false)
    }
  }

  // Register pet
  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPetFormLoading(true)

    const images = petForm.images
      ? petForm.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img)
      : ["/placeholder.svg?height=300&width=400"]

    const petData = {
      name: petForm.name,
      breed: petForm.breed,
      age: Number.parseInt(petForm.age),
      healthStatus: petForm.healthStatus,
      description: petForm.description,
      location: petForm.location,
      images: images,
    }

    try {
      const response = await fetch("http://34.235.49.193:3006/pets/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      })

      if (response.ok) {
        setPetFormSuccess(true)
        setPetForm({
          name: "",
          breed: "",
          age: "",
          healthStatus: "Good",
          description: "",
          location: "",
          images: "",
        })
        setTimeout(() => setPetFormSuccess(false), 3000)
        // Refresh pets list if we're viewing it
        if (activeSection === "pets") {
          fetchPets(currentPetPage)
        }
      }
    } catch (error) {
      console.error("Error registering pet:", error)
    } finally {
      setPetFormLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://34.232.173.120:3002/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      localStorage.removeItem("userId")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem("userId")
      router.push("/")
    }
  }

  // Search pets by breed using GraphQL
  const searchPetsByBreed = async () => {
    if (!searchBreed.trim()) return

    setSearchLoading(true)
    try {
      const query = `
        query {
          getPetsByBreed(breed: "${searchBreed}") {
            id
            name
            age
            healthStatus
            location
            breed
            description
            images
          }
        }
      `

      const response = await fetch("http://34.235.49.193:3011/graphql/search/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.data.getPetsByBreed || [])
      }
    } catch (error) {
      console.error("Error searching pets:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  // Update pet (Admin only)
  const updatePet = async (petId: string) => {
    if (!editingPet) return

    const images = editForm.images
      ? editForm.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img)
      : ["/placeholder.svg?height=300&width=400"]

    const petData = {
      name: editForm.name,
      breed: editForm.breed,
      age: Number.parseInt(editForm.age),
      healthStatus: editForm.healthStatus,
      description: editForm.description,
      location: editForm.location,
      images: images,
    }

    try {
      const response = await fetch(`http://34.235.49.193:3007/pets/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      })

      if (response.ok) {
        setEditingPet(null)
        fetchPets(currentPetPage) // Refresh the list
      }
    } catch (error) {
      console.error("Error updating pet:", error)
    }
  }

  // Delete pet (Admin only)
  const deletePet = async (petId: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) return

    try {
      const response = await fetch(`http://34.235.49.193:3008/pets/${petId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchPets(currentPetPage) // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting pet:", error)
    }
  }

  // Start editing a pet
  const startEditPet = (pet: Pet) => {
    setEditingPet(pet)
    setEditForm({
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      healthStatus: pet.healthStatus,
      description: pet.description,
      location: pet.location,
      images: pet.images.join(", "),
    })
  }

  // Submit adoption request
  const submitAdoptionRequest = async () => {
    if (!selectedPet || !userData) return

    setAdoptionLoading(true)
    try {
      const response = await fetch("http://54.88.156.54:3015/adoption-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          petId: selectedPet._id,
          message: adoptionMessage,
        }),
      })

      if (response.ok) {
        setShowAdoptModal(false)
        setSelectedPet(null)
        setAdoptionMessage("")
        alert("Adoption request submitted successfully!")
      }
    } catch (error) {
      console.error("Error submitting adoption request:", error)
    } finally {
      setAdoptionLoading(false)
    }
  }

  // Fetch adoption requests (Admin only)
  const fetchAdoptionRequests = async () => {
    setAdoptionRequestsLoading(true)
    try {
      const response = await fetch("http://54.88.156.54:3016/list/adoption-requests")
      if (response.ok) {
        const data = await response.json()
        setAdoptionRequests(data.requests || data)
      }
    } catch (error) {
      console.error("Error fetching adoption requests:", error)
    } finally {
      setAdoptionRequestsLoading(false)
    }
  }

  // Handle adoption request (Admin only - simulated)
  const handleAdoptionRequest = async (requestId: string, action: "approve" | "reject") => {
    // Simulate the action
    setAdoptionRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: action === "approve" ? "approved" : "rejected" } : request,
      ),
    )
    alert(`Adoption request ${action}d successfully!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-orange-500 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const isAdmin = userData.role === "Admin"
  const isContributor = userData.role === "Contributor"
  const hasNoRole = userData.role === "NoRole"

  if (hasNoRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-full p-2 mr-3">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Shaggy Mission</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>No Role Assigned</CardTitle>
              <CardDescription>
                Your account doesn't have a role assigned yet. Please contact an administrator to get access.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/shaggy-logo.png" alt="Shaggy Mission" className="h-12 w-12 mr-3 rounded-lg" />
              <h1 className="text-2xl font-bold text-gray-900">Shaggy Mission</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">Demo User</p>
                  <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className={isAdmin ? "bg-orange-500" : "bg-blue-500"}
                  >
                    {userData.role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeSection === "dashboard"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveSection("pets")
                fetchPets(1)
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeSection === "pets"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pets
            </button>
            <button
              onClick={() => setActiveSection("register-pet")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeSection === "register-pet"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Register Pet
            </button>
            {isContributor && (
              <button
                onClick={() => setActiveSection("donate")}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === "donate"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Donate
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveSection("users")
                  fetchUsers(1)
                }}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === "users"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Users
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveSection("adoption-requests")
                  fetchAdoptionRequests()
                }}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === "adoption-requests"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Adoption Requests
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Welcome, {isAdmin ? "Administrator" : isContributor ? "Contributor" : "User"}!
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    {isAdmin
                      ? "You have full access to manage the platform and oversee all activities."
                      : isContributor
                        ? "You can register pets, help with adoption tasks, and support our mission through donations."
                        : "Welcome to Shaggy Mission platform."}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Dashboard Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Registered Pets</CardTitle>
                  <PawPrint className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Adoptions</CardTitle>
                  <Heart className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 this month</p>
                </CardContent>
              </Card>

              {isAdmin && (
                <>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">48</div>
                      <p className="text-xs text-muted-foreground">+5 this month</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Donations</CardTitle>
                      <DollarSign className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$2,450</div>
                      <p className="text-xs text-muted-foreground">+$320 this week</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </>
        )}

        {/* Pets Section */}
        {activeSection === "pets" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Available Pets</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPets(currentPetPage - 1)}
                  disabled={currentPetPage <= 1 || petsLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Page {currentPetPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPets(currentPetPage + 1)}
                  disabled={currentPetPage >= totalPetPages || petsLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Pets by Breed</CardTitle>
                <CardDescription>Use GraphQL to search for pets by their breed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter breed (e.g., Golden Retriever)"
                    value={searchBreed}
                    onChange={(e) => setSearchBreed(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchPetsByBreed()}
                  />
                  <Button onClick={searchPetsByBreed} disabled={searchLoading}>
                    {searchLoading ? "Searching..." : "Search"}
                  </Button>
                  {searchResults.length > 0 && (
                    <Button variant="outline" onClick={() => setSearchResults([])}>
                      Clear Results
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Search Results ({searchResults.length} found)</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((pet) => (
                    <Card key={pet.id || pet._id} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={pet.images?.[0] || "/placeholder.svg?height=300&width=400"}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{pet.name}</span>
                          <Badge variant="secondary">{pet.age} years</Badge>
                        </CardTitle>
                        <CardDescription>
                          <p className="font-medium">{pet.breed}</p>
                          <p className="text-sm text-gray-600">{pet.location}</p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={pet.healthStatus === "Good" ? "default" : "secondary"}
                            className={pet.healthStatus === "Good" ? "bg-green-500" : ""}
                          >
                            {pet.healthStatus}
                          </Badge>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={() => {
                              setSelectedPet(pet)
                              setShowAdoptModal(true)
                            }}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Adopt
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Pets */}
            {petsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading pets...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <Card key={pet._id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={pet.images[0] || "/placeholder.svg?height=300&width=400"}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{pet.name}</span>
                        <Badge variant="secondary">{pet.age} years</Badge>
                      </CardTitle>
                      <CardDescription>
                        <p className="font-medium">{pet.breed}</p>
                        <p className="text-sm text-gray-600">{pet.location}</p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-2">{pet.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <Badge
                          variant={pet.healthStatus === "Good" ? "default" : "secondary"}
                          className={pet.healthStatus === "Good" ? "bg-green-500" : ""}
                        >
                          {pet.healthStatus}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => {
                            setSelectedPet(pet)
                            setShowAdoptModal(true)
                          }}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Adopt
                        </Button>
                      </div>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <div className="flex space-x-2 pt-2 border-t">
                          <Button size="sm" variant="outline" onClick={() => startEditPet(pet)} className="flex-1">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deletePet(pet._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Pet Modal */}
            {editingPet && isAdmin && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Edit Pet: {editingPet.name}</CardTitle>
                    <CardDescription>Update the pet information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        updatePet(editingPet._id)
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Pet Name</Label>
                          <Input
                            id="edit-name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-breed">Breed</Label>
                          <Input
                            id="edit-breed"
                            value={editForm.breed}
                            onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-age">Age (years)</Label>
                          <Input
                            id="edit-age"
                            type="number"
                            value={editForm.age}
                            onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-healthStatus">Health Status</Label>
                          <select
                            id="edit-healthStatus"
                            value={editForm.healthStatus}
                            onChange={(e) => setEditForm({ ...editForm, healthStatus: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Needs Care">Needs Care</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                          id="edit-location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-images">Images</Label>
                        <Input
                          id="edit-images"
                          value={editForm.images}
                          onChange={(e) => setEditForm({ ...editForm, images: e.target.value })}
                          placeholder="Enter image URLs separated by commas"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                          Update Pet
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingPet(null)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Register Pet Section */}
        {activeSection === "register-pet" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Register a New Pet</h2>

            {petFormSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">Pet registered successfully!</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
                <CardDescription>Fill in the details for the pet that needs a home</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePetSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Pet Name</Label>
                      <Input
                        id="name"
                        value={petForm.name}
                        onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                        required
                        disabled={petFormLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={petForm.breed}
                        onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                        required
                        disabled={petFormLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        value={petForm.age}
                        onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                        required
                        disabled={petFormLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="healthStatus">Health Status</Label>
                      <select
                        id="healthStatus"
                        value={petForm.healthStatus}
                        onChange={(e) => setPetForm({ ...petForm, healthStatus: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={petFormLoading}
                      >
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Needs Care">Needs Care</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={petForm.location}
                      onChange={(e) => setPetForm({ ...petForm, location: e.target.value })}
                      required
                      disabled={petFormLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={petForm.description}
                      onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                      rows={3}
                      required
                      disabled={petFormLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Images (optional)</Label>
                    <Input
                      id="images"
                      value={petForm.images}
                      onChange={(e) => setPetForm({ ...petForm, images: e.target.value })}
                      placeholder="Enter image URLs separated by commas"
                      disabled={petFormLoading}
                    />
                    <p className="text-xs text-gray-500">Leave empty to use default pet image</p>
                  </div>

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={petFormLoading}>
                    {petFormLoading ? "Registering..." : "Register Pet"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donate Section (Contributors only) */}
        {activeSection === "donate" && isContributor && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Support Our Mission</h2>
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Your donation helps us care for animals in need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500">
                    <CardHeader>
                      <CardTitle className="text-2xl text-orange-500">$1</CardTitle>
                      <CardDescription>Provides food for a pet for one day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Donate $1</Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500">
                    <CardHeader>
                      <CardTitle className="text-2xl text-orange-500">$5</CardTitle>
                      <CardDescription>Covers basic medical supplies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Donate $5</Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500">
                    <CardHeader>
                      <CardTitle className="text-2xl text-orange-500">$10</CardTitle>
                      <CardDescription>Sponsors a pet's care for one week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Donate $10</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management Section (Admin only) */}
        {activeSection === "users" && isAdmin && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(currentUserPage - 1)}
                  disabled={currentUserPage <= 1 || usersLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Page {currentUserPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(currentUserPage + 1)}
                  disabled={usersLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm text-gray-500">
                          <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                          <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Adoption Requests Section (Admin only) */}
        {activeSection === "adoption-requests" && isAdmin && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Adoption Requests</h2>

            {adoptionRequestsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading adoption requests...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {adoptionRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">Adoption Request #{request.id.slice(-6)}</h3>
                              <p className="text-gray-600">
                                User: {request.user?.firstName} {request.user?.lastName} ({request.user?.email})
                              </p>
                              <p className="text-sm text-gray-500">
                                Pet: {request.pet?.name} - {request.pet?.breed}
                              </p>
                              <p className="text-sm text-gray-500">
                                Submitted: {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {request.message && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                              <p className="text-gray-600">{request.message}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              request.status === "approved"
                                ? "bg-green-500"
                                : request.status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>

                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleAdoptionRequest(request.id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAdoptionRequest(request.id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {adoptionRequests.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No adoption requests found.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Adoption Request Modal */}
        {showAdoptModal && selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Adopt {selectedPet.name}</CardTitle>
                <CardDescription>Tell us why you'd like to adopt this {selectedPet.breed}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={selectedPet.images[0] || "/placeholder.svg?height=60&width=60"}
                      alt={selectedPet.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{selectedPet.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedPet.breed} • {selectedPet.age} years
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adoption-message">Why do you want to adopt this pet? (Optional)</Label>
                    <Textarea
                      id="adoption-message"
                      value={adoptionMessage}
                      onChange={(e) => setAdoptionMessage(e.target.value)}
                      placeholder="Tell us about your experience with pets, your living situation, and why you'd be a great match..."
                      rows={4}
                      disabled={adoptionLoading}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={submitAdoptionRequest}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      disabled={adoptionLoading}
                    >
                      {adoptionLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAdoptModal(false)
                        setSelectedPet(null)
                        setAdoptionMessage("")
                      }}
                      disabled={adoptionLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
