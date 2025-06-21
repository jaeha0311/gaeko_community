import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useRouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  const navigate = useCallback(async (href: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Let the global loading transition handle the animation
    router.push(href);
    
    // Reset transition state after a delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [router, isTransitioning]);

  const goBack = useCallback(async () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Let the global loading transition handle the animation
    router.back();
    
    // Reset transition state after a delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [router, isTransitioning]);

  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

  return {
    isTransitioning,
    navigate,
    goBack
  };
} 