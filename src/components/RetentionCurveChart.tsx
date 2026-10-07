import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { RetentionPoint, RetentionDrop } from '../types.ts';
import { TrendingDown, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

interface RetentionCurveChartProps {
  data: RetentionPoint[];
  drops: RetentionDrop[];
}

export const RetentionCurveChart: React.FC<RetentionCurveChartProps> = ({ data, drops }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Audience Retention Decay Curve
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Predicts viewer drop-off dynamics based on first-3s hook, visual cut rate, and monologue silence.
          </p>
        </div>

        {/* Mandatory Label from Section 5 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          <span>Predicted, not real viewer data</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              domain={[30, 100]} 
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RetentionPoint;
                  return (
                    <div className="bg-[#0e1322] border border-purple-500/30 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <div className="text-slate-400 font-mono">Timestamp: <span className="text-white font-bold">{item.timestamp}</span></div>
                      <div className="text-purple-300 font-bold text-sm">
                        Retention: {item.retention}%
                      </div>
                      {item.label && (
                        <div className="text-amber-400 font-semibold text-[11px] pt-1 border-t border-white/10">
                          ⚠️ {item.label}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="retention"
              stroke="#A78BFA"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#retentionGradient)"
            />

            {/* Reference markers for drops */}
            <ReferenceDot x="3s" y={92} r={5} fill="#FFB020" stroke="#FFFFFF" strokeWidth={1.5} />
            <ReferenceDot x="30s" y={61} r={5} fill="#FF3D9A" stroke="#FFFFFF" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drops Analysis & Fixes Card */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Detected Pacing Drops & Algorithmic Fixes</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drops.map((drop) => (
            <div 
              key={drop.id} 
              className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                drop.severity === 'high'
                  ? 'bg-pink-950/20 border-pink-500/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${drop.severity === 'high' ? 'bg-pink-400' : 'bg-amber-400'}`} />
                  {drop.name}
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                  -{drop.dropPercent}% drop
                </span>
              </div>

              <p className="text-slate-300 text-[11px]">
                <strong className="text-slate-200">Diagnosis:</strong> {drop.diagnosis}
              </p>

              <div className="flex items-start gap-1.5 text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20 text-[11px]">
                <Wrench className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                <span><strong>Recommended Fix:</strong> {drop.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
