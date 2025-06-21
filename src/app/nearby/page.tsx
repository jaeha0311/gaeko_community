'use client';

import { ArrowLeft, Search, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"

export default function NearbyPage() {
  return (
    <WithBottomMenu>
      <div className="min-h-screen bg-[#f2f2f5] flex flex-col max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#ffffff]">
          <Button variant="ghost" size="icon" className="p-0">
            <ArrowLeft className="h-6 w-6 text-[#121417]" />
          </Button>
          <h1 className="text-xl font-semibold text-[#121417]">Nearby Breeders</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-[#ffffff]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7582]" />
            <Input
              placeholder="Search for breeders"
              className="pl-10 bg-[#f2f2f5] border-none text-[#6b7582] placeholder:text-[#6b7582]"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 relative">
          {/* Map Frame */}
          <div className="relative mx-auto" style={{ width: "fit-content" }}>
            {/* Wooden Frame */}
            <div className="bg-gradient-to-br from-[#d4b896] to-[#c4a882] p-4 rounded-lg shadow-lg">
              {/* White Matting */}
              <div className="bg-[#ffffff] p-4 rounded-sm">
                {/* Map Image */}
                <div className="w-80 h-96 bg-gradient-to-br from-[#4a9b8e] to-[#5fb3a3] relative overflow-hidden rounded-sm">
                  {/* Street Grid Pattern */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 320 384"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Vertical Lines */}
                    {Array.from({ length: 20 }, (_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 16}
                        y1="0"
                        x2={i * 16}
                        y2="384"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {/* Horizontal Lines */}
                    {Array.from({ length: 24 }, (_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 16}
                        x2="320"
                        y2={i * 16}
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {/* Main Roads */}
                    <line x1="80" y1="0" x2="80" y2="384" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    <line x1="160" y1="0" x2="160" y2="384" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    <line x1="240" y1="0" x2="240" y2="384" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    <line x1="0" y1="96" x2="320" y2="96" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    <line x1="0" y1="192" x2="320" y2="192" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    <line x1="0" y1="288" x2="320" y2="288" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                    {/* Diagonal Roads */}
                    <line x1="0" y1="0" x2="320" y2="192" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                    <line x1="0" y1="384" x2="320" y2="192" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 bg-[#ffffff] border-[#6b7582] text-[#121417] hover:bg-[#f2f2f5]"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 bg-[#ffffff] border-[#6b7582] text-[#121417] hover:bg-[#f2f2f5]"
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WithBottomMenu>
  )
}
