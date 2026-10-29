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
  BarChart2,
  Users,
  ShieldCheck,
  Wallet,
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

// Pure Vector 3D Folded Ribbon Logo Component (No PNG artifacts, 100% vector sharpness)
function NexachainRibbonLogo({ className = 'w-12 h-12' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left vertical ribbon - vibrant cyan to azure */}
        <linearGradient id="n-cyan-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Center diagonal ribbon fold - vivid royal electric blue */}
        <linearGradient id="n-mid-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004AD6" />
        </linearGradient>

        {/* Right vertical facet - deep cobalt shadow */}
        <linearGradient id="n-dark-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Left Pillar */}
      <path
        d="M20 18 C20 15 23 13 26 14.5 L44 24.5 C46.5 25.8 48 28.3 48 31 L48 82 C48 85 45 87 42 85.5 L24 75.5 C21.5 74.2 20 71.7 20 69 Z"
        fill="url(#n-cyan-ribbon)"
      />

      {/* Diagonal Connecting Ribbon Fold */}
      <path
        d="M48 31 L78 50 C80.5 51.5 82 54 82 57 L82 82 C82 85 79 87 76 85.5 L46 66.5 Z"
        fill="url(#n-dark-ribbon)"
      />

      {/* Right Pillar Overlapping */}
      <path
        d="M52 18 C52 15 55 13 58 14.5 L76 24.5 C78.5 25.8 80 28.3 80 31 L80 58 C80 60.5 77.5 62.5 74.5 61 L56 50 C53.5 48.7 52 46.2 52 43.5 Z"
        fill="url(#n-mid-ribbon)"
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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
    <div className="h-screen w-screen max-h-screen overflow-hidden relative bg-[#EEF5FC] flex flex-col lg:flex-row select-none">
      {/* ========================================================================= */}
      {/* Edge-to-Edge Wave Canvas (Fluid Flow Across Full Screen)                   */}
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
            <linearGradient id="bg-navy-grad" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#02143A" />
              <stop offset="35%" stopColor="#05215A" />
              <stop offset="70%" stopColor="#093988" />
              <stop offset="100%" stopColor="#0D4AB5" />
            </linearGradient>

            {/* Glowing Royal Blue Sweeping Wave */}
            <linearGradient id="bg-wave-royal" x1="15%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#08378E" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#1155D0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.5" />
            </linearGradient>

            {/* Top-Right Deep Blue Corner Arc */}
            <linearGradient id="bg-top-right-arc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A3B94" />
              <stop offset="60%" stopColor="#1357D2" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.8" />
            </linearGradient>

            {/* Bottom Dark Blue Fluid Anchor */}
            <linearGradient id="bg-bottom-anchor" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#041846" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#0A368A" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#1864F0" stopOpacity="0.3" />
            </linearGradient>

            {/* Right Pale Sky Backdrop */}
            <linearGradient id="bg-ice-sky" x1="40%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6F0FC" />
              <stop offset="50%" stopColor="#EEF5FE" />
              <stop offset="100%" stopColor="#F8FAFE" />
            </linearGradient>
          </defs>

          {/* Pale Ice-Blue Base */}
          <rect width="1536" height="1024" fill="url(#bg-ice-sky)" />

          {/* Top-Right Deep Blue Corner Arc */}
          <path
            d="M 850 0 C 960 140 1160 220 1536 260 L 1536 0 Z"
            fill="url(#bg-top-right-arc)"
          />

          {/* Main Left Navy Organic Mass */}
          <path
            d="M 0 0 L 830 0 C 780 180 730 320 780 480 C 840 660 770 830 700 1024 L 0 1024 Z"
            fill="url(#bg-navy-grad)"
          />

          {/* Flowing Mid Wave Curving Across Lower Canvas */}
          <path
            d="M 0 420 C 280 340 540 560 760 490 C 910 440 980 660 1100 1024 L 520 1024 Z"
            fill="url(#bg-wave-royal)"
          />

          {/* Bottom Dark Anchor Wave */}
          <path
            d="M 0 740 C 300 660 540 820 790 770 C 910 750 990 850 1120 1024 L 0 1024 Z"
            fill="url(#bg-bottom-anchor)"
          />

          {/* Soft Organic Contours Behind Right White Card */}
          <path
            d="M 810 0 C 750 280 920 450 1020 680 C 1090 840 1240 900 1536 1024 L 1536 0 Z"
            fill="#DFECFC"
            fillOpacity="0.75"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Left Column: Brand Identity, Value Highlights & Native 3D Dashboard       */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[48%] flex-col justify-between pl-8 sm:pl-12 lg:pl-16 xl:pl-20 pr-4 sm:pr-6 py-6 sm:py-8 lg:py-10 relative z-10 text-white h-full overflow-hidden">
        {/* Top Header: 3D Ribbon Logo & Tagline */}
        <div className="shrink-0">
          <div className="flex items-center gap-3">
            <NexachainRibbonLogo className="w-11 h-11 drop-shadow-md" />
            <div>
              <div className="flex items-baseline text-[26px] font-black tracking-tight leading-none">
                <span className="text-white">Nexachain</span>
                <span className="text-[#1D6EFF] ml-1.5 font-black">AI</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#8EA8D6] tracking-[0.24em] uppercase mt-2 pl-0.5">
            INVEST · EARN · GROW TOGETHER
          </p>
        </div>

        {/* Central Hero Headline & 2x2 Feature Pills */}
        <div className="my-auto py-2 max-w-lg shrink-0">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-white leading-[1.12] tracking-tight">
            Build Your <br />
            Financial Growth <br />
            with <span className="text-[#1D6EFF]">Nexachain AI</span>
          </h1>

          <p className="mt-4 text-xs sm:text-[13px] text-[#A0B6D9] leading-relaxed font-normal max-w-sm">
            A secure investment and referral platform designed for long-term growth. Invest, earn
            daily ROI and build your network.
          </p>

          {/* 2x2 Feature Pills Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            {/* Pill 1: Daily ROI Earnings */}
            <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-[#092254]/75 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Daily ROI</p>
                <p className="text-[11px] font-medium text-[#8EA8D6] leading-tight mt-0.5">Earnings</p>
              </div>
            </div>

            {/* Pill 2: Multi-Level Referral Income */}
            <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-[#092254]/75 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Multi-Level</p>
                <p className="text-[11px] font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Referral Income
                </p>
              </div>
            </div>

            {/* Pill 3: Secure & Transparent */}
            <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-[#092254]/75 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Secure &</p>
                <p className="text-[11px] font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Transparent
                </p>
              </div>
            </div>

            {/* Pill 4: Track Your Investments */}
            <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-[#092254]/75 border border-blue-400/15 backdrop-blur-md shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Track Your</p>
                <p className="text-[11px] font-medium text-[#8EA8D6] leading-tight mt-0.5">
                  Investments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: Pure Native 3D Isometric Dashboard (No PNG Box, Perfectly Integrated) */}
        <div className="relative pt-2 max-w-lg shrink-0">
          <div
            className="relative"
            style={{
              perspective: '1000px',
            }}
          >
            {/* The Slanted Tablet Base */}
            <div
              className="relative w-[360px] sm:w-[390px] h-[190px] rounded-[24px] bg-[#07193F]/80 border border-blue-400/25 p-4 shadow-[0_20px_50px_rgba(2,10,35,0.7)] backdrop-blur-xl"
              style={{
                transform: 'rotateX(28deg) rotateY(-18deg) rotateZ(8deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Top Left: 3 Skeleton Bars */}
              <div className="space-y-1.5 pl-1 pt-1">
                <div className="w-20 h-1.5 rounded-full bg-white/20" />
                <div className="w-14 h-1.5 rounded-full bg-white/10" />
                <div className="w-10 h-1.5 rounded-full bg-white/10" />
              </div>

              {/* Center Right: Recessed Screen with Luminous Line Chart */}
              <div className="absolute top-4 right-4 w-[210px] sm:w-[230px] h-[115px] rounded-xl bg-[#051433]/70 border border-blue-400/15 overflow-hidden p-2">
                {/* Subtle vertical grid lines */}
                <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-10">
                  <div className="w-[1px] h-full bg-blue-300" />
                  <div className="w-[1px] h-full bg-blue-300" />
                  <div className="w-[1px] h-full bg-blue-300" />
                  <div className="w-[1px] h-full bg-blue-300" />
                  <div className="w-[1px] h-full bg-blue-300" />
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 90">
                  <defs>
                    <linearGradient id="chart-area-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0088FF" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#0055FF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#003399" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00E5FF" floodOpacity="0.9" />
                    </filter>
                  </defs>

                  {/* Shaded Area Under Line */}
                  <path
                    d="M 5 62 L 35 50 L 65 58 L 100 42 L 135 48 L 170 30 L 195 14 L 195 90 L 5 90 Z"
                    fill="url(#chart-area-fill)"
                  />

                  {/* Glowing Cyan Line */}
                  <path
                    d="M 5 62 L 35 50 L 65 58 L 100 42 L 135 48 L 170 30 L 195 14"
                    stroke="#00D2FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#cyan-glow)"
                  />

                  {/* 6 Data Node Circles along the path */}
                  <circle cx="5" cy="62" r="3" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1.5" />
                  <circle cx="35" cy="50" r="3" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1.5" />
                  <circle cx="65" cy="58" r="3" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1.5" />
                  <circle cx="100" cy="42" r="3" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1.5" />
                  <circle cx="135" cy="48" r="3" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="1.5" />
                  <circle cx="170" cy="30" r="3.5" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="2" />
                  <circle cx="195" cy="14" r="4" fill="#FFFFFF" stroke="#00A3FF" strokeWidth="2" />
                </svg>
              </div>

              {/* Bottom: Skeleton Pills on Left & Right */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex gap-2">
                  <div className="w-12 h-1.5 rounded-full bg-white/20" />
                  <div className="w-16 h-1.5 rounded-full bg-white/15" />
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-1.5 rounded-full bg-white/20" />
                  <div className="w-14 h-1.5 rounded-full bg-white/15" />
                </div>
              </div>
            </div>

            {/* Overlapping Floating "Total Earnings" Card */}
            <div
              className="absolute -bottom-3 -left-3 sm:-left-4 w-[190px] sm:w-[205px] rounded-[18px] bg-[#0A245E]/90 border border-blue-400/40 p-3.5 px-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              style={{
                transform: 'rotateX(28deg) rotateY(-18deg) rotateZ(8deg) translateZ(35px)',
              }}
            >
              <p className="text-[11px] text-slate-300 font-medium">Total Earnings</p>
              <h4 className="text-[22px] font-black text-white tracking-tight mt-0.5">₹ 12,750</h4>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <ChevronUp className="w-3.5 h-3.5 stroke-[3]" /> +12%
                </span>
                {/* 4-bar equalizer graphic in bright royal blue */}
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 h-2 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-3.5 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-2.5 bg-[#1E74FF] rounded-full" />
                  <span className="w-1 h-4 bg-[#00D2FF] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Right Column: Floating Crisp White Login Card (With Left & Right Spacing) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[50%] xl:w-[52%] flex items-center justify-center pl-4 sm:pl-6 lg:pl-8 pr-6 sm:pr-10 lg:pr-16 xl:pr-20 py-4 sm:py-6 lg:py-8 relative z-10 h-full overflow-hidden">
        {/* Mobile Brand Bar */}
        <div className="lg:hidden absolute top-4 left-6 flex items-center gap-2 z-20">
          <NexachainRibbonLogo className="w-8 h-8" />
          <span className="text-xl font-black text-[#0B132A]">
            Nexachain <span className="text-[#0066FF]">AI</span>
          </span>
        </div>

        {/* The Exact White Login Card (1:1 Clone of UI Design) */}
        <div className="w-full max-w-[430px] xl:max-w-[450px] bg-white rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_-15px_rgba(10,35,90,0.13)] border border-white/90 my-auto">
          {/* Card Top: 3D Ribbon Logo & Welcome Typography */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="flex justify-center mb-2.5">
              <NexachainRibbonLogo className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
            </div>

            <h2 className="text-2xl sm:text-[26px] font-black text-[#0B132A] tracking-tight leading-tight">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
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
                  className="w-full py-3 sm:py-3.5 pl-11 pr-4 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
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
                  className="w-full py-3 sm:py-3.5 pl-11 pr-11 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
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
              <div className="flex justify-end mt-1.5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast('Password reset instruction sent to your registered email.', {
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
              className="w-full mt-2 py-3 sm:py-3.5 px-4 bg-[#0066FF] hover:bg-[#0051D6] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
          <div className="relative my-3.5 sm:my-4 text-center">
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
            className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
          <p className="text-center text-xs text-slate-500 mt-4 sm:mt-5">
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