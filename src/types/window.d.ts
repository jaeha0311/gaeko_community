// Kakao Maps API 글로벌 변수 타입 선언

declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }

  interface KakaoNamespace {
    maps: KakaoMaps;
  }

  interface KakaoMaps {
    Map: new (container: HTMLElement, options: object) => KakaoMapInstance;
    Marker: new (options: object) => KakaoMarkerInstance;
    MarkerImage: new (src: string, size: KakaoSize, options?: object) => KakaoMarkerImageInstance;
    LatLng: new (lat: number, lng: number) => KakaoLatLngInstance;
    ZoomControl: new () => KakaoZoomControlInstance;
    ControlPosition: {
      TOP: number;
      TOPRIGHT: number;
      RIGHT: number;
      BOTTOMRIGHT: number;
      BOTTOM: number;
      BOTTOMLEFT: number;
      LEFT: number;
      TOPLEFT: number;
    };
    InfoWindow: new (options: object) => KakaoInfoWindowInstance;
    services: unknown;
    event: {
      addListener: (target: unknown, type: string, handler: (...args: unknown[]) => void) => void;
    };
    load: (callback: () => void) => void;
    Size: new (width: number, height: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint;
  }

  interface KakaoMapInstance {
    setCenter: (latlng: KakaoLatLngInstance) => void;
    addControl: (control: unknown, position: number) => void;
  }

  interface KakaoMarkerInstance {
    setMap: (map: KakaoMapInstance | null) => void;
  }

  type KakaoMarkerImageInstance = unknown;
  type KakaoLatLngInstance = unknown;
  type KakaoZoomControlInstance = unknown;
  interface KakaoInfoWindowInstance {
    open: (map: KakaoMapInstance, marker: KakaoMarkerInstance) => void;
  }
  type KakaoSize = unknown;
  type KakaoPoint = unknown;
}

export {}; 