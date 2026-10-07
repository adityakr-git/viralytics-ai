import React from 'react';
import { CheckCircle2, Loader2, Cpu, ShieldCheck } from 'lucide-react';

interface AnalysisProgressProps {
  currentStage: string;
  stageProgress: number;
  totalProgress: number;
}

const STAGES = [
  { id: 'Frames & scenes', label: '1. Frames & Scenes', detail: 'Extracting keyframes, cut frequency, lighting luminosity, and text overlays' },
  { id: 'Audio & speech', label: '2. Audio & Speech', detail: 'Analyzing vocal clarity, SNR, speech rate, and silence gaps' },
  { id: 'NLP & hook', label: '3. NLP & Hook', detail: 'Evaluating first-3s hook curiosity, sentiment, and copywriting friction' },
  { id: 'ML scoring', label: '4. ML Scoring', detail: 'Computing 10 weighted sub-scores & calibrating prediction confidence' },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  currentStage,
  stageProgress,
  totalProgress,
}) => {
  const getStageStatus = (stageId: string, index: number) => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    if (currentStage === 'Complete' || index < currentIndex) {
      return 'completed';
    }
    if (index === currentIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border-cyan-500/30 space-y-8 my-8 shadow-2xl shadow-cyan-950/40">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>Multi-Modal Feature Extraction in Progress</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          Analyzing Video Signals
        </h3>
        <p className="text-xs text-slate-400">
          Running background processing pipeline across computer vision, audio, NLP, and ML models.
        </p>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Total Pipeline Progress</span>
          <span className="text-cyan-400 font-bold">{totalProgress}%</span>
        </div>
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, totalProgress)}%` }}
          />
        </div>
      </div>

      {/* 4-Item Progress Checklist */}
      <div className="space-y-3 pt-2">
        {STAGES.map((stage, idx) => {
          const status = getStageStatus(stage.id, idx);
          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all ${
                status === 'active'
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/30'
                  : status === 'completed'
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : 'bg-slate-900/30 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <div>
                    <span className={`text-xs font-bold ${status === 'active' ? 'text-white' : 'text-slate-300'}`}>
                      {stage.label}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {stage.detail}
                    </p>
                  </div>
                </div>

                {status === 'active' && (
                  <span className="font-mono text-xs text-cyan-300 font-bold">
                    {stageProgress}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-white/5 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>We predict potential. We don&apos;t promise virality.</span>
      </div>
    </div>
  );
};
