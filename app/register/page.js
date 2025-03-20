"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    toast.success("Registration Successful!", { position: "top-right" });
    console.log("Form Data Submitted", formData);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      number: "",
      gender: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      
      {/* Left Side - Form Section */}
      <div className="w-3/5 flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Register for an Account</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input type="text" name="name" value={formData.name} className="w-full p-2 border rounded" onChange={handleChange} required placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input type="email" name="email" value={formData.email} className="w-full p-2 border rounded" onChange={handleChange} required placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input type="text" name="number" value={formData.number} className="w-full p-2 border rounded" onChange={handleChange} required placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} className="w-full p-2 border rounded text-gray-400" onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} className="w-full p-2 border rounded pr-10" onChange={handleChange} required placeholder="Enter a strong password" />
              <span className="absolute right-3 top-10 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
              </span>
            </div>
            <div className="relative">
              <label className="block text-gray-700">Confirm Password</label>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} className="w-full p-2 border rounded pr-10" onChange={handleChange} required placeholder="Re-enter your password" />
              <span className="absolute right-3 top-10 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="col-span-2 flex gap-4">
              <button type="submit" className="w-full bg-[#3D8D7A] text-white p-2 rounded hover:bg-[#2F6E5C]">
                Register
              </button>
              <button type="button" onClick={handleClear} className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="w-2/5 bg-gradient-to-br from-[#3D8D7A] via-[#9EDF9C] to-[#3D8D7A] flex items-center justify-center rounded-l-[50px]">
        <h1 className="text-white text-2xl font-bold">Registration</h1>
      </div>
    </div>
  );
}