# 네이버 지도 API 설정 가이드

## 1. 네이버 클라우드 플랫폼에서 API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 로그인
2. **AI·NAVER API** > **Maps** 선택
3. **Application 등록** 클릭
4. 애플리케이션 이름 입력 (예: "Geckoland Maps")
5. **Web Dynamic Map** 서비스 선택
6. 등록 완료 후 **Client ID**와 **Client Secret** 확인

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Naver Maps API Configuration
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id_here
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret_here
```

## 3. Vercel 배포 시 환경변수 설정

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** > **Environment Variables** 이동
3. 다음 변수들을 추가:
   - `NEXT_PUBLIC_NAVER_CLIENT_ID`: 네이버 클라이언트 ID
   - `NEXT_PUBLIC_NAVER_CLIENT_SECRET`: 네이버 클라이언트 시크릿

## 4. API 사용량 및 제한

- **Web Dynamic Map**: 월 100만 건 무료
- **Geocoding**: 월 25만 건 무료
- **Reverse Geocoding**: 월 25만 건 무료

## 5. 기능

### 지도 표시

- 사용자 프로필에서 위치 정보를 네이버 지도로 표시
- 마커와 정보창으로 정확한 위치 표시

### 위치 선택

- 지도를 클릭하여 원하는 위치 선택
- 네이버 Geocoding API로 주소 정보 자동 변환
- 한국 지도 데이터로 정확한 주소 제공

### 현재 위치

- 브라우저 GPS 기능으로 현재 위치 감지
- 네이버 지도와 연동하여 정확한 위치 표시

## 6. 주의사항

- API 키는 클라이언트 사이드에서 사용되므로 보안에 주의
- 도메인 제한 설정으로 API 키 보호 권장
- 사용량 모니터링으로 비용 관리 필요
