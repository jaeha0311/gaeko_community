'use client';

import React from 'react';
import BottomMenu from '@/components/ui/BottomMenu';

interface WithBottomMenuProps {
  children: React.ReactNode;
}

export function withBottomMenu<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithBottomMenuComponent(props: P) {
    return (
      <>
        <WrappedComponent {...props} />
        <BottomMenu />
      </>
    );
  };
}

// Alternative: Simple wrapper component
export function WithBottomMenu({ children }: WithBottomMenuProps) {
  return (
    <>
      {children}
      <BottomMenu />
    </>
  );
} 