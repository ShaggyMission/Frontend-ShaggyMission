"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Target, Zap, LogOut } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.firstName || user.name || "Collaborator")
      } catch (error) {
        setUserName("Collaborator")
      }
    } else {
      // If no user data, redirect to login
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const features = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Mission Ready",
      description: "Access your assigned missions and track progress",
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Team Collaboration",
      description: "Connect with other collaborators and share insights",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Real-time Updates",
      description: "Stay updated with live mission status and notifications",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Shaggy Mission</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, Collaborator{userName && ` ${userName}`}!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've successfully joined the Shaggy Mission platform. Get ready to embark on exciting missions and
            collaborate with fellow team members.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Mission?</h2>
            <p className="text-blue-100 mb-6">
              Your journey as a Shaggy Mission collaborator begins now. Explore the platform and discover what awaits
              you.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200">
              Explore Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Account successfully activated</span>
          </div>
        </div>
      </main>
    </div>
  )
}
