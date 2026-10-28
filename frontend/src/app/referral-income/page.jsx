'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Coins,
  Network,
  Wallet,
  ArrowRight,
  Search,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { referralsApi } from '../../features/referrals/referralsApi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

const DONUT_COLORS = ['#0066FF', '#10B981', '#8B5CF6'];

export default function ReferralIncomePage() {
  const { user } = useAuth();
  const [data, setData] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    metrics: {
      totalLevelIncome: 4500,
      directIncome: 2000,
      l1Income: 1800,
      l2Income: 1575,
      l3Income: 1125,
    },
  });
  const [directUsers, setDirectUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [levelFilter, setLevelFilter] = useState('');
  const [page, setPage] = useState(1);

  // Withdraw Modal Demo
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomeRes, directRes] = await Promise.all([
        referralsApi.getReferralIncome({
          level: levelFilter || undefined,
          page,
          limit: 10,
        }),
        referralsApi.getDirectReferrals(),
      ]);

      setData(incomeRes.data.data);
      setDirectUsers(directRes.data.data.referrals || []);
    } catch (err) {
      console.error('Fetch referral income error:', err);
      setError('Failed to fetch referral income records.');
    } finally {
      setLoading(false);
    }
  }, [levelFilter, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Donut chart breakdown
  const pieData = [
    { name: 'Level 1 (40%)', value: data.metrics?.l1Income || 1800, color: '#0066FF' },
    { name: 'Level 2 (35%)', value: data.metrics?.l2Income || 1575, color: '#10B981' },
    { name: 'Level 3 (25%)', value: data.metrics?.l3Income || 1125, color: '#8B5CF6' },
  ];

  // Bar chart trend mockup data
  const barData = [
    { date: 'Oct 01', Direct: 100, Level: 50 },
    { date: 'Oct 05', Direct: 150, Level: 100 },
    { date: 'Oct 10', Direct: 200, Level: 150 },
    { date: 'Oct 15', Direct: 250, Level: 180 },
    { date: 'Oct 20', Direct: 300, Level: 200 },
    { date: 'Oct 25', Direct: 400, Level: 250 },
    { date: 'Oct 30', Direct: 500, Level: 300 },
  ];

  return (
    <AppLayout searchPlaceholder="Search users, investments, referrals...">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Referral Income
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Track your referral earnings and level wise income.
            </p>
            <p className="text-xs text-slate-400 mt-1">Dashboard &gt; Referral Income</p>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Level Income"
            amount={data.metrics?.totalLevelIncome || 4500}
            badgeText="+18%"
            subtext="From 3 levels"
            icon={Coins}
            iconBgColor="bg-purple-600"
          />

          <StatCard
            title="Direct Referral Income"
            amount={data.metrics?.directIncome || 2000}
            badgeText="+12%"
            subtext="From 8 direct referrals"
            icon={Users}
            iconBgColor="bg-emerald-500"
          />

          <StatCard
            title="Total Referrals"
            amount="24"
            isCurrency={false}
            subtext="8 Direct | 16 Indirect"
            icon={Network}
            iconBgColor="bg-[#0066FF]"
          />

          <StatCard
            title="Available Balance"
            amount={user?.walletBalance || 12750}
            icon={Wallet}
            iconBgColor="bg-amber-500"
            actionButton={
              <Button
                size="sm"
                onClick={() => setWithdrawModalOpen(true)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="font-bold shadow-sm"
              >
                Withdraw
              </Button>
            }
          />
        </div>

        {/* Charts: Referral Income Trend (Stacked Bar) & Level-Wise Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stacked Bar Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Referral Income Trend
                </h3>
                <div className="flex items-center gap-4 mt-2 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                    Direct Income
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Level Income
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                {['7D', '30D', '3M', '1Y'].map((t, idx) => (
                  <button
                    key={t}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      idx === 1
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
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
                    formatter={(val) => formatINR(val)}
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="Direct" stackId="a" fill="#0066FF" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Level" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Level Wise Income (1 Col) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-2">
              Level Wise Income
            </h3>

            <div className="relative h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatINR(val)} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute text-center pointer-events-none">
                <p className="text-sm font-extrabold text-slate-900">
                  {formatINR(data.metrics?.totalLevelIncome || 4500)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Income</p>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{formatINR(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Referral Income History Table & Recent Referrals Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header & Level Filter */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Referral Income History
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Commission credits earned from your network.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={levelFilter}
                    onChange={(e) => {
                      setLevelFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="1">Level 1 (Direct)</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                  </select>
                </div>
              </div>

              {/* Table Body */}
              {loading ? (
                <LoadingState message="Loading referral income..." />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchData} />
              ) : data.records?.length === 0 ? (
                <EmptyState
                  title="No referral income found"
                  description="Share your referral link to earn rewards when friends invest."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3.5 px-6">#</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6">From User</th>
                        <th className="py-3.5 px-6">Level</th>
                        <th className="py-3.5 px-6">Income Amount</th>
                        <th className="py-3.5 px-6">Type</th>
                        <th className="py-3.5 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.records.map((item, idx) => {
                        const rowNum = (page - 1) * 10 + idx + 1;
                        return (
                          <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-6 font-semibold text-slate-400">{rowNum}</td>
                            <td className="py-4 px-6 font-semibold text-slate-800">
                              {formatDate(item.date)}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.fromUser?.fullName || 'user' + item.referralLevel}
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge status={`L${item.referralLevel}`} />
                            </td>
                            <td className="py-4 px-6 font-extrabold text-emerald-600">
                              +{formatINR(item.incomeAmount)}
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-600">
                              {item.incomeType}
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge status={item.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={data.pagination?.totalPages || 1}
              totalItems={data.pagination?.total || 0}
              pageSize={10}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>

          {/* Recent Referrals Feed (1 Col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-slate-800">Recent Referrals</h4>
                <Link
                  href={ROUTES.REFERRAL_TREE}
                  className="text-xs font-semibold text-[#0066FF] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {directUsers.length > 0 ? (
                  directUsers.slice(0, 5).map((userItem, idx) => (
                    <div
                      key={userItem._id || idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{userItem.fullName}</p>
                          <p className="text-[11px] text-slate-400">
                            Joined {formatDate(userItem.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={`Level ${idx % 3 + 1}`} />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No referrals yet</p>
                )}
              </div>
            </div>

            <Link
              href={ROUTES.REFERRAL_TREE}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors block"
            >
              View All Referrals →
            </Link>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Withdraw Funds"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            Available wallet balance:{' '}
            <span className="font-bold text-slate-800">
              {formatINR(user?.walletBalance || 12750)}
            </span>
          </p>
          <Input
            label="Withdrawal Amount (₹)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setWithdrawModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(`Withdrawal request of ${formatINR(Number(withdrawAmount))} placed!`);
                setWithdrawModalOpen(false);
              }}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
