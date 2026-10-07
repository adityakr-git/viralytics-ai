import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { BenchmarkReport } from '../types.ts';
import { Award, Database, Wifi } from 'lucide-react';

interface BenchmarkChartProps {
  benchmarks: BenchmarkReport;
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ benchmarks }) => {
  const chartData = benchmarks.metrics.map((m) => ({
    name: m.name.replace(' Potential', '').replace(' Strength', ''),
    YourVideo: m.yourScore,
    CategoryAvg: m.categoryAvg,
    Top10Percent: m.topTenPercent,
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Your Video vs Category Benchmark
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded in TinyFish social scraping intelligence for <strong>{benchmarks.category}</strong>.
          </p>
        </div>

        {/* Live or Cached Badge from Section 8 */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 ${
            benchmarks.isCached
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {benchmarks.isCached ? (
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

      {/* Bar Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} tickLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0b1020] border border-cyan-500/30 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <div className="text-white font-bold">{label}</div>
                      {payload.map((entry, idx) => (
                        <div key={idx} className="flex justify-between gap-3 text-[11px]" style={{ color: entry.color }}>
                          <span>{entry.name}:</span>
                          <span className="font-mono font-bold">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="YourVideo" name="Your Video" fill="#00E5FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CategoryAvg" name="Category Avg" fill="#64748B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Top10Percent" name="Top 10% Benchmark" fill="#22E58B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Micro Benchmark Takeaway */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center justify-between">
        <span>
          Hook Score (<strong className="text-cyan-400">94%</strong>) beats category top-10% threshold (<strong className="text-emerald-400">90%</strong>).
        </span>
        <span className="text-[11px] text-slate-400">
          Source: TinyFish Fetch API
        </span>
      </div>
    </div>
  );
};
