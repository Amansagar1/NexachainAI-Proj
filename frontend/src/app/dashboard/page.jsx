'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Coins,
  TrendingUp,
  Users,
  Wallet,
  Copy,
  Check,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { dashboardApi } from '../../features/dashboard/dashboardApi';
import { ROUTES } from '../../constants/routes';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('30d');
  const [chartData, setChartData] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, chartRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getEarnings(chartPeriod),
      ]);
      setSummary(sumRes.data.data);
      setChartData(chartRes.data.data.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard metrics. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [chartPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopyCode = () => {
    if (summary?.referralSummary?.referralCode) {
      navigator.clipboard.writeText(summary.referralSummary.referralCode);
      setCopiedCode(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <AppLayout>
      {loading ? (
        <LoadingState message="Loading your investment dashboard..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="space-y-8">
          {/* Top Greeting & Referral Badges Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Welcome back, {summary?.user?.fullName || 'Investor'}! Here&apos;s your investment overview.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Referral Code Box */}
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Your Referral Code
                  </p>
                  <p className="text-base font-extrabold text-blue-900 tracking-wider">
                    {summary?.referralSummary?.referralCode || 'NXA123456'}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Total Referrals Badge */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Referrals
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {summary?.referralSummary?.totalReferrals || 0}{' '}
                    <span className="text-xs font-normal text-slate-400">Direct</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Investments"
              amount={summary?.kpis?.totalInvestments?.amount || 0}
              badgeText="+12%"
              subtext={`${summary?.kpis?.totalInvestments?.activePlansCount || 0} Active Plans`}
              icon={Coins}
              iconBgColor="bg-[#0066FF]"
              onClick={() => router.push(ROUTES.INVESTMENTS)}
            />

            <StatCard
              title="Daily ROI"
              amount={summary?.kpis?.dailyRoi?.amount || 0}
              badgeText="+5%"
              subtext="From active investments"
              icon={TrendingUp}
              iconBgColor="bg-emerald-500"
              onClick={() => router.push(ROUTES.ROI_HISTORY)}
            />

            <StatCard
              title="Total Level Income"
              amount={summary?.kpis?.totalLevelIncome?.amount || 0}
              badgeText="+18%"
              subtext="From 3 levels"
              icon={Users}
              iconBgColor="bg-purple-600"
              onClick={() => router.push(ROUTES.REFERRAL_INCOME)}
            />

            <StatCard
              title="Wallet Balance"
              amount={summary?.kpis?.walletBalance?.amount || 0}
              badgeText="+8%"
              subtext="Available balance"
              icon={Wallet}
              iconBgColor="bg-amber-500"
              onClick={() => router.push(ROUTES.WALLET)}
            />
          </div>

          {/* Middle Row: Earnings Overview Chart & Mini Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Interactive Recharts Line Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Earnings Overview
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                      ROI Earnings
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Referral Income
                    </span>
                  </div>
                </div>

                {/* Period Selector Pills */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                  {['7d', '30d', '3m', '1y'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        chartPeriod === p
                          ? 'bg-[#0066FF] text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="displayDate"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip
                      formatter={(val, name) => [
                        formatINR(val),
                        name === 'roiEarnings' ? 'ROI Earnings' : 'Referral Income',
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="roiEarnings"
                      stroke="#0066FF"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#0066FF' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="referralIncome"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right 1 Col: Recent Investments & Recent Earnings */}
            <div className="space-y-6">
              {/* Recent Investments Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800">Recent Investments</h4>
                  <Link
                    href={ROUTES.INVESTMENTS}
                    className="text-xs font-semibold text-[#0066FF] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {summary?.recentInvestments?.length > 0 ? (
                    summary.recentInvestments.map((inv) => (
                      <div
                        key={inv._id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{inv.planName}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(inv.startDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{formatINR(inv.amount)}</p>
                          <StatusBadge status={inv.status} className="mt-1 text-[10px]" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No investments found</p>
                  )}
                </div>
              </div>

              {/* Recent Earnings Feed Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800">Recent Earnings</h4>
                  <Link
                    href={ROUTES.ROI_HISTORY}
                    className="text-xs font-semibold text-[#0066FF] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {summary?.recentEarnings?.length > 0 ? (
                    summary.recentEarnings.map((earn, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              earn.iconType === 'roi'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-purple-100 text-purple-600'
                            }`}
                          >
                            {earn.iconType === 'roi' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{earn.type}</p>
                            <p className="text-[11px] text-slate-400">{formatDate(earn.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">+{formatINR(earn.amount)}</p>
                          <StatusBadge status={earn.status} className="mt-0.5 text-[10px]" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No earnings yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Referral Network Mini Tree & Investment Plans Teaser */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral Network Teaser */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Your Referral Network</h3>
                  <Link
                    href={ROUTES.REFERRAL_TREE}
                    className="text-xs font-semibold text-[#0066FF] hover:underline"
                  >
                    View Tree
                  </Link>
                </div>

                {/* 3 mini cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Referrals</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-1">
                      {summary?.referralSummary?.totalReferrals || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Direct Referrals</p>
                    <p className="text-lg font-extrabold text-emerald-800 mt-1">
                      {summary?.referralSummary?.directReferrals || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
                    <p className="text-[10px] font-bold text-purple-600 uppercase">Total Level Income</p>
                    <p className="text-lg font-extrabold text-purple-800 mt-1">
                      {formatINR(summary?.referralSummary?.totalLevelIncome || 0)}
                    </p>
                  </div>
                </div>

                {/* Mini Visual Hierarchy Preview */}
                <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col items-center">
                  {/* Root Node */}
                  <div className="px-5 py-2 rounded-2xl bg-[#0066FF] text-white text-xs font-bold shadow-md shadow-blue-500/20 text-center">
                    <p>{summary?.user?.fullName || 'John Doe'} (You)</p>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-0.5 h-6 bg-blue-300" />

                  {/* Children Row */}
                  <div className="flex items-center gap-4 sm:gap-8">
                    {['user123', 'user456', 'user789'].map((uname, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-sm text-center"
                      >
                        <p className="text-[#0066FF]">{uname}</p>
                        <p className="text-[10px] font-normal text-slate-400">Level 1</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Plans Teaser */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800">Investment Plans</h3>
                  <Link
                    href={ROUTES.INVESTMENTS}
                    className="text-xs font-semibold text-[#0066FF] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Growth Plan A */}
                  <div className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Growth Plan A</h4>
                      <p className="text-xs text-slate-500 mt-0.5">1% Daily ROI • 90 Days</p>
                      <p className="text-xs font-semibold text-emerald-600 mt-2">
                        Min Investment: ₹ 1,000
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(ROUTES.INVESTMENTS)}
                      className="mt-4 w-full py-2 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Invest Now
                    </button>
                  </div>

                  {/* Growth Plan B */}
                  <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white flex flex-col justify-between relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 bg-[#0066FF] text-white rounded-full">
                      ★ Popular
                    </span>
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center mb-3">
                        <Coins className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Growth Plan B</h4>
                      <p className="text-xs text-slate-500 mt-0.5">1.5% Daily ROI • 120 Days</p>
                      <p className="text-xs font-semibold text-[#0066FF] mt-2">
                        Min Investment: ₹ 5,000
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(ROUTES.INVESTMENTS)}
                      className="mt-4 w-full py-2 rounded-xl bg-[#0066FF] text-white hover:bg-blue-700 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
