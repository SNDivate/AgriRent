'use client'

import React, { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, CardFooter, Input, Button } from "@nextui-org/react"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function LoginComponent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (session?.user?.role === "user") {
        router.replace("/user")
      } else if (session?.user?.role === "admin") {
        router.replace("/admin")
      }
    }
  }, [session, isMounted, router])

  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result.ok) {
        console.log("Login Successful!")
      } else {
        console.error("Login failed!")
      }
    } catch (error) {
      console.error("Failed to login", error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl font-bold">Login</h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </CardBody>
          <CardFooter>
            <Button type="submit" color="primary" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

