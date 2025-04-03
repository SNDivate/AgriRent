"use client";
import React, { useState } from "react";
import { AgriLogo } from "./AgriLogo";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  VisuallyHidden,
  useSwitch
} from "@heroui/react";

// Moon Icon Component
export const MoonIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
};

// Sun Icon Component
export const SunIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
};

// Theme Switch Component
const ThemeSwitch = (props) => {
  const {Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps} =
    useSwitch(props);
  return (
    <div className="flex items-center">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-8 h-8",
              "flex items-center justify-center",
              "rounded-lg bg-default-100 hover:bg-default-200",
              "text-white"
            ],
          })}
        >
          {isSelected ? <SunIcon /> : <MoonIcon />}
        </div>
      </Component>
    </div>
  );
};

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <CustomNavbar className="top-2 bg-topGreen text-black px-6 py-3 shadow-md" />
    </div>
  );
}

function CustomNavbar({ className }) {
  const [isSelected, setIsSelected] = useState(false);

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
          <Link color="foreground" href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
        </NavbarItem>
        {/* <NavbarItem>
          <Link color="foreground" href="/user/equipments/page.js" className="text-gray-300 hover:text-white">
            Equipment
          </Link>
        </NavbarItem> */}
        
        <NavbarItem>
          <Link color="foreground" href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      
      {/* Right: Theme Switcher, Login & Sign Up Buttons */}
      <NavbarContent justify="end" className="gap-4">
       
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
        <NavbarItem>
          <ThemeSwitch 
            isSelected={isSelected}
            onValueChange={setIsSelected}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}