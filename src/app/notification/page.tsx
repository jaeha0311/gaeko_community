'use client';

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"

export default function NotificationPage() {
    const notifications = {
        today: [
            {
                id: 1,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Liam",
                action: "started following you",
                time: "12h",
            },
            {
                id: 2,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Ethan",
                action: "commented on your post",
                time: "1d",
            },
            {
                id: 3,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Sophia",
                action: "liked your post",
                time: "2d",
            },
        ],
        thisWeek: [
            {
                id: 4,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Noah",
                action: "sent you a message",
                time: "3d",
            },
            {
                id: 5,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Ava",
                action: "mentioned you in a comment",
                time: "4d",
            },
            {
                id: 6,
                avatar: "/placeholder.svg?height=48&width=48",
                name: "Jackson",
                action: "liked your post",
                time: "5d",
            },
        ],
    }

    return (
        <WithBottomMenu>
            <div className="max-w-sm mx-auto bg-[#ffffff] min-h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pt-12">
                    <Button variant="ghost" size="icon" className="p-0">
                        <ArrowLeft className="h-6 w-6 text-[#121417]" />
                    </Button>
                    <h1 className="text-xl font-semibold text-[#121417]">Notifications</h1>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="flex-1 px-4 pb-20">
                    {/* Today Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#121417] mb-6">Today</h2>
                        <div className="space-y-4">
                            {notifications.today.map((notification) => (
                                <div key={notification.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f2f2f5] flex-shrink-0">
                                        <Image
                                            src={notification.avatar || "/placeholder.svg"}
                                            alt={notification.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#121417] text-base">
                                            <span className="font-medium">{notification.name}</span> {notification.action}
                                        </p>
                                    </div>
                                    <span className="text-[#6b7582] text-sm">{notification.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* This Week Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#121417] mb-6">This Week</h2>
                        <div className="space-y-4">
                            {notifications.thisWeek.map((notification) => (
                                <div key={notification.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f2f2f5] flex-shrink-0">
                                        <Image
                                            src={notification.avatar || "/placeholder.svg"}
                                            alt={notification.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#121417] text-base">
                                            <span className="font-medium">{notification.name}</span> {notification.action}
                                        </p>
                                    </div>
                                    <span className="text-[#6b7582] text-sm">{notification.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </WithBottomMenu>
    )
}
