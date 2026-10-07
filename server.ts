import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import { 
  AnalysisJob, 
  AnalysisReport, 
  AnalysisStage 
} from './server/types.ts';
import { scoringEngine } from './server/scoring.ts';
import { featureExtractionLayer } from './server/featureExtraction.ts';
import { recommendationEngine } from './server/recommendations.ts';
import { tinyfishService } from './server/tinyfishService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory Job & Report storage
const jobs = new Map<string, AnalysisJob>();
const reports = new Map<string, AnalysisReport>();

// Multer storage for video upload simulation
const upload = multer({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for safe handling
  storage: multer.memoryStorage(),
});

// Helper: load Demo Fixture single source of truth
function getDemoFixture(): AnalysisReport {
  const fixturePath = path.join(ROOT_DIR, 'data', 'demo_fixture.json');
  if (fs.existsSync(fixturePath)) {
    const raw = fs.readFileSync(fixturePath, 'utf-8');
    return JSON.parse(raw);
  }
  throw new Error('demo_fixture.json missing');
}

// Seed the initial demo report so it can be previewed immediately
try {
  const demoReport = getDemoFixture();
  reports.set(demoReport.id, demoReport);
} catch (e) {
  console.warn('[Server] Could not pre-seed demo fixture:', e);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Upload Video Metadata / File
app.post('/api/videos', upload.single('video'), (req, res) => {
  const file = req.file;
  const videoId = 'vid_' + Math.random().toString(36).substring(2, 9);
  
  const videoMetadata = {
    videoId,
    filename: file ? file.originalname : 'demo_video.mp4',
    sizeBytes: file ? file.size : 14200000,
    sizeFormatted: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '14.2 MB',
    uploadedAt: new Date().toISOString(),
    status: 'uploaded',
  };

  res.json({ success: true, ...videoMetadata });
});

// 2. Start Video Analysis (Background Job)
app.post('/api/analyses', async (req, res) => {
  const {
    videoId,
    filename = 'video_draft.mp4',
    caption = '',
    hashtags = [],
    targetPlatform = 'YouTube Shorts',
    category = 'General Content',
    durationSeconds = 45,
    thumbnailUrl,
    fileSize,
    isDemo = false,
    resolution,
    aspectRatio,
    detectedLuminance,
    detectedMotionRate,
    detectedSilenceRatio,
    detectedVolumeDb,
    hasAudioTrack,
  } = req.body;

  const analysisId = 'job_' + Math.random().toString(36).substring(2, 9);

  // Initialize background job
  const job: AnalysisJob = {
    id: analysisId,
    status: 'queued',
    currentStage: 'Frames & scenes',
    stageProgress: 0,
    totalProgress: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  jobs.set(analysisId, job);

  // Use demo fixture ONLY if user explicitly asked for the demo fixture and gave the fixture filename
  const isFixtureRequested = Boolean(isDemo && filename === 'AI Tools You Need in 2026.mp4');

  // Trigger asynchronous background pipeline
  simulateBackgroundPipeline(analysisId, {
    videoId,
    filename,
    caption,
    hashtags,
    targetPlatform,
    category,
    durationSeconds: Number(durationSeconds) || 45,
    thumbnailUrl,
    fileSize,
    isDemo: isFixtureRequested,
    resolution,
    aspectRatio,
    detectedLuminance,
    detectedMotionRate,
    detectedSilenceRatio,
    detectedVolumeDb,
    hasAudioTrack,
  });

  res.json({
    analysisId,
    status: 'queued',
    message: 'Analysis pipeline started. Poll /api/analyses/:id for progress.',
  });
});

// 3. Poll Analysis Progress
app.get('/api/analyses/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    // If not in job list, check if report already exists (e.g. demo)
    if (reports.has(req.params.id)) {
      return res.json({
        id: req.params.id,
        status: 'completed',
        currentStage: 'Complete',
        stageProgress: 100,
        totalProgress: 100,
      });
    }
    return res.status(404).json({ error: 'Analysis job not found' });
  }

  res.json(job);
});

// 4. Get Final Report
app.get('/api/analyses/:id/report', (req, res) => {
  const report = reports.get(req.params.id);
  if (!report) {
    // Fallback: if user asked for demo
    if (req.params.id === 'demo' || req.params.id === 'demo-analysis-2026') {
      const demo = getDemoFixture();
      return res.json(demo);
    }
    return res.status(404).json({ error: 'Analysis report not found or processing incomplete' });
  }

  res.json(report);
});

// 5. Optimize Endpoint (Hook rewrites, captions, edit plans)
app.post('/api/optimize', async (req, res) => {
  const {
    caption = '',
    hashtags = [],
    category = 'General Content',
    targetPlatform = 'YouTube Shorts',
    durationSeconds = 48,
    filename = '',
  } = req.body;

  try {
    const pkg = await recommendationEngine.generateOptimizedPackage({
      filename,
      caption,
      hashtags,
      category,
      targetPlatform,
      durationSeconds,
    });
    res.json({ success: true, package: pkg });
  } catch (err: any) {
    res.status(500).json({ error: 'Optimization failed', details: err.message });
  }
});

// 6. TinyFish Trend Radar
app.get('/api/trends', (req, res) => {
  const category = (req.query.category as string) || 'Tech & Productivity';
  const trends = tinyfishService.getTrendRadar(category);
  res.json(trends);
});

// 7. TinyFish Benchmarks
app.get('/api/benchmarks', (req, res) => {
  const category = (req.query.category as string) || 'Tech & Productivity';
  const benchmarks = tinyfishService.getBenchmarks(category);
  res.json(benchmarks);
});

// 8. Usage info (Unlimited)
app.get('/api/user/usage', (_req, res) => {
  res.json({ unlimited: true, plan: 'Creator Unlimited' });
});

// ==========================================
// BACKGROUND PROCESSING PIPELINE
// ==========================================
async function simulateBackgroundPipeline(
  analysisId: string,
  params: {
    videoId?: string;
    filename: string;
    caption: string;
    hashtags: string[];
    targetPlatform: string;
    category: string;
    durationSeconds?: number;
    thumbnailUrl?: string;
    fileSize?: string;
    isDemo: boolean;
    resolution?: string;
    aspectRatio?: string;
    detectedLuminance?: number;
    detectedMotionRate?: number;
    detectedSilenceRatio?: number;
    detectedVolumeDb?: number;
    hasAudioTrack?: boolean;
  }
) {
  const job = jobs.get(analysisId);
  if (!job) return;

  job.status = 'processing';

  const stages: { stage: AnalysisStage; durationMs: number; endProgress: number }[] = [
    { stage: 'Frames & scenes', durationMs: 1400, endProgress: 25 },
    { stage: 'Audio & speech', durationMs: 1400, endProgress: 50 },
    { stage: 'NLP & hook', durationMs: 1400, endProgress: 75 },
    { stage: 'ML scoring', durationMs: 1400, endProgress: 100 },
  ];

  for (const { stage, durationMs, endProgress } of stages) {
    job.currentStage = stage;
    const steps = 5;
    const interval = durationMs / steps;
    const startProgress = job.totalProgress;

    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, interval));
      job.stageProgress = Math.round((i / steps) * 100);
      job.totalProgress = Math.min(100, Math.round(startProgress + ((endProgress - startProgress) * i) / steps));
      job.updatedAt = Date.now();
    }
  }

  // Generate Report
  let finalReport: AnalysisReport;

  if (params.isDemo) {
    // SINGLE SOURCE OF TRUTH: EXACT FIXTURE
    const fixture = getDemoFixture();
    finalReport = {
      ...fixture,
      id: analysisId,
    };
  } else {
    // Real Feature Extraction + Scoring pipeline
    const videoDuration = Math.max(5, params.durationSeconds || 45);
    const cleanTitle = params.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const detectedTopic = recommendationEngine.extractTopicName(params.filename, params.caption, params.category);

    const features = featureExtractionLayer.extract({
      filename: params.filename,
      caption: params.caption,
      hashtags: params.hashtags,
      targetPlatform: params.targetPlatform,
      category: detectedTopic,
      durationSeconds: videoDuration,
      resolution: params.resolution,
      aspectRatio: params.aspectRatio,
      detectedLuminance: params.detectedLuminance,
      detectedMotionRate: params.detectedMotionRate,
      detectedSilenceRatio: params.detectedSilenceRatio,
      detectedVolumeDb: params.detectedVolumeDb,
      hasAudioTrack: params.hasAudioTrack,
    });

    const scores = featureExtractionLayer.deriveSubScores(features, params.targetPlatform);
    const overallScore = scoringEngine.computeOverallScore(scores);
    const confidenceScore = scoringEngine.computeConfidence({
      hasVideoData: true,
      hasAudioData: features.audio.voiceClarityScore > 40,
      hasTranscript: Boolean(params.caption && params.caption.length > 10),
      hasCaptions: Boolean(params.caption),
      durationSeconds: features.metadata.durationSeconds,
    });

    const { curve, drops } = scoringEngine.generateRetentionCurve(
      features.metadata.durationSeconds,
      scores.hookStrength,
      scores.audienceRetention,
      features.vision.cutFrequencyPerMinute,
      features.audio.hasBackgroundMusic
    );

    const findings = recommendationEngine.generateFindings(
      scores, 
      params.caption, 
      features.metadata.durationSeconds,
      params.filename,
      params.targetPlatform,
      features.metadata.aspectRatio,
      features.vision.lightingQualityScore,
      features.audio.hasBackgroundMusic
    );
    const improvements = recommendationEngine.getImprovements(params.caption, features.metadata.durationSeconds);
    const hookComparison = recommendationEngine.getHookComparison(params.caption, detectedTopic, params.filename);
    const platformFit = recommendationEngine.getPlatformFit(features.metadata.durationSeconds, features.metadata.aspectRatio);
    const benchmarks = tinyfishService.getBenchmarks(detectedTopic, {
      hook: scores.hookStrength,
      retention: scores.audienceRetention,
      engagement: scores.engagementPotential,
    });
    const trendRadar = tinyfishService.getTrendRadar(detectedTopic);
    const optimizedPackage = await recommendationEngine.generateOptimizedPackage({
      filename: params.filename,
      caption: params.caption,
      hashtags: params.hashtags,
      category: detectedTopic,
      targetPlatform: params.targetPlatform,
      durationSeconds: features.metadata.durationSeconds,
    });

    let aiSummary = `Moderate viral potential detected for ${detectedTopic}. Focus on accelerating opening pacing.`;
    if (overallScore >= 85) {
      aiSummary = `Exceptional viral potential for ${detectedTopic}! Strong pacing and visual retention alignment.`;
    } else if (overallScore >= 75) {
      aiSummary = `Strong viral baseline for ${detectedTopic}. Trim intro delay to maximize viewer retention.`;
    } else if (overallScore <= 60) {
      aiSummary = `High drop-off risk for ${detectedTopic}. Hook lacks immediate curiosity; rework opening frame.`;
    }

    const defaultTags = ['#viral', `#${detectedTopic.toLowerCase().replace(/[^a-z0-9]/g, '')}`];

    finalReport = {
      id: analysisId,
      filename: params.filename,
      fileSize: params.fileSize || '14.2 MB',
      thumbnailUrl: params.thumbnailUrl,
      durationSeconds: features.metadata.durationSeconds,
      resolution: features.metadata.resolution,
      category: detectedTopic,
      targetPlatform: params.targetPlatform,
      caption: params.caption || cleanTitle,
      hashtags: params.hashtags.length > 0 ? params.hashtags : defaultTags,
      overallScore,
      confidenceScore,
      isDemo: false,
      createdAt: new Date().toISOString(),
      scores,
      retentionCurve: curve,
      retentionDrops: drops,
      benchmarks,
      aiSummary,
      hookComparison,
      findings,
      improvements,
      platformFit,
      optimizedPackage,
      trendRadar,
    };
  }

  // Store completed state
  reports.set(analysisId, finalReport);
  job.status = 'completed';
  job.currentStage = 'Complete';
  job.stageProgress = 100;
  job.totalProgress = 100;
  job.report = finalReport;
}

// ==========================================
// VITE DEV SERVER OR STATIC PROD
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(ROOT_DIR, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(ROOT_DIR, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VIRALYTICS AI] Dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[VIRALYTICS AI] Server boot error:', err);
});
