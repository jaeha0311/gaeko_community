"use client"
import { Home, MapPin, Plus, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

export default function BottomMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] bg-[#ffffff] border-t border-[#f0f2f5]">
      <div className="flex items-center justify-around py-3 px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={isActive('/') ? "text-[#121417]" : "text-[#61758a]"}
          onClick={() => router.push("/")}
        >
          <Home className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={isActive('/nearby') ? "text-[#121417]" : "text-[#61758a]"}
          onClick={() => router.push("/nearby")}
        >
          <MapPin className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={isActive('/new') ? "text-[#121417]" : "text-[#61758a]"}
          onClick={() => router.push("/new")}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={isActive('/notification') ? "text-[#121417]" : "text-[#61758a]"}
          onClick={() => router.push("/notification")}
        >
          <Bell className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={isActive('/profile') ? "text-[#121417]" : "text-[#61758a]"}
          onClick={() => router.push("/profile")}
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
} 