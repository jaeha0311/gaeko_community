'use client';

import { useState } from 'react';
import Image from "next/image"
import { Settings } from "lucide-react"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"
import { useUser } from "@/hooks/useUser"
import { ProfileEditForm } from "@/components/ProfileEditForm"
import { SettingsPopup } from "@/components/SettingsPopup"
import { ProfileLoading } from "@/components/ui/ProfileLoading"
import { Database } from "@/types/feed"

export default function ProfilePage() {
    const { user, feedsCount, loading, error, updateProfile } = useUser();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async (profileData: Partial<Database['public']['Tables']['users']['Update']>) => {
        try {
            setSaving(true);
            await updateProfile(profileData);
            setShowEditForm(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <WithBottomMenu>
                <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
                    <ProfileLoading />
                </div>
            </WithBottomMenu>
        );
    }

    if (error) {
        return (
            <WithBottomMenu>
                <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">Error loading profile</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-orange-500 hover:text-orange-600"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </WithBottomMenu>
        );
    }

    if (!user) {
        return (
            <WithBottomMenu>
                <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Please log in to view your profile</p>
                    </div>
                </div>
            </WithBottomMenu>
        );
    }

    return (
        <WithBottomMenu>
            <div className="max-w-sm mx-auto bg-white min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-semibold">Profile</h1>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center p-6">
                    {/* Profile Image */}
                    <div className="w-32 h-32 rounded-full bg-orange-100 mb-4 overflow-hidden">
                        <Image
                            src={user.avatar_url || "/placeholder.svg?height=128&width=128"}
                            alt="Profile picture"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name and Username */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {user.full_name || 'Anonymous'}
                    </h2>
                    <p className="text-gray-500 mb-2">
                        @{user.username || 'user'}
                    </p>

                    {/* Tag */}
                    {user.tag && (
                        <p className="text-orange-600 font-medium mb-4">
                            {user.tag}
                        </p>
                    )}

                    {/* Edit Profile Button */}
                    <button 
                        onClick={() => setShowEditForm(true)}
                        className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-full py-3 mb-6 hover:bg-gray-200 transition-colors"
                    >
                        Edit Profile
                    </button>

                    {/* Stats */}
                    <div className="flex w-full justify-between mb-6">
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-2xl font-bold text-gray-900">{feedsCount}</span>
                            <span className="text-gray-500 text-sm">Posts</span>
                        </div>
                        <div className="flex flex-col items-center flex-1 border-x border-gray-200">
                            <span className="text-2xl font-bold text-gray-900">0</span>
                            <span className="text-gray-500 text-sm">Followers</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-2xl font-bold text-gray-900">0</span>
                            <span className="text-gray-500 text-sm">Following</span>
                        </div>
                    </div>

                    {/* Description */}
                    {user.description && (
                        <p className="text-center text-gray-700 leading-relaxed mb-6">
                            {user.description}
                        </p>
                    )}
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

                {/* Edit Profile Modal */}
                {showEditForm && (
                    <ProfileEditForm
                        user={user}
                        onSave={handleSaveProfile}
                        onCancel={() => setShowEditForm(false)}
                        loading={saving}
                    />
                )}

                {/* Settings Popup */}
                <SettingsPopup
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                />
            </div>
        </WithBottomMenu>
    )
}
