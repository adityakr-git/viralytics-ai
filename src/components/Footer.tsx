import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#070A14] mt-20 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-bold text-white text-sm font-mono">
            <span>VIRALYTICS AI</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-sans font-normal">Team Go-Gitters</span>
          </div>
          <p className="mt-1 text-slate-400">
            Aditya Kumar &bull; Virat Saroj &bull; Vishal Kumar Yadav &bull; Vipin Prajapati
          </p>
          <p className="mt-2 text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Core Promise: &ldquo;We predict potential. We don&apos;t promise virality.&rdquo;</span>
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-slate-400">
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300">Privacy & Data Isolation</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300">Empirical Heuristics & ML</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300">TinyFish Integration</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Production-Grade AI &bull; Local One-Command Execution
          </p>
        </div>
      </div>
    </footer>
  );
};
