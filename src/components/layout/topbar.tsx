"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"

export function Topbar() {
  return (
    <div className="flex h-14 items-center border-b bg-card px-4 shadow-sm">
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/login" />
      </div>
    </div>
  )
} 