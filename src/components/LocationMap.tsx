'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  locationName?: string | null;
  className?: string;
}

export function LocationMap({ latitude, longitude, locationName, className = '' }: LocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

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

  useEffect(() => {
    if (!mapLoaded || !latitude || !longitude) return;

    // @ts-expect-error - Leaflet is loaded dynamically
    const L = window.L;
    if (!L) return;

    // Create map
    const map = L.map('location-map').setView([latitude, longitude], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude]).addTo(map);
    
    if (locationName) {
      marker.bindPopup(locationName).openPopup();
    }

    return () => {
      map.remove();
    };
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

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      <div 
        id="location-map" 
        className="w-full rounded-lg"
        style={{ height: '200px' }}
      />
    </div>
  );
} 