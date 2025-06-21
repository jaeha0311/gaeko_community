"use client"
import { Home, Users, Plus, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BottomMenu() {
  const router = useRouter();
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] bg-[#ffffff] border-t border-[#f0f2f5]">
      <div className="flex items-center justify-around py-3 px-4">
        <Button variant="ghost" size="icon" className="text-[#121417]">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#61758a]">
          <Users className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#61758a]" onClick={() => router.push("/new") }>
          <Plus className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#61758a]">
          <Bell className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#61758a]">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
} 