"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Settings, Bell, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import MainLogo from "@/public/main-log";
import ConvertDropDown from "@/components/Convert/ConvertDropDown";
import ToolsDropDown from "./Tools/ToolsDropDown";

export function NavBar() {
  const User = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "tools" | "convert" | null
  >(null);

  return (
    <header className="bg-[#06044b] text-white w-full ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <MainLogo />
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {/* Tools Drop Down */}
              <ToolsDropDown
                isOpen={activeDropdown === "tools"}
                onToggle={(open) => setActiveDropdown(open ? "tools" : null)}
              />
              {/* Convert Drop Down */}
              <ConvertDropDown
                isOpen={activeDropdown === "convert"}
                onToggle={(open) => setActiveDropdown(open ? "convert" : null)}
              />
              <Link
                href="#"
                className="px-3 py-2 text-sm font-medium hover:text-[#61e987]"
              >
                E - Sign
              </Link>
              <Link
                href={`/print-and-deliver/${User.user?.id}`}
                className="px-3 py-2 text-sm font-medium hover:text-[#61e987]"
              >
                Print & Deliver
              </Link>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-white text-black rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#61e987]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#06044b]/50"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#06044b]/50"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#06044b]/50"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>

            {/* Clerk Authentication */}
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-[#06044b]/50 hover:cursor-pointer"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    variant="outline"
                    className="text-white hover:bg-[#06044b]/50 border-white hover:cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-[#06044b]/50"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#06044b]/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#06044b] border-t border-[#ffffff]/10 py-2">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="#"
              className="block px-3 py-2 text-base font-medium hover:bg-[#06044b]/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 text-base font-medium hover:bg-[#06044b]/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Convert
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 text-base font-medium hover:bg-[#06044b]/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              E - Sign
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 text-base font-medium hover:bg-[#06044b]/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Print & Deliver
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 text-base font-medium hover:bg-[#06044b]/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
          </div>
          <div className="px-4 py-3 border-t border-[#ffffff]/10">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-white text-black rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#61e987]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#06044b]/50"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#06044b]/50"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#06044b]/50"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </div>

              <SignedOut>
                <SignUpButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white hover:bg-[#06044b]/50 border-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
