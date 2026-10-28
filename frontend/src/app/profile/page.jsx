'use client';

import React from 'react';
import { User, Mail, Phone, Tag, ShieldCheck } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Profile
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Personal information and account credentials.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0B132B] text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.fullName?.slice(0, 2).toUpperCase() || 'JD'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user?.fullName || 'John Doe'}</h3>
                <StatusBadge status={user?.accountStatus || 'Active'} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {formatDate(user?.createdAt || new Date())}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Email Address</span>
              <p className="text-sm font-bold text-slate-800">{user?.email || 'john@nexachain.ai'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Mobile Number</span>
              <p className="text-sm font-bold text-slate-800">{user?.mobileNumber || '+91 98765 43210'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-blue-600 font-semibold block mb-1">Personal Referral Code</span>
              <p className="text-base font-extrabold text-blue-900 tracking-wider">
                {user?.referralCode || 'NXA123456'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold block mb-1">Account Status</span>
              <p className="text-sm font-bold text-emerald-600">Verified & Active</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
