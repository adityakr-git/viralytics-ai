import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  BarChart2, 
  Eye, 
  Clock, 
  Scissors, 
  Share2, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface LandingHeroProps {
  onStartUpload: () => void;
  onViewDemoReport: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartUpload, onViewDemoReport }) => {
  const capabilityChips = [
    'AI / ML Predictive Ensemble',
    'Computer Vision (Cut & Lighting)',
    'Audio & Speech Clarity',
    'NLP Hook Analyzer',
    'Audience Retention Modeling',
    'Social Media Intelligence (TinyFish)',
  ];

  const questionsAnswered = [
    { q: 'Is the viral potential real?', a: 'Weighted multi-modal scoring calibrated across 10 empirical metrics.' },
    { q: 'Is the hook strong enough?', a: 'First 0-5s curiosity scoring with instant high-converting LLM rewrites.' },
    { q: 'Is length & pacing right?', a: 'Predicted retention decay curve detecting exact drop-off moments.' },
    { q: 'Do caption & hashtags work?', a: 'Copywriting engagement index with high-velocity niche hashtag sets.' },
    { q: 'Is the thumbnail attractive?', a: 'Mobile feed readability contrast check and composition recommendation.' },
    { q: 'Which platform fits best?', a: 'Algorithmic alignment across YouTube Shorts, Reels, TikTok & Long-form.' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-4 max-w-4xl mx-auto">
        {/* Core Promise Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Core Promise: &ldquo;We predict potential. We don&apos;t promise virality.&rdquo;</span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Predict Video Virality <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Before You Hit Publish.
            </span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-300">
            Upload. Analyze. Optimize. Go Viral.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Multi-modal AI analysis for YouTube Shorts, Instagram Reels, and TikTok. Extract computer vision, vocal clarity, retention decay curves, and concrete edit plans.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartUpload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Analyze New Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemoReport}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Inspect Demo Fixture Report (87%)</span>
          </button>
        </div>

        {/* Capabilities Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {capabilityChips.map((chip, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-slate-300"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Sample Analysis Highlight Card */}
      <div className="max-w-4xl mx-auto">
        <div 
          onClick={onViewDemoReport}
          className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer group shadow-2xl shadow-cyan-950/30 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  Verified Demo Fixture
                </span>
                <span className="text-xs text-slate-400">&bull; YouTube Shorts &bull; Tech & Productivity</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                &ldquo;AI Tools You Need in 2026.mp4&rdquo;
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Your video has strong viral potential, but the first 4 seconds can be improved.&rdquo;
              </p>

              {/* Mini Score Bars */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Hook Strength</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">94/100</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Audience Retention</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">82/100</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Engagement Index</span>
                  <span className="font-mono font-bold text-purple-300 text-sm">89/100</span>
                </div>
              </div>
            </div>

            {/* Right: Donut preview badge */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-white/10 shrink-0 text-center w-full md:w-52">
              <span className="text-4xl font-black text-cyan-400 font-mono tracking-tight">87%</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider mt-1">Viral Potential</span>
              <span className="text-[10px] text-slate-400 mt-1">Confidence: 74%</span>
              <div className="mt-3 text-xs font-semibold text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Open Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What it answers before publishing (6 Questions from Section 1) */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Answers Creators Need Before Publishing
          </h2>
          <p className="text-xs text-slate-400">
            Fix critical algorithmic friction points while you can still edit the timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionsAnswered.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border-white/5 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <h4 className="font-bold text-white text-xs">
                  {item.q}
                </h4>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
