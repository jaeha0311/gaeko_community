import { useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  locationName?: string;
}

interface UseLocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationName = async (latitude: number, longitude: number): Promise<string | undefined> => {
    try {
      // Check if Kakao Maps API is available
      if ((window as any).kakao && (window as any).kakao.maps && (window as any).kakao.maps.services) {
        const geocoder = new (window as any).kakao.maps.services.Geocoder();
        
        return new Promise((resolve) => {
          geocoder.coord2Address(longitude, latitude, (result: any, status: string) => {
            if (status === (window as any).kakao.maps.services.Status.OK) {
              const address = result[0].address;
              // 도로명주소가 있으면 도로명주소 사용, 없으면 지번주소 사용
              const roadAddress = result[0].road_address;
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
      } else {
        // Fallback to OpenStreetMap if Kakao Maps is not available
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );
        const data = await response.json();
        return data.display_name || undefined;
      }
    } catch (error) {
      console.error('Failed to get location name:', error);
      return undefined;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      // Get location name from coordinates
      const locationName = await getLocationName(latitude, longitude);
      setLocation({
        latitude,
        longitude,
        locationName
      });
    } catch (err: any) {
      // kCLErrorLocationUnknown 또는 POSITION_UNAVAILABLE(1) 에러 시 기본 위치로 fallback
      const isUnknownLocation =
        (err instanceof GeolocationPositionError && err.code === 1) ||
        (typeof err?.message === 'string' && err.message.includes('kCLErrorLocationUnknown'));
      if (isUnknownLocation) {
        const fallbackLat = 37.553881;
        const fallbackLng = 126.970488;
        const locationName = await getLocationName(fallbackLat, fallbackLng);
        setLocation({
          latitude: fallbackLat,
          longitude: fallbackLng,
          locationName
        });
        setError('위치 정보를 가져올 수 없어 기본 위치로 이동합니다.');
      } else {
        const errorMessage = err instanceof GeolocationPositionError 
          ? getGeolocationErrorMessage(err.code)
          : 'Failed to get current location';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions.';
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case GeolocationPositionError.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation
  };
}; 