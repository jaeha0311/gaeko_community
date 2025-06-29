# 카카오 지도 API 설정 가이드

## 1. 카카오 개발자 센터에서 API 키 발급

1. [카카오 개발자 센터](https://developers.kakao.com/)에 로그인
2. **내 애플리케이션** > **애플리케이션 추가하기** 클릭
3. 애플리케이션 이름 입력 (예: "Geckoland Maps")
4. **JavaScript 키** 확인 (이것이 App Key입니다)

## 2. 플랫폼 설정

1. **플랫폼** > **Web 플랫폼 등록** 클릭
2. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:3000`
   - 프로덕션: `https://your-domain.vercel.app`
3. **저장** 클릭

## 3. 카카오 지도 API 활성화

1. **카카오 로그인** > **활성화** 설정
2. **카카오 지도** > **활성화** 설정
3. **저장** 클릭

## 4. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Kakao Maps API Configuration
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_javascript_key_here
```

## 5. Vercel 배포 시 환경변수 설정

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** > **Environment Variables** 이동
3. 다음 변수를 추가:
   - `NEXT_PUBLIC_KAKAO_APP_KEY`: 카카오 JavaScript 키

## 6. API 사용량 및 제한

- **카카오 지도**: 무제한 (무료)
- **Geocoding**: 무제한 (무료)
- **Reverse Geocoding**: 무제한 (무료)

## 7. 기능

### 지도 표시

- 사용자 프로필에서 위치 정보를 카카오 지도로 표시
- 마커와 정보창으로 정확한 위치 표시
- 한국 지도 데이터로 정확한 주소 제공

### 위치 선택

- 지도를 클릭하여 원하는 위치 선택
- 카카오 Geocoding API로 주소 정보 자동 변환
- 한국 주소 체계에 맞는 정확한 주소 제공

### 현재 위치

- 브라우저 GPS 기능으로 현재 위치 감지
- 카카오 지도와 연동하여 정확한 위치 표시

## 8. 카카오 지도의 장점

### 사용자 친화적

- 한국에서 가장 널리 사용되는 지도 서비스
- 익숙한 인터페이스와 디자인
- 한국어 지도 서비스

### 정확성

- 한국 지도 데이터로 정확한 위치 정보
- 한국 주소 체계에 맞는 주소 변환
- 실시간 교통 정보 및 POI 데이터

### 무료 서비스

- 모든 기능이 무료로 제공
- 사용량 제한 없음
- 안정적인 서비스

## 9. 주의사항

- API 키는 클라이언트 사이드에서 사용되므로 보안에 주의
- 도메인 제한 설정으로 API 키 보호 권장
- 카카오 개발자 센터에서 사용량 모니터링 가능

## 10. API 로딩 방식

이 프로젝트에서는 카카오 지도 API를 다음과 같이 로드합니다:

```javascript
// autoload=false 옵션으로 수동 로딩
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&libraries=services&autoload=false`;

// API 완전 로드 후 초기화
window.kakao.maps.load(() => {
  // 지도 초기화 코드
});
```

이 방식으로 API가 완전히 로드된 후에 지도를 초기화하여 `window.kakao.maps.LatLng is not a constructor` 에러를 방지합니다.

## 11. 지도 정리 (Cleanup)

카카오 지도는 `destroy()` 메서드가 없으므로 다음과 같이 정리합니다:

```javascript
// 지도 컨테이너 내용을 비우기
if (mapRef.current) {
  mapRef.current.innerHTML = '';
}

// 마커 제거
if (markerRef.current) {
  markerRef.current.setMap(null);
}
```

이 방식으로 메모리 누수를 방지하고 새로운 지도를 안전하게 생성할 수 있습니다.
