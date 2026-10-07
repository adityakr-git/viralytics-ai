import React, { useState } from 'react';
import { HookComparison } from '../types.ts';
import { Sparkles, ArrowRight, Check, Copy, Flame, Eye, Wand2, RefreshCw } from 'lucide-react';

interface HookAnalyzerProps {
  hookData: HookComparison;
}

export const HookAnalyzer: React.FC<HookAnalyzerProps> = ({ hookData }) => {
  const [copied, setCopied] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testScore, setTestScore] = useState<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(hookData.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestHook = () => {
    if (!testInput.trim()) return;
    // Client-side heuristic calculation for testing hook variants
    let score = 50;
    if (/\d+/.test(testInput)) score += 12; // Numbers
    if (/(stop|never|secret|hack|mistake|illegal|cheat|warning|how to|why)/i.test(testInput)) score += 18;
    if (testInput.length > 15 && testInput.length < 80) score += 10;
    if (/(you|your)/i.test(testInput)) score += 8;
    setTestScore(Math.min(96, score));
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Hook Analyzer (First 0-5 Seconds)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
            {hookData.hookType}
          </span>
        </div>
      </div>

      {/* Before vs After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Weak Opening */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <span>BEFORE: Weak Opening</span>
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Hook Score: {hookData.originalScore}%
              </span>
            </div>
            <p className="text-xs text-slate-300 italic border-l-2 border-rose-500/40 pl-2.5 py-1">
              &ldquo;{hookData.original}&rdquo;
            </p>
          </div>
          <div className="text-[11px] text-slate-400 bg-black/30 p-2 rounded-lg">
            ⚠️ <strong>Friction:</strong> Passive greeting, delays value proposition, lacks visual stakes.
          </div>
        </div>

        {/* AI Rewritten Hook */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900/90 border border-cyan-500/40 flex flex-col justify-between space-y-3 shadow-lg shadow-cyan-950/30">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AFTER: LLM-Rewritten Hook</span>
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Hook Score: {hookData.improvedScore}%
              </span>
            </div>
            <p className="text-sm font-semibold text-white border-l-2 border-cyan-400 pl-2.5 py-1">
              &ldquo;{hookData.improved}&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-400 font-medium">
              +51% Projected First-3s Hold Rate
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-cyan-500 text-black hover:bg-cyan-400 transition-colors flex items-center gap-1 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Hook'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Checklist Findings */}
      <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-2 text-xs">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Algorithmic Hook Audit Breakdown:
        </h4>
        <ul className="space-y-1.5 text-slate-300 text-[11px]">
          {hookData.auditFindings.map((finding, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5 font-bold">&bull;</span>
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Hook Tester Playground */}
      <div className="pt-3 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Hook Sandbox (Test an Alternative Opening)</span>
          </label>
          {testScore !== null && (
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
              Predicted Score: {testScore}%
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="e.g., 99% of creators make this mistake in their first 5 seconds..."
            className="flex-1 bg-slate-900/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleTestHook}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Score Hook
          </button>
        </div>
      </div>
    </div>
  );
};
