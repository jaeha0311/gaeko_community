'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingTransitionProps {
  children: React.ReactNode;
}

export default function LoadingTransition({ children }: LoadingTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Route change started
    setIsLoading(true);
    
    // Show loading for a bit longer to make it feel smooth
    const loadingTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, 300); // Slightly longer to show the gecko loading

    // Hide loading and show new content
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Total transition time

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname, children]);

  return (
    <>
      {/* Gecko Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#ffffff] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🦎</div>
            <p className="text-[#61758a] text-lg font-medium">게코랜드로 이동 중...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div
        className={`transition-opacity duration-300 ease-in-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {displayChildren}
      </div>
    </>
  );
} 