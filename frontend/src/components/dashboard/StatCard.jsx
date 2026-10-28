'use client';

import React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { formatINR } from '../../utils/currency';

export const StatCard = ({
  title,
  amount,
  isCurrency = true,
  badgeText,
  badgePositive = true,
  subtext,
  icon: Icon,
  iconBgColor = 'bg-blue-600',
  iconTextColor = 'text-white',
  actionButton,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-200' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {Icon && (
            <div
              className={`w-12 h-12 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shadow-md`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}

          {badgeText && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                badgePositive
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {badgePositive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {badgeText}
            </span>
          )}

          {actionButton && <div>{actionButton}</div>}
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isCurrency ? formatINR(amount) : amount}
        </h3>
      </div>

      {subtext && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">{subtext}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );
};
