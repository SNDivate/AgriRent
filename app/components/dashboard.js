'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardBody, CardFooter, Button, Spinner, Image } from "@nextui-org/react"
import { toast } from 'react-hot-toast'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const [equipment, setEquipment] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchEquipment()
    }
  }, [status])

  const fetchEquipment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!session?.user?.id) {
        throw new Error('User ID not found in session')
      }

      const response = await fetch('/api/userequipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: session.user.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch equipment')
      }

      const data = await response.json()
      setEquipment(data)
    } catch (error) {
      console.error('Error fetching equipment:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-danger text-lg">Please sign in to view your dashboard.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-danger text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Equipment</h1>
      {equipment.length === 0 ? (
        <p>You haven't added any equipment yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function EquipmentCard({ equipment }) {
  return (
    <Card className="max-w-sm">
      <CardHeader className="flex gap-3">
        <Image
          alt={equipment.name}
          height={40}
          radius="sm"
          src={equipment.image?.image_url || "/placeholder.svg"}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{equipment.name}</p>
          <p className="text-small text-default-500">{equipment.condition}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>{equipment.description}</p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <p className="text-default-500">Rental Price: ${equipment.rentalPrice}</p>
        <Button color="primary" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  )
}

