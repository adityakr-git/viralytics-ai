export interface SubScores {
  hookStrength: number;
  audienceRetention: number;
  engagementPotential: number;
  visualQuality: number;
  trendMatch: number;
  emotionalImpact: number;
  contentRelevance: number;
  audioQuality: number;
  captionQuality: number;
  hashtagQuality: number;
  shareability: number;
}

export interface RetentionPoint {
  timestamp: string;
  retention: number;
  drop?: boolean;
  label?: string;
}

export interface RetentionDrop {
  id: string;
  timeframe: string;
  name: string;
  severity: 'high' | 'medium' | 'low';
  dropPercent: number;
  diagnosis: string;
  fix: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'good';
  category: string;
  action: string;
}

export interface BenchmarkMetric {
  name: string;
  yourScore: number;
  categoryAvg: number;
  topTenPercent: number;
}

export interface BenchmarkReport {
  category: string;
  source: string;
  isCached: boolean;
  metrics: BenchmarkMetric[];
}

export interface PlatformFitItem {
  platform: 'YouTube Shorts' | 'TikTok' | 'Instagram Reels' | 'YouTube Long-form';
  fitScore: number;
  recommended: boolean;
  reason: string;
  optimalLength: string;
  aspectRatio: string;
}

export interface HookComparison {
  original: string;
  originalScore: number;
  improved: string;
  improvedScore: number;
  hookType: string;
  auditFindings: string[];
}

export interface EditPlanStep {
  step: number;
  timestamp: string;
  instruction: string;
}

export interface OptimizedPackage {
  rewrittenHook: string;
  improvedCaption: string;
  optimizedHashtags: string[];
  thumbnailSuggestion: {
    text: string;
    composition: string;
    contrastRatio: string;
  };
  editPlan: EditPlanStep[];
}

export interface TrendRadarData {
  matchScore: number;
  topKeywords: string[];
  trendingSounds: string[];
  risingHashtags: string[];
  viralFormats?: string[];
  dataSource: string;
  status: 'Live' | 'Cached';
}

export interface AnalysisReport {
  id: string;
  filename: string;
  fileSize?: string;
  durationSeconds: number;
  resolution?: string;
  thumbnailUrl?: string;
  category: string;
  targetPlatform: string;
  caption: string;
  hashtags: string[];
  overallScore: number;
  confidenceScore: number;
  isDemo: boolean;
  createdAt: string;
  scores: SubScores;
  retentionCurve: RetentionPoint[];
  retentionDrops: RetentionDrop[];
  benchmarks: BenchmarkReport;
  aiSummary: string;
  hookComparison: HookComparison;
  findings: Finding[];
  improvements: string[];
  platformFit: PlatformFitItem[];
  optimizedPackage: OptimizedPackage;
  trendRadar: TrendRadarData;
  features?: Record<string, any>;
}

export type AnalysisStage = 
  | 'Frames & scenes'
  | 'Audio & speech'
  | 'NLP & hook'
  | 'ML scoring'
  | 'Complete';

export interface AnalysisJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  currentStage: AnalysisStage;
  stageProgress: number; // 0 - 100
  totalProgress: number; // 0 - 100
  createdAt: number;
  updatedAt: number;
  report?: AnalysisReport;
  error?: string;
}
