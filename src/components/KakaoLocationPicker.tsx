'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KakaoLocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, locationName?: string) => void;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  className?: string;
}

export function KakaoLocationPicker({ 
  onLocationSelect, 
  initialLatitude, 
  initialLongitude, 
  className = '' 
}: KakaoLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    locationName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const getLocationName = async (latitude: number, longitude: number): Promise<string | undefined> => {
    try {
      const geocoder = new (window as any).kakao.maps.services.Geocoder();
      
      return new Promise((resolve) => {
        geocoder.coord2Address(longitude, latitude, (result: any, status: string) => {
          if (status === (window as any).kakao.maps.services.Status.OK) {
            const address = result[0].address;
            const roadAddress = result[0].road_address;
            
            // 도로명주소가 있으면 도로명주소 사용, 없으면 지번주소 사용
            if (roadAddress) {
              const locationName = `${roadAddress.region_1depth_name} ${roadAddress.region_2depth_name} ${roadAddress.road_name}`;
              resolve(locationName);
            } else {
              const locationName = `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
              resolve(locationName);
            }
          } else {
            resolve(undefined);
          }
        });
      });
    } catch (error) {
      console.error('Failed to get location name:', error);
      return undefined;
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !mapLoaded || !(window as any).kakao?.maps) return;

    // Clear existing map container
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    // Default to Seoul if no initial location
    const defaultLat = initialLatitude || 37.5665;
    const defaultLng = initialLongitude || 126.9780;

    const options = {
      center: new (window as any).kakao.maps.LatLng(defaultLat, defaultLng),
      level: 5
    };

    mapInstanceRef.current = new (window as any).kakao.maps.Map(mapRef.current, options);

    // Handle map click
    (window as any).kakao.maps.event.addListener(mapInstanceRef.current, 'click', async (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      
      setLoading(true);
      
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      markerRef.current = new (window as any).kakao.maps.Marker({
        position: new (window as any).kakao.maps.LatLng(lat, lng)
      });

      markerRef.current.setMap(mapInstanceRef.current);

      // Get location name
      const locationName = await getLocationName(lat, lng);
      
      const location = {
        latitude: lat,
        longitude: lng,
        locationName
      };

      setSelectedLocation(location);

      // Add info window
      if (locationName) {
        const infowindow = new (window as any).kakao.maps.InfoWindow({
          content: `<div style="padding: 10px; min-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 5px;">📍 ${locationName}</div>
          </div>`
        });
        infowindow.open(mapInstanceRef.current, markerRef.current);
      }

      setLoading(false);
    });

    // Add initial marker if coordinates provided
    if (initialLatitude && initialLongitude) {
      markerRef.current = new (window as any).kakao.maps.Marker({
        position: new (window as any).kakao.maps.LatLng(initialLatitude, initialLongitude)
      });
      markerRef.current.setMap(mapInstanceRef.current);
    }
  };

  useEffect(() => {
    // Check if Kakao Maps API is already loaded
    if ((window as any).kakao && (window as any).kakao.maps) {
      setMapLoaded(true);
      return;
    }

    // Load Kakao Maps API
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'demo'}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      // Initialize Kakao Maps API
      (window as any).kakao.maps.load(() => {
        setMapLoaded(true);
        if (mapRef.current) {
          initializeMap();
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded]);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(
        selectedLocation.latitude,
        selectedLocation.longitude,
        selectedLocation.locationName
      );
    }
  };

  if (!mapLoaded) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white rounded-lg border">
          <div className="flex items-center justify-center" style={{ height: '300px' }}>
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm">지도를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border">
        <div 
          ref={mapRef}
          className="w-full rounded-lg"
          style={{ height: '300px' }}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm">위치 정보를 가져오는 중...</span>
        </div>
      )}

      {selectedLocation && (
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {selectedLocation.locationName || 
                `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
            </span>
          </div>
          
          {selectedLocation.locationName && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div>📍 {selectedLocation.locationName}</div>
              <div className="text-gray-400 mt-1">
                좌표: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </div>
            </div>
          )}
          
          <Button
            onClick={handleConfirmLocation}
            className="w-full"
            disabled={loading}
          >
            이 위치로 설정
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        지도를 클릭하여 위치를 선택하세요
      </p>
    </div>
  );
} 