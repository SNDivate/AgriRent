'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Card, CardBody, CardHeader, Avatar, Spinner, Divider } from "@nextui-org/react"

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return

      if (!session?.user?.email) {
        setLoading(false)
        setError("Please sign in to view your profile")
        return
      }

      try {
        const response = await axios.get(`/api/user?email=${encodeURIComponent(session.user.email)}`)
        if (response.data && !response.data.error) {
          setUserData(response.data)
        } else {
          setError(response.data.error || "Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError(error.response?.data?.error || "An error occurred while fetching user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session, status])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardBody>
            <p className="text-lg font-medium text-danger">{error}</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardBody>
            <p className="text-lg font-medium">No user data found</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex gap-3">
          <Avatar
            src={userData.profilePhoto || "/placeholder.svg?height=128&width=128"}
            size="lg"
            isBordered
            color="primary"
          />
          <div className="flex flex-col">
            <p className="text-md">{userData.name}</p>
            <p className="text-small text-default-500">{userData.email}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Full Name" value={userData.name} />
            <ProfileField label="Email" value={userData.email} />
            <ProfileField label="Gender" value={userData.gender} />
            <ProfileField label="Phone" value={userData.phone} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-small text-default-500">{label}</p>
    <p className="text-md">{value || "N/A"}</p>
  </div>
)

export default UserProfilePage

