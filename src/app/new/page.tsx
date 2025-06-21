"use client"
import { X, ImageIcon, Play, Smile, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomMenu from "@/components/ui/BottomMenu"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

export default function Component() {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

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

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleYoutubeLink = () => {
        const link = prompt("YouTube 링크를 입력하세요:");
        if (link) {
            setYoutubeLink(link);
        }
    };

    const handleEmojiSelect = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const emojis = ["😊", "😍", "🎉", "🔥", "💪", "🌟", "❤️", "👍", "🎯", "✨"];

    const handleEmojiClick = (emoji: string) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-[600px] mx-auto bg-[#ffffff] min-h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#f2f2f5]">
                    <Button variant="ghost" size="icon" className="p-0 h-8 w-8" onClick={handleCancel}>
                        <X className="h-6 w-6 text-[#121417]" />
                    </Button>
                    <h1 className="text-xl font-semibold text-[#121417]">New Post</h1>
                    <div className="w-8" /> {/* Spacer for centering */}
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto pb-20">
                    {/* Content Area */}
                    <div className="p-4 space-y-6">
                        {/* Text Input Area */}
                        <div className="space-y-4">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="무엇을 생각하고 계신가요?"
                                className="w-full h-32 p-4 border border-[#f2f2f5] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
                            {/* Selected Content Display */}
                            {selectedImage && (
                                <div className="relative">
                                    <img 
                                        src={URL.createObjectURL(selectedImage)} 
                                        alt="Selected" 
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 bg-white rounded-full"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            
                            {youtubeLink && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">YouTube 링크: {youtubeLink}</p>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setYoutubeLink("")}
                                        className="text-red-500 text-xs"
                                    >
                                        제거
                                    </Button>
                                </div>
                            )}
                            
                            {selectedEmoji && (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{selectedEmoji}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setSelectedEmoji("")}
                                        className="text-red-500 text-xs"
                                    >
                                        제거
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Add to your post */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-[#121417]">Add to your post</h2>

                            <div className="flex justify-between gap-4 relative">
                                <div className="flex flex-col items-center flex-1">
                                    <button 
                                        onClick={handleImageUpload}
                                        className="bg-[#f2f2f5] rounded-full p-4 mb-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <ImageIcon className="h-6 w-6 text-[#6b7582]" />
                                    </button>
                                    <span className="text-sm text-[#121417]">Photo</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                <div className="flex flex-col items-center flex-1">
                                    <button 
                                        onClick={handleYoutubeLink}
                                        className="bg-[#f2f2f5] rounded-full p-4 mb-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <Play className="h-6 w-6 text-[#6b7582]" />
                                    </button>
                                    <span className="text-sm text-[#121417]">Video</span>
                                </div>

                                <div className="flex flex-col items-center flex-1">
                                    <button 
                                        onClick={handleEmojiSelect}
                                        className="bg-[#f2f2f5] rounded-full p-4 mb-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <Smile className="h-6 w-6 text-[#6b7582]" />
                                    </button>
                                    <span className="text-sm text-[#121417]">Feeling/Activity</span>
                                </div>
                                
                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div ref={emojiPickerRef} className="absolute bottom-full right-0 -translate-y-2 bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-10 w-1/2">
                                        <div className="grid grid-cols-5 gap-2">
                                            {emojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleEmojiClick(emoji)}
                                                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                </div>

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
