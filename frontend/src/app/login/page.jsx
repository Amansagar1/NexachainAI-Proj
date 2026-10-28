'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col lg:flex-row relative bg-[#EEF5FC] select-none">
      {/* ========================================================================= */}
      {/* Left Column: Exact Edge-to-Edge 3D Artwork from Nexachain AI Design       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden bg-[#03173D]">
        <img
          src="/assets/login-hero.png"
          alt="Nexachain AI Financial Growth Platform"
          className="w-full h-full object-cover object-left-top pointer-events-none"
        />
      </div>

      {/* ========================================================================= */}
      {/* Right Column: Exact Ambient Waves Background & Interactive White Card     */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative overflow-hidden bg-[#EEF5FC]">
        {/* Soft Ambient Background Wave in top-right corner matching design */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 768 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="top-right-swoop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A3B94" />
                <stop offset="50%" stopColor="#1256D1" />
                <stop offset="100%" stopColor="#226BFF" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="soft-ice-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6F0FC" />
                <stop offset="50%" stopColor="#EEF5FE" />
                <stop offset="100%" stopColor="#F8FAFE" />
              </linearGradient>
            </defs>

            {/* Base pale sky canvas */}
            <rect width="768" height="1024" fill="url(#soft-ice-bg)" />

            {/* Top-Right Deep Blue Corner Arc */}
            <path
              d="M 120 0 C 220 130 420 200 768 240 L 768 0 Z"
              fill="url(#top-right-swoop)"
            />

            {/* Soft Ambient Lower Wave Contour */}
            <path
              d="M 0 850 C 250 820 450 900 768 1024 L 0 1024 Z"
              fill="#DFECFC"
              fillOpacity="0.6"
            />
          </svg>
        </div>

        {/* Mobile Header for small screens where left column is hidden */}
        <div className="lg:hidden absolute top-4 left-4 flex items-center gap-2 z-20">
          <img src="/assets/logo-ribbon.png" alt="Nexachain AI Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-black text-[#0B132A]">
            Nexachain <span className="text-[#0066FF]">AI</span>
          </span>
        </div>

        {/* ========================================================================= */}
        {/* The Exact White Login Card (1:1 Clone of Design)                          */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[460px] xl:max-w-[480px] bg-white rounded-[32px] sm:rounded-[36px] p-7 sm:p-10 lg:p-11 shadow-[0_25px_60px_-15px_rgba(10,35,90,0.13)] border border-white/90 relative z-10 my-auto">
          {/* Card Top: 3D Ribbon Logo & Welcome Typography */}
          <div className="text-center mb-6 sm:mb-7">
            <div className="flex justify-center mb-2.5">
              <img
                src="/assets/logo-ribbon.png"
                alt="Nexachain 3D Ribbon Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
              />
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

          {/* Login Form */}
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
              className="w-full mt-2 py-3.5 px-4 bg-[#0066FF] hover:bg-[#0051D6] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
          <div className="relative my-4 sm:my-5 text-center">
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
          <p className="text-center text-xs text-slate-500 mt-5 sm:mt-6">
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