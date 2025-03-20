"use client";
import React from "react";
import { AgriLogo } from "./AgriLogo";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <CustomNavbar className="top-2 bg-topGreen text-black px-6 py-3 shadow-md" />
    </div>
  );
}


function CustomNavbar({ className }) {
  return (
    <Navbar className={`${className} flex justify-between`}>
      {/* Left: Logo & Brand Name */}
      <NavbarBrand className="flex items-center gap-2">
        <AgriLogo />
        <p className="font-bold text-white text-lg">AgriRent</p>
      </NavbarBrand>

      {/* Center: Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#" className="text-gray-300 hover:text-white">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/user/equipments/page.js" className="text-gray-300 hover:text-white">
            Equipment
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="foreground" href="\components\about" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </NavbarItem>

      </NavbarContent>

      {/* Right: Login & Sign Up Buttons */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/register" className="text-gray-300 hover:text-white">
            Register
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
