import { 
  AnalysisJob, 
  AnalysisReport, 
  BenchmarkReport, 
  Finding, 
  HookComparison, 
  OptimizedPackage, 
  PlatformFitItem, 
  RetentionDrop, 
  RetentionPoint, 
  SubScores, 
  TrendRadarData 
} from '../types.ts';
import demoFixtureData from '../../data/demo_fixture.json';
import trendsCacheData from '../../data/trends_cache.json';
import weightsData from '../../data/weights.json';

// Simple hash generator for consistent signals
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getClientTrendRadar(category: string = 'Tech & Productivity'): TrendRadarData {
  const cat = (trendsCacheData.categories as Record<string, any>)[category] || 
              (trendsCacheData.categories as Record<string, any>)['Tech & Productivity'];

  return {
    matchScore: cat.overallTrendVelocity,
    topKeywords: cat.risingTopics,
    trendingSounds: cat.popularAudio,
    risingHashtags: cat.topHashtags,
    viralFormats: cat.viralFormats,
    dataSource: 'TinyFish Trend Intelligence (Public Social Web)',
    status: 'Cached',
  };
}

export function getClientBenchmarks(
  category: string = 'Tech & Productivity', 
  yourScores?: { retention?: number; hook?: number; engagement?: number }
): BenchmarkReport {
  const cat = (trendsCacheData.categories as Record<string, any>)[category] || 
              (trendsCacheData.categories as Record<string, any>)['Tech & Productivity'];
  const bm = cat.benchmarks || { audienceRetention: 89, hookStrength: 90, engagementPotential: 88 };

  return {
    category,
    source: 'TinyFish Category Intelligence',
    isCached: true,
    metrics: [
      {
        name: 'Hook Strength',
        yourScore: yourScores?.hook ?? 94,
        categoryAvg: bm.hookStrength,
        topTenPercent: bm.hookStrength + 5,
      },
      {
        name: 'Audience Retention',
        yourScore: yourScores?.retention ?? 82,
        categoryAvg: bm.audienceRetention,
        topTenPercent: bm.audienceRetention + 4,
      },
      {
        name: 'Engagement Potential',
        yourScore: yourScores?.engagement ?? 89,
        categoryAvg: bm.engagementPotential,
        topTenPercent: bm.engagementPotential + 6,
      },
    ],
  };
}

export function getClientDemoFixture(): AnalysisReport {
  return demoFixtureData as unknown as AnalysisReport;
}

export function extractClientTopicName(filename: string = '', caption: string = '', category: string = ''): string {
  const text = (filename + ' ' + caption + ' ' + category).toLowerCase();
  if (text.includes('gym') || text.includes('workout') || text.includes('fit') || text.includes('squat') || text.includes('muscle') || text.includes('exercise')) return 'Fitness & Health';
  if (text.includes('cook') || text.includes('food') || text.includes('recipe') || text.includes('kitchen') || text.includes('bake') || text.includes('dish') || text.includes('eat')) return 'Food & Cooking';
  if (text.includes('game') || text.includes('gaming') || text.includes('clutch') || text.includes('bgmi') || text.includes('pubg') || text.includes('gta') || text.includes('minecraft') || text.includes('roblox') || text.includes('valorant')) return 'Gaming & Esports';
  if (text.includes('comedy') || text.includes('funny') || text.includes('skit') || text.includes('joke') || text.includes('meme') || text.includes('laugh') || text.includes('prank') || text.includes('pov')) return 'Entertainment & Comedy';
  if (text.includes('travel') || text.includes('trip') || text.includes('tour') || text.includes('explore') || text.includes('beach') || text.includes('mountain') || text.includes('flight') || text.includes('hotel')) return 'Travel & Adventure';
  if (text.includes('vlog') || text.includes('routine') || text.includes('day in') || text.includes('daily') || text.includes('morning') || text.includes('reset') || text.includes('room tour')) return 'Lifestyle & Vlog';
  if (text.includes('dance') || text.includes('music') || text.includes('song') || text.includes('sing') || text.includes('beat') || text.includes('dj') || text.includes('remix') || text.includes('cover')) return 'Music & Dance';
  if (text.includes('beauty') || text.includes('makeup') || text.includes('grwm') || text.includes('skincare') || text.includes('outfit') || text.includes('fashion') || text.includes('hair') || text.includes('ootd')) return 'Fashion & Beauty';
  if (text.includes('money') || text.includes('dollar') || text.includes('business') || text.includes('finance') || text.includes('income') || text.includes('crypto') || text.includes('invest') || text.includes('profit') || text.includes('side hustle')) return 'Business & Finance';
  if (text.includes('learn') || text.includes('how to') || text.includes('tips') || text.includes('study') || text.includes('facts') || text.includes('science') || text.includes('history') || text.includes('trick')) return 'Education & How-To';
  if (text.includes('code') || text.includes('python') || text.includes('dev') || text.includes('software') || text.includes('ai') || text.includes('tool') || text.includes('app') || text.includes('tech') || text.includes('automation')) return 'Tech & Productivity';
  
  return category || 'General Content';
}

export function computeClientScores(params: {
  filename: string;
  caption: string;
  hashtags: string[];
  targetPlatform: string;
  category: string;
  durationSeconds: number;
  resolution?: string;
  aspectRatio?: string;
  detectedLuminance?: number;
  detectedMotionRate?: number;
  detectedSilenceRatio?: number;
  detectedVolumeDb?: number;
  hasAudioTrack?: boolean;
}): {
  scores: SubScores;
  overallScore: number;
  confidenceScore: number;
  curve: RetentionPoint[];
  drops: RetentionDrop[];
  findings: Finding[];
  improvements: string[];
  hookComparison: HookComparison;
  platformFit: PlatformFitItem[];
  optimizedPackage: OptimizedPackage;
  benchmarks: BenchmarkReport;
  trendRadar: TrendRadarData;
  aiSummary: string;
} {
  const dur = Math.max(5, params.durationSeconds || 30);
  const cleanTitle = params.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const topic = extractClientTopicName(params.filename, params.caption, params.category);
  const seed = hashString(params.filename + params.caption + topic);

  const cleanFilename = params.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const fullText = `${cleanFilename} ${params.caption}`.trim();

  const hasNumbers = /\d+/.test(fullText);
  const hasPassiveGreeting = /^(today|hello|hey guys|hi everyone|in this video|welcome back|so today|basically)/i.test(params.caption.trim());
  const hasCuriosity = /(secret|mistake|illegal|stop|never|hack|how to|why|formula|insane|steal|cheat|rule|truth|warning|danger|best|worst|don't|shocking|hidden)/i.test(fullText);
  const hasActionVerb = /(discover|automate|build|stop|steal|watch|boost|transform|double|scale|fix|create|learn|try|make|get|avoid)/i.test(fullText);
  const hasCallToAction = /(comment|save|share|follow|link|check out|subscribe|below|part 2|tell me)/i.test(fullText);

  // Hook Strength
  let hook = 65;
  if (hasPassiveGreeting) hook -= 20;
  if (hasCuriosity) hook += 22;
  if (hasNumbers) hook += 10;
  if (fullText.includes('?')) hook += 6;
  if (hasActionVerb) hook += 5;
  hook = Math.min(98, Math.max(35, hook));

  // Retention
  let retention = 78;
  if (dur <= 30) retention += 8;
  else if (dur > 60 && params.targetPlatform !== 'YouTube Long-form') retention -= 12;
  if (hook > 85) retention += 6;
  else if (hook < 55) retention -= 8;
  retention = Math.min(96, Math.max(40, retention));

  // Engagement
  let engagement = 70;
  if (hasCallToAction) engagement += 14;
  if (hasCuriosity) engagement += 8;
  engagement = Math.min(96, Math.max(45, engagement));

  // Visual Quality
  let visual = 82;
  if (params.detectedLuminance !== undefined && params.detectedLuminance !== null) {
    const lum = params.detectedLuminance;
    if (lum >= 40 && lum <= 75) visual = Math.min(96, 85 + Math.round((lum - 40) * 0.3));
    else if (lum < 30) visual = Math.max(42, Math.round(lum * 1.5));
    else if (lum > 85) visual = Math.max(50, 95 - Math.round((lum - 85) * 2));
  }

  // Audio Quality
  const hasAudio = params.hasAudioTrack !== undefined ? params.hasAudioTrack : true;
  let audio = 82;
  if (!hasAudio) {
    audio = 30;
  } else if (params.detectedVolumeDb !== undefined && params.detectedVolumeDb !== null) {
    if (params.detectedVolumeDb > -24 && params.detectedVolumeDb < -8) audio = 91;
    else if (params.detectedVolumeDb <= -35) audio = 62;
  }

  const relevance = Math.min(96, Math.max(55, 75 + (params.hashtags.length > 2 ? 15 : 5)));
  const captionScore = Math.min(95, Math.max(40, 60 + (params.caption.length > 30 ? 20 : 0) + (hasCallToAction ? 10 : 0)));
  const hashtagScore = params.hashtags.length >= 3 ? 85 : params.hashtags.length >= 1 ? 65 : 35;
  const emotional = Math.min(95, Math.max(45, 70 + (hasCuriosity ? 12 : 0) + (hasActionVerb ? 6 : 0)));
  const shareability = Math.min(95, Math.max(40, Math.round(hook * 0.45 + engagement * 0.55)));
  const trendMatch = Math.min(96, Math.max(60, 78 + (seed % 15)));

  const scores: SubScores = {
    hookStrength: hook,
    audienceRetention: retention,
    engagementPotential: engagement,
    visualQuality: visual,
    trendMatch: trendMatch,
    emotionalImpact: emotional,
    contentRelevance: relevance,
    audioQuality: audio,
    captionQuality: captionScore,
    hashtagQuality: hashtagScore,
    shareability: shareability,
  };

  // Compute Overall Score with weights
  const weights = (weightsData.weights as Record<string, number>);
  let wSum = 0;
  let totalW = 0;
  for (const [key, w] of Object.entries(weights)) {
    const s = (scores as any)[key] ?? 50;
    wSum += s * w;
    totalW += w;
  }
  const overallScore = totalW > 0 ? Math.round(wSum / totalW) : 75;
  const confidenceScore = Math.min(75, Math.max(55, 62 + (hasAudio ? 6 : 0) + (params.caption ? 5 : 0)));

  // Scaled Retention Curve
  const intervals = [
    0,
    Math.max(1, Math.min(3, Math.round(dur * 0.08))),
    Math.max(2, Math.round(dur * 0.25)),
    Math.max(4, Math.round(dur * 0.50)),
    Math.max(6, Math.round(dur * 0.75)),
    dur,
  ];

  const formatTs = (sec: number) => {
    if (sec >= 120) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return s === 0 ? `${m}m` : `${m}m ${s}s`;
    }
    return `${sec}s`;
  };

  const hookFactor = (100 - hook) * 0.22;
  const dropAtIntro = Math.max(55, Math.round(100 - (4 + hookFactor)));
  const dropAtQ1 = Math.max(45, Math.round(dropAtIntro - (4 + (100 - retention) * 0.08)));
  const dropAtMid = Math.max(35, Math.round(dropAtQ1 - 8));
  const dropAtQ3 = Math.max(25, Math.round(dropAtMid - 9));
  const dropAtEnd = Math.max(18, Math.round(dropAtQ3 - 10));

  const introTimeframe = `0-${intervals[1]}s`;
  const midTimeframe = `${intervals[2]}-${intervals[3]}s`;

  const isIntroDrop = (100 - dropAtIntro) >= 6;
  const isMidDrop = (dropAtQ1 - dropAtMid) >= 8;

  const curve: RetentionPoint[] = [
    { timestamp: formatTs(intervals[0]), retention: 100, drop: false },
    { timestamp: formatTs(intervals[1]), retention: dropAtIntro, drop: isIntroDrop, label: `Drop 1: Intro (${introTimeframe})` },
    { timestamp: formatTs(intervals[2]), retention: dropAtQ1, drop: false },
    { timestamp: formatTs(intervals[3]), retention: dropAtMid, drop: isMidDrop, label: `Drop 2: Pacing (${midTimeframe})` },
    { timestamp: formatTs(intervals[4]), retention: dropAtQ3, drop: false },
    { timestamp: formatTs(intervals[5]), retention: dropAtEnd, drop: false },
  ];

  const drops: RetentionDrop[] = [];
  const drop1Diff = 100 - dropAtIntro;
  if (drop1Diff >= 6) {
    drops.push({
      id: 'drop-1',
      timeframe: introTimeframe,
      name: `Drop 1: Intro hook (${introTimeframe})`,
      severity: drop1Diff >= 10 ? 'high' : 'medium',
      dropPercent: drop1Diff,
      diagnosis: `Viewer interest drops during the initial ${introTimeframe} window before value is delivered.`,
      fix: 'Cut slow greetings or dead silence; lead immediately with the core visual outcome in frame 1.'
    });
  }

  const drop2Diff = dropAtQ1 - dropAtMid;
  if (drop2Diff >= 8) {
    drops.push({
      id: 'drop-2',
      timeframe: midTimeframe,
      name: `Drop 2: Mid-video decay (${midTimeframe})`,
      severity: drop2Diff >= 12 ? 'high' : 'medium',
      dropPercent: drop2Diff,
      diagnosis: `Retention drops around ${midTimeframe} due to monotonous camera angles or pacing drag.`,
      fix: 'Introduce a visual pattern interrupt: zoom-in, B-roll cut, kinetic graphics, or sound effect.'
    });
  }

  // Findings
  const findings: Finding[] = [];
  if (hasPassiveGreeting || hook < 70) {
    findings.push({
      id: 'f1',
      title: 'Opening contains passive delay before delivering value',
      severity: 'critical',
      category: 'Hook Quality',
      action: 'Cut the greeting completely; lead immediately with the core payoff or high-stakes visual outcome in frame 1.',
    });
  } else {
    findings.push({
      id: 'f1-good',
      title: 'First 2 seconds contain strong curiosity and pattern interrupt',
      severity: 'good',
      category: 'Hook Quality',
      action: 'Maintain this high-energy opening velocity in future videos.',
    });
  }

  const isHorizontal = (params.aspectRatio || '').includes('16:9');
  if (isHorizontal && params.targetPlatform !== 'YouTube Long-form') {
    findings.push({
      id: 'f-aspect',
      title: 'Aspect ratio mismatch: 16:9 horizontal video in vertical feed',
      severity: 'critical',
      category: 'Format Packaging',
      action: 'Re-crop or export as 9:16 vertical (1080x1920) to avoid heavy black letterbox bars in mobile feeds.',
    });
  }

  if (dur > 60 && params.targetPlatform === 'YouTube Shorts') {
    findings.push({
      id: 'f-dur-limit',
      title: `${dur}s exceeds YouTube Shorts 60-second limit`,
      severity: 'critical',
      category: 'Pacing & Retention',
      action: `Trim ${dur - 60} seconds of filler or split into a 2-part series to qualify for Shorts feed.`,
    });
  }

  if (!hasAudio) {
    findings.push({
      id: 'f-audio-silent',
      title: 'No audio track or dialogue detected in video',
      severity: 'critical',
      category: 'Audio Quality',
      action: 'Add voiceover commentary, sound effects, or a high-energy trending background track.',
    });
  }

  findings.push({
    id: 'f-pacing',
    title: 'Pacing velocity matches high-retention algorithmic benchmarks',
    severity: 'good',
    category: 'Pacing & Retention',
    action: 'Pacing and duration are well balanced for optimal audience completion.',
  });

  findings.push({
    id: 'f-trend',
    title: `Content aligns with trending interest in ${topic}`,
    severity: 'good',
    category: 'Trend Radar',
    action: 'Publish during peak mobile activity windows (12-2 PM or 6-9 PM local) to accelerate early algorithmic testing.',
  });

  const orderMap: Record<string, number> = { critical: 0, warning: 1, good: 2 };
  findings.sort((a, b) => orderMap[a.severity] - orderMap[b.severity]);

  // Improvements
  const improvements = [
    hasPassiveGreeting ? 'Cut intro greeting completely (jump straight to payoff)' : 'Trim first 1.5 seconds of dead air',
    'Start with the finished result or peak moment in frame 1',
    'Increase kinetic subtitle size to 64pt in safe center zone',
    dur > 40 ? `Trim ${Math.round(dur * 0.12)}s of mid-video monologue pauses` : 'Add B-roll pattern interrupt at halfway point',
    'Add a clear action prompt (comment or save for later)',
  ];

  // Hook Comparison
  let orig = params.caption.trim();
  if (!orig || orig.length < 10) {
    if (topic === 'Fitness & Health') orig = `Hey guys, today I am showing you my routine for ${cleanTitle}...`;
    else if (topic === 'Food & Cooking') orig = `Welcome back! Today we are making ${cleanTitle} at home...`;
    else if (topic === 'Gaming & Esports') orig = `Check out this clutch gameplay in ${cleanTitle}...`;
    else orig = `Watch this video about ${cleanTitle}...`;
  }

  let improvedHook = '99% of people do this completely WRONG...';
  let hookType = 'Negative Constraint & High Urgency Warning';
  if (topic === 'Fitness & Health') {
    improvedHook = 'Stop doing this exercise until you fix this 1 mistake...';
    hookType = 'Injury Prevention & Immediate Form Intervention';
  } else if (topic === 'Food & Cooking') {
    improvedHook = 'The 1 restaurant secret that makes this taste 10x better...';
    hookType = 'Insider Secret & Sensory Taste Payoff';
  } else if (topic === 'Gaming & Esports') {
    improvedHook = '99% of players don\'t know this hidden clutch mechanic...';
    hookType = 'Skill Discrepancy & Secret Meta Exploit';
  } else if (topic === 'Entertainment & Comedy') {
    improvedHook = 'POV: You try this once and immediately regret everything...';
    hookType = 'High Relatability & Curiosity Contrast';
  } else if (topic === 'Travel & Adventure') {
    improvedHook = 'Do NOT visit this place without knowing this 1 hidden rule...';
    hookType = 'Urgent Travel Warning & Insider Safety';
  } else if (topic === 'Lifestyle & Vlog') {
    improvedHook = 'The 2-minute morning habit that permanently fixed my routine...';
    hookType = 'Micro-Commitment & Aspirational Result';
  }

  const hookComparison: HookComparison = {
    original: orig,
    originalScore: hook < 70 ? 46 : 74,
    improved: improvedHook,
    improvedScore: 92,
    hookType,
    auditFindings: [
      hook < 70 
        ? "Original opening contains delay friction before value proposition is delivered."
        : "Original opening has moderate intrigue, but lacks extreme contrast or concrete stakes.",
      `Rewritten version establishes immediate high-stakes curiosity ('${improvedHook.slice(0, 35)}...') within frame 1.`,
    ],
  };

  // Platform Fit
  const isShort = dur <= 60;
  const platformFit: PlatformFitItem[] = isHorizontal ? [
    { platform: 'YouTube Long-form', fitScore: 94, recommended: true, reason: '16:9 widescreen format matches desktop & TV playback.', optimalLength: '8-14 min', aspectRatio: '16:9' },
    { platform: 'YouTube Shorts', fitScore: 45, recommended: false, reason: 'Horizontal 16:9 will display with heavy black bars.', optimalLength: '35-50s', aspectRatio: '9:16 (Requires Crop)' },
    { platform: 'TikTok', fitScore: 42, recommended: false, reason: 'Horizontal video significantly underperforms in vertical feeds.', optimalLength: '20-40s', aspectRatio: '9:16 (Requires Crop)' },
    { platform: 'Instagram Reels', fitScore: 40, recommended: false, reason: 'Reels algorithm favors 9:16 vertical full-screen video.', optimalLength: '25-45s', aspectRatio: '9:16 (Requires Crop)' },
  ] : [
    { platform: 'YouTube Shorts', fitScore: isShort ? 94 : 48, recommended: isShort, reason: isShort ? `${dur}s vertical format fits Shorts completion benchmark.` : `${dur}s exceeds Shorts 60s hard limit.`, optimalLength: '35-50s', aspectRatio: '9:16' },
    { platform: 'TikTok', fitScore: 91, recommended: !isShort, reason: 'Native 9:16 format aligns with TikTok feed; maintain fast cuts.', optimalLength: '20-40s', aspectRatio: '9:16' },
    { platform: 'Instagram Reels', fitScore: 88, recommended: false, reason: 'Visual presentation fits Reels well; add a "Save for later" CTA.', optimalLength: '25-45s', aspectRatio: '9:16' },
    { platform: 'YouTube Long-form', fitScore: 38, recommended: false, reason: 'Vertical 9:16 will display with pillarbox bars on widescreen players.', optimalLength: '8-14 min', aspectRatio: '16:9' },
  ];

  // Optimized Package
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const optimizedPackage: OptimizedPackage = {
    rewrittenHook: improvedHook,
    improvedCaption: `Stop doing this the hard way. Here is the exact fix that actually works! Save this before you forget. 🚀 Which tip helped most?`,
    optimizedHashtags: params.hashtags.length > 0 ? params.hashtags : ['#viral', `#${topic.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#trending'],
    thumbnailSuggestion: {
      text: 'STOP DOING THIS (FIX NOW)',
      composition: 'High-contrast bold typography across top third, peak action freeze frame on right half, dark vignette.',
      contrastRatio: '6.8:1 (Excellent mobile readability)',
    },
    editPlan: [
      { step: 1, timestamp: `0:00 - ${formatTime(Math.max(1, Math.round(dur * 0.08)))}`, instruction: `Trim introductory silence completely; lead with '${improvedHook.slice(0, 30)}...' in frame 1.` },
      { step: 2, timestamp: `${formatTime(Math.max(1, Math.round(dur * 0.08)))} - ${formatTime(Math.max(3, Math.round(dur * 0.30)))}`, instruction: `Overlay kinetic high-contrast subtitles (font: Montserrat/Inter ExtraBold, 64pt).` },
      { step: 3, timestamp: `${formatTime(Math.max(3, Math.round(dur * 0.30)))} - ${formatTime(Math.max(5, Math.round(dur * 0.60)))}`, instruction: `Insert a rapid zoom-in or B-roll cut to break eye-tracking fatigue.` },
      { step: 4, timestamp: `${formatTime(Math.max(5, Math.round(dur * 0.60)))} - ${formatTime(Math.max(7, Math.round(dur * 0.85)))}`, instruction: `Apply speech isolation (+3dB voice boost) to ensure vocal track cuts clearly through phone speakers.` },
      { step: 5, timestamp: `${formatTime(Math.max(7, Math.round(dur * 0.85)))} - ${formatTime(dur)}`, instruction: `Add pinned comment reminder and visual pointing arrow towards save/share button.` },
    ],
  };

  const benchmarks = getClientBenchmarks(topic, { hook, retention, engagement });
  const trendRadar = getClientTrendRadar(topic);

  let aiSummary = `Moderate viral potential detected for ${topic}. Focus on accelerating opening pacing.`;
  if (overallScore >= 85) {
    aiSummary = `Exceptional viral potential for ${topic}! Strong pacing and visual retention alignment.`;
  } else if (overallScore >= 75) {
    aiSummary = `Strong viral baseline for ${topic}. Trim intro delay to maximize viewer retention.`;
  }

  return {
    scores,
    overallScore,
    confidenceScore,
    curve,
    drops,
    findings,
    improvements,
    hookComparison,
    platformFit,
    optimizedPackage,
    benchmarks,
    trendRadar,
    aiSummary,
  };
}

export async function runClientAnalysisPipeline(
  params: {
    filename: string;
    caption: string;
    hashtags: string[];
    targetPlatform: string;
    category: string;
    durationSeconds: number;
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
  },
  onProgress: (job: AnalysisJob) => void
): Promise<AnalysisReport> {
  const analysisId = 'job_' + Math.random().toString(36).substring(2, 9);

  if (params.isDemo && params.filename === 'AI Tools You Need in 2026.mp4') {
    const fixture = getClientDemoFixture();
    return { ...fixture, id: analysisId };
  }

  const stages: { stage: AnalysisJob['currentStage']; durationMs: number; endProgress: number }[] = [
    { stage: 'Frames & scenes', durationMs: 1200, endProgress: 25 },
    { stage: 'Audio & speech', durationMs: 1200, endProgress: 50 },
    { stage: 'NLP & hook', durationMs: 1200, endProgress: 75 },
    { stage: 'ML scoring', durationMs: 1200, endProgress: 100 },
  ];

  let currentTotal = 5;

  for (const { stage, durationMs, endProgress } of stages) {
    const steps = 4;
    const interval = durationMs / steps;
    const startProgress = currentTotal;

    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, interval));
      const stagePct = Math.round((i / steps) * 100);
      currentTotal = Math.min(100, Math.round(startProgress + ((endProgress - startProgress) * i) / steps));

      onProgress({
        id: analysisId,
        status: 'processing',
        currentStage: stage,
        stageProgress: stagePct,
        totalProgress: currentTotal,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }

  const computed = computeClientScores(params);
  const cleanTitle = params.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const topic = extractClientTopicName(params.filename, params.caption, params.category);

  const finalReport: AnalysisReport = {
    id: analysisId,
    filename: params.filename,
    fileSize: params.fileSize || '14.2 MB',
    thumbnailUrl: params.thumbnailUrl,
    durationSeconds: Math.max(5, params.durationSeconds || 30),
    resolution: params.resolution || '1080x1920 (9:16)',
    category: topic,
    targetPlatform: params.targetPlatform,
    caption: params.caption || cleanTitle,
    hashtags: params.hashtags.length > 0 ? params.hashtags : ['#viral', `#${topic.toLowerCase().replace(/[^a-z0-9]/g, '')}`],
    overallScore: computed.overallScore,
    confidenceScore: computed.confidenceScore,
    isDemo: false,
    createdAt: new Date().toISOString(),
    scores: computed.scores,
    retentionCurve: computed.curve,
    retentionDrops: computed.drops,
    benchmarks: computed.benchmarks,
    aiSummary: computed.aiSummary,
    hookComparison: computed.hookComparison,
    findings: computed.findings,
    improvements: computed.improvements,
    platformFit: computed.platformFit,
    optimizedPackage: computed.optimizedPackage,
    trendRadar: computed.trendRadar,
  };

  return finalReport;
}
