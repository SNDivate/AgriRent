"use client";
// import { NextUIProvider } from "@nextui-org/system";
import { SessionProvider } from "next-auth/react";
// import { StoreProviders } from "./redux/provider";

// import { ThemeProvider } from "next-themes";
export const AuthProvider = ({ children }) => {
  return (<SessionProvider>
    {children}
  
    </SessionProvider>)
};
