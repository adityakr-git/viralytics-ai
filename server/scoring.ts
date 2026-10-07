import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SubScores, RetentionPoint, RetentionDrop } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export interface WeightsConfig {
  version: string;
  weights: Record<keyof SubScores, number>;
  confidenceCaps: {
    heuristicOnly: number;
    mlEnsemble: number;
  };
}

/**
 * Pluggable ML Interface (Emulates scikit-learn / XGBoost model predictor pipeline)
 * In production, this can invoke an exported ONNX model or Python microservice.
 */
export interface MLViralityPredictor {
  isAvailable(): boolean;
  predict(features: Record<string, number>): { score: number; confidence: number };
}

export class ScikitLearnViralityModel implements MLViralityPredictor {
  private hasTrainedModelWeights: boolean = false;

  constructor() {
    // Can check if trained_model.onnx or model.pkl exists
    const modelPath = path.join(ROOT_DIR, 'data', 'trained_model.onnx');
    this.hasTrainedModelWeights = fs.existsSync(modelPath);
  }

  isAvailable(): boolean {
    return this.hasTrainedModelWeights;
  }

  predict(features: Record<string, number>): { score: number; confidence: number } {
    if (!this.hasTrainedModelWeights) {
      throw new Error('Trained ML model weights not loaded; fallback to heuristic ensemble.');
    }
    // Pluggable ML inference
    return { score: 85, confidence: 88 };
  }
}

export class ScoringEngine {
  private weightsConfig: WeightsConfig;
  private mlPredictor: MLViralityPredictor;

  constructor(mlPredictor?: MLViralityPredictor) {
    this.mlPredictor = mlPredictor || new ScikitLearnViralityModel();
    this.weightsConfig = this.loadWeights();
  }

  private loadWeights(): WeightsConfig {
    const weightsPath = path.join(ROOT_DIR, 'data', 'weights.json');
    try {
      if (fs.existsSync(weightsPath)) {
        const raw = fs.readFileSync(weightsPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[ScoringEngine] Could not load weights.json, using defaults:', e);
    }

    return {
      version: '1.0.0',
      weights: {
        audienceRetention: 0.25,
        hookStrength: 0.15,
        engagementPotential: 0.15,
        visualQuality: 0.10,
        emotionalImpact: 0.10,
        contentRelevance: 0.10,
        audioQuality: 0.05,
        captionQuality: 0.05,
        shareability: 0.05,
        hashtagQuality: 0.00,
        trendMatch: 0.00,
      },
      confidenceCaps: {
        heuristicOnly: 75,
        mlEnsemble: 92,
      },
    };
  }

  public computeOverallScore(scores: SubScores): number {
    const weights = this.weightsConfig.weights;
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights) as [keyof SubScores, number][]) {
      const score = scores[key] ?? 50;
      weightedSum += score * weight;
      totalWeight += weight;
    }

    if (totalWeight <= 0) return 50;
    return Math.round(weightedSum / totalWeight);
  }

  /**
   * Computes confidence score dynamically based on:
   * 1. Feature coverage (video frames analyzed, audio SNR clarity, transcript availability)
   * 2. Video length and content sample count
   * 3. Model type (capped at ~75% for heuristics, higher for ML model)
   */
  public computeConfidence(metadata: {
    hasVideoData: boolean;
    hasAudioData: boolean;
    hasTranscript: boolean;
    hasCaptions: boolean;
    durationSeconds: number;
    sampleRateQuality?: number; // 0 to 1
  }): number {
    let baseConfidence = 45;

    if (metadata.hasVideoData) baseConfidence += 10;
    if (metadata.hasAudioData) baseConfidence += 8;
    if (metadata.hasTranscript) baseConfidence += 12;
    if (metadata.hasCaptions) baseConfidence += 4;

    const sampleFactor = metadata.sampleRateQuality ?? 0.85;
    baseConfidence += Math.round(sampleFactor * 6);

    // Duration stability factor: 15-90s videos have optimal training baseline
    if (metadata.durationSeconds >= 15 && metadata.durationSeconds <= 90) {
      baseConfidence += 4;
    }

    // Heuristic cap
    const cap = this.mlPredictor.isAvailable() 
      ? this.weightsConfig.confidenceCaps.mlEnsemble 
      : this.weightsConfig.confidenceCaps.heuristicOnly;

    return Math.min(cap, Math.max(50, baseConfidence));
  }

  /**
   * Generates predicted viewer retention curve dynamically scaled to actual durationSeconds.
   * Predicts drops based on hook, cut frequency, and pacing within video duration bounds.
   */
  public generateRetentionCurve(
    durationSeconds: number,
    hookScore: number,
    retentionScore: number,
    cutRatePerMin: number = 14,
    hasVoiceover: boolean = true
  ): { curve: RetentionPoint[]; drops: RetentionDrop[] } {
    const dur = Math.max(5, durationSeconds);
    
    // Scale timestamps across 6 key evaluation intervals: 0%, 8%, 25%, 50%, 75%, 100%
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

    // Calculate drop at intro window (0 - 3s or 8%)
    const hookFactor = (100 - hookScore) * 0.22;
    const dropAtIntro = Math.max(55, Math.round(100 - (4 + hookFactor)));

    // Quarter mark drop
    const dropAtQ1 = Math.max(45, Math.round(dropAtIntro - (4 + (100 - retentionScore) * 0.08)));

    // Mid-point drop (pacing and cut frequency effect)
    const cutBonus = cutRatePerMin >= 12 ? 3 : -5;
    const dropAtMid = Math.max(35, Math.round(dropAtQ1 - (7 - cutBonus + (hasVoiceover ? 0 : 3))));

    // Three-quarter drop
    const dropAtQ3 = Math.max(25, Math.round(dropAtMid - 9));

    // End completion
    const dropAtEnd = Math.max(18, Math.round(dropAtQ3 - 10));

    const retValues = [100, dropAtIntro, dropAtQ1, dropAtMid, dropAtQ3, dropAtEnd];
    const introTimeframe = `0-${intervals[1]}s`;
    const midTimeframe = `${intervals[2]}-${intervals[3]}s`;

    const isIntroDrop = (100 - dropAtIntro) >= 6;
    const isMidDrop = (dropAtQ1 - dropAtMid) >= 8;

    const curve: RetentionPoint[] = [
      { timestamp: formatTs(intervals[0]), retention: retValues[0], drop: false },
      { timestamp: formatTs(intervals[1]), retention: retValues[1], drop: isIntroDrop, label: `Drop 1: Intro (${introTimeframe})` },
      { timestamp: formatTs(intervals[2]), retention: retValues[2], drop: false },
      { timestamp: formatTs(intervals[3]), retention: retValues[3], drop: isMidDrop, label: `Drop 2: Pacing (${midTimeframe})` },
      { timestamp: formatTs(intervals[4]), retention: retValues[4], drop: false },
      { timestamp: formatTs(intervals[5]), retention: retValues[5], drop: false },
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

    return { curve, drops };
  }
}

export const scoringEngine = new ScoringEngine();
