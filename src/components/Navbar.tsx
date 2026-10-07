import React from 'react';
import { Sparkles, TrendingUp, UploadCloud, Layers, ShieldCheck, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'upload' | 'trends' | 'pricing';
  setActiveTab: (tab: 'dashboard' | 'upload' | 'trends' | 'pricing') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  setIsDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0D1A]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-[#0A0D1A] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">
                VIRALYTICS<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Upload. Analyze. Optimize. Go Viral.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Analyze Video</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Trend Radar</span>
            <span className="sm:hidden">Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Plans & Roadmap</span>
            <span className="sm:hidden">Plans</span>
          </button>
        </nav>

        {/* Right Action: Demo Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Mode Badge */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              isDemoMode
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-sm shadow-purple-500/20'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
            title="Toggle between Live Multi-Modal ML and 87% Demo Fixture"
          >
            {isDemoMode ? 'Fixture: 87% (Demo)' : 'Live ML: Active'}
          </button>
        </div>
      </div>
    </header>
  );
};
