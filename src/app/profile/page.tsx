'use client';

import { useState, useRef } from 'react';
import Image from "next/image"
import { Check, X, LogOut, Edit } from "lucide-react"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"
import { useUser } from "@/hooks/useUser"
import { ProfileEditForm } from "@/components/ProfileEditForm"
import { SettingsPopup } from "@/components/SettingsPopup"
import { InlineProfileEdit, InlineProfileEditRef } from "@/components/InlineProfileEdit"
import { UsernameSetup } from "@/components/UsernameSetup"
import { ProfileLoading } from "@/components/ui/ProfileLoading"
import { Database } from "@/types/feed"
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, feedsCount, loading, error, updateProfile } = useUser();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const inlineEditRef = useRef<InlineProfileEditRef>(null);
    const router = useRouter();

    const handleSaveProfile = async (profileData: Partial<Database['public']['Tables']['users']['Update']>) => {
        try {
            setSaving(true);
            await updateProfile(profileData);
            setShowEditForm(false);
            setIsEditMode(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleInlineSave = async (profileData: Partial<Database['public']['Tables']['users']['Update']>) => {
        try {
            setSaving(true);
            await updateProfile(profileData);
            setIsEditMode(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleUsernameSave = async (username: string) => {
        try {
            setSaving(true);
            await updateProfile({ username });
        } catch (err) {
            console.error('Failed to update username:', err);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
            } else {
                router.push('/login');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const handleEditProfile = () => {
        setIsEditMode(true);
    };

    const handleHeaderSave = async () => {
        if (inlineEditRef.current) {
            await inlineEditRef.current.submit();
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

    // Show username setup if username is not set
    if (!user.username) {
        return (
            <WithBottomMenu>
                <div className="max-w-sm mx-auto bg-white min-h-screen">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h1 className="text-xl font-semibold">Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-red-600" />
                        </button>
                    </div>

                    {/* Username Setup */}
                    <UsernameSetup
                        onSave={handleUsernameSave}
                        loading={saving}
                    />
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
                    {isEditMode ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={handleHeaderSave}
                                disabled={saving}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50"
                            >
                                <Check className="w-5 h-5 text-green-600" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-red-600" />
                        </button>
                    )}
                </div>

                {/* Profile Section */}
                {isEditMode ? (
                    <InlineProfileEdit
                        ref={inlineEditRef}
                        user={user}
                        onSave={handleInlineSave}
                        onCancel={handleCancelEdit}
                        loading={saving}
                    />
                ) : (
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

                        {/* Username (instead of full_name) */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            @{user.username}
                        </h2>

                        {/* Edit Profile Button */}
                        <button 
                            onClick={handleEditProfile}
                            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors mb-6"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            프로필 수정
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
                )}

                {/* Tabs */}
                {!isEditMode && (
                    <>
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
                    </>
                )}

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
                    onEditProfile={handleEditProfile}
                />
            </div>
        </WithBottomMenu>
    )
}
