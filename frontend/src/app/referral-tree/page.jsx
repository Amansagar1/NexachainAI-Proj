'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Minimize2,
  ChevronRight,
  User,
  ArrowUp,
  Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLayout } from '../../components/layout/AppLayout';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { referralsApi } from '../../features/referrals/referralsApi';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';

// Hierarchy data matching UiDesign/Nexachain AI Referral Tree Dashboard.png
const defaultTreeData = {
  root: {
    fullName: 'John Doe',
    referralCode: 'NXA123456',
    totalReferrals: 24,
    directReferralsCount: 8,
    totalLevelIncome: 4500,
  },
  l1Nodes: [
    {
      id: 'u123',
      name: 'user123',
      level: 1,
      referrals: 5,
      earned: 1800,
      children: [
        {
          id: 'u654',
          name: 'user654',
          level: 2,
          referrals: 2,
          earned: 500,
          children: [
            { id: 'u777', name: 'user777', level: 3, referrals: 0, earned: 0 },
          ],
        },
        {
          id: 'u987',
          name: 'user987',
          level: 2,
          referrals: 3,
          earned: 750,
          children: [
            { id: 'u888', name: 'user888', level: 3, referrals: 1, earned: 100 },
          ],
        },
      ],
    },
    {
      id: 'u456',
      name: 'user456',
      level: 1,
      referrals: 3,
      earned: 1200,
      children: [
        {
          id: 'u111',
          name: 'user111',
          level: 2,
          referrals: 1,
          earned: 250,
          children: [
            { id: 'u999', name: 'user999', level: 3, referrals: 0, earned: 0 },
          ],
        },
        {
          id: 'u222',
          name: 'user222',
          level: 2,
          referrals: 2,
          earned: 500,
          children: [
            { id: 'u1000', name: 'user1000', level: 3, referrals: 1, earned: 100 },
          ],
        },
      ],
    },
    {
      id: 'u789',
      name: 'user789',
      level: 1,
      referrals: 2,
      earned: 1000,
      children: [
        {
          id: 'u333',
          name: 'user333',
          level: 2,
          referrals: 1,
          earned: 250,
          children: [],
        },
        {
          id: 'u444',
          name: 'user444',
          level: 2,
          referrals: 1,
          earned: 250,
          children: [
            { id: 'u1010', name: 'user1010', level: 3, referrals: 0, earned: 0 },
          ],
        },
      ],
    },
    {
      id: 'u321',
      name: 'user321',
      level: 1,
      referrals: 4,
      earned: 1500,
      children: [
        {
          id: 'u555',
          name: 'user555',
          level: 2,
          referrals: 2,
          earned: 500,
          children: [
            { id: 'u1111', name: 'user1111', level: 3, referrals: 1, earned: 100 },
          ],
        },
        {
          id: 'u666',
          name: 'user666',
          level: 2,
          referrals: 2,
          earned: 500,
          children: [],
        },
      ],
    },
  ],
  directReferralsList: [
    { name: 'user123', joined: 'Joined Oct 30, 2024', status: 'Active', avatarBg: 'bg-blue-500' },
    { name: 'user456', joined: 'Joined Oct 28, 2024', status: 'Active', avatarBg: 'bg-amber-500' },
    { name: 'user789', joined: 'Joined Oct 25, 2024', status: 'Active', avatarBg: 'bg-blue-500' },
    { name: 'user321', joined: 'Joined Oct 22, 2024', status: 'Active', avatarBg: 'bg-emerald-500' },
    { name: 'user654', joined: 'Joined Oct 20, 2024', status: 'Active', avatarBg: 'bg-blue-500' },
  ],
  summaryMatrix: [
    { level: 'Level 1 (Direct)', count: '8 Users', amount: 1800, dotColor: 'bg-[#0066FF]' },
    { level: 'Level 2', count: '12 Users', amount: 1750, dotColor: 'bg-[#00C48C]' },
    { level: 'Level 3', count: '4 Users', amount: 950, dotColor: 'bg-[#7B2CBF]' },
  ],
};

export default function ReferralTreePage() {
  const { user } = useAuth();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customRefCode, setCustomRefCode] = useState('NXA123456');

  const referralCode = user?.referralCode || customRefCode;
  const referralLink = `https://nexachain.ai/register?ref=${referralCode}`;

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
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(defaultTreeData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `nexachain_referral_tree_${referralCode}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Referral tree exported successfully!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <AppLayout searchPlaceholder="Search users, investments, referrals...">
      <div className="space-y-4">
        {/* Top Header Row with Breadcrumbs and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Referral Tree
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View your complete referral network and hierarchy.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-500 font-medium">Referral Tree</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportTree}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Tree</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all shadow-xs cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-slate-600" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total Referrals */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Referrals</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                24
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">8 Direct &nbsp;|&nbsp; 16 Indirect</p>
            </div>
          </div>

          {/* Card 2: Total Level Income */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#00C48C] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-slate-500">Total Level Income</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  ₹ 4,500
                </h3>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" /> 18%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">From 3 levels</p>
            </div>
          </div>

          {/* Card 3: Direct Referrals */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#7B2CBF] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-slate-500">Direct Referrals</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  8
                </h3>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" /> 12%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Joined this month</p>
            </div>
          </div>

          {/* Card 4: Total Team Size */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FF8A00] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total Team Size</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                25
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">(You + 24)</p>
            </div>
          </div>
        </div>

        {/* Main Content: 8-col Visual Network Tree Canvas + 4-col Right Sidebar */}
        <div className="grid grid-cols-12 gap-3.5 sm:gap-4">
          {/* Left Canvas: Referral Network Tree (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
            {/* Canvas Header: Title, Legend, Zoom Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Referral Network Tree
                </h2>
                <p className="text-[11px] text-slate-400">
                  Visual representation of your referral hierarchy.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Level Badges Legend */}
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                    Level 1
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00C48C]" />
                    Level 2
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7B2CBF]" />
                    Level 3
                  </span>
                </div>

                {/* Zoom Box */}
                <div className="flex items-center border border-slate-200 rounded-xl px-1.5 py-0.5 bg-white text-xs text-slate-600 shadow-2xs">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-semibold px-2 min-w-[42px] text-center text-slate-700">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <span className="h-3 w-px bg-slate-200 mx-1" />
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Tree Canvas Body */}
            <div className="overflow-x-auto py-5 px-1 min-h-[460px] flex items-center justify-center">
              <div
                className="w-full min-w-[760px] max-w-[840px] transition-transform duration-200 origin-top flex flex-col items-center"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {/* ROOT NODE (LEVEL 0 - John Doe (You)) */}
                <div className="w-[280px] bg-white border-2 border-blue-400 rounded-2xl p-3 shadow-xs text-center relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {user?.fullName || defaultTreeData.root.fullName} (You)
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {referralCode}
                        </p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Level 0
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2.5 mt-2.5 border-t border-slate-100 text-center">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 leading-tight">24</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Total Referrals</p>
                    </div>
                    <div className="border-x border-slate-100">
                      <p className="font-extrabold text-xs text-slate-900 leading-tight">8</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Direct Referrals</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 leading-tight">₹ 4,500</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Total Income</p>
                    </div>
                  </div>
                </div>

                {/* SVG CONNECTOR FROM ROOT TO LEVEL 1 (Dashed Blue Lines) */}
                <div className="w-full h-8 relative pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 32">
                    {/* Vertical drop from center of root */}
                    <path
                      d="M 50 0 L 50 16 M 12.5 16 L 87.5 16 M 12.5 16 L 12.5 32 M 37.5 16 L 37.5 32 M 62.5 16 L 62.5 32 M 87.5 16 L 87.5 32"
                      fill="none"
                      stroke="#0066FF"
                      strokeWidth="1.25"
                      strokeDasharray="2.5 2.5"
                    />
                  </svg>
                </div>

                {/* LEVEL 1 ROW (4 Columns) */}
                <div className="grid grid-cols-4 gap-3 w-full">
                  {defaultTreeData.l1Nodes.map((l1Node, idx) => (
                    <div key={l1Node.id} className="flex flex-col items-center">
                      {/* Level 1 Node Card */}
                      <div className="w-full bg-blue-50/70 border border-blue-200 rounded-2xl p-2.5 text-center shadow-xs hover:border-blue-300 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-1 shadow-2xs">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h5 className="font-bold text-xs text-slate-900 leading-tight">
                          {l1Node.name}
                        </h5>
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
                          Level 1
                        </span>
                        <div className="mt-1.5 pt-1.5 border-t border-blue-100 text-[10px] space-y-0.5">
                          <p className="text-slate-500">{l1Node.referrals} Referrals</p>
                          <p className="font-bold text-slate-800">
                            {formatINR(l1Node.earned)} Earned
                          </p>
                        </div>
                      </div>

                      {/* SVG CONNECTOR FROM LEVEL 1 TO LEVEL 2 */}
                      <div className="w-full h-6 relative pointer-events-none">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
                          <path
                            d="M 50 0 L 50 12 M 25 12 L 75 12 M 25 12 L 25 24 M 75 12 L 75 24"
                            fill="none"
                            stroke="#00C48C"
                            strokeWidth="1.25"
                            strokeDasharray="2.5 2.5"
                          />
                        </svg>
                      </div>

                      {/* LEVEL 2 CHILDREN (2 Sub-Columns under each L1) */}
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {l1Node.children.map((l2Node) => (
                          <div key={l2Node.id} className="flex flex-col items-center">
                            {/* Level 2 Node Card */}
                            <div className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl p-2 text-center shadow-2xs hover:border-emerald-300 transition-colors">
                              <div className="w-6 h-6 rounded-full bg-[#00C48C] text-white flex items-center justify-center mx-auto mb-0.5 shadow-2xs">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <h6 className="font-bold text-[11px] text-slate-900 leading-tight">
                                {l2Node.name}
                              </h6>
                              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-semibold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                                Level 2
                              </span>
                              <div className="mt-1 pt-1 border-t border-emerald-100 text-[9px] leading-tight">
                                <p className="text-slate-500">{l2Node.referrals} Referrals</p>
                                <p className="font-bold text-slate-800 mt-0.5">
                                  ₹ {l2Node.earned}
                                </p>
                              </div>
                            </div>

                            {/* LEVEL 3 CONNECTOR & CARD IF PRESENT */}
                            {l2Node.children && l2Node.children.length > 0 ? (
                              <>
                                <div className="w-full h-4 relative pointer-events-none">
                                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 16">
                                    <line
                                      x1="50"
                                      y1="0"
                                      x2="50"
                                      y2="16"
                                      stroke="#7B2CBF"
                                      strokeWidth="1.25"
                                      strokeDasharray="2.5 2.5"
                                    />
                                  </svg>
                                </div>
                                {l2Node.children.map((l3Node) => (
                                  <div
                                    key={l3Node.id}
                                    className="w-full bg-purple-50/60 border border-purple-200 rounded-xl p-2 text-center shadow-2xs hover:border-purple-300 transition-colors"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-[#7B2CBF] text-white flex items-center justify-center mx-auto mb-0.5 shadow-2xs">
                                      <User className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <h6 className="font-bold text-[10px] text-slate-900 leading-tight">
                                      {l3Node.name}
                                    </h6>
                                    <span className="bg-purple-100 text-purple-700 text-[8px] font-semibold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                                      Level 3
                                    </span>
                                    <div className="mt-1 pt-1 border-t border-purple-100 text-[9px] leading-tight">
                                      <p className="text-slate-500">{l3Node.referrals} Referrals</p>
                                      <p className="font-bold text-slate-800 mt-0.5">
                                        ₹ {l3Node.earned}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Cards Stacked (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* Card 1: Your Referral Info */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Your Referral Info
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 border border-slate-200 hover:bg-slate-50 rounded-lg px-2.5 py-0.5 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Code Box */}
              <div>
                <p className="text-[10px] font-medium text-slate-500 mb-1">Your Referral Code</p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="font-extrabold text-slate-900 tracking-wider text-xs">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    title="Copy Referral Code"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Link Box */}
              <div className="mt-2.5">
                <p className="text-[10px] font-medium text-slate-500 mb-1">Referral Link</p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="text-[11px] text-blue-600 font-medium truncate mr-2">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0"
                    title="Copy Referral Link"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Direct Referrals (8) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Direct Referrals (8)
                </h3>
                <Link
                  href="/referral-income"
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {defaultTreeData.directReferralsList.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full ${item.avatarBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.joined}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Tree Summary */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
                Tree Summary
              </h3>

              <div className="space-y-2">
                {defaultTreeData.summaryMatrix.map((item) => (
                  <div
                    key={item.level}
                    className="flex items-center justify-between text-xs py-0.5"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                      <span className="font-medium">{item.level}</span>
                    </span>
                    <span className="font-semibold text-slate-800">{item.count}</span>
                    <span className="font-bold text-slate-900">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 my-3" />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Referrals</span>
                  <span className="font-bold text-slate-900">24 Users</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Level Income</span>
                  <span className="text-sm font-extrabold text-slate-900">₹ 4,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Referral Code Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Customize Referral Code"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            Set your customized unique referral identifier. This will update your sharing link across your network.
          </p>
          <Input
            label="Custom Referral Code"
            type="text"
            value={customRefCode}
            onChange={(e) => setCustomRefCode(e.target.value.toUpperCase())}
            placeholder="e.g. NXA123456"
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success('Referral code updated successfully!');
                setIsEditModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
