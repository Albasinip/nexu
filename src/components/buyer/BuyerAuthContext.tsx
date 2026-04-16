'use client';

import React, { createContext, useContext, useState } from 'react';

type AuthDrawerContextType = {
  isAuthDrawerOpen: boolean;
  openAuthDrawer: () => void;
  closeAuthDrawer: () => void;
};

const AuthDrawerContext = createContext<AuthDrawerContextType | undefined>(undefined);

export function AuthDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);

  return (
    <AuthDrawerContext.Provider value={{
      isAuthDrawerOpen,
      openAuthDrawer: () => setIsAuthDrawerOpen(true),
      closeAuthDrawer: () => setIsAuthDrawerOpen(false)
    }}>
      {children}
    </AuthDrawerContext.Provider>
  );
}

export const useAuthDrawer = () => {
  const ctx = useContext(AuthDrawerContext);
  if (!ctx) throw new Error('useAuthDrawer must be used within AuthDrawerProvider');
  return ctx;
};
