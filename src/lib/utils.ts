import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  // 24시간 이내: 시간 단위
  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    if (hours === 0) {
      const diffInMinutes = diffInMs / (1000 * 60);
      const minutes = Math.floor(diffInMinutes);
      return minutes <= 1 ? '방금 전' : `${minutes}분 전`;
    }
    return `${hours}시간 전`;
  }
  
  // 24시간~3일: 일 단위
  if (diffInDays < 3) {
    const days = Math.floor(diffInDays);
    return `${days}일 전`;
  }
  
  // 3일 이상: YY-MM-dd 형태
  const year = targetDate.getFullYear().toString().slice(-2);
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
