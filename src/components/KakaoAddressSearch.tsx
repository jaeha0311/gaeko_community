'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface KakaoAddressSearchProps {
  onAddressSelect: (address: string, latitude: number, longitude: number) => void;
  className?: string;
}

interface AddressSearchResult {
  address_name: string;
  x: string; // longitude
  y: string; // latitude
}

export function KakaoAddressSearch({ onAddressSelect, className = '' }: KakaoAddressSearchProps) {
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchLoaded, setSearchLoaded] = useState(false);


  const searchAddress = async (query: string) => {
    try {
      const geocoder = new (window as any).kakao.maps.services.Geocoder();

      geocoder.addressSearch(query, (result: AddressSearchResult[], status: string) => {
        if (status === (window as any).kakao.maps.services.Status.OK) {
          const item = result[0];
          const address = item.address_name;
          const latitude = parseFloat(item.y);
          const longitude = parseFloat(item.x);

          onAddressSelect(address, latitude, longitude);
        } else {
          alert('주소를 찾을 수 없습니다. 다른 주소를 입력해주세요.');
        }
      });
    } catch (error) {
      console.error('Address search failed:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };
  const initializeAddressSearch = useCallback(() => {
    if (!searchRef.current || !(window as any).kakao?.maps) return;

    // Clear existing content
    searchRef.current.innerHTML = '';

    // Create address search input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '주소를 입력하세요';
    input.className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';
    searchRef.current.appendChild(input);

    // Create search button
    const searchButton = document.createElement('button');
    searchButton.innerHTML = `
      <div class="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        검색
      </div>
    `;
    searchButton.className = 'mt-2 w-full';
    searchRef.current.appendChild(searchButton);

    // Handle search button click
    searchButton.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) {
        searchAddress(query);
      }
    });

    // Handle Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          searchAddress(query);
        }
      }
    });
  }, [searchAddress]);

  useEffect(() => {
    // Check if Kakao Maps API is already loaded
    if ((window as any).kakao && (window as any).kakao.maps) {
      setSearchLoaded(true);
      return;
    }

    // Load Kakao Maps API
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'demo'}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      // Initialize Kakao Maps API
      (window as any).kakao.maps.load(() => {
        setSearchLoaded(true);
        if (searchRef.current) {
          initializeAddressSearch();
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
  }, [initializeAddressSearch]);

  useEffect(() => {
    if (searchLoaded && searchRef.current) {
      initializeAddressSearch();
    }
  }, [searchLoaded]);


  if (!searchLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height: '60px' }}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto mb-1"></div>
          <p className="text-xs">주소 검색을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div ref={searchRef} className="space-y-2"></div>
      <p className="text-xs text-gray-500 text-center">
        주소를 입력하고 검색 버튼을 클릭하세요
      </p>
    </div>
  );
} 