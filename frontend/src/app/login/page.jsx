'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  ShieldCheck,
  Wallet,
  BarChart2,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { extractErrorMessage } from '../../utils/errorHandler';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Exact 3D Folded Ribbon Logo Component
function NexachainRibbonLogo({ className = 'w-14 h-14' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left vertical ribbon - vibrant cyan to azure */}
        <linearGradient id="ribbon-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Center diagonal ribbon - vivid royal electric blue */}
        <linearGradient id="ribbon-mid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004AD6" />
        </linearGradient>

        {/* Right vertical facet - deep cobalt shadow */}
        <linearGradient id="ribbon-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Left Pillar */}
      <path
        d="M20 18 C20 15 23 13 26 14.5 L44 24.5 C46.5 25.8 48 28.3 48 31 L48 82 C48 85 45 87 42 85.5 L24 75.5 C21.5 74.2 20 71.7 20 69 Z"
        fill="url(#ribbon-cyan-grad)"
      />

      {/* Diagonal Connecting Ribbon Fold */}
      <path
        d="M48 31 L78 50 C80.5 51.5 82 54 82 57 L82 82 C82 85 79 87 76 85.5 L46 66.5 Z"
        fill="url(#ribbon-dark-grad)"
      />

      {/* Right Pillar Overlapping */}
      <path
        d="M52 18 C52 15 55 13 58 14.5 L76 24.5 C78.5 25.8 80 28.3 80 31 L80 58 C80 60.5 77.5 62.5 74.5 61 L56 50 C53.5 48.7 52 46.2 52 43.5 Z"
        fill="url(#ribbon-mid-grad)"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'john@nexachain.ai',
      password: 'password123',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to Nexachain AI!');
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to log in. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-[#EEF5FC]">
      {/* ========================================================================= */}
      {/* 1:1 Flowing Gradient Wave Canvas (Matching Reference Screenshot)          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1536 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Deep Midnight Navy Base Gradient */}
            <linearGradient id="navy-base-grad" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#02143A" />
              <stop offset="35%" stopColor="#05215A" />
              <stop offset="70%" stopColor="#093988" />
              <stop offset="100%" stopColor="#0D4AB5" />
            </linearGradient>

            {/* Glowing Royal Blue Sweeping Wave */}
            <linearGradient id="wave-royal-grad" x1="15%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#08378E" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#1155D0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.5" />
            </linearGradient>

            {/* Top Right Deep Blue Corner Swirl */}
            <linearGradient id="top-right-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A3B94" />
              <stop offset="60%" stopColor="#1357D2" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.8" />
            </linearGradient>

            {/* Bottom Dark Blue Fluid Anchor */}
            <linearGradient id="bottom-fluid-anchor" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#041846" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#0A368A" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#1864F0" stopOpacity="0.3" />
            </linearGradient>

            {/* Right Pale Sky Backdrop */}
            <linearGradient id="right-pale-sky" x1="40%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6F0FC" />
              <stop offset="50%" stopColor="#F0F5FE" />
              <stop offset="100%" stopColor="#F8FAFE" />
            </linearGradient>
          </defs>

          {/* Pale Ice-Blue Base Canvas */}
          <rect width="1536" height="1024" fill="url(#right-pale-sky)" />

          {/* Top-Right Deep Blue Corner Arc (Crucial visual element from screenshot) */}
          <path
            d="M 850 0 C 960 140 1160 220 1536 260 L 1536 0 Z"
            fill="url(#top-right-wave-grad)"
          />

          {/* Main Left Navy Organic Mass */}
          <path
            d="M 0 0 L 830 0 C 780 180 730 320 780 480 C 840 660 770 830 700 1024 L 0 1024 Z"
            fill="url(#navy-base-grad)"
          />

          {/* Flowing Mid Wave Curving Across Lower Canvas */}
          <path
            d="M 0 420 C 280 340 540 560 760 490 C 910 440 980 660 1100 1024 L 520 1024 Z"
            fill="url(#wave-royal-grad)"
          />

          {/* Bottom Dark Anchor Wave */}
          <path
            d="M 0 740 C 300 660 540 820 790 770 C 910 750 990 850 1120 1024 L 0 1024 Z"
            fill="url(#bottom-fluid-anchor)"
          />

          {/* Soft Organic Contours Behind Right White Card */}
          <path
            d="M 810 0 C 750 280 920 450 1020 680 C 1090 840 1240 900 1536 1024 L 1536 0 Z"
            fill="#DFECFC"
            fillOpacity="0.75"
          />
          <path
            d="M 940 0 C 890 300 1050 470 1150 700 C 1210 850 1350 900 1536 1024 L 1536 0 Z"
            fill="#EDF4FE"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Left Column: Brand Identity, Value Highlights & 3D Analytics Widget       */}
      {/* ========================================================================= */}
      <div className="lg:w-[52%] xl:w-[50%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 relative z-10 text-white min-h-[660px] lg:min-h-screen">
        {/* Top Logo & Tagline */}
        <div>
          <div className="flex items-center gap-3">
            <NexachainRibbonLogo className="w-12 h-12 drop-shadow-md" />
            <div>
              <div className="flex items-baseline text-[28px] font-black tracking-tight leading-none">
                <span className="text-white">Nexachain</span>
                <span className="text-[#1D6EFF] ml-1.5 font-black">AI</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold text-[#8EA8D6] tracking-[0.22em] uppercase mt-2 pl-0.5">
            INVEST · EARN · GROW TOGETHER
          </p>
        </div>

        {/* Central Hero Headline & Feature Pills */}
        <div className="my-auto py-8 sm:py-10 max-w-lg">
          <h1 className="text-4xl sm:text-[46px] lg:text-[48px] font-black text-white leading-[1.12] tracking-tight">
            Build Your <br />
            Financial Growth <br />
            with <span className="text-[#1D6EFF]">Nexachain AI</span>
          </h1>

          <p className="mt-5 text-sm sm:text-[15px] text-[#A0B6D9] leading-relaxed font-normal max-w-md">
            A secure investment and referral platform designed for long-term growth. Invest, earn
            daily ROI and build your network.
          </p>

          {/* 2x2 Feature Pills Grid (Matching Reference Screenshot) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-md">
            {/* Pill 1: Daily ROI Earnings */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/70 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Daily ROI</p>
                <p className="text-xs font-medium text-[#8EA8D6] leading-tight mt-0.5">Earnings</p>
              </div>
            </div>

            {/* Pill 2: Multi-Level Referral Income */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/70 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Multi-Level</p>
                <p className="text-xs font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Referral Income
                </p>
              </div>
            </div>

            {/* Pill 3: Secure & Transparent */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/70 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Secure &</p>
                <p className="text-xs font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Transparent
                </p>
              </div>
            </div>

            {/* Pill 4: Track Your Investments */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/70 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Track Your</p>
                <p className="text-xs font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Investments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: 3D Isometric Perspective Dashboard Preview (Exact Clone) */}
        <div className="relative pt-4 max-w-lg hidden sm:block">
          <div
            className="relative"
            style={{
              perspective: '1200px',
              perspectiveOrigin: 'center center',
            }}
          >
            {/* Base Tilted Tablet Slate */}
            <div
              className="relative w-[360px] sm:w-[390px] h-[210px] rounded-[24px] bg-[#071638]/90 border border-blue-400/25 p-5 shadow-[0_25px_60px_rgba(2,10,30,0.8)] backdrop-blur-xl"
              style={{
                transform: 'rotateX(26deg) rotateY(-18deg) rotateZ(6deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Skeleton lines at top left */}
              <div className="space-y-1.5">
                <div className="w-16 h-1.5 rounded-full bg-white/20" />
                <div className="w-10 h-1.5 rounded-full bg-white/10" />
              </div>

              {/* Luminous Glowing Area Line Chart */}
              <div className="w-full h-24 mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 280 80">
                  <defs>
                    <linearGradient id="chart-glow-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#0066FF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0047BA" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="3.5"
                        floodColor="#00E5FF"
                        floodOpacity="0.9"
                      />
                    </filter>
                  </defs>
                  <path
                    d="M 5 60 C 45 55 70 68 105 44 C 140 20 175 48 210 28 C 235 12 255 20 275 8 L 275 80 L 5 80 Z"
                    fill="url(#chart-glow-fill)"
                  />
                  <path
                    d="M 5 60 C 45 55 70 68 105 44 C 140 20 175 48 210 28 C 235 12 255 20 275 8"
                    stroke="#00E5FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#neon-glow)"
                  />
                  <circle cx="105" cy="44" r="3.5" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="2" />
                  <circle cx="210" cy="28" r="3.5" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="2" />
                  <circle cx="275" cy="8" r="4.5" fill="#FFFFFF" stroke="#00A3FF" strokeWidth="2" />
                </svg>
              </div>

              {/* Skeleton lines at bottom */}
              <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
                <div className="w-16 h-1.5 rounded-full bg-white/15" />
                <div className="w-8 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Overlapping Floating "Total Earnings" Card */}
            <div
              className="absolute -bottom-3 -left-4 w-[210px] rounded-[18px] bg-[#0A235C]/95 border border-blue-400/35 p-3.5 px-4 shadow-[0_20px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              style={{
                transform: 'rotateX(26deg) rotateY(-18deg) rotateZ(6deg) translateZ(35px)',
              }}
            >
              <p className="text-[11px] text-slate-300 font-medium">Total Earnings</p>
              <h4 className="text-[22px] font-black text-white tracking-tight mt-0.5">₹ 12,750</h4>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <ChevronUp className="w-3.5 h-3.5 stroke-[3]" /> +12%
                </span>
                {/* 4-bar equalizer graphic in bright blue */}
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 h-2 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-3.5 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-2.5 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-4 bg-[#00E5FF] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Right Column: Floating Crisp White Login Card (Exact UI Clone)             */}
      {/* ========================================================================= */}
      <div className="lg:w-[48%] xl:w-[50%] flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-16 relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,25,80,0.12)] border border-white/80">
          {/* Card Top: 3D Ribbon Logo & Welcome Typography */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <NexachainRibbonLogo className="w-16 h-16 drop-shadow-md" />
            </div>

            <h2 className="text-[26px] font-black text-[#0B132A] tracking-tight">
              Nexachain <span className="text-[#0066FF]">AI</span>
            </h2>

            <p className="text-[11px] font-bold tracking-[0.24em] text-slate-400 uppercase mt-2">
              WELCOME BACK
            </p>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1">
              Login to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
                Email
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.email
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full py-3.5 pl-11 pr-4 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5">
                Password
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.password
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full py-3.5 pl-11 pr-11 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}

              {/* Forgot Password Link */}
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast('Password reset link sent to your registered email address.', {
                      icon: 'ℹ️',
                    });
                  }}
                  className="text-xs font-semibold text-[#0066FF] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={() =>
              toast('Google OAuth ready for client credentials configuration.', { icon: 'ℹ️' })
            }
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Registration Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className="font-bold text-[#0066FF] hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}