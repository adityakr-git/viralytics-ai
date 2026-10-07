import React from 'react';
import { TrendRadarData } from '../types.ts';
import { 
  TrendingUp, 
  Database, 
  Wifi, 
  Music, 
  Hash, 
  Flame, 
  Layers, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface TrendRadarCardProps {
  trendData: TrendRadarData;
  activeCategory: string;
  onSelectCategory?: (cat: string) => void;
}

export const TrendRadarCard: React.FC<TrendRadarCardProps> = ({ 
  trendData, 
  activeCategory,
  onSelectCategory 
}) => {
  const categories = [
    'Tech & Productivity',
    'Fitness & Health',
    'Food & Cooking',
    'Gaming & Esports',
    'Entertainment & Comedy',
    'Lifestyle & Vlog',
    'Travel & Adventure',
    'Education & How-To',
    'Business & Finance',
    'Music & Dance',
    'Fashion & Beauty',
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              TinyFish Trend Radar & Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated from public social web crawling via TinyFish Search & Fetch APIs.
          </p>
        </div>

        {/* Live or Cached Badge from Section 8 */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 ${
            trendData.status === 'Cached'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {trendData.status === 'Cached' ? (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>TinyFish: Cached</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>TinyFish: Live</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Category selector */}
      {onSelectCategory && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trend Velocity & Match */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trend Velocity</span>
            </span>
            <span className="font-mono font-bold text-cyan-300 text-sm">
              {trendData.matchScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Current search & view momentum is surging for <strong>{activeCategory}</strong>.
          </p>
        </div>

        {/* Trending Sounds */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>Algorithmic Audio Beds</span>
            </span>
          </div>
          <div className="space-y-1">
            {trendData.trendingSounds.map((snd, i) => (
              <div key={i} className="text-[11px] text-purple-200 line-clamp-1 bg-purple-950/30 px-2 py-1 rounded border border-purple-500/20">
                🎵 {snd}
              </div>
            ))}
          </div>
        </div>

        {/* Rising Hashtags */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-pink-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-pink-400" />
              <span>Surging Hashtags</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {trendData.risingHashtags.map((tag, i) => (
              <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Keywords & Viral Formats */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3 text-xs">
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
            High-Search Topics & Keywords:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {trendData.topKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200 text-xs">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {trendData.viralFormats && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
              Top Converting Video Formats:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              {trendData.viralFormats.map((fmt, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{fmt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guardrail and compliance footer from Section 8 */}
      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>TinyFish API Integration &bull; Public data only &bull; robots.txt compliant &bull; 24h cache TTL</span>
        </span>
        <span className="font-mono text-slate-400">{trendData.dataSource}</span>
      </div>
    </div>
  );
};
