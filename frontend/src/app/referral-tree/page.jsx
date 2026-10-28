'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Network,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { referralsApi } from '../../features/referrals/referralsApi';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export default function ReferralTreePage() {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Collapsed state map for nodes
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await referralsApi.getReferralTree();
      setTreeData(res.data.data);
    } catch (err) {
      console.error('Fetch referral tree error:', err);
      setError('Failed to fetch referral tree hierarchy.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const toggleCollapse = (nodeId) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const referralCode = treeData?.root?.referralCode || user?.referralCode || 'NXA123456';
  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/register?ref=${referralCode}`
      : `https://nexachain.ai/register?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportTree = () => {
    if (!treeData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(treeData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `nexachain_referral_tree_${referralCode}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Referral tree exported successfully!');
  };

  return (
    <AppLayout searchPlaceholder="Search users, referrals, nodes...">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Referral Tree
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              View your complete referral network and hierarchy.
            </p>
            <p className="text-xs text-slate-400 mt-1">Dashboard &gt; Referral Tree</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportTree}
              leftIcon={<Download className="w-4 h-4 text-slate-600" />}
              className="bg-white border-slate-200"
            >
              Export Tree
            </Button>
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Referrals"
            amount={`${treeData?.summary?.totalReferrals || 24}`}
            isCurrency={false}
            subtext="8 Direct | 16 Indirect"
            icon={Users}
            iconBgColor="bg-[#0066FF]"
          />

          <StatCard
            title="Total Level Income"
            amount={treeData?.summary?.totalLevelIncome || 4500}
            badgeText="+18%"
            subtext="From 3 levels"
            icon={Network}
            iconBgColor="bg-emerald-500"
          />

          <StatCard
            title="Direct Referrals"
            amount={`${treeData?.summary?.directReferrals || 8}`}
            isCurrency={false}
            badgeText="+12%"
            subtext="Joined this month"
            icon={Users}
            iconBgColor="bg-purple-600"
          />

          <StatCard
            title="Total Team Size"
            amount={`${treeData?.summary?.totalTeamSize || 25}`}
            isCurrency={false}
            subtext="(You + 24)"
            icon={Users}
            iconBgColor="bg-amber-500"
          />
        </div>

        {/* Interactive Visual Hierarchy Canvas + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Hierarchy Canvas (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            {/* Canvas Header & Zoom Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Referral Network Tree
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual representation of your referral hierarchy.
                </p>
              </div>

              {/* Legend & Zoom Tools */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Level Badges Legend */}
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                    Level 1
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Level 2
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Level 3
                  </span>
                </div>

                {/* Zoom Box */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-600 w-10 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer text-[10px] font-bold ml-1"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Tree Canvas */}
            <div className="overflow-auto py-8 px-4 flex justify-center min-h-[480px]">
              {loading ? (
                <LoadingState message="Building visual hierarchy..." />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchTree} />
              ) : (
                <div
                  className="flex flex-col items-center transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {/* ROOT NODE (LEVEL 0) */}
                  <div className="bg-gradient-to-r from-blue-50 to-white border-2 border-[#0066FF] rounded-2xl p-4 shadow-lg shadow-blue-500/10 w-72 text-center relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Level 0 (Root)
                    </span>
                    <div className="flex items-center justify-center gap-2 mb-2 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                          {treeData?.root?.fullName || 'John Doe'} (You)
                        </h4>
                        <p className="text-[11px] text-slate-400">{referralCode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Total</p>
                        <p className="font-extrabold text-slate-900">
                          {treeData?.root?.totalReferrals || 24}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Direct</p>
                        <p className="font-extrabold text-slate-900">
                          {treeData?.root?.directReferralsCount || 8}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Income</p>
                        <p className="font-extrabold text-emerald-600">
                          {formatINR(treeData?.root?.totalLevelIncome || 4500)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Connector Line */}
                  <div className="w-0.5 h-8 bg-blue-300" />

                  {/* LEVEL 1 NODES ROW */}
                  <div className="flex flex-wrap items-start justify-center gap-4 relative">
                    {/* Horizontal Connector Bar */}
                    <div className="absolute top-0 left-12 right-12 h-0.5 bg-blue-200" />

                    {treeData?.root?.children?.map((l1) => {
                      const isCollapsed = collapsedNodes[l1._id];
                      return (
                        <div key={l1._id} className="flex flex-col items-center relative pt-4">
                          {/* Top tick connector */}
                          <div className="w-0.5 h-4 bg-blue-200 absolute top-0" />

                          {/* Level 1 Node Card */}
                          <div className="bg-white border-2 border-blue-400 rounded-2xl p-3.5 shadow-md w-52 text-center hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                Level 1
                              </span>
                              {l1.children?.length > 0 && (
                                <button
                                  onClick={() => toggleCollapse(l1._id)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                                  title="Toggle children"
                                >
                                  {isCollapsed ? (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="font-bold text-xs text-slate-900">{l1.fullName}</p>
                            <p className="text-[10px] text-slate-400">{l1.referralCode}</p>

                            <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                              <div>
                                <span className="text-[10px] text-slate-400">Referrals: </span>
                                <span className="font-bold text-slate-800">
                                  {l1.directReferralsCount || 0}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400">Earned: </span>
                                <span className="font-bold text-emerald-600">
                                  {formatINR(l1.totalEarned || 0)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Children (Level 2) if not collapsed */}
                          {!isCollapsed && l1.children?.length > 0 && (
                            <>
                              <div className="w-0.5 h-6 bg-emerald-300" />
                              <div className="flex items-start gap-3 relative">
                                {l1.children.map((l2) => (
                                  <div
                                    key={l2._id}
                                    className="flex flex-col items-center relative"
                                  >
                                    {/* Level 2 Node Card */}
                                    <div className="bg-white border border-emerald-400 rounded-xl p-2.5 shadow-sm w-44 text-center">
                                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        Level 2
                                      </span>
                                      <p className="font-bold text-[11px] text-slate-800 mt-1">
                                        {l2.fullName}
                                      </p>
                                      <p className="text-[9px] text-slate-400">{l2.referralCode}</p>
                                      <p className="text-[10px] text-emerald-600 font-bold mt-1">
                                        {formatINR(l2.totalEarned || 0)}
                                      </p>
                                    </div>

                                    {/* Level 3 Leaves */}
                                    {l2.children?.length > 0 && (
                                      <>
                                        <div className="w-0.5 h-4 bg-purple-300" />
                                        <div className="flex items-start gap-2">
                                          {l2.children.map((l3) => (
                                            <div
                                              key={l3._id}
                                              className="bg-white border border-purple-300 rounded-lg p-2 shadow-xs w-36 text-center"
                                            >
                                              <span className="text-[8px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full">
                                                Level 3
                                              </span>
                                              <p className="font-bold text-[10px] text-slate-800 truncate mt-0.5">
                                                {l3.fullName}
                                              </p>
                                              <p className="text-[9px] text-slate-400">
                                                {l3.referralCode}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Referral Info, Direct List, Tree Summary (1 Col) */}
          <div className="space-y-6">
            {/* Referral Info Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Your Referral Info</h4>

              {/* Code Box */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Your Referral Code</p>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="font-extrabold text-blue-900 tracking-wider text-sm">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Link Box */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Shareable Referral Link</p>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-600 truncate mr-2">{referralLink}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 text-slate-600 hover:text-blue-600 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Referrals List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800">
                  Direct Referrals ({treeData?.summary?.directReferrals || 8})
                </h4>
                <span className="text-xs font-semibold text-emerald-600">Active</span>
              </div>

              <div className="space-y-3">
                {['user123', 'user456', 'user789', 'user321', 'user654'].map((userKey, idx) => (
                  <div
                    key={userKey}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{userKey}</p>
                        <p className="text-[10px] text-slate-400">Joined Oct 2024</p>
                      </div>
                    </div>
                    <StatusBadge status="Active" className="text-[10px]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Summary Breakdown Matrix */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Tree Summary</h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50">
                  <span className="font-semibold text-blue-700">Level 1 (Direct)</span>
                  <span className="font-bold text-slate-800">8 Users • ₹ 1,800</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50">
                  <span className="font-semibold text-emerald-700">Level 2</span>
                  <span className="font-bold text-slate-800">12 Users • ₹ 1,750</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50">
                  <span className="font-semibold text-purple-700">Level 3</span>
                  <span className="font-bold text-slate-800">4 Users • ₹ 950</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Total Network Income:</span>
                <span className="text-sm font-extrabold text-[#0066FF]">₹ 4,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
