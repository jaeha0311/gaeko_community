import Image from "next/image"
import { Settings, Home, MapPin, Plus, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Component() {
    return (
        <div className="max-w-sm mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-semibold">Profile</h1>
                <Settings className="w-6 h-6 text-gray-600" />
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center p-6">
                {/* Profile Image */}
                <div className="w-32 h-32 rounded-full bg-orange-100 mb-4 overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt="Profile picture"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name and Username */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Alex</h2>
                <p className="text-gray-500 mb-6">@alex_gecko</p>

                {/* Edit Profile Button */}
                <Button variant="outline" className="w-full bg-gray-100 text-gray-900 border-gray-200 rounded-full py-3 mb-6">
                    Edit Profile
                </Button>

                {/* Stats */}
                <div className="flex w-full justify-between mb-6">
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-2xl font-bold text-gray-900">12</span>
                        <span className="text-gray-500 text-sm">Posts</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 border-x border-gray-200">
                        <span className="text-2xl font-bold text-gray-900">25</span>
                        <span className="text-gray-500 text-sm">Followers</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-2xl font-bold text-gray-900">18</span>
                        <span className="text-gray-500 text-sm">Following</span>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-center text-gray-700 leading-relaxed mb-6">
                    Crested gecko enthusiast. Sharing my passion for these amazing creatures and connecting with fellow keepers.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button className="flex-1 py-3 text-center font-medium text-gray-900 border-b-2 border-gray-900">Posts</button>
                <button className="flex-1 py-3 text-center font-medium text-gray-500">Saved</button>
                <button className="flex-1 py-3 text-center font-medium text-gray-500">Liked</button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-1 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
                        <Image
                            src={`/placeholder.svg?height=200&width=200`}
                            alt={`Gecko photo ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t">
                <div className="flex justify-around py-3">
                    <Home className="w-6 h-6 text-gray-400" />
                    <MapPin className="w-6 h-6 text-gray-400" />
                    <Plus className="w-6 h-6 text-gray-400" />
                    <Bell className="w-6 h-6 text-gray-400" />
                    <User className="w-6 h-6 text-gray-900" />
                </div>
            </div>

            {/* Bottom padding to account for fixed navigation */}
            <div className="h-16"></div>
        </div>
    )
}
