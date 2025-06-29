'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, locationName?: string) => void;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  className?: string;
}

export function LocationPicker({ 
  onLocationSelect, 
  initialLatitude, 
  initialLongitude, 
  className = '' 
}: LocationPickerProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    locationName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const getLocationName = async (latitude: number, longitude: number): Promise<string | undefined> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const data = await response.json();
      return data.display_name || undefined;
    } catch (error) {
      console.error('Failed to get location name:', error);
      return undefined;
    }
  };

  useEffect(() => {
    if (!mapLoaded) return;

    // @ts-expect-error - Leaflet is loaded dynamically
    const L = window.L;
    if (!L) return;

    // Default to Seoul if no initial location
    const defaultLat = initialLatitude || 37.5665;
    const defaultLng = initialLongitude || 126.9780;

    // Create map
    const map = L.map('location-picker-map').setView([defaultLat, defaultLng], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker: any = null;

    // Handle map click
    map.on('click', async (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      
      setLoading(true);
      
      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Add new marker
      marker = L.marker([lat, lng]).addTo(map);

      // Get location name
      const locationName = await getLocationName(lat, lng);
      
      const location = {
        latitude: lat,
        longitude: lng,
        locationName
      };

      setSelectedLocation(location);

      if (locationName) {
        marker.bindPopup(locationName).openPopup();
      }

      setLoading(false);
    });

    // Add initial marker if coordinates provided
    if (initialLatitude && initialLongitude) {
      marker = L.marker([initialLatitude, initialLongitude]).addTo(map);
      if (selectedLocation?.locationName) {
        marker.bindPopup(selectedLocation.locationName).openPopup();
      }
    }

    return () => {
      map.remove();
    };
  }, [mapLoaded, initialLatitude, initialLongitude, selectedLocation?.locationName]);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(
        selectedLocation.latitude,
        selectedLocation.longitude,
        selectedLocation.locationName
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border">
        <div 
          id="location-picker-map" 
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