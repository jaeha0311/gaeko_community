'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Check, X, Camera, MapPin, Loader2, Search } from 'lucide-react';
import { Database } from '@/types/feed';
import { getUserByUsername } from '@/lib/api/users';
import { useLocation } from '@/hooks/useLocation';
import { KakaoLocationMap } from '@/components/KakaoLocationMap';
import { AddressSearchModal } from '@/components/AddressSearchModal';

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
    const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [tempLocationData, setTempLocationData] = useState<{
      latitude: number;
      longitude: number;
      locationName: string;
    } | null>(null);
    
    const [formData, setFormData] = useState({
      username: user.username || '',
      description: user.description || '',
      tag: user.tag || '',
      location_name: user.location_name || '',
      avatar_url: user.avatar_url || ''
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleAddressSearchSelect = (address: string, latitude: number, longitude: number) => {
      console.log('Address selected:', { address, latitude, longitude });
      
      // Create or update location object
      const newLocation = {
        latitude,
        longitude,
        locationName: address
      };
      
      // Update form data
      setFormData(prev => ({ ...prev, location_name: address }));
      
      // Store the location data for submission
      setTempLocationData(newLocation);
      setShowAddressSearch(false);
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
        
        const saveData: Partial<Database['public']['Tables']['users']['Update']> = { ...formData };
        
        // Include location data if available
        if (location) {
          saveData.latitude = location.latitude;
          saveData.longitude = location.longitude;
          if (location.locationName) {
            saveData.location_name = location.locationName;
          }
        }
        
        // Check for temporary location data from address search
        if (tempLocationData) {
          saveData.latitude = tempLocationData.latitude;
          saveData.longitude = tempLocationData.longitude;
          saveData.location_name = tempLocationData.locationName;
          setTempLocationData(null);
        }
        
        console.log('Saving profile data:', saveData);
        await onSave(saveData);
      } catch (err) {
        setUsernameError('프로필 저장 중 오류가 발생했습니다');
        console.error('Failed to update profile:', err);
      }
    };

    const handleCancel = () => {
      setFormData({
        username: user.username || '',
        description: user.description || '',
        tag: user.tag || '',
        location_name: user.location_name || '',
        avatar_url: user.avatar_url || ''
      });
      setAvatarPreview(null);
      setUsernameError('');
      onCancel();
    };

    const handleGetLocation = async () => {
      await getCurrentLocation();
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
        <div className="w-full mb-4">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="자기소개를 입력하세요"
            className="w-full text-center text-gray-700 bg-transparent border border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none resize-none"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Location Input */}
        <div className="w-full mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.location_name}
              onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
              onClick={() => setShowAddressSearch(true)}
              placeholder="위치를 입력하세요 (클릭하여 검색)"
              className="flex-1 text-center text-gray-700 bg-transparent border border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none cursor-pointer"
              disabled={loading}
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowAddressSearch(true)}
              disabled={loading}
              className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="주소 검색"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loading || locationLoading}
              className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>
          {locationError && (
            <p className="text-red-500 text-sm mt-2 text-center">{locationError}</p>
          )}
          {location && (
            <p className="text-green-600 text-sm mt-2 text-center">
              위치 업데이트됨: {location.locationName || '주소 정보를 가져올 수 없습니다'}
            </p>
          )}

          {/* Location Map Preview */}
          {(location || tempLocationData || (user.latitude && user.longitude)) && (
            <div className="mt-3">
              <KakaoLocationMap
                latitude={tempLocationData?.latitude || location?.latitude || user.latitude}
                longitude={tempLocationData?.longitude || location?.longitude || user.longitude}
                locationName={tempLocationData?.locationName || location?.locationName || user.location_name}
                className="w-full"
              />
            </div>
          )}
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

        {/* Address Search Modal */}
        <AddressSearchModal
          isOpen={showAddressSearch}
          onClose={() => setShowAddressSearch(false)}
          onAddressSelect={handleAddressSearchSelect}
        />
      </div>
    );
  }
);

InlineProfileEdit.displayName = 'InlineProfileEdit'; 