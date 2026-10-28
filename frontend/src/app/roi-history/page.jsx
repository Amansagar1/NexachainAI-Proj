'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Coins,
  Calendar,
  TrendingUp,
  LineChart as ChartIcon,
  Search,
  RefreshCw,
  Play,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
import { roiApi } from '../../features/roi/roiApi';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

const DONUT_COLORS = ['#0066FF', '#10B981', '#8B5CF6', '#F59E0B'];

export default function ROIHistoryPage() {
  const [data, setData] = useState({
    records: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    metrics: {
      totalRoiEarned: 12750,
      totalRoiDays: 26,
      averageDailyRoi: 490,
      activeInvestmentsCount: 2,
      distribution: [],
      trend: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isProcessingCron, setIsProcessingCron] = useState(false);

  const fetchRoi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await roiApi.getRoiHistory({
        page,
        limit: 10,
        status: statusFilter || undefined,
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Fetch ROI history error:', err);
      setError('Failed to fetch ROI history records.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchRoi();
  }, [fetchRoi]);

  const handleTriggerDailyCron = async () => {
    setIsProcessingCron(true);
    try {
      const res = await roiApi.triggerDailyRoi();
      const info = res.data.data;
      toast.success(
        `Daily ROI executed! Credited: ${info.credited}, Skipped: ${info.skipped}, Total: ${formatINR(
          info.totalAmountCredited
        )}`
      );
      await fetchRoi();
    } catch (err) {
      toast.error('Failed to trigger Daily ROI process.');
    } finally {
      setIsProcessingCron(false);
    }
  };

  // Fallback demo distribution if empty
  const distributionData =
    data.metrics?.distribution?.length > 0
      ? data.metrics.distribution
      : [
          { name: 'Growth Plan A', amount: 4500, percentage: 35 },
          { name: 'Growth Plan B', amount: 5250, percentage: 41 },
          { name: 'Wealth Plan', amount: 3000, percentage: 24 },
        ];

  return (
    <AppLayout searchPlaceholder="Search ROI history, date, etc...">
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ROI History
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              View your daily ROI earnings from your investments.
            </p>
            <p className="text-xs text-slate-400 mt-1">Dashboard &gt; ROI History</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Manual Cron Trigger Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleTriggerDailyCron}
              isLoading={isProcessingCron}
              leftIcon={<Play className="w-3.5 h-3.5 text-blue-600" />}
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Trigger Daily ROI
            </Button>

            {/* Date Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Oct 1, 2024 - Oct 30, 2024</span>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total ROI Earned"
            amount={data.metrics?.totalRoiEarned || 12750}
            badgeText="+12% vs last month"
            icon={Coins}
            iconBgColor="bg-[#0066FF]"
          />

          <StatCard
            title="Total ROI Days"
            amount={`${data.metrics?.totalRoiDays || 26}`}
            isCurrency={false}
            subtext="out of 30 days"
            icon={Calendar}
            iconBgColor="bg-emerald-500"
          />

          <StatCard
            title="Average Daily ROI"
            amount={data.metrics?.averageDailyRoi || 490}
            badgeText="+8% vs last month"
            icon={TrendingUp}
            iconBgColor="bg-purple-600"
          />

          <StatCard
            title="Active Investments"
            amount={`${data.metrics?.activeInvestmentsCount || 2}`}
            isCurrency={false}
            subtext="generating ROI"
            icon={ChartIcon}
            iconBgColor="bg-amber-500"
          />
        </div>

        {/* Visual Charts: ROI Earnings Trend & Distribution Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Area Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  ROI Earnings Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Daily credited returns</p>
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
                <AreaChart
                  data={
                    data.metrics?.trend?.length > 0
                      ? data.metrics.trend
                      : [
                          { date: 'Oct 01', amount: 200 },
                          { date: 'Oct 05', amount: 250 },
                          { date: 'Oct 10', amount: 400 },
                          { date: 'Oct 15', amount: 490 },
                          { date: 'Oct 20', amount: 650 },
                          { date: 'Oct 25', amount: 800 },
                          { date: 'Oct 30', amount: 950 },
                        ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(val) => [formatINR(val), 'Daily ROI']}
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#0066FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#roiGradient)"
                    dot={{ r: 4, fill: '#0066FF' }}
                    activeDot={{ r: 6, fill: '#0066FF' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Earnings Distribution (1 Col) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-2">
              Earnings Distribution
            </h3>

            {/* Donut Center */}
            <div className="relative h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatINR(val)} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute text-center pointer-events-none">
                <p className="text-sm font-extrabold text-slate-900">
                  {formatINR(data.metrics?.totalRoiEarned || 12750)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Earnings</p>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              {distributionData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                    />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{formatINR(item.amount)}</span>
                    <span className="text-[11px] text-slate-400">({item.percentage || 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Table Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                ROI History Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete record of daily credits from active investments.
              </p>
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
              >
                <option value="">All Status</option>
                <option value="Credited">Credited</option>
                <option value="Pending">Pending</option>
              </select>

              <button
                onClick={fetchRoi}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <LoadingState message="Loading ROI history records..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchRoi} />
          ) : data.records?.length === 0 ? (
            <EmptyState
              title="No ROI records found"
              description="No ROI has been credited yet for this filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-6">#</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Investment Plan</th>
                    <th className="py-3.5 px-6">Investment Amount</th>
                    <th className="py-3.5 px-6">Daily ROI (%)</th>
                    <th className="py-3.5 px-6">ROI Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Remarks</th>
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
                          {item.investment?.planDetails?.planName || 'Growth Plan'}
                        </td>
                        <td className="py-4 px-6 text-slate-700">
                          {formatINR(item.investment?.investmentAmount || 25000)}
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-600">
                          {item.dailyRoiPercentage}%
                        </td>
                        <td className="py-4 px-6 font-extrabold text-emerald-600">
                          +{formatINR(item.roiAmount)}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-4 px-6 text-slate-500">{item.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={data.pagination?.totalPages || 1}
            totalItems={data.pagination?.total || 0}
            pageSize={10}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </AppLayout>
  );
}
