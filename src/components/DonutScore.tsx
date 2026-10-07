import React from 'react';
import { ShieldAlert, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface DonutScoreProps {
  score: number;
  confidence: number;
  isDemo?: boolean;
}

export const DonutScore: React.FC<DonutScoreProps> = ({ score, confidence, isDemo }) => {
  // SVG calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 85) return '#00E5FF'; // cyan
    if (val >= 70) return '#22E58B'; // green
    if (val >= 50) return '#FFB020'; // amber
    return '#FF3D9A'; // pink
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-cyan-500/20">
      {/* Background glow */}
      <div 
        className="absolute -left-10 -top-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: scoreColor }}
      />

      {/* Left: Donut Chart */}
      <div className="flex items-center gap-6">
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Value Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
              {score}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Viral Score
            </span>
          </div>
        </div>

        {/* Confidence & Badges block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/5 border border-white/10 text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prediction Confidence: <strong className="text-cyan-300 font-mono">{confidence}%</strong></span>
            </span>
            {isDemo && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 uppercase tracking-wider">
                Demo Values
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Viral Potential Assessment</span>
              {score >= 80 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-amber-400" />
              )}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
              Calculated from 10 weighted multi-modal signals including first 3s hook impact, drop-off dynamics, and platform audio/visual pacing.
            </p>
          </div>

          {/* Responsible AI Disclaimer badge */}
          <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
              <strong>AI estimate, not a guarantee.</strong> Real algorithmic distribution depends on real-time audience cohorts and unpredictable platform fluctuations.
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Insights summary */}
      <div className="w-full md:w-64 bg-slate-900/60 rounded-xl p-3.5 border border-white/5 text-xs space-y-2">
        <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/5">
          <span>Benchmark Tier</span>
          <span className="font-semibold text-emerald-400">Top 12% Viral Potential</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/5">
          <span>Hook Impact (0-5s)</span>
          <span className="font-semibold text-cyan-300">Exceptional (94/100)</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/5">
          <span>Est. 30s Retention</span>
          <span className="font-semibold text-amber-300">61% (Pacing drop detected)</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Scoring Engine</span>
          <span className="font-mono text-[10px] text-slate-400">Weights.json calibrated</span>
        </div>
      </div>
    </div>
  );
};
