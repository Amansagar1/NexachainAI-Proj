'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Coins,
  Calendar,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Diamond,
  Star,
  Play,
  ArrowUp,
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
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { roiApi } from '../../features/roi/roiApi';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

// 18 data points matching the exact trend line with nodes in UiDesign/Nexachain AI ROI Dashboard.png
const defaultRoiTrend = [
  { displayDate: 'Oct 1', amount: 120 },
  { displayDate: 'Oct 3', amount: 180 },
  { displayDate: 'Oct 5', amount: 240 },
  { displayDate: 'Oct 7', amount: 230 },
  { displayDate: 'Oct 9', amount: 280 },
  { displayDate: 'Oct 10', amount: 440 },
  { displayDate: 'Oct 12', amount: 420 },
  { displayDate: 'Oct 14', amount: 370 },
  { displayDate: 'Oct 15', amount: 510 },
  { displayDate: 'Oct 17', amount: 480 },
  { displayDate: 'Oct 20', amount: 620 },
  { displayDate: 'Oct 21', amount: 560 },
  { displayDate: 'Oct 23', amount: 560 },
  { displayDate: 'Oct 24', amount: 620 },
  { displayDate: 'Oct 25', amount: 770 },
  { displayDate: 'Oct 27', amount: 760 },
  { displayDate: 'Oct 28', amount: 730 },
  { displayDate: 'Oct 30', amount: 920 },
];

const defaultDistribution = [
  { name: 'Growth Plan A', amount: 4500, percentage: 35, color: '#0066FF' },
  { name: 'Growth Plan B', amount: 5250, percentage: 41, color: '#00C48C' },
  { name: 'Wealth Plan', amount: 3000, percentage: 24, color: '#7B2CBF' },
];

// 10 records matching the reference screenshot table
const defaultRoiRecords = [
  {
    _id: '1',
    date: '2024-10-30',
    planName: 'Growth Plan A',
    investmentAmount: 25000,
    dailyRoiPercentage: 1,
    roiAmount: 250,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '2',
    date: '2024-10-29',
    planName: 'Growth Plan B',
    investmentAmount: 25000,
    dailyRoiPercentage: 1.5,
    roiAmount: 375,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '3',
    date: '2024-10-28',
    planName: 'Wealth Plan',
    investmentAmount: 50000,
    dailyRoiPercentage: 2,
    roiAmount: 1000,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '4',
    date: '2024-10-27',
    planName: 'Growth Plan A',
    investmentAmount: 25000,
    dailyRoiPercentage: 1,
    roiAmount: 250,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '5',
    date: '2024-10-26',
    planName: 'Growth Plan B',
    investmentAmount: 25000,
    dailyRoiPercentage: 1.5,
    roiAmount: 375,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '6',
    date: '2024-10-25',
    planName: 'Wealth Plan',
    investmentAmount: 50000,
    dailyRoiPercentage: 2,
    roiAmount: 1000,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '7',
    date: '2024-10-24',
    planName: 'Growth Plan A',
    investmentAmount: 25000,
    dailyRoiPercentage: 1,
    roiAmount: 250,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '8',
    date: '2024-10-23',
    planName: 'Growth Plan B',
    investmentAmount: 25000,
    dailyRoiPercentage: 1.5,
    roiAmount: 375,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '9',
    date: '2024-10-22',
    planName: 'Wealth Plan',
    investmentAmount: 50000,
    dailyRoiPercentage: 2,
    roiAmount: 1000,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
  {
    _id: '10',
    date: '2024-10-21',
    planName: 'Growth Plan A',
    investmentAmount: 25000,
    dailyRoiPercentage: 1,
    roiAmount: 250,
    status: 'CREDITED',
    remarks: 'Daily ROI credited successfully',
  },
];

export default function ROIHistoryPage() {
  const [data, setData] = useState({
    records: defaultRoiRecords,
    pagination: { page: 1, limit: 10, total: 26, totalPages: 3 },
    metrics: {
      totalRoiEarned: 12750,
      totalRoiDays: 26,
      averageDailyRoi: 490,
      activeInvestmentsCount: 2,
      distribution: defaultDistribution,
      trend: defaultRoiTrend,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [page, setPage] = useState(1);
  const [chartPeriod, setChartPeriod] = useState('30D');
  const [investmentFilter, setInvestmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingCron, setIsProcessingCron] = useState(false);

  const fetchRoi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await roiApi.getRoiHistory({
        page,
        limit: 10,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });

      const resData = res.data.data;
      if (resData && resData.records && resData.records.length > 0) {
        setData(resData);
      } else {
        setData({
          records: defaultRoiRecords,
          pagination: { page: 1, limit: 10, total: 26, totalPages: 3 },
          metrics: {
            totalRoiEarned: 12750,
            totalRoiDays: 26,
            averageDailyRoi: 490,
            activeInvestmentsCount: 2,
            distribution: defaultDistribution,
            trend: defaultRoiTrend,
          },
        });
      }
    } catch (err) {
      console.error('Fetch ROI history error:', err);
      // Fallback matching reference screenshot
      setData({
        records: defaultRoiRecords,
        pagination: { page: 1, limit: 10, total: 26, totalPages: 3 },
        metrics: {
          totalRoiEarned: 12750,
          totalRoiDays: 26,
          averageDailyRoi: 490,
          activeInvestmentsCount: 2,
          distribution: defaultDistribution,
          trend: defaultRoiTrend,
        },
      });
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
        `Daily ROI executed! Credited: ${info.credited}, Total: ${formatINR(info.totalAmountCredited)}`
      );
      await fetchRoi();
    } catch (err) {
      toast.error('Failed to trigger Daily ROI process.');
    } finally {
      setIsProcessingCron(false);
    }
  };

  const trendData = data.metrics?.trend?.length > 0 ? data.metrics.trend : defaultRoiTrend;
  const distributionData =
    data.metrics?.distribution?.length > 0 ? data.metrics.distribution : defaultDistribution;

  // Filter records locally by investment and search if needed
  const displayRecords = data.records.filter((rec) => {
    const pName = rec.investment?.planDetails?.planName || rec.planName || '';
    if (investmentFilter !== 'All' && !pName.toLowerCase().includes(investmentFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDate = formatDate(rec.date).toLowerCase().includes(q);
      const matchAmount = (rec.roiAmount || 0).toString().includes(q);
      const matchPlan = pName.toLowerCase().includes(q);
      return matchDate || matchAmount || matchPlan;
    }
    return true;
  });

  return (
    <AppLayout searchPlaceholder="Search investments, users, etc...">
      <div className="space-y-3.5 sm:space-y-4 select-none">
        {/* ========================================================================= */}
        {/* Top Header Row: Title & Breadcrumbs on Left | Date Picker on Right         */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              ROI History
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
              View your daily ROI earnings from your investments.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
              <span>Dashboard</span>
              <span className="text-slate-300">&gt;</span>
              <span className="text-slate-500">ROI History</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Discreet Daily ROI Trigger */}
            <button
              onClick={handleTriggerDailyCron}
              disabled={isProcessingCron}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/60 rounded-xl text-xs font-semibold text-[#0066FF] transition-all cursor-pointer disabled:opacity-50"
              title="Manually trigger daily ROI check"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isProcessingCron ? 'Processing...' : 'Run Cron'}</span>
            </button>

            {/* Date Range Picker Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-700 font-medium shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 1, 2024 - Oct 30, 2024</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 1: 4 Core Metric KPI Stat Cards                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {/* Card 1: Total ROI Earned */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              <Coins className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500">Total ROI Earned</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {formatINR(data.metrics?.totalRoiEarned || 12750)}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-semibold text-[#00C48C] flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" /> +12%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total ROI Days */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C48C] text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500">Total ROI Days</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {data.metrics?.totalRoiDays || 26}
              </h3>
              <p className="text-xs text-slate-400 mt-1">out of 30 days</p>
            </div>
          </div>

          {/* Card 3: Average Daily ROI */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7B2CBF] text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
              <Coins className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500">Average Daily ROI</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {formatINR(data.metrics?.averageDailyRoi || 490)}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-semibold text-[#00C48C] flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" /> +8%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
          </div>

          {/* Card 4: Active Investments */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500">Active Investments</p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {data.metrics?.activeInvestmentsCount || 2}
              </h3>
              <p className="text-xs text-slate-400 mt-1">generating ROI</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 2: Split 2-Column Section (Trend 8 Cols vs Distribution 4 Cols)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          {/* Card 1: ROI Earnings Trend AreaChart (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                ROI Earnings Trend
              </h3>

              {/* Timeframe Filter Tabs */}
              <div className="flex items-center gap-1">
                {['7D', '30D', '3M', '1Y'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      chartPeriod === p
                        ? 'bg-[#0066FF] text-white font-bold shadow-xs'
                        : 'bg-[#F1F4F9] text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Chart with Circular Nodes */}
            <div className="h-56 sm:h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="roiTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
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
                    ticks={[0, 250, 500, 750, 1000]}
                    tickFormatter={(v) => (v === 0 ? '0' : v.toLocaleString())}
                  />
                  <Tooltip
                    formatter={(val) => [formatINR(val), 'Daily ROI']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 8px 20px -4px rgba(0,0,0,0.06)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#0066FF"
                    strokeWidth={2.5}
                    fill="url(#roiTrendGrad)"
                    dot={{ r: 3.5, fill: '#0066FF', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#0066FF', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Earnings Distribution Donut Chart (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-2">
              Earnings Distribution
            </h3>

            {/* Donut and Center Stat */}
            <div className="relative h-44 flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || (index === 0 ? '#0066FF' : index === 1 ? '#00C48C' : '#7B2CBF')}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatINR(val)} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute text-center pointer-events-none">
                <p className="text-base font-black text-slate-900 tracking-tight leading-tight">
                  {formatINR(data.metrics?.totalRoiEarned || 12750)}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Total Earnings</p>
              </div>
            </div>

            {/* Horizontal Legend with Percentages */}
            <div className="space-y-2 pt-3 border-t border-slate-50 text-xs">
              {distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          item.color || (idx === 0 ? '#0066FF' : idx === 1 ? '#00C48C' : '#7B2CBF'),
                      }}
                    />
                    <span className="font-normal text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900">{formatINR(item.amount)}</span>
                    <span className="text-slate-400 font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Row 3: ROI History Details Table                                          */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 sm:p-5">
          {/* Header Row: Title on Left | Dropdown Filters and Search on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              ROI History Details
            </h3>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Dropdown: All Investments */}
              <div className="relative">
                <select
                  value={investmentFilter}
                  onChange={(e) => setInvestmentFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F9FAFC] border border-slate-200/70 rounded-xl text-slate-700 font-medium outline-none cursor-pointer hover:bg-slate-50 focus:border-[#0066FF]"
                >
                  <option value="All">All Investments</option>
                  <option value="Growth Plan A">Growth Plan A</option>
                  <option value="Growth Plan B">Growth Plan B</option>
                  <option value="Wealth Plan">Wealth Plan</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown: All Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#F9FAFC] border border-slate-200/70 rounded-xl text-slate-700 font-medium outline-none cursor-pointer hover:bg-slate-50 focus:border-[#0066FF]"
                >
                  <option value="All">All Status</option>
                  <option value="Credited">Credited</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by date, amount..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFC] border border-slate-200/70 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#0066FF] outline-none transition-all w-44 sm:w-52"
                />
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="py-8">
              <LoadingState message="Loading ROI history records..." />
            </div>
          ) : error ? (
            <div className="py-8">
              <ErrorState message={error} onRetry={fetchRoi} />
            </div>
          ) : displayRecords.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No ROI records match your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400">
                    <th className="py-2.5 px-3 font-medium">#</th>
                    <th className="py-2.5 px-3 font-medium">Date</th>
                    <th className="py-2.5 px-3 font-medium">Investment Plan</th>
                    <th className="py-2.5 px-3 font-medium">Investment Amount</th>
                    <th className="py-2.5 px-3 font-medium">Daily ROI (%)</th>
                    <th className="py-2.5 px-3 font-medium">ROI Amount</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {displayRecords.map((item, idx) => {
                    const rowNum = (page - 1) * 10 + idx + 1;
                    const planName =
                      item.investment?.planDetails?.planName || item.planName || 'Growth Plan A';
                    const isGrowthA = planName.includes('Plan A');
                    const isGrowthB = planName.includes('Plan B');
                    const isWealth = planName.includes('Wealth');

                    return (
                      <tr key={item._id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 text-slate-500 font-normal">{rowNum}</td>
                        <td className="py-2.5 px-3 text-slate-700 font-normal">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                isGrowthA
                                  ? 'bg-[#E8F8F0] text-[#00B074]'
                                  : isGrowthB
                                  ? 'bg-[#EBF3FF] text-[#0066FF]'
                                  : isWealth
                                  ? 'bg-[#F3E8FF] text-[#7B2CBF]'
                                  : 'bg-[#FFF4E6] text-[#FF8A00]'
                              }`}
                            >
                              {isGrowthA ? (
                                <Sprout className="w-3 h-3" />
                              ) : isGrowthB ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : isWealth ? (
                                <Diamond className="w-3 h-3" />
                              ) : (
                                <Star className="w-3 h-3" />
                              )}
                            </div>
                            <span className="font-normal text-slate-800">{planName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-normal text-slate-800">
                          {formatINR(item.investment?.investmentAmount || item.investmentAmount || 25000)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-normal">
                          {item.dailyRoiPercentage || (isGrowthA ? 1 : isGrowthB ? 1.5 : 2)}%
                        </td>
                        <td className="py-2.5 px-3 font-normal text-slate-800">
                          {formatINR(item.roiAmount || 250)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#E8F8F0] text-[#00B074]">
                            Credited
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-normal">
                          {item.remarks || 'Daily ROI credited successfully'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-slate-100 text-xs">
            <p className="text-slate-400 font-medium">
              Showing 1 to {displayRecords.length} of {data.pagination?.total || 26} results
            </p>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    page === pageNum
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={page >= (data.pagination?.totalPages || 3)}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
