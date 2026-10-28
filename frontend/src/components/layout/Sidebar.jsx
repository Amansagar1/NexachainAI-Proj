'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Coins,
  TrendingUp,
  Users,
  Network,
  Wallet,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

// 3D Ribbon Logo Component
function RibbonLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sb-n-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="sb-n-mid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004AD6" />
        </linearGradient>
        <linearGradient id="sb-n-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <path
        d="M20 18 C20 15 23 13 26 14.5 L44 24.5 C46.5 25.8 48 28.3 48 31 L48 82 C48 85 45 87 42 85.5 L24 75.5 C21.5 74.2 20 71.7 20 69 Z"
        fill="url(#sb-n-cyan)"
      />
      <path
        d="M48 31 L78 50 C80.5 51.5 82 54 82 57 L82 82 C82 85 79 87 76 85.5 L46 66.5 Z"
        fill="url(#sb-n-dark)"
      />
      <path
        d="M52 18 C52 15 55 13 58 14.5 L76 24.5 C78.5 25.8 80 28.3 80 31 L80 58 C80 60.5 77.5 62.5 74.5 61 L56 50 C53.5 48.7 52 46.2 52 43.5 Z"
        fill="url(#sb-n-mid)"
      />
    </svg>
  );
}

const navItems = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Investments', path: ROUTES.INVESTMENTS, icon: Coins },
  { name: 'ROI History', path: ROUTES.ROI_HISTORY, icon: TrendingUp },
  { name: 'Referral Income', path: ROUTES.REFERRAL_INCOME, icon: Users },
  { name: 'Referral Tree', path: ROUTES.REFERRAL_TREE, icon: Network },
  { name: 'Wallet', path: ROUTES.WALLET, icon: Wallet },
  { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const Sidebar = ({ isMobile = false, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <aside className="w-60 bg-[#051336] text-white flex flex-col h-full shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-white/5">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5">
          <RibbonLogo className="w-8 h-8 drop-shadow-md" />
          <div className="flex items-baseline">
            <span className="font-extrabold text-[19px] tracking-tight text-white">Nexachain</span>
            <span className="font-black text-[19px] text-[#1D6EFF] ml-1">AI</span>
          </div>
        </Link>

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path ||
            (item.path !== ROUTES.DASHBOARD && pathname?.startsWith(item.path));

          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/25 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pinned Logout Button (Exact Match to Design) */}
      <div className="p-3.5 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};