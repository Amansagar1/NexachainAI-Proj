'use client';

import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';

export default function WalletPage() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('5000');

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Wallet & Earnings
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your funds, deposits, and withdrawal requests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Available Balance"
            amount={user?.walletBalance || 12750}
            badgeText="Active"
            icon={Wallet}
            iconBgColor="bg-[#0066FF]"
          />
          <StatCard
            title="Total ROI Earned"
            amount={user?.totalRoiEarned || 12750}
            badgeText="Cumulative"
            icon={ArrowUpRight}
            iconBgColor="bg-emerald-500"
          />
          <StatCard
            title="Total Level Income"
            amount={user?.totalLevelIncomeEarned || 4500}
            badgeText="Referrals"
            icon={ArrowDownLeft}
            iconBgColor="bg-purple-600"
          />
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Need to deposit or withdraw?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Transfer funds instantly or request settlement to your registered bank account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Deposit Funds
            </Button>
            <Button
              onClick={() => toast.success('Withdrawal request initiated!')}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Request Withdrawal
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Deposit Funds">
        <div className="space-y-4 text-xs">
          <Input
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(`Deposit of ${formatINR(Number(amount))} processed!`);
                setModalOpen(false);
              }}
            >
              Confirm Deposit
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
