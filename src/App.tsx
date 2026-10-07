import React, { useState, useEffect } from 'react';
import { 
  AnalysisJob, 
  AnalysisReport, 
  TrendRadarData 
} from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { UploadSection } from './components/UploadSection.tsx';
import { AnalysisProgress } from './components/AnalysisProgress.tsx';
import { DonutScore } from './components/DonutScore.tsx';
import { SubscoreBars } from './components/SubscoreBars.tsx';
import { RetentionCurveChart } from './components/RetentionCurveChart.tsx';
import { HookAnalyzer } from './components/HookAnalyzer.tsx';
import { FindingsList } from './components/FindingsList.tsx';
import { BenchmarkChart } from './components/BenchmarkChart.tsx';
import { PlatformFitCard } from './components/PlatformFitCard.tsx';
import { OptimizedPackageView } from './components/OptimizedPackageView.tsx';
import { TrendRadarCard } from './components/TrendRadarCard.tsx';
import { PricingRoadmap } from './components/PricingRoadmap.tsx';
import { QuickActionSummary } from './components/QuickActionSummary.tsx';
import { 
  Sparkles, 
  Video, 
  Share2, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Flame,
  Scissors,
  Layers,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'trends' | 'pricing'>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [trendData, setTrendData] = useState<TrendRadarData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tech & Productivity');
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'overview' | 'hook' | 'edits' | 'benchmarks'>('all');
  
  // Background Job Polling State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<AnalysisJob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Category Trends on mount
  useEffect(() => {
    fetch(`/api/trends?category=${encodeURIComponent(selectedCategory)}`)
      .then((res) => res.json())
      .then((data: TrendRadarData) => {
        setTrendData(data);
      })
      .catch((err) => console.warn('Trend fetch error:', err));
  }, [selectedCategory]);

  // When demo mode is explicitly toggled by user in Navbar
  const handleToggleDemoMode = (newVal: boolean) => {
    setIsDemoMode(newVal);
    if (newVal) {
      // Load verified fixture
      fetch('/api/analyses/demo-analysis-2026/report')
        .then((res) => res.json())
        .then((data) => {
          setReport(data);
          setActiveTab('dashboard');
        })
        .catch(() => {});
    } else {
      setReport(null);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setDashboardFilter('all');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Handle Start Analysis Trigger
  const handleStartAnalysis = async (params: {
    videoFile?: File | null;
    filename: string;
    caption: string;
    hashtags: string[];
    targetPlatform: string;
    category: string;
    durationSeconds?: number;
    thumbnailUrl?: string;
    isDemo: boolean;
    resolution?: string;
    aspectRatio?: string;
    detectedLuminance?: number;
    detectedMotionRate?: number;
    detectedSilenceRatio?: number;
    detectedVolumeDb?: number;
    hasAudioTrack?: boolean;
  }) => {
    setErrorMessage(null);
    setIsAnalyzing(true);
    setCurrentJob({
      id: 'pending',
      status: 'queued',
      currentStage: 'Frames & scenes',
      stageProgress: 0,
      totalProgress: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    try {
      const formattedSize = params.videoFile ? `${(params.videoFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined;

      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: params.filename,
          caption: params.caption,
          hashtags: params.hashtags,
          targetPlatform: params.targetPlatform,
          category: params.category,
          durationSeconds: params.durationSeconds || 45,
          thumbnailUrl: params.thumbnailUrl,
          fileSize: formattedSize,
          isDemo: params.isDemo,
          resolution: params.resolution,
          aspectRatio: params.aspectRatio,
          detectedLuminance: params.detectedLuminance,
          detectedMotionRate: params.detectedMotionRate,
          detectedSilenceRatio: params.detectedSilenceRatio,
          detectedVolumeDb: params.detectedVolumeDb,
          hasAudioTrack: params.hasAudioTrack,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Analysis initiation failed');
      }

      const { analysisId } = await res.json();

      const pollInterval = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/analyses/${analysisId}`);
          if (!pollRes.ok) return;

          const jobData: AnalysisJob = await pollRes.json();
          setCurrentJob(jobData);

          if (jobData.status === 'completed') {
            clearInterval(pollInterval);

            const reportRes = await fetch(`/api/analyses/${analysisId}/report`);
            const finalReport: AnalysisReport = await reportRes.json();

            setReport(finalReport);
            if (finalReport.trendRadar) {
              setTrendData(finalReport.trendRadar);
            }
            setSelectedCategory(finalReport.category);
            setIsAnalyzing(false);
            setCurrentJob(null);
            setDashboardFilter('all');
            setActiveTab('dashboard');
          } else if (jobData.status === 'failed') {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setErrorMessage(jobData.error || 'Video analysis failed. Please try again.');
          }
        } catch (e) {
          console.warn('Poll error:', e);
        }
      }, 500);
    } catch (err: any) {
      setIsAnalyzing(false);
      setCurrentJob(null);
      setErrorMessage(err.message || 'Network error initiating analysis');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D1A] text-slate-100 bg-tech-grid flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        setIsDemoMode={handleToggleDemoMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-4 text-xs text-rose-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: UPLOAD & PROGRESS */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {isAnalyzing && currentJob ? (
              <AnalysisProgress
                currentStage={currentJob.currentStage}
                stageProgress={currentJob.stageProgress}
                totalProgress={currentJob.totalProgress}
              />
            ) : (
              <UploadSection
                onStartAnalysis={handleStartAnalysis}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}

        {/* VIEW 2: TREND RADAR */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Social Trend Radar (TinyFish API)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Explore real-time velocity, viral formats, trending audio, and high-converting keywords across platforms.
              </p>
            </div>

            {trendData ? (
              <TrendRadarCard
                trendData={trendData}
                activeCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            ) : (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
                Loading TinyFish Trend Intelligence...
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PRICING & ROADMAP */}
        {activeTab === 'pricing' && (
          <PricingRoadmap
            onStartAnalysis={() => setActiveTab('upload')}
          />
        )}

        {/* VIEW 4: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {!report ? (
              <LandingHero
                onStartUpload={() => setActiveTab('upload')}
                onViewDemoReport={() => {
                  fetch('/api/analyses/demo-analysis-2026/report')
                    .then((r) => r.json())
                    .then((d) => setReport(d));
                }}
              />
            ) : (
              <>
                {/* Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    {report.thumbnailUrl && (
                      <div className="relative w-14 h-20 rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-950/40 shrink-0">
                        <img src={report.thumbnailUrl} alt="Video Frame" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          {report.targetPlatform}
                        </span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-xs text-slate-300 font-medium">
                          {report.category}
                        </span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {report.durationSeconds}s &bull; {report.resolution || '1080x1920 (9:16)'} {report.fileSize ? `&bull; ${report.fileSize}` : ''}
                        </span>
                        {report.isDemo && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                            Demo Values
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {report.filename}
                      </h2>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Analyze Another Video</span>
                    </button>

                    <button
                      onClick={() => scrollToSection('optimized-package-section')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Jump to Edit Plan</span>
                    </button>
                  </div>
                </div>

                {/* AI Executive Summary Quote */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 flex items-start gap-3.5 shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      AI Executive Diagnosis:
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                      &ldquo;{report.aiSummary}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Score Donut + Confidence */}
                <DonutScore
                  score={report.overallScore}
                  confidence={report.confidenceScore}
                  isDemo={report.isDemo}
                />

                {/* Instant Quick Action Summary Bar (Easy 3-step action) */}
                <QuickActionSummary
                  report={report}
                  onGoToSection={scrollToSection}
                />

                {/* Segmented Filter Control for Easy Navigation */}
                <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-white/10 overflow-x-auto text-xs">
                  <button
                    onClick={() => setDashboardFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      dashboardFilter === 'all'
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>All Insights</span>
                  </button>

                  <button
                    onClick={() => setDashboardFilter('overview')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      dashboardFilter === 'overview'
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>10 Sub-Scores</span>
                  </button>

                  <button
                    onClick={() => setDashboardFilter('hook')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      dashboardFilter === 'hook'
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hook & Retention</span>
                  </button>

                  <button
                    onClick={() => setDashboardFilter('edits')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      dashboardFilter === 'edits'
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Step 7: Edit Cutlist</span>
                  </button>

                  <button
                    onClick={() => setDashboardFilter('benchmarks')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                      dashboardFilter === 'benchmarks'
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Platform Fit & Benchmarks</span>
                  </button>
                </div>

                {/* Sub-Score Bars */}
                {(dashboardFilter === 'all' || dashboardFilter === 'overview') && (
                  <div id="subscores-section">
                    <SubscoreBars scores={report.scores} />
                  </div>
                )}

                {/* Hook Analyzer & Retention Decay */}
                {(dashboardFilter === 'all' || dashboardFilter === 'hook') && (
                  <>
                    <div id="hook-section">
                      <HookAnalyzer hookData={report.hookComparison} />
                    </div>
                    <div id="retention-section">
                      <RetentionCurveChart
                        data={report.retentionCurve}
                        drops={report.retentionDrops}
                      />
                    </div>
                  </>
                )}

                {/* Prioritized Findings & Numbered Improvements */}
                {(dashboardFilter === 'all' || dashboardFilter === 'overview' || dashboardFilter === 'edits') && (
                  <div id="findings-section">
                    <FindingsList
                      findings={report.findings}
                      improvements={report.improvements}
                    />
                  </div>
                )}

                {/* Benchmarks & Platform Fit */}
                {(dashboardFilter === 'all' || dashboardFilter === 'benchmarks') && (
                  <>
                    <div id="benchmarks-section">
                      <BenchmarkChart benchmarks={report.benchmarks} />
                    </div>
                    <div id="platform-section">
                      <PlatformFitCard
                        platforms={report.platformFit}
                        thumbnailSuggestion={report.optimizedPackage.thumbnailSuggestion}
                      />
                    </div>
                  </>
                )}

                {/* Step 7: Production-Ready Optimized Package */}
                {(dashboardFilter === 'all' || dashboardFilter === 'edits') && (
                  <div id="optimized-package-section">
                    <OptimizedPackageView packageData={report.optimizedPackage} />
                  </div>
                )}

                {/* Trend Radar */}
                {(dashboardFilter === 'all' || dashboardFilter === 'benchmarks') && trendData && (
                  <TrendRadarCard
                    trendData={trendData}
                    activeCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
