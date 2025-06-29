'use client';

import { useState } from 'react';
import { X, MapPin, Loader2, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KakaoLocationMap } from '@/components/KakaoLocationMap';
import { KakaoLocationPicker } from '@/components/KakaoLocationPicker';
import { AddressSearchModal } from '@/components/AddressSearchModal';
import { Database } from '@/types/feed';
import { useLocation } from '@/hooks/useLocation';

interface ProfileEditFormProps {
  user: Database['public']['Tables']['users']['Row'];
  onSave: (data: Partial<Database['public']['Tables']['users']['Update']>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProfileEditForm({ user, onSave, onCancel, loading }: ProfileEditFormProps) {
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [tempLocationData, setTempLocationData] = useState<{
    latitude: number;
    longitude: number;
    locationName: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    username: user.username || '',
    description: user.description || '',
    location_name: user.location_name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
  };

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  const handleMapLocationSelect = (latitude: number, longitude: number, locationName?: string) => {
    // Update the location state
    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      if (locationName) {
        location.locationName = locationName;
      }
    }
    
    // Update form data
    if (locationName) {
      setFormData(prev => ({ ...prev, location_name: locationName }));
    }
    
    setShowMapPicker(false);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
              disabled={loading}
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">
              Username can be changed in settings
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                onClick={() => setShowAddressSearch(true)}
                placeholder="위치를 입력하세요 (클릭하여 검색)"
                disabled={loading}
                className="flex-1 cursor-pointer"
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddressSearch(true)}
                disabled={loading}
                className="px-3"
                title="Search address"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={loading || locationLoading}
                className="px-3"
                title="Get current location"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMapPicker(true)}
                disabled={loading}
                className="px-3"
                title="Pick location on map"
              >
                <Globe className="w-4 h-4" />
              </Button>
            </div>
            {locationError && (
              <p className="text-xs text-red-500 mt-1">{locationError}</p>
            )}
            {location && (
              <p className="text-xs text-green-600 mt-1">
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

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {/* Map Picker Modal */}
        {showMapPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">위치 선택</h3>
                <button
                  onClick={() => setShowMapPicker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <KakaoLocationPicker
                  onLocationSelect={handleMapLocationSelect}
                  initialLatitude={location?.latitude || user.latitude}
                  initialLongitude={location?.longitude || user.longitude}
                />
              </div>
            </div>
          </div>
        )}

        {/* Address Search Modal */}
        <AddressSearchModal
          isOpen={showAddressSearch}
          onClose={() => setShowAddressSearch(false)}
          onAddressSelect={handleAddressSearchSelect}
        />
      </div>
    </div>
  );
} 