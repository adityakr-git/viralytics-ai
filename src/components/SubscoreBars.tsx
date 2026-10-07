import React from 'react';
import { SubScores } from '../types.ts';
import { Activity, BarChart3, HelpCircle } from 'lucide-react';

interface SubscoreBarsProps {
  scores: SubScores;
}

interface ScoreConfig {
  key: keyof SubScores;
  label: string;
  weight: string;
  description: string;
}

const SCORE_CONFIGS: ScoreConfig[] = [
  { key: 'audienceRetention', label: 'Audience Retention Potential', weight: '25%', description: 'Predicted completion curve and watch-time resilience.' },
  { key: 'hookStrength', label: 'Hook Strength (0-5s)', weight: '15%', description: 'Immediate pattern interruption, movement, and curiosity trigger.' },
  { key: 'engagementPotential', label: 'Engagement Potential', weight: '15%', description: 'Likelihood of likes, shares, comments, and conversation starters.' },
  { key: 'visualQuality', label: 'Visual Quality & Lighting', weight: '10%', description: 'Resolution, lighting contrast, frame composition, and camera steadiness.' },
  { key: 'emotionalImpact', label: 'Emotional Impact', weight: '10%', description: 'Arousal, humor, surprise, inspiration, or relief trigger.' },
  { key: 'contentRelevance', label: 'Content Relevance', weight: '10%', description: 'Alignment with current search interest and target audience niche.' },
  { key: 'audioQuality', label: 'Audio & Vocal Clarity', weight: '5%', description: 'Signal-to-noise ratio, voice isolation, and dynamic range balance.' },
  { key: 'captionQuality', label: 'Caption Quality', weight: '5%', description: 'First-line readability, copywriting intrigue, and CTA clarity.' },
  { key: 'shareability', label: 'Shareability Index', weight: '5%', description: 'DM-share probability, relatable value, and save-worthy tips.' },
  { key: 'hashtagQuality', label: 'Hashtag Quality', weight: '0%', description: 'Niche specificity vs generic clutter balance.' },
  { key: 'trendMatch', label: 'Trend Match (TinyFish)', weight: '0%', description: 'Alignment with viral sounds, rising keywords, and formats.' },
];

export const SubscoreBars: React.FC<SubscoreBarsProps> = ({ scores }) => {
  const getProgressColor = (val: number) => {
    if (val >= 90) return 'bg-gradient-to-r from-cyan-500 to-cyan-300';
    if (val >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-300';
    if (val >= 70) return 'bg-gradient-to-r from-indigo-500 to-indigo-300';
    if (val >= 50) return 'bg-gradient-to-r from-amber-500 to-amber-300';
    return 'bg-gradient-to-r from-rose-500 to-rose-400';
  };

  const getTextColor = (val: number) => {
    if (val >= 90) return 'text-cyan-400';
    if (val >= 80) return 'text-emerald-400';
    if (val >= 70) return 'text-indigo-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Multi-Modal Sub-Score Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 90+ Top
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 80+ Strong
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Needs Work
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {SCORE_CONFIGS.map((item) => {
          const val = scores[item.key] ?? 50;
          return (
            <div key={item.key} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono px-1 rounded bg-white/5">
                    {item.weight}
                  </span>
                </div>
                <span className={`font-mono font-bold text-sm ${getTextColor(val)}`}>
                  {val}<span className="text-[10px] text-slate-500 font-normal">/100</span>
                </span>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(val)}`}
                  style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                />
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <span>Weights calibrated via data/weights.json schema</span>
        <span className="text-amber-400/80">AI estimate, not a guarantee</span>
      </div>
    </div>
  );
};
