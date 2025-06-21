"use client"
import { X, ImageIcon, Play, Smile, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomMenu from "@/components/ui/BottomMenu"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Component() {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCancel = () => {
        setShowConfirm(true);
    };

    const handleConfirmYes = () => {
        router.back();
        setShowConfirm(false);
    };

    const handleConfirmNo = () => {
        setShowConfirm(false);
    };

    return (
        <div className="bg-[#ffffff] min-h-screen max-w-sm mx-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#f2f2f5]">
                <Button variant="ghost" size="icon" className="p-0 h-8 w-8" onClick={handleCancel}>
                    <X className="h-6 w-6 text-[#121417]" />
                </Button>
                <h1 className="text-xl font-semibold text-[#121417]">New Post</h1>
                <div className="w-8" /> {/* Spacer for centering */}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 space-y-6">
                {/* Placeholder Content Area */}
                <div className="bg-[#f2f2f5] rounded-lg h-64 w-full"></div>

                {/* Add to your post */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-[#121417]">Add to your post</h2>

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col items-center flex-1">
                            <div className="bg-[#f2f2f5] rounded-full p-4 mb-2">
                                <ImageIcon className="h-6 w-6 text-[#6b7582]" />
                            </div>
                            <span className="text-sm text-[#121417]">Photo</span>
                        </div>

                        <div className="flex flex-col items-center flex-1">
                            <div className="bg-[#f2f2f5] rounded-full p-4 mb-2">
                                <Play className="h-6 w-6 text-[#6b7582]" />
                            </div>
                            <span className="text-sm text-[#121417]">Video</span>
                        </div>

                        <div className="flex flex-col items-center flex-1">
                            <div className="bg-[#f2f2f5] rounded-full p-4 mb-2">
                                <Smile className="h-6 w-6 text-[#6b7582]" />
                            </div>
                            <span className="text-sm text-[#121417]">Feeling/Activity</span>
                        </div>
                    </div>
                </div>

                {/* Post details */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-[#121417]">Post details</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-3">
                            <span className="text-[#121417]">Select a category</span>
                            <ChevronRight className="h-5 w-5 text-[#6b7582]" />
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <span className="text-[#121417]">Privacy</span>
                            <ChevronRight className="h-5 w-5 text-[#6b7582]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Button */}
            <div className="p-4">
                <Button className="w-full bg-[#dbe8f2] hover:bg-[#dbe8f2]/80 text-[#121417] font-medium py-3 rounded-full">
                    Post
                </Button>
            </div>

            {/* Bottom Navigation */}
            <BottomMenu />

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-[#121417] mb-4">작성을 취소하시겠습니까?</h3>
                        <p className="text-[#61758a] text-sm mb-6">작성 중인 내용이 저장되지 않습니다.</p>
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1" 
                                onClick={handleConfirmNo}
                            >
                                No
                            </Button>
                            <Button 
                                className="flex-1 bg-red-500 hover:bg-red-600" 
                                onClick={handleConfirmYes}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
