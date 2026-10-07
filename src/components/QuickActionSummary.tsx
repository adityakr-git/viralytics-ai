import React, { useState } from 'react';
import { 
  Zap, 
  Scissors, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight,
  Download
} from 'lucide-react';
import { AnalysisReport } from '../types.ts';

interface QuickActionSummaryProps {
  report: AnalysisReport;
  onGoToSection: (sectionId: string) => void;
}

export const QuickActionSummary: React.FC<QuickActionSummaryProps> = ({ report, onGoToSection }) => {
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const handleCopyHook = () => {
    navigator.clipboard.writeText(report.optimizedPackage.rewrittenHook);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(report.optimizedPackage.improvedCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-[#0E1528] to-purple-950/20 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 fill-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Quick Fix Summary: Top 3 Edits to Make Right Now</span>
            </h3>
            <p className="text-xs text-slate-400">
              Apply these 3 high-impact fixes before uploading to maximize algorithm reach.
            </p>
          </div>
        </div>

        <button
          onClick={() => onGoToSection('optimized-package-section')}
          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 self-start sm:self-auto bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
        >
          <span>View Full Cutlist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Fix 1: Hook */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                1. Opening Hook (0-3s)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">+51% Hold</span>
            </div>
            <p className="text-xs font-semibold text-white line-clamp-2">
              &ldquo;{report.optimizedPackage.rewrittenHook}&rdquo;
            </p>
          </div>
          <button
            onClick={handleCopyHook}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-cyan-500/30 cursor-pointer"
          >
            {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHook ? 'Copied to Clipboard!' : 'Copy Rewritten Hook'}</span>
          </button>
        </div>

        {/* Fix 2: Pacing Cut */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                2. Pacing & Retention Cut
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {report.retentionDrops && report.retentionDrops[0] 
                  ? report.retentionDrops[0].timeframe 
                  : 'Pacing Trim'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug line-clamp-3">
              {report.retentionDrops && report.retentionDrops[0] 
                ? report.retentionDrops[0].fix 
                : report.improvements[0] || 'Trim initial pause and introduce pattern interrupts.'}
            </p>
          </div>
          <button
            onClick={() => onGoToSection('retention-section')}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-purple-500/30 cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Inspect Retention Curve</span>
          </button>
        </div>

        {/* Fix 3: High-Converting Caption & Tags */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pink-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                3. High-Converting Copy
              </span>
              <span className="text-[10px] text-pink-300 font-mono font-bold">5 Viral Tags</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2">
              {report.optimizedPackage.improvedCaption}
            </p>
          </div>
          <button
            onClick={handleCopyCaption}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-pink-500/30 cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCaption ? 'Copied Caption!' : 'Copy Caption & Tags'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
