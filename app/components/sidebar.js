'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Avatar, Button } from "@nextui-org/react"
import {
  UserIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  PackageIcon,
  CalendarRangeIcon
} from 'lucide-react'

const AppSidebar = () => {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedProfile = sessionStorage.getItem('userProfile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    sessionStorage.clear()
    router.replace("/")
  }

  const sidebarItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboardIcon size={20} />,
      description: "View your profile and activities"
    },
    {
      key: "equipment",
      name: "Equipment",
      href: "/equipment",
      icon: <PackageIcon size={20} />,
      description: "Browse available equipment"
    },
    {
      key: "book-equipment",
      name: "Book Equipment",
      href: "/book-equipment",
      icon: <CalendarRangeIcon size={20} />,
      description: "Schedule equipment booking"
    }
  ]

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  if (!mounted) {
    return null
  }

  return (
    <div 
      className={`
        h-screen flex flex-col bg-gray-50 border-r border-gray-200
        ${isCollapsed ? 'w-16' : 'w-64'} 
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header with user info */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Avatar
                src={userProfile?.avatar || "/placeholder.svg?height=40&width=40"}
                size="sm"
                className="ring-2 ring-primary ring-offset-2"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">
                  {userProfile?.name || 'User'}
                </span>
                <span className="text-xs text-gray-500">User Account</span>
              </div>
            </div>
          )}
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle sidebar"
            className="hidden sm:flex"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow pt-4">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <Button
                  variant="light"
                  startContent={item.icon}
                  className={`
                    w-full justify-start text-gray-700 hover:text-primary
                    hover:bg-primary-50 group transition-colors
                    ${isCollapsed ? 'px-2' : 'px-4'}
                  `}
                  onClick={() => router.push(item.href)}
                >
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <Button
            color="danger"
            variant="light"
            startContent={<LogOutIcon size={20} />}
            className={`
              w-full justify-start hover:bg-danger-50
              ${isCollapsed ? 'px-2' : 'px-4'}
            `}
            onClick={handleSignOut}
          >
            {!isCollapsed && "Log Out"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppSidebar