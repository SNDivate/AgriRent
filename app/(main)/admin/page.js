'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Card, CardBody, CardHeader, Avatar, Button, Spinner, Divider } from "@nextui-org/react"
import { User, Mail, Phone, Crown, Edit, Lock, BarChart3 } from 'lucide-react'

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchAdminData = async () => {
      if (status === "loading") return

      if (!session?.user?.email) {
        setLoading(false)
        setError("Please sign in to view your profile")
        return
      }

      try {
        const response = await axios.get(`/api/admin?email=${encodeURIComponent(session.user.email)}`)
        if (response.data && !response.data.error) {
          setAdminData(response.data)
        } else {
          setError(response.data.error || "Failed to fetch admin data")
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setError(error.response?.data?.error || "An error occurred while fetching admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [session, status])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="secondary" />
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

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardBody>
            <p className="text-lg font-medium">No admin data found</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex gap-3">
          <Avatar src={adminData.avatar || "/placeholder.svg"} size="lg" />
          <div className="flex flex-col">
            <p className="text-md">Welcome back,</p>
            <p className="text-lg font-bold">{adminData.fullname}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Full Name" value={adminData.fullname} icon={<User className="text-primary" />} />
            <ProfileField label="Email" value={adminData.email} icon={<Mail className="text-primary" />} />
            <ProfileField label="Phone" value={adminData.phone} icon={<Phone className="text-primary" />} />
            <ProfileField label="Role" value="Administrator" icon={<Crown className="text-primary" />} />
          </div>

          <Divider className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton label="Edit Profile" icon={<Edit size={18} />} onClick={() => {/* Handle edit */}} />
            <ActionButton label="Security Settings" icon={<Lock size={18} />} onClick={() => {/* Handle security settings */}} />
            <ActionButton label="View Dashboard" icon={<BarChart3 size={18} />} onClick={() => {/* Handle dashboard navigation */}} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

const ProfileField = ({ label, value, icon }) => (
  <div className="flex items-center space-x-3 p-2">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "N/A"}</p>
    </div>
  </div>
)

const ActionButton = ({ label, icon, onClick }) => (
  <Button
    onClick={onClick}
    startContent={icon}
    className="w-full"
    color="secondary"
    variant="flat"
  >
    {label}
  </Button>
)

export default AdminProfilePage

