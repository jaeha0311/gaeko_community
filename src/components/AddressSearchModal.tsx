'use client';

import { useState, useEffect } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddressSearchResult {
  address_name: string;
  road_address?: {
    address_name: string;
  };
  x: string; // longitude
  y: string; // latitude
}

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: string, latitude: number, longitude: number) => void;
}

export function AddressSearchModal({ isOpen, onClose, onAddressSelect }: AddressSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressSearchResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedAddress(null);
    }
  }, [isOpen]);

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Check if Kakao Maps API is available
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(searchQuery, (result: AddressSearchResult[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setSearchResults(result);
          } else {
            setSearchResults([]);
            alert('주소를 찾을 수 없습니다. 다른 주소를 입력해주세요.');
          }
          setLoading(false);
        });
      } else {
        // Fallback to simple search
        setSearchResults([]);
        setLoading(false);
        alert('주소 검색 서비스를 사용할 수 없습니다.');
      }
    } catch (error) {
      console.error('Address search failed:', error);
      setLoading(false);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };

  const handleAddressSelect = (address: AddressSearchResult) => {
    setSelectedAddress(address);
  };

  const handleConfirmAddress = () => {
    if (selectedAddress) {
      const address = selectedAddress.address_name;
      const latitude = parseFloat(selectedAddress.y);
      const longitude = parseFloat(selectedAddress.x);
      
      onAddressSelect(address, latitude, longitude);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="주소를 입력하세요 (예: 강남대로)"
              className="flex-1"
            />
            <Button
              onClick={searchAddress}
              disabled={loading || !searchQuery.trim()}
              className="px-4"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">검색 결과</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleAddressSelect(result)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === result
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {result.address_name}
                        </div>
                        {result.road_address && (
                          <div className="text-sm text-gray-500 mt-1">
                            {result.road_address.address_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Address */}
          {selectedAddress && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-900">
                    선택된 주소
                  </div>
                  <div className="text-sm text-orange-700">
                    {selectedAddress.address_name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmAddress}
              disabled={!selectedAddress}
              className="flex-1"
            >
              이 주소로 설정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 