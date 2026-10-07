import React from 'react';
import { Finding } from '../types.ts';
import { XCircle, AlertTriangle, CheckCircle, ArrowUpDown, ListChecks } from 'lucide-react';

interface FindingsListProps {
  findings: Finding[];
  improvements: string[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings, improvements }) => {
  const getSeverityIcon = (sev: Finding['severity']) => {
    switch (sev) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    }
  };

  const getSeverityBadge = (sev: Finding['severity']) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Critical Fix
          </span>
        );
      case 'warning':
        return (
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Warning
          </span>
        );
      case 'good':
        return (
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Optimal
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Prioritized Findings & Algorithmic Diagnosis
          </h3>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span>Ranked by: <strong>Fix This First</strong></span>
        </span>
      </div>

      {/* Numbered Improvements Chips */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Suggested Improvements (Quick Action Chips)</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {improvements.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-slate-900 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:border-cyan-400 hover:bg-slate-800 transition-all cursor-default"
            >
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Findings List Ordered by fix priority */}
      <div className="space-y-3">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
              finding.severity === 'critical'
                ? 'bg-rose-950/15 border-rose-500/30 hover:border-rose-500/50'
                : finding.severity === 'warning'
                ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                {getSeverityIcon(finding.severity)}
                <div>
                  <h5 className="font-bold text-slate-100 text-xs">
                    {finding.title}
                  </h5>
                  <span className="text-[10px] text-slate-400">
                    Category: {finding.category}
                  </span>
                </div>
              </div>
              <div>{getSeverityBadge(finding.severity)}</div>
            </div>

            <div className="pl-6 text-[11px] text-slate-300 bg-black/20 p-2 rounded-lg mt-1 border border-white/5">
              <strong className="text-white">Actionable Fix:</strong> {finding.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
