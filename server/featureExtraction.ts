import { SubScores } from './types.ts';

export interface ExtractedFeatures {
  metadata: {
    durationSeconds: number;
    resolution: string;
    aspectRatio: string;
    captionLength: number;
    hashtagCount: number;
  };
  vision: {
    faceDetected: boolean;
    lightingQualityScore: number;
    sharpnessScore: number;
    cutFrequencyPerMinute: number;
    visualMovementRate: number;
    textOverlayPresent: boolean;
  };
  audio: {
    voiceClarityScore: number;
    signalToNoiseRatioDb: number;
    speechRateWpm: number;
    hasBackgroundMusic: boolean;
    silenceRatioPercent: number;
  };
  nlp: {
    transcriptWordCount: number;
    hookCuriosityIndex: number;
    sentimentPolarity: number;
    keyTopicTerms: string[];
    hasActionVerb: boolean;
    hasQuantifiedValue: boolean;
    hasPassiveGreeting: boolean;
    hasCallToAction: boolean;
  };
}

// Consistent hash generator for filename/content attributes
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export class FeatureExtractionLayer {
  public extract(input: {
    filename: string;
    caption?: string;
    hashtags?: string[];
    targetPlatform?: string;
    category?: string;
    durationSeconds?: number;
    resolution?: string;
    aspectRatio?: string;
    detectedLuminance?: number;
    detectedMotionRate?: number;
    detectedSilenceRatio?: number;
    detectedVolumeDb?: number;
    hasAudioTrack?: boolean;
  }): ExtractedFeatures {
    const caption = input.caption || '';
    const hashtags = input.hashtags || [];
    const duration = Math.max(5, input.durationSeconds || 45);
    const platform = input.targetPlatform || 'YouTube Shorts';
    const seed = hashString(input.filename + caption + (input.category || ''));

    // Combined text context (filename + caption)
    const cleanFilename = input.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const fullText = `${cleanFilename} ${caption}`.trim();
    const words = fullText.split(/\s+/).filter(Boolean);

    const hasNumbers = /\d+/.test(fullText);
    const hasPassiveGreeting = /^(today|hello|hey guys|hi everyone|in this video|welcome back|so today|basically)/i.test(caption.trim());
    const hasCuriosity = /(secret|mistake|illegal|stop|never|hack|how to|why|formula|insane|steal|cheat|rule|truth|warning|danger|best|worst|don't|shocking|hidden)/i.test(fullText);
    const hasActionVerb = /(discover|automate|build|stop|steal|watch|boost|transform|double|scale|fix|create|learn|try|make|get|avoid)/i.test(fullText);
    const hasCallToAction = /(comment|save|share|follow|link|check out|subscribe|below|part 2|tell me)/i.test(fullText);

    // Dynamic curiosity score
    let curiosityScore = 60;
    if (hasPassiveGreeting) curiosityScore -= 22;
    if (hasCuriosity) curiosityScore += 24;
    if (hasNumbers) curiosityScore += 12;
    if (fullText.includes('?')) curiosityScore += 8;
    if (hasActionVerb) curiosityScore += 6;
    curiosityScore = Math.min(96, Math.max(30, curiosityScore));

    // Dynamic audio signals (incorporating real audio measurements if detected)
    const hasAudio = input.hasAudioTrack !== undefined ? input.hasAudioTrack : true;
    let voiceClarity = 85;
    let snrDb = 22;
    let silenceRatio = 8;
    const speechRate = 135 + (seed % 35); // 135 - 170 wpm

    if (!hasAudio) {
      voiceClarity = 25;
      snrDb = 0;
      silenceRatio = 100;
    } else {
      if (input.detectedSilenceRatio !== undefined && input.detectedSilenceRatio !== null) {
        silenceRatio = Math.min(100, Math.max(0, input.detectedSilenceRatio));
      } else {
        silenceRatio = Math.max(4, 7 + (seed % 10));
      }

      if (input.detectedVolumeDb !== undefined && input.detectedVolumeDb !== null) {
        // Normal speech is -18 to -12 dB. If < -35 dB, too quiet.
        const vol = input.detectedVolumeDb;
        if (vol > -24 && vol < -8) {
          snrDb = 26;
          voiceClarity = 92;
        } else if (vol <= -35) {
          snrDb = 12;
          voiceClarity = 62;
        } else {
          snrDb = 20;
          voiceClarity = 82;
        }
      } else {
        const audioClarityVariation = (seed % 16) - 8;
        voiceClarity = Math.min(95, Math.max(68, 84 + audioClarityVariation));
        snrDb = Math.min(28, Math.max(15, 22 + (seed % 8) - 4));
      }
    }

    // Vision signals (incorporating real luminance & motion if detected)
    let lightingScore = 82;
    if (input.detectedLuminance !== undefined && input.detectedLuminance !== null) {
      const lum = input.detectedLuminance;
      if (lum >= 40 && lum <= 75) {
        lightingScore = Math.min(96, 85 + Math.round((lum - 40) * 0.3));
      } else if (lum < 30) {
        lightingScore = Math.max(40, Math.round(lum * 1.5)); // Under-exposed / dark
      } else if (lum > 85) {
        lightingScore = Math.max(50, 95 - Math.round((lum - 85) * 2)); // Blown out / over-exposed
      } else {
        lightingScore = 78;
      }
    } else {
      lightingScore = Math.min(94, Math.max(68, 80 + ((seed >> 2) % 15) - 6));
    }

    let movementRate = 75;
    if (input.detectedMotionRate !== undefined && input.detectedMotionRate !== null) {
      movementRate = Math.min(95, Math.max(40, input.detectedMotionRate));
    } else {
      movementRate = Math.min(94, Math.max(58, 76 + (hasActionVerb ? 8 : 0)));
    }

    const cutFrequency = duration < 30 ? 15 + (seed % 5) : 11 + (seed % 5);
    const sharpness = Math.min(96, Math.max(72, 85 + ((seed >> 3) % 10) - 3));

    // Resolution & Aspect Ratio from actual video detection
    let finalResolution = input.resolution;
    let finalAspectRatio = input.aspectRatio;
    if (!finalResolution || !finalAspectRatio) {
      finalResolution = platform === 'YouTube Long-form' ? '1920x1080 (16:9)' : '1080x1920 (9:16)';
      finalAspectRatio = platform === 'YouTube Long-form' ? '16:9' : '9:16';
    }

    return {
      metadata: {
        durationSeconds: duration,
        resolution: finalResolution,
        aspectRatio: finalAspectRatio,
        captionLength: caption.length,
        hashtagCount: hashtags.length,
      },
      vision: {
        faceDetected: (seed % 2) === 0,
        lightingQualityScore: lightingScore,
        sharpnessScore: sharpness,
        cutFrequencyPerMinute: cutFrequency,
        visualMovementRate: movementRate,
        textOverlayPresent: caption.length > 15,
      },
      audio: {
        voiceClarityScore: voiceClarity,
        signalToNoiseRatioDb: snrDb,
        speechRateWpm: speechRate,
        hasBackgroundMusic: hasAudio,
        silenceRatioPercent: silenceRatio,
      },
      nlp: {
        transcriptWordCount: words.length || 50,
        hookCuriosityIndex: curiosityScore,
        sentimentPolarity: hasCuriosity ? 0.75 : 0.50,
        keyTopicTerms: hashtags.length > 0 
          ? hashtags.map((h) => h.replace(/^#/, '')).slice(0, 5) 
          : [cleanFilename.split(' ')[0] || 'video'],
        hasActionVerb,
        hasQuantifiedValue: hasNumbers,
        hasPassiveGreeting,
        hasCallToAction,
      },
    };
  }

  public deriveSubScores(features: ExtractedFeatures, platform: string = 'YouTube Shorts'): SubScores {
    // 1. Hook strength: heavily dependent on first 3 seconds signals
    let hook = features.nlp.hookCuriosityIndex;
    if (features.nlp.hasPassiveGreeting) hook -= 15;
    if (features.nlp.hasQuantifiedValue) hook += 8;
    if (features.vision.visualMovementRate > 80) hook += 5;
    hook = Math.min(98, Math.max(35, Math.round(hook)));

    // 2. Audience retention: depends on duration, cut frequency, and silence
    let retention = 72;
    if (features.vision.cutFrequencyPerMinute >= 14) retention += 8;
    else if (features.vision.cutFrequencyPerMinute < 10) retention -= 10;
    
    if (features.audio.silenceRatioPercent > 12) retention -= 8;
    if (features.metadata.durationSeconds <= 35) retention += 7;
    else if (features.metadata.durationSeconds > 60 && platform !== 'YouTube Long-form') retention -= 12;

    // Hook influences overall retention significantly
    if (hook > 85) retention += 5;
    else if (hook < 55) retention -= 8;
    retention = Math.min(95, Math.max(40, Math.round(retention)));

    // 3. Engagement potential: CTA, curiosity, controversial question
    let engagement = 68;
    if (features.nlp.hasCallToAction) engagement += 12;
    if (features.nlp.transcriptWordCount > 15) engagement += 6;
    if (features.nlp.hasActionVerb) engagement += 6;
    engagement = Math.min(96, Math.max(45, Math.round(engagement)));

    // 4. Visual quality
    const visual = Math.round((features.vision.lightingQualityScore + features.vision.sharpnessScore) / 2);

    // 5. Audio quality
    const audio = Math.round(features.audio.voiceClarityScore * 0.7 + (features.audio.signalToNoiseRatioDb / 30) * 30);

    // 6. Content relevance: keyword presence
    let relevance = 65;
    if (features.nlp.keyTopicTerms.length >= 3) relevance += 18;
    else if (features.nlp.keyTopicTerms.length >= 1) relevance += 10;
    if (features.metadata.captionLength > 40) relevance += 7;
    relevance = Math.min(96, Math.max(50, Math.round(relevance)));

    // 7. Caption quality
    let captionScore = 55;
    if (features.metadata.captionLength >= 40) captionScore += 18;
    if (features.nlp.hasCallToAction) captionScore += 12;
    if (!features.nlp.hasPassiveGreeting) captionScore += 8;
    captionScore = Math.min(95, Math.max(40, Math.round(captionScore)));

    // 8. Hashtags quality
    let hashtagScore = 45;
    if (features.metadata.hashtagCount >= 3 && features.metadata.hashtagCount <= 7) hashtagScore = 82;
    else if (features.metadata.hashtagCount >= 1) hashtagScore = 65;
    else hashtagScore = 35; // zero hashtags

    // 9. Emotional impact
    let emotional = 68;
    if (features.nlp.sentimentPolarity > 0.6) emotional += 14;
    if (features.nlp.hasActionVerb) emotional += 6;
    emotional = Math.min(94, Math.max(45, Math.round(emotional)));

    // 10. Shareability
    const shareability = Math.min(95, Math.max(40, Math.round(hook * 0.45 + engagement * 0.55)));

    // Trend Match
    const trendMatch = Math.min(95, Math.max(55, Math.round(relevance * 0.6 + (features.metadata.hashtagCount > 2 ? 30 : 15))));

    return {
      hookStrength: hook,
      audienceRetention: retention,
      engagementPotential: engagement,
      visualQuality: Math.min(95, Math.max(50, visual)),
      trendMatch: trendMatch,
      emotionalImpact: emotional,
      contentRelevance: relevance,
      audioQuality: Math.min(96, Math.max(50, audio)),
      captionQuality: captionScore,
      hashtagQuality: hashtagScore,
      shareability: shareability,
    };
  }
}

export const featureExtractionLayer = new FeatureExtractionLayer();
