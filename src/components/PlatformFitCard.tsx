import React from 'react';
import { PlatformFitItem } from '../types.ts';
import { Share2, AlertCircle, CheckCircle2, Image, ShieldAlert } from 'lucide-react';

interface PlatformFitCardProps {
  platforms: PlatformFitItem[];
  thumbnailSuggestion?: {
    text: string;
    composition: string;
    contrastRatio: string;
  };
}

export const PlatformFitCard: React.FC<PlatformFitCardProps> = ({ platforms, thumbnailSuggestion }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pink-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Cross-Platform Fit Ranking
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates format length, pacing velocity, and audio dependence across major platforms.
          </p>
        </div>

        {/* Mandatory Transparency Note from Section 9 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Platform algorithms are private & proprietary; recommendations reflect empirical heuristics.</span>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {platforms.map((item) => (
          <div
            key={item.platform}
            className={`p-4 rounded-xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
              item.recommended
                ? 'bg-cyan-950/20 border-cyan-500/40 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900/50 border-white/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm">
                  {item.platform}
                </span>
                <span
                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    item.fitScore >= 90
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : item.fitScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-white/5'
                  }`}
                >
                  {item.fitScore}% Fit
                </span>
              </div>

              {item.recommended && (
                <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Primary Recommendation</span>
                </div>
              )}

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {item.reason}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 space-y-1">
              <div>Optimal Length: <strong className="text-slate-200">{item.optimalLength}</strong></div>
              <div>Aspect Ratio: <strong className="text-slate-200">{item.aspectRatio}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnail Health Check */}
      {thumbnailSuggestion && (
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-cyan-400" />
              <span>Mobile Feed Thumbnail Health Check</span>
            </h4>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {thumbnailSuggestion.contrastRatio}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Recommended On-Screen Overlay Text:
              </span>
              <p className="font-mono font-bold text-cyan-300">
                &ldquo;{thumbnailSuggestion.text}&rdquo;
              </p>
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Composition & Layout Rule:
              </span>
              <p className="text-slate-300 text-[11px]">
                {thumbnailSuggestion.composition}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
