'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface KakaoLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  locationName?: string | null;
  className?: string;
}

export function KakaoLocationMap({ latitude, longitude, locationName, className = '' }: KakaoLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initializeMap = () => {
    if (!mapRef.current || !latitude || !longitude || !(window as any).kakao?.maps) return;

    // Clear existing map container
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    const options = {
      center: new (window as any).kakao.maps.LatLng(latitude, longitude),
      level: 3
    };

    mapInstanceRef.current = new (window as any).kakao.maps.Map(mapRef.current, options);

    // Add marker
    const markerPosition = new (window as any).kakao.maps.LatLng(latitude, longitude);
    markerRef.current = new (window as any).kakao.maps.Marker({
      position: markerPosition
    });

    markerRef.current.setMap(mapInstanceRef.current);

    // Add info window if location name is provided
    if (locationName) {
      const infowindow = new (window as any).kakao.maps.InfoWindow({
        content: `<div style="padding: 10px; min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 5px;">📍 ${locationName}</div>
        </div>`
      });
      
      (window as any).kakao.maps.event.addListener(markerRef.current, 'click', () => {
        infowindow.open(mapInstanceRef.current, markerRef.current);
      });
      
      // Auto open info window
      infowindow.open(mapInstanceRef.current, markerRef.current);
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
        if (mapRef.current && latitude && longitude) {
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
    if (mapLoaded && (window as any).kakao && mapRef.current && latitude && longitude) {
      initializeMap();
    }
  }, [mapLoaded, latitude, longitude, locationName]);

  if (!latitude || !longitude) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height: '200px' }}>
        <div className="text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">위치 정보가 없습니다</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height: '200px' }}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      <div 
        ref={mapRef}
        className="w-full rounded-lg"
        style={{ height: '200px' }}
      />
    </div>
  );
} 