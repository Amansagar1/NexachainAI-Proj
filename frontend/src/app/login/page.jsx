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
    <div className="h-screen w-screen max-h-screen overflow-hidden relative bg-[#EEF5FC] flex items-center justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-3 lg:py-5 select-none">
      {/* ========================================================================= */}
      {/* Dynamic Wave Background Canvas (Edge-to-Edge Backdrop)                    */}
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
            <linearGradient id="bg-navy-grad" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#02143A" />
              <stop offset="35%" stopColor="#05215A" />
              <stop offset="70%" stopColor="#093988" />
              <stop offset="100%" stopColor="#0D4AB5" />
            </linearGradient>

            <linearGradient id="bg-wave-royal" x1="15%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#08378E" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#1155D0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="bg-top-right-arc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A3B94" />
              <stop offset="60%" stopColor="#1357D2" />
              <stop offset="100%" stopColor="#226BFF" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="bg-ice-sky" x1="40%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6F0FC" />
              <stop offset="50%" stopColor="#F0F5FE" />
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

          {/* Soft Organic Contours Behind Right White Card */}
          <path
            d="M 810 0 C 750 280 920 450 1020 680 C 1090 840 1240 900 1536 1024 L 1536 0 Z"
            fill="#DFECFC"
            fillOpacity="0.75"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* Centered Main Stage: Left & Right Spaced Layout (Fits Single Screen)     */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1360px] h-full max-h-[820px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 xl:gap-16 relative z-10">
        {/* ===================================================================== */}
        {/* Left Section: Exact 3D Artwork (Full Height, Contained, No Scroll)    */}
        {/* ===================================================================== */}
        <div className="hidden lg:flex lg:w-[50%] xl:w-[48%] h-full max-h-[740px] items-center justify-center relative overflow-hidden">
          <img
            src="/assets/login-hero.png"
            alt="Nexachain AI Financial Growth Platform"
            className="h-full max-h-[700px] w-auto max-w-full object-contain rounded-3xl drop-shadow-[0_20px_40px_rgba(2,15,45,0.4)] pointer-events-none"
          />
        </div>

        {/* Mobile Top Header (Small screens only) */}
        <div className="lg:hidden w-full flex items-center justify-between pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/assets/logo-ribbon.png" alt="Nexachain AI Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black text-[#0B132A]">
              Nexachain <span className="text-[#0066FF]">AI</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            LOGIN
          </span>
        </div>

        {/* ===================================================================== */}
        {/* Right Section: Compact White Login Card (Tighter, Clean Margins)      */}
        {/* ===================================================================== */}
        <div className="w-full lg:w-[46%] xl:w-[44%] max-w-[420px] xl:max-w-[430px] flex items-center justify-center shrink-0">
          <div className="w-full bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 lg:p-8 shadow-[0_20px_50px_-15px_rgba(10,35,90,0.13)] border border-white/90">
            {/* Card Header: 3D Ribbon Logo & Welcome Typography */}
            <div className="text-center mb-4 sm:mb-5">
              <div className="flex justify-center mb-2">
                <img
                  src="/assets/logo-ribbon.png"
                  alt="Nexachain 3D Ribbon Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md"
                />
              </div>

              <h2 className="text-2xl sm:text-[25px] font-black text-[#0B132A] tracking-tight leading-tight">
                Nexachain <span className="text-[#0066FF]">AI</span>
              </h2>

              <p className="text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase mt-1">
                WELCOME BACK
              </p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Login to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email
                </label>
                <div
                  className={`relative flex items-center rounded-xl border bg-white transition-all ${
                    errors.email
                      ? 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <div className="absolute left-3 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full py-2.5 sm:py-3 pl-9 pr-3 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-0.5 text-[11px] text-rose-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Password
                </label>
                <div
                  className={`relative flex items-center rounded-xl border bg-white transition-all ${
                    errors.password
                      ? 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <div className="absolute left-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full py-2.5 sm:py-3 pl-9 pr-10 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-0.5 text-[11px] text-rose-500 font-medium">{errors.password.message}</p>
                )}

                {/* Forgot Password Link */}
                <div className="flex justify-end mt-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast('Password reset instruction sent to your registered email.', {
                        icon: 'ℹ️',
                      });
                    }}
                    className="text-[11px] font-semibold text-[#0066FF] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1.5 py-2.5 sm:py-3 px-4 bg-[#0066FF] hover:bg-[#0051D6] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
            <div className="relative my-3 sm:my-3.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() =>
                toast('Google OAuth ready for client credentials configuration.', { icon: 'ℹ️' })
              }
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
            <p className="text-center text-xs text-slate-500 mt-3.5 sm:mt-4">
              Don&apos;t have an account?{' '}
              <Link href={ROUTES.REGISTER} className="font-bold text-[#0066FF] hover:underline ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}