import React from 'react';

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
  Completed: 'bg-blue-50 text-blue-600 border-blue-200/80',
  completed: 'bg-blue-50 text-blue-600 border-blue-200/80',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-200/80',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-200/80',
  Pending: 'bg-amber-50 text-amber-600 border-amber-200/80',
  pending: 'bg-amber-50 text-amber-600 border-amber-200/80',
  Credited: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',

  'Level 0': 'bg-blue-100 text-blue-700 border-blue-300',
  'Level 1': 'bg-blue-50 text-blue-600 border-blue-200',
  'Level 2': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Level 3': 'bg-purple-50 text-purple-600 border-purple-200',
  L1: 'bg-blue-50 text-blue-600 border-blue-200',
  L2: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  L3: 'bg-purple-50 text-purple-600 border-purple-200',

  'Direct Income': 'bg-blue-50 text-blue-600 border-blue-200',
  'Level Income': 'bg-purple-50 text-purple-600 border-purple-200',
};

export const StatusBadge = ({ status, className = '' }) => {
  const currentStyle = statusStyles[status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}
    >
      {status}
    </span>
  );
};
