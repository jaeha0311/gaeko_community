'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Check, X, Camera } from 'lucide-react';
import { Database } from '@/types/feed';
import { getUserByUsername } from '@/lib/api/users';

interface InlineProfileEditProps {
  user: Database['public']['Tables']['users']['Row'];
  onSave: (data: Partial<Database['public']['Tables']['users']['Update']>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface InlineProfileEditRef {
  submit: () => Promise<void>;
}

export const InlineProfileEdit = forwardRef<InlineProfileEditRef, InlineProfileEditProps>(
  ({ user, onSave, onCancel, loading }, ref) => {
    const [formData, setFormData] = useState({
      username: user.username || '',
      description: user.description || '',
      avatar_url: user.avatar_url || '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async () => {
      try {
        setUsernameError('');
        // Username validation
        if (!formData.username.trim()) {
          setUsernameError('사용자명을 입력해주세요');
          return;
        }
        if (formData.username.length < 3) {
          setUsernameError('사용자명은 3자 이상이어야 합니다');
          return;
        }
        if (formData.username.length > 20) {
          setUsernameError('사용자명은 20자 이하여야 합니다');
          return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          setUsernameError('사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다');
          return;
        }
        // Check for duplicate username (if changed)
        if (formData.username !== user.username) {
          const existing = await getUserByUsername(formData.username);
          if (existing) {
            setUsernameError('이미 사용 중인 사용자명입니다');
            return;
          }
        }
        const updateData: Partial<Database['public']['Tables']['users']['Update']> = {
          username: formData.username,
          description: formData.description,
        };
        if (avatarFile) {
          updateData.avatar_url = avatarPreview || formData.avatar_url;
        }
        await onSave(updateData);
      } catch (err) {
        setUsernameError('프로필 저장 중 오류가 발생했습니다');
        console.error('Failed to update profile:', err);
      }
    };

    const handleCancel = () => {
      setFormData({
        username: user.username || '',
        description: user.description || '',
        avatar_url: user.avatar_url || '',
      });
      setAvatarFile(null);
      setAvatarPreview(null);
      setUsernameError('');
      onCancel();
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <div className="flex flex-col items-center p-6">
        {/* Profile Image with Edit */}
        <div className="relative w-32 h-32 rounded-full bg-orange-100 mb-4 overflow-hidden group">
          <Image
            src={avatarPreview || formData.avatar_url || "/placeholder.svg?height=128&width=128"}
            alt="Profile picture"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Username Input */}
        <div className="w-full mb-4">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, username: e.target.value }));
              if (usernameError) setUsernameError('');
            }}
            placeholder="사용자명을 입력하세요"
            className="w-full text-gray-900 text-center bg-transparent border-b border-gray-300 focus:border-orange-500 focus:outline-none pb-1 text-lg"
            disabled={loading}
            maxLength={20}
          />
          {usernameError && (
            <p className="text-red-500 text-sm mt-2 text-center">{usernameError}</p>
          )}
        </div>

        {/* Description Input */}
        <div className="w-full mb-6">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="자기소개를 입력하세요"
            className="w-full text-center text-gray-700 bg-transparent border border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none resize-none"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 w-full">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-1" />
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4 mr-1" />
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    );
  }
);

InlineProfileEdit.displayName = 'InlineProfileEdit'; 