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

// Reusable 3D Folded Geometric 'N' Ribbon Logo matching UI specification
function NexachainRibbonLogo({ className = 'w-12 h-12' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="n-left-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="n-mid-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#004AD6" />
        </linearGradient>
        <linearGradient id="n-right-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* 3D Folded Facets */}
      {/* Left Vertical Ribbon */}
      <path
        d="M20 18 C20 15 23 13 26 14.5 L44 24.5 C46.5 25.8 48 28.3 48 31 L48 82 C48 85 45 87 42 85.5 L24 75.5 C21.5 74.2 20 71.7 20 69 Z"
        fill="url(#n-left-ribbon)"
      />

      {/* Diagonal Connecting Ribbon with 3D Fold depth */}
      <path
        d="M48 31 L78 50 C80.5 51.5 82 54 82 57 L82 82 C82 85 79 87 76 85.5 L46 66.5 Z"
        fill="url(#n-right-ribbon)"
      />

      {/* Right Vertical Facet overlapping in isometric perspective */}
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

  const handleFillDemo = () => {
    setValue('email', 'john@nexachain.ai');
    setValue('password', 'password123');
    toast('Demo credentials auto-filled', { icon: '🔑' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-[#EFF5FC]">
      {/* ========================================================================= */}
      {/* 1:1 Precise Organic Flowing Gradient Waves Background Canvas               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Deep Dark Navy Base Gradient */}
            <linearGradient id="bg-deep-navy" x1="0%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#031538" />
              <stop offset="40%" stopColor="#06225B" />
              <stop offset="75%" stopColor="#0A3A8E" />
              <stop offset="100%" stopColor="#0F4FC1" />
            </linearGradient>

            {/* Radiant Cobalt Wave Layer */}
            <linearGradient id="bg-royal-wave" x1="20%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A3C94" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#145BD8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#256EFF" stopOpacity="0.5" />
            </linearGradient>

            {/* Lower Fluid Swoop */}
            <linearGradient id="bg-lower-swoop" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#061F54" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#0C3D9A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1A6BF8" stopOpacity="0.3" />
            </linearGradient>

            {/* Right Side Soft Ambient Sky Gradients */}
            <linearGradient id="bg-sky-soft" x1="50%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9F2FD" />
              <stop offset="60%" stopColor="#F1F6FE" />
              <stop offset="100%" stopColor="#F7FAFF" />
            </linearGradient>
          </defs>

          {/* Right Pale Canvas */}
          <rect width="1440" height="900" fill="url(#bg-sky-soft)" />

          {/* Main Left Navy Organic Mass */}
          <path
            d="M 0 0 L 760 0 C 720 160 670 290 710 430 C 760 590 850 670 940 900 L 0 900 Z"
            fill="url(#bg-deep-navy)"
          />

          {/* Sweeping Mid Wave that curls gracefully across the lower-center */}
          <path
            d="M 0 380 C 240 310 480 500 680 440 C 820 400 900 580 1020 900 L 650 900 Z"
            fill="url(#bg-royal-wave)"
          />

          {/* Bottom Dark Blue Anchor Wave */}
          <path
            d="M 0 680 C 280 610 500 760 740 710 C 850 690 940 790 1060 900 L 0 900 Z"
            fill="url(#bg-lower-swoop)"
          />

          {/* Soft Organic Right Contour Shading */}
          <path
            d="M 720 0 C 670 250 820 420 920 640 C 990 800 1140 850 1440 900 L 1440 0 Z"
            fill="#E2EEFC"
            fillOpacity="0.7"
          />
          <path
            d="M 830 0 C 780 270 930 430 1030 650 C 1100 810 1240 860 1440 900 L 1440 0 Z"
            fill="#EDF4FE"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Left Side: Brand Story, Value Highlights & 3D Analytics Widget            */}
      {/* ========================================================================= */}
      <div className="lg:w-[52%] xl:w-[50%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 relative z-10 text-white min-h-[640px] lg:min-h-screen">
        {/* Top Header: 3D Logo & Tagline */}
        <div>
          <div className="flex items-center gap-3.5">
            <NexachainRibbonLogo className="w-11 h-11 drop-shadow-md" />
            <div>
              <div className="flex items-baseline text-[26px] font-black tracking-tight leading-none">
                <span className="text-white">Nexachain</span>
                <span className="text-[#1D6EFF] ml-1.5 font-black">AI</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-[0.25em] uppercase mt-2 pl-0.5">
            INVEST · EARN · GROW TOGETHER
          </p>
        </div>

        {/* Central Hero Headline & Description */}
        <div className="my-auto py-8 sm:py-10 max-w-lg">
          <h1 className="text-4xl sm:text-[46px] lg:text-[48px] font-black text-white leading-[1.12] tracking-tight">
            Build Your <br />
            Financial Growth <br />
            with <span className="text-[#1E6EFF]">Nexachain AI</span>
          </h1>

          <p className="mt-5 text-sm sm:text-[15px] text-slate-200/90 leading-relaxed font-normal max-w-md">
            A secure investment and referral platform designed for long-term growth. Invest, earn
            daily ROI and build your network.
          </p>

          {/* 2x2 Feature Pills Grid (Exact Clone of UI Design) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-md">
            {/* Pill 1: Daily ROI Earnings */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/75 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Daily ROI</p>
                <p className="text-xs font-medium text-slate-300 leading-tight mt-0.5">Earnings</p>
              </div>
            </div>

            {/* Pill 2: Multi-Level Referral Income */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/75 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Multi-Level</p>
                <p className="text-xs font-medium text-slate-300 leading-tight mt-0.5">
                  Referral Income
                </p>
              </div>
            </div>

            {/* Pill 3: Secure & Transparent */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/75 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Secure &</p>
                <p className="text-xs font-medium text-slate-300 leading-tight mt-0.5">
                  Transparent
                </p>
              </div>
            </div>

            {/* Pill 4: Track Your Investments */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#092254]/75 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2D6E] text-[#1E74FF] flex items-center justify-center shrink-0 shadow-inner">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Track Your</p>
                <p className="text-xs font-medium text-slate-300 leading-tight mt-0.5">
                  Investments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: 3D Isometric Perspective Dashboard Preview (Exact Clone) */}
        <div className="relative pt-2 max-w-lg hidden sm:block">
          <div
            className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out"
            style={{
              perspective: '1000px',
            }}
          >
            {/* Background Slanted Analytics Board */}
            <div className="rounded-3xl bg-[#06183E]/85 border border-blue-500/25 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(3,15,45,0.6)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                {/* Horizontal skeleton placeholder bars */}
                <div className="space-y-1.5">
                  <div className="w-24 h-2 rounded-full bg-white/20" />
                  <div className="w-14 h-2 rounded-full bg-white/10" />
                </div>
                {/* Status indicator */}
                <div className="w-3 h-3 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
                </div>
              </div>

              {/* Glowing Curved Area Line Chart */}
              <div className="h-28 w-full mt-3 relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 340 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="neon-area-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#0066FF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0047BA" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00D2FF" floodOpacity="0.9" />
                    </filter>
                  </defs>

                  {/* Shaded Area Under Line */}
                  <path
                    d="M 10 75 C 60 70 90 85 130 55 C 170 25 210 60 250 35 C 280 15 305 25 330 10 L 330 100 L 10 100 Z"
                    fill="url(#neon-area-glow)"
                  />

                  {/* Electric Cyan Glowing Curve */}
                  <path
                    d="M 10 75 C 60 70 90 85 130 55 C 170 25 210 60 250 35 C 280 15 305 25 330 10"
                    stroke="#00D2FF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#line-glow)"
                  />

                  {/* Spark Data Nodes */}
                  <circle cx="130" cy="55" r="4" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="2" />
                  <circle cx="250" cy="35" r="4" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="2" />
                  <circle cx="330" cy="10" r="5" fill="#FFFFFF" stroke="#00A3FF" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Bottom Skeleton UI Pills */}
              <div className="flex gap-2.5 mt-2 pt-3 border-t border-white/10">
                <div className="w-14 h-2 rounded-full bg-white/20" />
                <div className="w-20 h-2 rounded-full bg-white/15" />
                <div className="w-10 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Overlapping Floating "Total Earnings" Card (Positioned exactly as in UI screenshot) */}
            <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-[#0A2663]/95 border border-blue-400/35 rounded-2xl p-3.5 px-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl w-52">
              <p className="text-[11px] text-slate-300 font-medium">Total Earnings</p>
              <div className="flex items-baseline justify-between mt-0.5">
                <h4 className="text-xl font-black text-white tracking-tight">₹ 12,750</h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <ChevronUp className="w-3.5 h-3.5 stroke-[3]" /> +12%
                </span>

                {/* 4-bar mini graphic */}
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
      {/* Right Side: Floating Crisp White Login Card (Exact UI Clone)              */}
      {/* ========================================================================= */}
      <div className="lg:w-[48%] xl:w-[50%] flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-16 relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-11 shadow-[0_25px_65px_-12px_rgba(10,35,90,0.14)] border border-slate-100">
          {/* Card Top: 3D Ribbon Logo & Welcome Typography */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-3">
              <NexachainRibbonLogo className="w-16 h-16 drop-shadow-md" />
            </div>

            <h2 className="text-[26px] font-black text-[#0B1736] tracking-tight">
              Nexachain <span className="text-[#0062FF]">AI</span>
            </h2>

            <p className="text-[11px] font-bold tracking-[0.22em] text-slate-400 uppercase mt-2">
              WELCOME BACK
            </p>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
              Login to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5">
                Email
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.email
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0062FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="pl-3.5 pr-1 text-slate-400">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full py-3.5 pr-4 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.password
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0062FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="pl-3.5 pr-1 text-slate-400">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full py-3.5 pr-11 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
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
                    toast('Password reset instruction sent to your registered email.', { icon: 'ℹ️' });
                  }}
                  className="text-xs font-semibold text-[#0062FF] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-[#0062FF] hover:bg-[#0051D6] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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

          {/* Quick Demo Autofill Pill */}
          <div className="mt-3.5 pt-2.5 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-400 font-medium">Demo account:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#0062FF] font-bold hover:underline cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
          <p className="text-center text-xs text-slate-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className="font-bold text-[#0062FF] hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}