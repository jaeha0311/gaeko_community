'use client';

import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WithBottomMenu } from "@/components/hoc/withBottomMenu"
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { useUser } from "@/hooks/useUser";

const DEFAULT_AVATAR_URL = "/user.svg";

export default function NearbyPage() {
  const { location, loading, error, getCurrentLocation } = useLocation();
  const { user } = useUser();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // Kakao Maps API 로드
  useEffect(() => {
    if (typeof window !== "undefined" && window.kakao?.maps) {
      return;
    }
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'demo'}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setMapLoaded(true);
          getCurrentLocation();
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [getCurrentLocation]);

  // // 처음 마운트 시 내 위치 자동 탐색
  // useEffect(() => {
  //   getCurrentLocation();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 지도 및 마커 세팅
  useEffect(() => {
    if (!mapLoaded || !location) return;
    if (!mapRef.current) return;
    if (!window.kakao?.maps) return;
    // 지도 초기화
    mapRef.current.innerHTML = "";
    const center = new window.kakao.maps.LatLng(location.latitude, location.longitude);
    const options = { center, level: 3 };
    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
    // 커스텀 마커(프로필 이미지)
    const imageSrc = user?.avatar_url || DEFAULT_AVATAR_URL;
    const imageSize = new window.kakao.maps.Size(36, 36);
    const imageOption = { offset: new window.kakao.maps.Point(18, 36) };
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    markerRef.current = new window.kakao.maps.Marker({
      position: center,
      image: markerImage,
    });
    if (mapInstanceRef.current && markerRef.current && window.kakao?.maps) {
      (markerRef.current as unknown as { setMap: (map: unknown) => void }).setMap(mapInstanceRef.current);
      // 지도 컨트롤(확대/축소)
      const zoomControl = new window.kakao.maps.ZoomControl();
      (mapInstanceRef.current as unknown as { addControl: (ctrl: unknown, pos: unknown) => void }).addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    }
  }, [mapLoaded, location, user?.avatar_url]);

  // 내 위치로 이동 버튼
  const handleMoveToMyLocation = async () => {
    await getCurrentLocation();
    if (mapInstanceRef.current && location && window.kakao?.maps) {
      const center = new window.kakao.maps.LatLng(location.latitude, location.longitude);
      (mapInstanceRef.current as unknown as { setCenter: (center: unknown) => void }).setCenter(center);
    }
  };

  return (
    <WithBottomMenu>
      <div className="min-h-screen bg-[#f2f2f5] flex flex-col max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#ffffff]">
          <Button variant="ghost" size="icon" className="p-0">
            <ArrowLeft className="h-6 w-6 text-[#121417]" />
          </Button>
          <h1 className="text-xl font-semibold text-[#121417]">Nearby Breeders</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-[#ffffff]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6b7582]" />
            <Input
              placeholder="Search for breeders"
              className="pl-10 bg-[#f2f2f5] border-none text-[#6b7582] placeholder:text-[#6b7582]"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Map Frame */}
              <div className="w-96 h-96 relative overflow-hidden rounded-sm">
                {/* 실제 지도 */}
                <div ref={mapRef} className="w-full h-full rounded-sm" />
                {/* 내 위치 찾기 버튼 */}
                <Button
                  onClick={handleMoveToMyLocation}
                  className="absolute left-2 top-2 z-10 bg-white/80 hover:bg-white border border-gray-300 shadow"
                  size="icon"
                  title="내 위치로 이동"
                >
                  <svg width="36" height="36" fill="black" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
                </Button>
              </div>
          {/* 로딩/에러 메시지 */}
          {loading && <div className="text-center text-gray-500 mt-4">내 위치를 불러오는 중...</div>}
          {error && <div className="text-center text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </WithBottomMenu>
  )
}
