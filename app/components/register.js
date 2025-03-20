// 'use client'

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Input, Button, Select } from "@nextui-org/react";
// import { toast } from "sonner"
// import { Select, SelectItem } from "@nextui-org/react";


// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [submitted, setSubmitted] = useState(null); // Fix: Define submitted state
//   const router = useRouter()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match")
//       return
//     }

//     try {
//       const { confirmPassword, ...userData } = formData
//       const response = await fetch('/api/user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         toast.success("User Registered Successfully")
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           gender: "",
//           password: "",
//           confirmPassword: "",
//         })
//         setSubmitted(userData); // Fix: Store submitted data
//         router.push("/login")
//       } else {
//         throw new Error(data.error || "Failed to Register")
//       }
//     } catch (error) {
//       console.error("Error during registration:", error)
//       toast.error(error.message || "Registration failed. Please try again.")
//     }
//   }

//   const handleCancel = () => {
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       gender: "",
//       password: "",
//       confirmPassword: "",
//     })
//   }

//   return (
//     <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input isRequired label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
//         <Input
//           isRequired
//           errorMessage="Please enter a valid email"
//           label="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="johndoe@example.com"
//           type="email"
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input isRequired label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 xxxxxxxxxx" />
//         <Select
//           isRequired
//           label="Gender"
//           name="gender"
//           selectedKeys={new Set([formData.gender])} // Correct way to set selected value
//           onSelectionChange={(keys) => setFormData((prev) => ({ ...prev, gender: [...keys][0] }))} // Correct event handling
//           placeholder="Select gender"
//         >
//           <SelectItem key="Male">Male</SelectItem>
//           <SelectItem key="Female">Female</SelectItem>
//           <SelectItem key="Other">Other</SelectItem>
//         </Select>

//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           isRequired
//           label="Password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Enter your password"
//           type="password"
//         />
//         <Input
//           isRequired
//           label="Confirm Password"
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           placeholder="Re-enter your password"
//           type="password"
//         />
//       </div>
//       <div className="flex justify-between gap-4">
//         <Button type="submit" variant="bordered" color="primary">
//           Register
//         </Button>
//         <Button type="button" onClick={handleCancel} variant="bordered" color="secondary">
//           Cancel
//         </Button>
//       </div>

//       {/* Fix: Show submitted data only if it exists */}
//       {submitted && (
//         <div className="text-small text-default-500">
//           You submitted: <code>{JSON.stringify(submitted)}</code>
//         </div>
//       )}

//       <p className="text-center text-sm">
//         Already have an account? <a href="/login" className="text-blue-500">Login</a>
//       </p>
//     </form>
//   );
// }
