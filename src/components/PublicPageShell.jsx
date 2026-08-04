import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const PublicPageShell = ({
  children,
  title,
  subtitle,
  actionLabel = 'Back home',
  actionTo = '/',
  actionIcon: ActionIcon = ArrowLeft,
  badge = 'SmartCare HMS',
}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(11,110,79,0.10),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#f3f6fb_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,110,79,0.04),transparent_40%,rgba(10,37,64,0.03))]" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#0B6E4F]/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0A2540]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0B6E4F]/20 bg-[#0B6E4F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#0B6E4F]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {badge}
                </div>
                {title && <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>}
                {subtitle && <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>}
              </div>

              {actionTo && (
                <Link
                  to={actionTo}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-[#0B6E4F] hover:text-[#0B6E4F]"
                >
                  <ActionIcon className="h-4 w-4" />
                  {actionLabel}
                </Link>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPageShell;
