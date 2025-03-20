'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Avatar, Button } from '@nextui-org/react';
import {
  UserIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  PackageIcon,
  CalendarRangeIcon,
} from 'lucide-react';

const AppSidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    sessionStorage.clear();
    router.replace('/');
  };

  const sidebarItems = [
    { key: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboardIcon size={20} /> },
    { key: 'equipment', name: 'Equipment', href: '/equipment', icon: <PackageIcon size={20} /> },
    { key: 'book-equipment', name: 'Book Equipment', href: '/book-equipment', icon: <CalendarRangeIcon size={20} /> },
  ];

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (!mounted) return null;

  return (
    <div
      className={`h-screen flex flex-col bg-green-100 border-r border-green-300 shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-300 bg-green-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <Avatar src={userProfile?.avatar || '/placeholder.svg'} size="md" className="ring-2 ring-green-500" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-green-900">{userProfile?.name || 'User'}</span>
              <span className="text-xs text-green-700">User Account</span>
            </div>
          </div>
        )}
        <Button isIconOnly variant="light" onClick={toggleCollapse} className="text-green-800">
          {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow mt-4 px-3">
        <ul className="space-y-3">
          {sidebarItems.map((item) => (
            <li key={item.key}>
              <Button
                variant="light"
                startContent={item.icon}
                className="w-full flex items-center gap-3 text-green-900 hover:bg-green-300 rounded-lg px-4 py-2 transition-all"
                onClick={() => router.push(item.href)}
              >
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-green-300 bg-green-200">
        <Button
          color="danger"
          variant="light"
          startContent={<LogOutIcon size={20} />}
          className="w-full flex items-center gap-3 text-red-700 hover:bg-red-200 rounded-lg px-4 py-2 transition-all"
          onClick={handleSignOut}
        >
          {!isCollapsed && 'Log Out'}
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
