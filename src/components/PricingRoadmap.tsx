import React from 'react';
import { Check, Sparkles, Zap, Shield, Rocket, ArrowRight, Infinity } from 'lucide-react';

interface PricingRoadmapProps {
  onStartAnalysis?: () => void;
}

export const PricingRoadmap: React.FC<PricingRoadmapProps> = ({ onStartAnalysis }) => {
  const roadmapChips = [
    'Personalized creator models',
    'Real-time trend detection',
    'Automatic video editing',
    'AI-generated hooks',
    'Deepfake & safety checks',
    'Copyright risk detection',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Pricing Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Flexible Plans for Creators & Growth Teams
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Full multi-modal virality prediction with unlimited analyses enabled.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* UNLIMITED CREATOR PLAN (Active) */}
        <div className="glass-panel p-6 rounded-2xl border-cyan-500/40 relative flex flex-col justify-between space-y-6 shadow-xl shadow-cyan-950/20">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Creator Tier
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Active & Unlimited
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                <span className="text-xs text-slate-400">/unlimited</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Unrestricted access to all multi-modal analysis features.
              </p>
            </div>

            {/* Unlimited Status Box */}
            <div className="p-3 bg-slate-900 rounded-xl border border-cyan-500/20 flex items-center gap-2.5 text-xs text-cyan-300">
              <Infinity className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Unlimited Analyses</span>
                <span className="text-[11px] text-slate-400">No monthly throttling or limits</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Unlimited Video Analyses</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>10 Multi-Modal Subscores</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>First 0-5s Hook Analyzer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Retention Decay Curve with Drops</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>TinyFish Category Benchmarks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Production Edit Plan Export</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onStartAnalysis}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors shadow-sm cursor-pointer"
          >
            Analyze Video Now
          </button>
        </div>

        {/* PRO CREATOR PLAN */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Pro Studio
              </span>
              <span className="text-[10px] text-slate-400">Cloud Sync</span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$29</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                For solo creators and editors publishing daily content.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Everything in Creator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Live TinyFish Trend Radar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Cross-Platform Optimizer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Automated Timeline Cutlists</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            Included in Build
          </button>
        </div>

        {/* CREATOR AGENCY */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Agency & Teams
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$79</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                For video agencies and creator studios.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Niche Competitor Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pink-400 shrink-0" />
                <span>A/B Hook Variant Testing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Team Collaboration (5 seats)</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            Agency Mode
          </button>
        </div>

        {/* ENTERPRISE */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Enterprise
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$249</span>
                <span className="text-xs text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                For enterprise programmatic video publishing.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full REST API Access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Fine-Tuned Models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SLA & Dedicated Support</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            Contact Enterprise
          </button>
        </div>
      </div>

      {/* ROADMAP SECTION */}
      <div className="glass-panel p-8 rounded-2xl border-white/10 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Rocket className="w-3.5 h-3.5" />
            <span>Product Roadmap & Future Capabilities</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Upcoming Algorithmic Enhancements
          </h3>
          <p className="text-xs text-slate-400">
            Next evolution milestones on the VIRALYTICS AI roadmap.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {roadmapChips.map((chip, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-xs font-medium text-purple-200 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
