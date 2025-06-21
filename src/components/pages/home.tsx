import Image from "next/image"
import { Heart, MessageCircle, Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomMenu from "../ui/BottomMenu"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#ffffff] border-b border-[#f0f2f5] shadow-sm">
          <Button variant="ghost" size="icon" className="text-[#121417]">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-[#121417] font-semibold text-lg">Crested Gecko Community</h1>
          <Button variant="ghost" size="icon" className="text-[#121417]">
            <Search className="h-6 w-6" />
          </Button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {/* First Post */}
          <div className="mb-6 pt-4">
            <div className="rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=350"
                alt="Crested gecko in natural habitat with wood branches"
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <h2 className="text-[#121417] font-bold text-lg mb-2">{`My Gecko's New Enclosure<`}</h2>
            <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
              {`Check out the new setup for my crested gecko! I've added some new climbing branches and a humid hide.`}
            </p>
            <p className="text-[#61758a] text-sm mb-3">By @ReptileFanatic</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">23</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">5</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">2</span>
              </div>
            </div>
          </div>

          {/* Second Post */}
          <div className="mb-6">
            <div className="rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=350"
                alt="Crested gecko on wooden branch substrate"
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <h2 className="text-[#121417] font-bold text-lg mb-2">Feeding Tips for Healthy Geckos</h2>
            <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
              Sharing some tips on keeping your crested geckos healthy with a balanced diet. Variety is key!
            </p>
            <p className="text-[#61758a] text-sm mb-3">By @GeckoLover22</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">18</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">3</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">1</span>
              </div>
            </div>
          </div>

          {/* Third Post */}
          <div className="mb-6">
            <div className="rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=350"
                alt="Crested gecko with plant decoration in terrarium"
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <h2 className="text-[#121417] font-bold text-lg mb-2">Breeding Season Insights</h2>
            <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
              {`Discussing the breeding season for crested geckos. It's important to be prepared and understand the process.`}
            </p>
            <p className="text-[#61758a] text-sm mb-3">By @CrestedCare</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">15</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">2</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">0</span>
              </div>
            </div>
          </div>

          {/* Additional posts for testing scroll */}
          <div className="mb-6">
            <div className="rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=350"
                alt="Crested gecko with plant decoration in terrarium"
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <h2 className="text-[#121417] font-bold text-lg mb-2">Habitat Setup Guide</h2>
            <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
              Complete guide to setting up the perfect habitat for your crested gecko. From substrate to decorations!
            </p>
            <p className="text-[#61758a] text-sm mb-3">By @HabitatExpert</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">31</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">8</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">4</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=350"
                alt="Crested gecko with plant decoration in terrarium"
                width={350}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
            <h2 className="text-[#121417] font-bold text-lg mb-2">Health Monitoring Tips</h2>
            <p className="text-[#61758a] text-sm mb-2 leading-relaxed">
              How to monitor your gecko&apos;s health and recognize early signs of potential issues.
            </p>
            <p className="text-[#61758a] text-sm mb-3">By @VetTech</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">27</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">6</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-5 w-5 text-[#61758a]" />
                <span className="text-[#61758a] text-sm">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomMenu />
      </div>
    </div>
  )
}
