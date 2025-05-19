"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && (
          <Link 
            href="/home" 
            className="group relative text-lg font-semibold transition-colors hover:text-purple-600"
          >
            <span className="relative z-10">Agil App</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {!isCollapsed && "Menu"}
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                !isCollapsed && "gap-2"
              )}
              onClick={() => !isCollapsed && setIsSubmenuOpen(!isSubmenuOpen)}
            >
              <span className={cn(isCollapsed && "hidden")}>Job Tasks</span>
              {!isCollapsed && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isSubmenuOpen && "rotate-180"
                  )}
                />
              )}
            </Button>
            {!isCollapsed && isSubmenuOpen && (
              <div className="ml-4 space-y-1">
                <Link
                  href="/agil-definitions"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Agil Definitions
                </Link>
                <Link
                  href="/stories"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Stories
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
} 