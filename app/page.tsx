import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, PawPrint } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-orange-500 rounded-full p-3 mr-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Shaggy Mission</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Connecting hearts with pets that need a home</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <PawPrint className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Adopt</CardTitle>
              <CardDescription>Find your perfect companion among our available pets</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Donate</CardTitle>
              <CardDescription>Help care for and feed animals waiting for a home</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Collaborate</CardTitle>
              <CardDescription>Join our mission by registering pets that need help</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Already have an account?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
