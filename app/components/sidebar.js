"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboardIcon, 
  PackageIcon, 
  CalendarRangeIcon, 
  LogOutIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "lucide-react";
import { Button } from "@nextui-org/react";

const sidebarItems = [
  {
    key: "dashboard",
    name: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    key: "equipment",
    name: "Equipment",
    href: "/user/equipments",
    icon: PackageIcon,
  },
  {
    key: "book-equipment",
    name: "Book Equipment",
    href: "/user/booking",
    icon: CalendarRangeIcon,
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    sessionStorage.clear();
    router.replace("/");
  };

  return (
    <div
      className={`h-screen flex flex-col bg-gray-800 text-white shadow-lg transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col items-center justify-center p-4 border-b border-gray-700">
        <Image
          src="/logo.jpg" 
          width={40} 
          height={40} 
          alt="Company Logo"
        />
        {!isCollapsed && (
          <span className="text-sm font-semibold mt-2">Agrirent</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow mt-4">
        <ul className="space-y-2 px-3">
          {sidebarItems.map(({ key, name, href, icon: Icon }) => (
            <li key={key}>
              <Link href={href} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all">
                <Icon size={22} />
                {!isCollapsed && <span className="text-sm font-medium">{name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          color="danger"
          variant="light"
          startContent={<LogOutIcon size={20} />}
          className="w-full flex justify-start hover:bg-red-600"
          onClick={handleSignOut}
        >
          {!isCollapsed && "Log Out"}
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
