"use client";

import { Input } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Eye, EyeOff, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && session?.user) {
      toast.success("Login Successful! Redirecting...", { autoClose: 2000 });
      setTimeout(() => {
        session.user.role === "user" ? router.replace("/user") : router.replace("/admin");
      }, 2000);
    }
  }, [session, isMounted, router]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleExpand = () => setIsExpanded(true);
  const handleClose = () => setIsExpanded(false);
  const handleClear = () => {
    setEmail("");
    setPassword("");
    toast.info("Fields Cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.ok) {
        toast.success("Login Successful! Redirecting...");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);
      } else {
        toast.error("Login Failed! Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error("Failed to login", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <ToastContainer />
      <div className={`relative w-full max-w-4xl h-[380px] flex gap-4 transition-all duration-500 ease-in-out ${isExpanded ? "max-w-5xl" : ""}`}>
        {/* Left Side - Welcome Section (Clickable) */}
        <div
          className={`relative flex items-center justify-center p-8 rounded-xl shadow-lg cursor-pointer transition-all duration-500 ease-in-out ${
            isExpanded ? "w-full h-full" : "w-1/2 bg-gradient-to-r from-[#3D8D7A] via-[#9EDF9C] to-[#3D8D7A]"
          }`}
          onClick={handleExpand}
        >
          <h2 className="text-4xl font-bold text-white text-center leading-tight">Welcome Back!</h2>
        </div>

        {/* Right Side - Login Form */}
        {!isExpanded && (
          <div className="w-1/2 bg-white p-10 rounded-xl shadow-lg transition-opacity duration-500 ease-in-out">
            <Card className="bg-white shadow-none">
              <CardHeader className="text-center">
                <h2 className="text-3xl font-semibold text-gray-800">Login</h2>
              </CardHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <CardBody className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-gray-700">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 border rounded text-gray-500 focus:border-[#9EDF9C]"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label className="block text-gray-700">Password</label>
                    <Input
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded pr-10 text-gray-500 focus:border-[#9EDF9C]"
                      placeholder="Enter your password"
                    />
                    <span
                      className="absolute right-3 top-10 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </span>
                  </div>
                </CardBody>

                {/* Buttons Row - Login & Clear */}
                <CardFooter className="flex justify-between">
                  <Button type="submit" className="w-1/2 bg-[#3D8D7A] hover:bg-[#2F6E5C] text-white font-bold py-3 rounded-lg transition duration-300">
                    Login
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClear}
                    className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition duration-300 ml-4"
                  >
                    Clear
                  </Button>
                </CardFooter>

                <p className="text-sm text-gray-500 text-center mt-4">
                  Don't have an account? <a href="/register" className="text-[#3D8D7A] font-medium">Register</a>
                </p>
              </form>
            </Card>
          </div>
        )}

        {/* Close Button when Expanded */}
        {isExpanded && (
          <button
            className="absolute top-5 right-5 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300"
            onClick={handleClose}
          >
            <X size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
