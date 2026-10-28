'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Coins,
  TrendingUp,
  Diamond,
  Star,
  Plus,
  Eye,
  Search,
  Calendar,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Pagination } from '../../components/common/Pagination';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { investmentsApi } from '../../features/investments/investmentsApi';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { extractErrorMessage } from '../../utils/errorHandler';

const PLAN_ICONS = {
  'growth-a': { icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  'growth-b': { icon: Coins, color: 'text-[#0066FF] bg-blue-50 border-blue-200' },
  wealth: { icon: Diamond, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  premium: { icon: Star, color: 'text-amber-500 bg-amber-50 border-amber-200' },
};

export default function InvestmentsPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [investmentsData, setInvestmentsData] = useState({
    records: [],
    counts: { all: 0, active: 0, completed: 0, cancelled: 0 },
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Investment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Investment Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingInvestment, setViewingInvestment] = useState(null);

  // Add Funds Demo Modal
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('10000');

  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansRes, invRes] = await Promise.all([
        investmentsApi.getPlans(),
        investmentsApi.getInvestments({
          status: statusFilter,
          search: searchQuery,
          page,
          limit: 10,
        }),
      ]);

      setPlans(plansRes.data.data.plans || []);
      setInvestmentsData(invRes.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch investments data.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleOpenInvestModal = (plan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minInvestment.toString());
    setIsModalOpen(true);
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const amount = Number(investAmount);
    if (isNaN(amount) || amount < selectedPlan.minInvestment) {
      toast.error(`Minimum investment amount is ${formatINR(selectedPlan.minInvestment)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await investmentsApi.createInvestment({
        planId: selectedPlan.id,
        amount,
      });

      toast.success(`Successfully invested ${formatINR(amount)} in ${selectedPlan.name}!`);
      setIsModalOpen(false);
      await fetchInvestments();
      await refreshUser();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to create investment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout searchPlaceholder="Search investments, plans, etc...">
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header & Wallet Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Investments
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Choose a plan, invest and start earning daily ROI.
            </p>
            <p className="text-xs text-slate-400 mt-1">Dashboard &gt; Investments</p>
          </div>

          {/* Wallet Balance Card with Add Funds */}
          <div className="flex items-center gap-4 bg-white p-4 px-6 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Wallet Balance
              </p>
              <p className="text-xl font-extrabold text-slate-900">
                {formatINR(user?.walletBalance || 12750)}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setAddFundsOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="ml-2 shadow-sm"
            >
              Add Funds
            </Button>
          </div>
        </div>

        {/* Investment Plans Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Investment Plans
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a plan that suits your goals and start your investment journey.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const iconObj = PLAN_ICONS[plan.id] || {
                icon: Coins,
                color: 'text-blue-600 bg-blue-50 border-blue-200',
              };
              const PlanIcon = iconObj.icon;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                    plan.popular
                      ? 'border-[#0066FF] ring-2 ring-blue-500/10'
                      : 'border-slate-200/80'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 bg-[#0066FF] text-white rounded-full uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${iconObj.color}`}
                      >
                        <PlanIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                          {plan.name}
                        </h4>
                        <p className="text-xs text-slate-500">{plan.subtitle}</p>
                      </div>
                    </div>

                    {/* Daily ROI display */}
                    <div className="my-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                          {plan.dailyRoiPercentage}%
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">Daily ROI</span>
                      </div>
                    </div>

                    {/* Features Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-t border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400">Duration</p>
                        <p className="font-bold text-slate-800 mt-0.5">{plan.durationDays} Days</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400">Min Investment</p>
                        <p className="font-bold text-slate-800 mt-0.5">{formatINR(plan.minInvestment)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invest Button */}
                  <Button
                    onClick={() => handleOpenInvestModal(plan)}
                    className="w-full mt-5 font-bold shadow-sm"
                    style={{
                      backgroundColor:
                        plan.id === 'growth-a'
                          ? '#10B981'
                          : plan.id === 'wealth'
                          ? '#8B5CF6'
                          : plan.id === 'premium'
                          ? '#F59E0B'
                          : '#0066FF',
                    }}
                  >
                    Invest Now
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Investments Table Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                My Investments
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                View and manage your investment history.
              </p>
            </div>

            <Button
              onClick={() => handleOpenInvestModal(plans[1] || plans[0])}
              leftIcon={<Plus className="w-4 h-4" />}
              className="self-start md:self-auto font-bold shadow-md shadow-blue-500/20"
            >
              New Investment
            </Button>
          </div>

          {/* Filters & Search Row */}
          <div className="p-4 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'All', count: investmentsData.counts?.all },
                { label: 'Active', count: investmentsData.counts?.active },
                { label: 'Completed', count: investmentsData.counts?.completed },
                { label: 'Cancelled', count: investmentsData.counts?.cancelled },
              ].map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setStatusFilter(tab.label);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.label
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search investments..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#0066FF] outline-none"
              />
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <LoadingState message="Loading investments list..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchInvestments} />
          ) : investmentsData.records?.length === 0 ? (
            <EmptyState
              title="No investments found"
              description="You have no investments matching your current filters."
              actionLabel="Explore Plans"
              onAction={() => handleOpenInvestModal(plans[0])}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-6">#</th>
                    <th className="py-3.5 px-6">Plan Name</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Daily ROI</th>
                    <th className="py-3.5 px-6">Start Date</th>
                    <th className="py-3.5 px-6">End Date</th>
                    <th className="py-3.5 px-6">Total Earned</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {investmentsData.records.map((inv, idx) => {
                    const rowNum = (page - 1) * 10 + idx + 1;
                    return (
                      <tr key={inv._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-400">{rowNum}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800">
                            {inv.planDetails?.planName}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900">
                          {formatINR(inv.investmentAmount)}
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-600">
                          {inv.dailyRoiPercentage}%
                        </td>
                        <td className="py-4 px-6 text-slate-500">{formatDate(inv.startDate)}</td>
                        <td className="py-4 px-6 text-slate-500">{formatDate(inv.endDate)}</td>
                        <td className="py-4 px-6 font-bold text-emerald-600">
                          {formatINR(inv.totalRoiEarned || 0)}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={inv.investmentStatus} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              setViewingInvestment(inv);
                              setDetailsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
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
            totalPages={investmentsData.pagination?.totalPages || 1}
            totalItems={investmentsData.pagination?.total || 0}
            pageSize={10}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Invest Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Invest in ${selectedPlan?.name || 'Plan'}`}
      >
        <form onSubmit={handleCreateInvestment} className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Plan Duration:</span>
              <span className="font-bold text-slate-800">{selectedPlan?.durationDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Return:</span>
              <span className="font-bold text-emerald-600">{selectedPlan?.dailyRoiPercentage}% Daily</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Minimum Amount:</span>
              <span className="font-bold text-slate-800">{formatINR(selectedPlan?.minInvestment || 0)}</span>
            </div>
          </div>

          <Input
            label="Investment Amount (₹)"
            type="number"
            min={selectedPlan?.minInvestment || 1000}
            step="500"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            helperText={`Minimum ₹${selectedPlan?.minInvestment?.toLocaleString()}`}
            required
          />

          {/* Quick Returns Calculation Preview */}
          {Number(investAmount) > 0 && selectedPlan && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-1.5">
              <p className="font-bold text-blue-900">Projected Returns:</p>
              <div className="flex justify-between text-blue-800">
                <span>Daily ROI Return:</span>
                <span className="font-bold">
                  {formatINR((Number(investAmount) * selectedPlan.dailyRoiPercentage) / 100, true)}/day
                </span>
              </div>
              <div className="flex justify-between text-blue-800">
                <span>Estimated Total ROI ({selectedPlan.durationDays} Days):</span>
                <span className="font-bold text-emerald-600">
                  {formatINR(
                    ((Number(investAmount) * selectedPlan.dailyRoiPercentage) / 100) *
                      selectedPlan.durationDays
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Confirm Investment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Investment Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Investment Details"
      >
        {viewingInvestment && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-slate-800">
                  {viewingInvestment.planDetails?.planName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Investment Amount:</span>
                <span className="font-extrabold text-slate-900">
                  {formatINR(viewingInvestment.investmentAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Return:</span>
                <span className="font-bold text-emerald-600">
                  {viewingInvestment.dailyRoiPercentage}% / day
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Start Date:</span>
                <span className="text-slate-800">{formatDate(viewingInvestment.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maturity / End Date:</span>
                <span className="text-slate-800">{formatDate(viewingInvestment.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total ROI Credited:</span>
                <span className="font-extrabold text-emerald-600">
                  {formatINR(viewingInvestment.totalRoiEarned || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={viewingInvestment.investmentStatus} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Funds Demo Modal */}
      <Modal
        isOpen={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
        title="Add Funds to Wallet"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            For demonstration and assessment testing, enter an amount to credit to your wallet
            balance:
          </p>
          <Input
            label="Amount (₹)"
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAddFundsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(`Demo funds of ${formatINR(Number(fundAmount))} added!`);
                setAddFundsOpen(false);
              }}
            >
              Add Funds
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
