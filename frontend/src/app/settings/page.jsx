'use client';

import React from 'react';
import { Settings, Bell, Lock, Globe, Shield } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your notification preferences and platform security.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-xs">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-800 text-sm">Email Notifications</p>
              <p className="text-slate-400">Receive alerts when daily ROI or referral income is credited.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</p>
              <p className="text-slate-400">Add an extra layer of security to your investment account.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success('2FA configuration enabled!')}>
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-bold text-slate-800 text-sm">Timezone & Locale</p>
              <p className="text-slate-400">Configured to Asia/Kolkata (IST).</p>
            </div>
            <span className="font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Asia/Kolkata (GMT+5:30)
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
