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
  TrendingUp,
  Users,
  ShieldCheck,
  Wallet,
  BarChart2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { extractErrorMessage } from '../../utils/errorHandler';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-[#F2F6FC]">
      {/* ========================================================================= */}
      {/* Dynamic Deep Blue Flowing Waves Background Canvas (Exact Reference Clone) */}
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
            <linearGradient id="bg-deep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#041238" />
              <stop offset="35%" stopColor="#082260" />
              <stop offset="70%" stopColor="#0047BA" />
              <stop offset="100%" stopColor="#0066FF" />
            </linearGradient>

            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0055DD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0099FF" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="wave-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00358E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="wave-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8E8FC" />
              <stop offset="100%" stopColor="#F5F9FF" />
            </linearGradient>
          </defs>

          {/* Base Split Background */}
          <rect width="1440" height="900" fill="url(#wave-light)" />

          {/* Left Deep Navy Fluid Mass */}
          <path
            d="M 0 0 L 750 0 C 680 180 620 320 680 480 C 740 640 850 720 920 900 L 0 900 Z"
            fill="url(#bg-deep)"
          />

          {/* Mid Layer Curved Ocean Waves */}
          <path
            d="M 0 350 C 220 280 450 480 640 430 C 780 390 850 560 960 900 L 600 900 Z"
            fill="url(#wave-grad-1)"
          />

          <path
            d="M 0 650 C 300 580 520 720 720 680 C 820 660 910 760 1020 900 L 0 900 Z"
            fill="url(#wave-grad-2)"
          />

          {/* Ambient Curved Highlights Behind Right Card */}
          <path
            d="M 660 0 C 600 240 760 400 860 620 C 930 780 1080 840 1440 900 L 1440 0 Z"
            fill="#EAF2FC"
            fillOpacity="0.75"
          />
          <path
            d="M 780 0 C 720 260 880 420 980 640 C 1050 800 1200 860 1440 900 L 1440 0 Z"
            fill="#F3F8FE"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Left Side: Brand Story, Value Highlights & Floating Analytics Widget      */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative z-10 text-white min-h-[600px] lg:min-h-screen">
        {/* Top Logo */}
        <div>
          <div className="flex items-center gap-3.5">
            {/* 3D Folded Ribbon 'N' Logo */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-11 h-11 drop-shadow-lg"
            >
              <defs>
                <linearGradient id="n-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C8FF" />
                  <stop offset="100%" stopColor="#0070FF" />
                </linearGradient>
                <linearGradient id="n-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="100%" stopColor="#003FA8" />
                </linearGradient>
                <linearGradient id="n-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#004AB8" />
                  <stop offset="100%" stopColor="#002275" />
                </linearGradient>
              </defs>
              <path
                d="M18 16 C18 13 21 11 24 12.5 L44 23.5 C46 24.5 47 26.5 47 29 L47 84 C47 87 44 89 41 87.5 L21 76.5 C19 75.5 18 73.5 18 71 Z"
                fill="url(#n-cyan)"
              />
              <path
                d="M47 29 L79 47.5 C81.5 49 83 51.5 83 54.5 L83 85 C83 87.5 80.5 89.5 77.5 88 L47 70.5 Z"
                fill="url(#n-dark)"
              />
              <path
                d="M54 16 C54 13 57 11 60 12.5 L80 23.5 C82 24.5 83 26.5 83 29 L83 60 C83 62.5 80.5 64.5 77.5 63 L57 51.5 C55 50.5 54 48.5 54 46 Z"
                fill="url(#n-blue)"
              />
            </svg>

            <div>
              <div className="flex items-center text-2xl font-black tracking-tight">
                <span className="text-white">Nexachain</span>
                <span className="text-[#0088FF] ml-1.5">AI</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-[0.25em] uppercase mt-1 pl-0.5">
            INVEST · EARN · GROW TOGETHER
          </p>
        </div>

        {/* Central Hero Headlines */}
        <div className="my-auto py-10 max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] tracking-tight">
            Build Your <br />
            Financial Growth <br />
            with <span className="text-[#0088FF]">Nexachain AI</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-md">
            A secure investment and referral platform designed for long-term growth. Invest, earn
            daily ROI and build your network.
          </p>

          {/* 2x2 Feature Pills Grid (Exact Clone of UI Design) */}
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            {/* Pill 1: Daily ROI */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#091F52]/60 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B72] text-[#0080FF] flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Daily ROI</p>
                <p className="text-xs font-medium text-slate-300 leading-tight mt-0.5">Earnings</p>
              </div>
            </div>

            {/* Pill 2: Multi-Level */}
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#091F52]/60 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B72] text-[#0080FF] flex items-center justify-center shrink-0">
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
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#091F52]/60 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B72] text-[#0080FF] flex items-center justify-center shrink-0">
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
            <div className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#091F52]/60 border border-blue-400/20 backdrop-blur-md shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#0C2B72] text-[#0080FF] flex items-center justify-center shrink-0">
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

        {/* Bottom Left: 3D Floating Glassmorphic Analytics Widget (Exact Clone) */}
        <div className="relative pt-4 max-w-md hidden sm:block">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#071944]/80 border border-blue-400/25 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              {/* Inset Total Earnings Card */}
              <div className="bg-[#0B2564] p-3.5 px-4 rounded-2xl border border-blue-400/30 shadow-md">
                <p className="text-[10px] text-slate-300 font-medium">Total Earnings</p>
                <h4 className="text-xl font-extrabold text-white mt-0.5">₹ 12,750</h4>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    ▲ +12%
                  </span>
                  <BarChart2 className="w-4 h-4 text-[#0088FF]" />
                </div>
              </div>

              {/* Glowing Line Graph */}
              <div className="flex-1 h-16 relative flex items-end">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 160 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Glowing line */}
                  <path
                    d="M 0 38 Q 25 32 45 36 T 85 24 T 120 18 T 160 8"
                    stroke="#00C8FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(0,200,255,0.8)]"
                  />
                  {/* Fill below line */}
                  <path
                    d="M 0 38 Q 25 32 45 36 T 85 24 T 120 18 T 160 8 L 160 50 L 0 50 Z"
                    fill="url(#chart-fill)"
                  />
                  {/* Glow dot at apex */}
                  <circle cx="160" cy="8" r="3.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>

            {/* Skeleton bars at bottom of widget */}
            <div className="flex gap-2 mt-3 pt-2.5 border-t border-white/10">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
              <div className="w-16 h-1.5 rounded-full bg-white/20" />
              <div className="w-8 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Right Side: Floating Crisp White Login Card (Exact UI Clone)              */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[32px] sm:rounded-[38px] p-8 sm:p-11 shadow-[0_25px_60px_-15px_rgba(4,22,64,0.12)] border border-slate-100">
          {/* Card Header: 3D Logo & Welcome Back */}
          <div className="text-center mb-8">
            {/* 3D Ribbon Logo */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 mx-auto mb-3.5 drop-shadow-md"
            >
              <defs>
                <linearGradient id="card-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C8FF" />
                  <stop offset="100%" stopColor="#0066FF" />
                </linearGradient>
                <linearGradient id="card-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="100%" stopColor="#003FA8" />
                </linearGradient>
                <linearGradient id="card-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#004AB8" />
                  <stop offset="100%" stopColor="#002275" />
                </linearGradient>
              </defs>
              <path
                d="M18 16 C18 13 21 11 24 12.5 L44 23.5 C46 24.5 47 26.5 47 29 L47 84 C47 87 44 89 41 87.5 L21 76.5 C19 75.5 18 73.5 18 71 Z"
                fill="url(#card-cyan)"
              />
              <path
                d="M47 29 L79 47.5 C81.5 49 83 51.5 83 54.5 L83 85 C83 87.5 80.5 89.5 77.5 88 L47 70.5 Z"
                fill="url(#card-dark)"
              />
              <path
                d="M54 16 C54 13 57 11 60 12.5 L80 23.5 C82 24.5 83 26.5 83 29 L83 60 C83 62.5 80.5 64.5 77.5 63 L57 51.5 C55 50.5 54 48.5 54 46 Z"
                fill="url(#card-blue)"
              />
            </svg>

            <h2 className="text-2xl font-black text-[#0B1736] tracking-tight">
              Nexachain <span className="text-[#0066FF]">AI</span>
            </h2>

            <p className="text-[11px] font-extrabold tracking-[0.2em] text-slate-400 uppercase mt-2">
              WELCOME BACK
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Login to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Email</label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.email
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="pl-3.5 pr-1 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full py-3 pr-4 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Password</label>
              <div
                className={`relative flex items-center rounded-xl border bg-white transition-all ${
                  errors.password
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                }`}
              >
                <div className="pl-3.5 pr-1 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full py-3 pr-10 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    toast('Password reset available in settings or contact admin.', { icon: 'ℹ️' });
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
              className="w-full mt-2 py-3.5 px-4 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Pill */}
          <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-400 font-medium">Demo account:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#0066FF] font-bold hover:underline cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative my-5 text-center">
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
