'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem } from "@nextui-org/react"
import Image from "next/image"
import { toast } from "sonner"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const { confirmPassword, ...userData } = formData
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("User Registered Successfully")
        setFormData({
          name: "",
          email: "",
          phone: "",
          gender: "",
          password: "",
          confirmPassword: "",
        })
        router.push("/login")
      } else {
        throw new Error(data.error || "Failed to Register")
      }
    } catch (error) {
      console.error("Error during registration:", error)
      toast.error(error.message || "Registration failed. Please try again.")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="hidden lg:flex w-1/2 justify-center items-center bg-blue-600 rounded-r-[10%]">
        <Image
          src="/backReg.png"
          width={600}
          height={600}
          alt="Registration"
          className="object-cover rounded-r-[10%]"
        />
      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-3 text-center">
            <h1 className="text-2xl font-bold">Create Your Account</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  label="Email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="phone"
                  label="Phone"
                  placeholder="+91 xxxxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Select
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={formData.gender ? [formData.gender] : []}
                  onChange={(e) => handleChange({ target: { name: 'gender', value: e.target.value } })}
                  required
                >
                  <SelectItem key="Male" value="Male">Male</SelectItem>
                  <SelectItem key="Female" value="Female">Female</SelectItem>
                  <SelectItem key="Other" value="Other">Other</SelectItem>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="password"
                  label="Password"
                  placeholder="Strong password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button color="primary" type="submit" className="flex-1">
                  Register
                </Button>
                <Button color="secondary" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <Button
                as="a"
                href="/login"
                variant="light"
                color="primary"
                className="p-0"
              >
                Login
              </Button>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

