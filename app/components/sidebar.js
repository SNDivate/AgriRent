'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Avatar, Button } from "@nextui-org/react"
import { UserIcon, LogOutIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

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

  const sidebarItems = useMemo(() => {
    if (!userProfile?.role) return []

    const { role } = userProfile
    switch (role) {
      case "admin":
        return [
          { key: "profile", name: "Profile", href: "/admin", icon: <UserIcon size={20} /> },
        ]
      case "user":
        return [
          { key: "profile", name: "Profile", href: "/user", icon: <UserIcon size={20} /> },
        ]
      default:
        return []
    }
  }, [userProfile])

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  if (!mounted) {
    return null
  }

  return (
    <div className={`h-screen flex flex-col bg-gray-100 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Avatar
                src={userProfile?.avatar || "/placeholder.svg?height=40&width=40"}
                size="sm"
              />
              <span className="text-sm font-medium">{userProfile?.name || 'User'}</span>
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

        <nav className="flex-grow">
          <ul className="space-y-2 p-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <Button
                  variant="light"
                  startContent={item.icon}
                  className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
                  onClick={() => router.push(item.href)}
                >
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4">
          <Button
            color="danger"
            variant="light"
            startContent={<LogOutIcon size={20} />}
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
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

