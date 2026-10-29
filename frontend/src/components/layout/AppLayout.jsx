'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { LoadingState } from '../common/LoadingState';

export const AppLayout = ({ children, searchPlaceholder }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <LoadingState message="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7FC]">
      {/* ------------------------------ Desktop Persistent Sidebar ------------------------------ */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar />
      </div>

      {/* ------------------------------ Mobile Navigation Drawer ------------------------------ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ------------------------------ Main Application Body ------------------------------ */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchPlaceholder={searchPlaceholder}
        />
        <main className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 max-w-[1540px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
