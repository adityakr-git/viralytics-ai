import { GoogleGenAI } from '@google/genai';
import { 
  Finding, 
  HookComparison, 
  OptimizedPackage, 
  PlatformFitItem, 
  SubScores 
} from './types.ts';

export class RecommendationEngine {
  private genAI: GoogleGenAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
      try {
        this.genAI = new GoogleGenAI();
      } catch (e) {
        console.warn('[RecommendationEngine] Could not initialize GoogleGenAI:', e);
      }
    }
  }

  public extractTopicName(filename: string = '', caption: string = '', category: string = ''): string {
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

  public generateFindings(
    scores: SubScores, 
    caption: string, 
    durationSeconds: number,
    filename: string = '',
    platform: string = 'YouTube Shorts',
    aspectRatio: string = '9:16',
    lightingScore: number = 82,
    hasAudio: boolean = true
  ): Finding[] {
    const findings: Finding[] = [];
    const topic = this.extractTopicName(filename, caption);
    const hasPassive = /^(today|hello|hey guys|hi everyone|in this video|welcome back|so today|basically)/i.test(caption.trim());

    // 1. Hook findings
    if (hasPassive || scores.hookStrength < 70) {
      findings.push({
        id: 'f1',
        title: 'Opening contains passive delay before delivering value',
        severity: 'critical',
        category: 'Hook Quality',
        action: 'Cut the greeting completely; lead immediately with the core payoff or high-stakes visual outcome in frame 1.',
      });
    } else if (scores.hookStrength >= 85) {
      findings.push({
        id: 'f1-good',
        title: 'First 2 seconds contain strong curiosity and pattern interrupt',
        severity: 'good',
        category: 'Hook Quality',
        action: 'Maintain this high-energy opening velocity in future videos.',
      });
    } else {
      findings.push({
        id: 'f1-warn',
        title: 'Hook curiosity is moderate — high drop-off risk at 0-3s mark',
        severity: 'warning',
        category: 'Hook Quality',
        action: 'Add a bold curiosity question, contrast trigger, or quantifiable number in the first frame.',
      });
    }

    // 2. Aspect Ratio & Platform Match
    const isHorizontal = aspectRatio.includes('16:9');
    const isVerticalTarget = platform !== 'YouTube Long-form';
    if (isHorizontal && isVerticalTarget) {
      findings.push({
        id: 'f-aspect',
        title: 'Aspect ratio mismatch: 16:9 horizontal video in vertical feed',
        severity: 'critical',
        category: 'Format Packaging',
        action: 'Re-crop or export as 9:16 vertical (1080x1920) to avoid heavy black letterbox bars in mobile feeds.',
      });
    } else if (!isHorizontal && platform === 'YouTube Long-form') {
      findings.push({
        id: 'f-aspect-long',
        title: 'Vertical 9:16 video uploaded to YouTube Long-form',
        severity: 'warning',
        category: 'Format Packaging',
        action: 'Consider publishing as a YouTube Short instead, or add side blurred filler for widescreen players.',
      });
    }

    // 3. Duration & Retention
    if (durationSeconds > 60 && platform === 'YouTube Shorts') {
      findings.push({
        id: 'f-dur-limit',
        title: `${durationSeconds}s exceeds YouTube Shorts 60-second limit`,
        severity: 'critical',
        category: 'Pacing & Retention',
        action: `Trim ${durationSeconds - 60} seconds of filler or split into a 2-part series to qualify for Shorts feed.`,
      });
    } else if (durationSeconds > 45 && isVerticalTarget) {
      findings.push({
        id: 'f2',
        title: `${durationSeconds}s duration is longer than the 25-40s retention sweet spot`,
        severity: 'warning',
        category: 'Pacing & Retention',
        action: `Accelerate pacing: trim monologue pauses or B-roll by ${Math.round(durationSeconds * 0.15)} seconds.`,
      });
    } else if (scores.audienceRetention < 75) {
      findings.push({
        id: 'f2-drop',
        title: 'Mid-video viewer decay risk detected around the halfway mark',
        severity: 'critical',
        category: 'Pacing & Retention',
        action: 'Introduce a pattern interrupt (zoom-in, sound effect whoosh, or kinetic caption card) every 3-4 seconds.',
      });
    } else {
      findings.push({
        id: 'f2-good',
        title: 'Pacing velocity matches high-retention algorithmic benchmarks',
        severity: 'good',
        category: 'Pacing & Retention',
        action: 'Pacing and duration are well balanced for optimal audience completion.',
      });
    }

    // 4. Audio Quality
    if (!hasAudio) {
      findings.push({
        id: 'f-audio-silent',
        title: 'No audio track or dialogue detected in video',
        severity: 'critical',
        category: 'Audio Quality',
        action: 'Add voiceover commentary, sound effects, or a high-energy trending background track.',
      });
    } else if (scores.audioQuality < 75) {
      findings.push({
        id: 'f3',
        title: 'Audio signal has noticeable room reverb or low clarity',
        severity: 'warning',
        category: 'Audio Quality',
        action: 'Apply gentle vocal isolation and normalize speech volume to -14 LUFS for punchy mobile playback.',
      });
    } else {
      findings.push({
        id: 'f3-good',
        title: 'Crisp vocal clarity with clean signal-to-noise separation',
        severity: 'good',
        category: 'Audio Quality',
        action: 'Dialogue intelligibility is high across phone speakers and headphones.',
      });
    }

    // 5. Visual Lighting
    if (lightingScore < 60) {
      findings.push({
        id: 'f-light-dark',
        title: 'Video frame is under-exposed or dimly lit (<40% luminance)',
        severity: 'warning',
        category: 'Visual Packaging',
        action: 'Increase exposure and shadow brightness in editing, or add a ring light/key light when filming.',
      });
    } else {
      findings.push({
        id: 'f-light-good',
        title: 'Balanced lighting and contrast for mobile screen readability',
        severity: 'good',
        category: 'Visual Packaging',
        action: 'Subject is clearly illuminated and stands out against the background.',
      });
    }

    // 6. Trend & Topic Alignment
    findings.push({
      id: 'f6',
      title: `Content aligns with trending interest in ${topic}`,
      severity: 'good',
      category: 'Trend Radar',
      action: 'Publish during peak mobile activity windows (12-2 PM or 6-9 PM local) to accelerate early algorithmic testing.',
    });

    const orderMap: Record<string, number> = { critical: 0, warning: 1, good: 2 };
    return findings.sort((a, b) => orderMap[a.severity] - orderMap[b.severity]);
  }

  public getImprovements(caption: string, durationSeconds: number): string[] {
    const hasPassive = /^(today|hello|hey|welcome|in this video)/i.test(caption.trim());
    const trimAmount = Math.max(2, Math.round(durationSeconds * 0.12));
    return [
      hasPassive ? 'Cut intro greeting completely (jump straight to payoff)' : 'Trim first 1.5 seconds of dead air',
      'Start with the finished result or peak moment in frame 1',
      'Increase kinetic subtitle size to 64pt in safe center zone',
      durationSeconds > 40 ? `Trim ${trimAmount}s of mid-video monologue pauses` : 'Add B-roll pattern interrupt at halfway point',
      'Add a clear action prompt (comment or save for later)',
    ];
  }

  public getHookComparison(caption: string = '', category?: string, filename: string = ''): HookComparison {
    const topic = this.extractTopicName(filename, caption, category);
    const cleanFilename = filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    let orig = caption.trim();
    if (!orig || orig.length < 10) {
      if (topic === 'Fitness & Health') orig = `Hey guys, today I am showing you my routine for ${cleanFilename || 'workout'}...`;
      else if (topic === 'Food & Cooking') orig = `Welcome back! Today we are making ${cleanFilename || 'this recipe'} at home...`;
      else if (topic === 'Gaming & Esports') orig = `Check out this crazy clutch gameplay I got in ${cleanFilename || 'this match'}...`;
      else if (topic === 'Entertainment & Comedy') orig = `So basically this happened to me today and it was super weird...`;
      else if (topic === 'Travel & Adventure') orig = `Hey everyone, today we are visiting ${cleanFilename || 'this place'} on our trip...`;
      else if (topic === 'Lifestyle & Vlog') orig = `Good morning guys, welcome to a day in my life vlog...`;
      else if (topic === 'Music & Dance') orig = `Hey guys, here is my cover / dance to this song...`;
      else if (topic === 'Fashion & Beauty') orig = `Get ready with me today as we try out this new look...`;
      else if (topic === 'Business & Finance') orig = `In this video I want to explain how I made money with this idea...`;
      else if (topic === 'Education & How-To') orig = `Today I am going to teach you an interesting fact about this topic...`;
      else if (topic === 'Tech & Productivity') orig = `Here are some cool tools and software you should check out...`;
      else orig = `Hey guys, in this video I am going to talk about ${cleanFilename || 'this topic'}...`;
    }

    let origScore = 48;
    if (/^(today|hello|hey|welcome|in this video|hi guys|so basically|good morning)/i.test(orig)) origScore -= 16;
    if (/\d+/.test(orig)) origScore += 12;
    if (/(secret|mistake|illegal|stop|never|hack|how to|why|don't|worst|best|shocking)/i.test(orig)) origScore += 18;
    if (orig.includes('?')) origScore += 8;
    if (orig.length > 20 && orig.length < 80) origScore += 6;
    origScore = Math.min(88, Math.max(32, origScore));

    let improved = '99% of people do this completely WRONG...';
    let hookType = 'Negative Constraint & High Urgency Warning';

    if (topic === 'Fitness & Health') {
      improved = 'Stop doing this exercise until you fix this 1 mistake...';
      hookType = 'Injury Prevention & Immediate Form Intervention';
    } else if (topic === 'Food & Cooking') {
      improved = 'The 1 restaurant secret that makes this taste 10x better...';
      hookType = 'Insider Secret & Sensory Taste Payoff';
    } else if (topic === 'Gaming & Esports') {
      improved = '99% of players don\'t know this hidden clutch mechanic...';
      hookType = 'Skill Discrepancy & Secret Meta Exploit';
    } else if (topic === 'Entertainment & Comedy') {
      improved = 'POV: You try this once and immediately regret everything...';
      hookType = 'High Relatability & Curiosity Contrast';
    } else if (topic === 'Travel & Adventure') {
      improved = 'Do NOT visit this place without knowing this 1 hidden rule...';
      hookType = 'Urgent Travel Warning & Insider Safety';
    } else if (topic === 'Lifestyle & Vlog') {
      improved = 'The 2-minute morning habit that permanently fixed my routine...';
      hookType = 'Micro-Commitment & Aspirational Result';
    } else if (topic === 'Music & Dance') {
      improved = 'Wait for the beat drop at 0:02... (headphones recommended)';
      hookType = 'Pattern Interruption & Sensory Anticipation';
    } else if (topic === 'Fashion & Beauty') {
      improved = 'Stop buying the $80 version when this $9 dupe does this...';
      hookType = 'Price Discrepancy & Friction-Free Hack';
    } else if (topic === 'Business & Finance') {
      improved = 'How I made $1,000 in 48 hours without spending a dime...';
      hookType = 'Concrete Proof & Zero-Friction Hook';
    } else if (topic === 'Education & How-To') {
      improved = 'Why did nobody teach us this in school? 30-second breakdown...';
      hookType = 'Forbidden Knowledge & Instant Clarity';
    } else if (topic === 'Tech & Productivity') {
      improved = 'Stop doing this manually. 3 tools that save 10 hours a week...';
      hookType = 'Pain Point Relief & Quantified Time-Save';
    }

    return {
      original: orig,
      originalScore: origScore,
      improved: improved,
      improvedScore: 92,
      hookType: hookType,
      auditFindings: [
        origScore < 60 
          ? "Original opening contains delay friction before value proposition is delivered."
          : "Original opening has moderate intrigue, but lacks extreme contrast or concrete stakes.",
        `Rewritten version establishes immediate high-stakes curiosity ('${improved.slice(0, 35)}...') within frame 1.`,
      ],
    };
  }

  public getPlatformFit(durationSeconds: number = 45, aspectRatio: string = '9:16'): PlatformFitItem[] {
    const isHorizontal = aspectRatio.includes('16:9');
    const isShort = durationSeconds <= 60;

    if (isHorizontal) {
      return [
        {
          platform: 'YouTube Long-form',
          fitScore: 94,
          recommended: true,
          reason: '16:9 widescreen format matches standard desktop and TV viewing expectations.',
          optimalLength: '8-14 min',
          aspectRatio: '16:9',
        },
        {
          platform: 'YouTube Shorts',
          fitScore: 45,
          recommended: false,
          reason: '16:9 horizontal video displays with heavy black letterbox bars in vertical Shorts.',
          optimalLength: '35-50s',
          aspectRatio: '9:16 (Requires Crop)',
        },
        {
          platform: 'TikTok',
          fitScore: 42,
          recommended: false,
          reason: 'Horizontal video significantly underperforms in TikTok\'s full-screen 9:16 feed.',
          optimalLength: '20-40s',
          aspectRatio: '9:16 (Requires Crop)',
        },
        {
          platform: 'Instagram Reels',
          fitScore: 40,
          recommended: false,
          reason: 'Reels algorithm favors 9:16 full-screen native vertical video format.',
          optimalLength: '25-45s',
          aspectRatio: '9:16 (Requires Crop)',
        },
      ];
    }

    return [
      {
        platform: 'YouTube Shorts',
        fitScore: isShort ? 94 : 48,
        recommended: isShort,
        reason: isShort 
          ? `${durationSeconds}s vertical format fits Shorts algorithm watch-time completion benchmark.`
          : `${durationSeconds}s exceeds Shorts 60-second hard limit.`,
        optimalLength: '35-50s',
        aspectRatio: '9:16',
      },
      {
        platform: 'TikTok',
        fitScore: isShort ? 91 : 85,
        recommended: !isShort, // TikTok supports up to 10m
        reason: 'Native 9:16 format aligns with TikTok feed; maintain cuts every 2.5s for peak push.',
        optimalLength: '20-40s',
        aspectRatio: '9:16',
      },
      {
        platform: 'Instagram Reels',
        fitScore: isShort ? 88 : 75,
        recommended: false,
        reason: 'Visual presentation fits Reels well; add an explicit "Save this for later" call-to-action.',
        optimalLength: '25-45s',
        aspectRatio: '9:16',
      },
      {
        platform: 'YouTube Long-form',
        fitScore: 38,
        recommended: false,
        reason: 'Vertical 9:16 aspect ratio displays with pillarbox bars on widescreen YouTube players.',
        optimalLength: '8-14 min',
        aspectRatio: '16:9 (Requires Landscape)',
      },
    ];
  }

  public async generateOptimizedPackage(params: {
    filename?: string;
    caption: string;
    hashtags: string[];
    category: string;
    targetPlatform: string;
    durationSeconds: number;
  }): Promise<OptimizedPackage> {
    const duration = Math.max(5, params.durationSeconds || 45);
    const filename = params.filename || '';
    const topic = this.extractTopicName(filename, params.caption, params.category);

    let rewrittenHook = '99% of people do this completely WRONG...';
    let improvedCaption = `Stop doing this the hard way. Here is the exact framework to fix it in minutes. Save this before algorithm shifts! 🚀 Which part was most helpful?`;
    let optimizedHashtags = ['#ViralTips', '#CreatorHacks', '#MustWatch', '#ProTips', '#Trending'];
    let thumbText = 'DO THIS (NOT THAT)';
    let thumbComp = 'High-contrast vibrant yellow typography on left 65%, expressive reaction frame on right third, dark vignette.';

    if (topic === 'Fitness & Health') {
      rewrittenHook = 'Stop doing this exercise until you fix this 1 mistake...';
      improvedCaption = 'Most people ruin their form on rep 3. Save this guide for your next gym session! 🏋️ Which exercise should I break down next?';
      optimizedHashtags = ['#FitnessTips', '#GymTok', '#WorkoutForm', '#StrengthTraining', '#FitnessMotivation'];
      thumbText = 'STOP DOING THIS (FIX FORM)';
      thumbComp = 'High-contrast red & white typography on top half, split-screen incorrect vs correct form demonstration below.';
    } else if (topic === 'Food & Cooking') {
      rewrittenHook = 'The 1 restaurant secret that makes this taste 10x better...';
      improvedCaption = 'Never make this dish without this 1 secret ingredient. Save this recipe for dinner tonight! 🍳 Tap save to cook later!';
      optimizedHashtags = ['#Foodie', '#CookingHacks', '#EasyRecipes', '#ChefSecrets', '#DinnerInspo'];
      thumbText = 'SECRET INGREDIENT REVEALED';
      thumbComp = 'Close-up sizzling hero shot of the finished dish with bold yellow text overlay across center top.';
    } else if (topic === 'Gaming & Esports') {
      rewrittenHook = '99% of players don\'t know this hidden clutch mechanic...';
      improvedCaption = 'This 1 setting completely changes your aim and movement. Tag your duo partner who needs to see this! 🎮';
      optimizedHashtags = ['#GamingShorts', '#ClutchMoment', '#GamerTips', '#GameHighlights', '#ProSettings'];
      thumbText = 'PROS NEVER REVEAL THIS';
      thumbComp = 'In-game high-action crosshair zoom with electric neon cyan border and bold uppercase warning.';
    } else if (topic === 'Entertainment & Comedy') {
      rewrittenHook = 'POV: You try this once and immediately regret everything...';
      improvedCaption = 'Why is this so embarrassingly relatable? 😂 Share this with someone who does this every single time!';
      optimizedHashtags = ['#ComedyReels', '#Relatable', '#POV', '#Humor', '#TrendingAudio'];
      thumbText = 'I WAS NOT READY FOR THIS';
      thumbComp = 'Freeze-frame of peak shocked facial expression with large white subtitle and skull emoji.';
    } else if (topic === 'Travel & Adventure') {
      rewrittenHook = 'Do NOT visit this place without knowing this 1 hidden rule...';
      improvedCaption = 'Save this for your 2026 travel bucket list before prices surge! ✈️ Comment "GUIDE" and I\'ll send the budget breakdown.';
      optimizedHashtags = ['#TravelTips', '#HiddenGem', '#Wanderlust', '#TravelHacks', '#BudgetTravel'];
      thumbText = 'DO NOT GO HERE WITHOUT THIS';
      thumbComp = 'Breathtaking landscape with subtle dark vignette and high-contrast yellow typography.';
    } else if (topic === 'Lifestyle & Vlog') {
      rewrittenHook = 'The 2-minute morning habit that permanently fixed my routine...';
      improvedCaption = 'The small shifts that actually make a difference. Save this for your weekly reset routine! ☀️ What is your #1 habit?';
      optimizedHashtags = ['#MiniVlog', '#DailyRoutine', '#Aesthetic', '#LifeReset', '#ProductiveDay'];
      thumbText = 'THE 2-MINUTE SHIFT';
      thumbComp = 'Clean minimalist aesthetic frame with warm sunlight and sleek typography in center-third safe area.';
    } else if (topic === 'Music & Dance') {
      rewrittenHook = 'Wait for the beat drop at 0:02... (headphones recommended)';
      improvedCaption = 'This transition took 4 hours to sync perfectly. Turn volume up! 🎧 Let me know your favorite part in the comments!';
      optimizedHashtags = ['#DanceChallenge', '#BeatDrop', '#ViralAudio', '#MusicCreator', '#TrendingTrack'];
      thumbText = 'WAIT FOR THE DROP 🎧';
      thumbComp = 'Dynamic motion freeze-frame with vibrant colored stage lighting and bold glowing text.';
    } else if (topic === 'Fashion & Beauty') {
      rewrittenHook = 'Stop buying the $80 version when this $9 dupe does this...';
      improvedCaption = 'Tested both side by side so you don\'t waste your money! 💄 Save this before your next shopping haul!';
      optimizedHashtags = ['#BeautyHacks', '#AffordableDupes', '#GRWM', '#SkincareTips', '#OutfitInspo'];
      thumbText = '$9 DUPE VS $80 ORIGINAL';
      thumbComp = 'Split-screen high-resolution product swatch comparison with crisp contrast ratio.';
    } else if (topic === 'Business & Finance') {
      rewrittenHook = 'How I made $1,000 in 48 hours without spending a dime...';
      improvedCaption = 'Stop trading hours for pennies. These automated workflows handle the heavy lifting on autopilot. 💰 Comment "GUIDE" for the breakdown!';
      optimizedHashtags = ['#SideHustle', '#MakeMoneyOnline', '#BusinessTips', '#PassiveIncome', '#Entrepreneur'];
      thumbText = '$1,000 IN 48 HOURS';
      thumbComp = 'High-contrast verified dashboard screenshot proof on left, presenter pointing gesture on right.';
    } else if (topic === 'Education & How-To') {
      rewrittenHook = 'Why did nobody teach us this in school? 30-second breakdown...';
      improvedCaption = 'The easiest way to understand this concept in under a minute. Save this to study later! 📚 Tag a friend!';
      optimizedHashtags = ['#LearnOnTikTok', '#LifeHacks', '#DidYouKnow', '#SkillShare', '#QuickTutorial'];
      thumbText = 'THEY NEVER TAUGHT THIS';
      thumbComp = 'Bold question mark graphic with clean minimalist diagram and vibrant color accents.';
    } else if (topic === 'Tech & Productivity') {
      rewrittenHook = 'Stop doing this manually. 3 tools that save 10 hours a week...';
      improvedCaption = 'Stop wasting 15+ hours on repetitive work. These tools handle it on autopilot. ⚡ Save this before the update!';
      optimizedHashtags = ['#ProductivityHacks', '#TechTips2026', '#WorkflowAutomation', '#UsefulWebsites', '#TimeSaver'];
      thumbText = 'STOP DOING THIS MANUALLY';
      thumbComp = 'Screen recording split with high-contrast text and bright highlight on the key button.';
    }

    const formatTime = (s: number) => {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const s1End = Math.max(1, Math.min(3, Math.round(duration * 0.08)));
    const s2End = Math.max(3, Math.round(duration * 0.30));
    const s3End = Math.max(5, Math.round(duration * 0.60));
    const s4End = Math.max(7, Math.round(duration * 0.85));

    const defaultPackage: OptimizedPackage = {
      rewrittenHook,
      improvedCaption,
      optimizedHashtags,
      thumbnailSuggestion: {
        text: thumbText,
        composition: thumbComp,
        contrastRatio: '6.8:1 (Excellent mobile readability)',
      },
      editPlan: [
        { 
          step: 1, 
          timestamp: `0:00 - ${formatTime(s1End)}`, 
          instruction: `Trim intro pauses completely; lead with visual payoff of '${rewrittenHook.slice(0, 32)}...' in frame 1.` 
        },
        { 
          step: 2, 
          timestamp: `${formatTime(s1End)} - ${formatTime(s2End)}`, 
          instruction: `Overlay kinetic high-contrast subtitles (font: Montserrat/Inter ExtraBold, 64pt) within mobile safe-zone.` 
        },
        { 
          step: 3, 
          timestamp: `${formatTime(s2End)} - ${formatTime(s3End)}`, 
          instruction: `Insert a rapid zoom-in, B-roll cut, or visual card to break eye-tracking fatigue.` 
        },
        { 
          step: 4, 
          timestamp: `${formatTime(s3End)} - ${formatTime(s4End)}`, 
          instruction: `Apply speech isolation (+3dB voice boost) to ensure vocal track cuts clearly through mobile phone speakers.` 
        },
        { 
          step: 5, 
          timestamp: `${formatTime(s4End)} - ${formatTime(duration)}`, 
          instruction: `Add pinned comment reminder and visual on-screen pointer prompting viewers to save or comment.` 
        },
      ],
    };

    // If Gemini API is active, call gemini-3.8-flash for tailored intelligence
    if (this.genAI && (params.caption || params.filename)) {
      try {
        const prompt = `You are VIRALYTICS AI, an expert video virality engine for ${params.targetPlatform}.
Video Information:
- Filename: ${params.filename || 'video.mp4'}
- Detected Topic: ${topic}
- Category: ${params.category}
- Duration: ${params.durationSeconds}s
- Original Caption/Script: "${params.caption}"
- Hashtags: ${params.hashtags.join(' ')}

Generate a tailored JSON response for this video topic:
{
  "rewrittenHook": "Ultra-catchy 1-sentence opening hook under 12 words tailored to this specific video",
  "improvedCaption": "Punchy 2-sentence caption with an engaging call to action tailored to this specific topic",
  "optimizedHashtags": ["#5", "#specific", "#viral", "#hashtags", "#here"],
  "thumbnailSuggestion": {
    "text": "3-5 WORD UPPERCASE BOLD THUMBNAIL TEXT",
    "composition": "Visual composition and color instruction for this specific video",
    "contrastRatio": "6.8:1 (High Contrast)"
  },
  "editPlan": [
    {"step": 1, "timestamp": "0:00 - ${formatTime(s1End)}", "instruction": "custom cut instruction for opening"},
    {"step": 2, "timestamp": "${formatTime(s1End)} - ${formatTime(s2End)}", "instruction": "custom subtitle / pacing instruction"},
    {"step": 3, "timestamp": "${formatTime(s2End)} - ${formatTime(s3End)}", "instruction": "custom visual pattern interrupt instruction"},
    {"step": 4, "timestamp": "${formatTime(s3End)} - ${formatTime(s4End)}", "instruction": "custom audio / B-roll instruction"},
    {"step": 5, "timestamp": "${formatTime(s4End)} - ${formatTime(duration)}", "instruction": "custom CTA end screen instruction"}
  ]
}
Respond ONLY with valid JSON.`;

        const res = await this.genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const text = res.text?.trim() || '';
        const cleanJson = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.rewrittenHook && parsed.editPlan) {
          return {
            rewrittenHook: parsed.rewrittenHook,
            improvedCaption: parsed.improvedCaption || defaultPackage.improvedCaption,
            optimizedHashtags: parsed.optimizedHashtags || defaultPackage.optimizedHashtags,
            thumbnailSuggestion: parsed.thumbnailSuggestion || defaultPackage.thumbnailSuggestion,
            editPlan: parsed.editPlan || defaultPackage.editPlan,
          };
        }
      } catch (err) {
        console.warn('[RecommendationEngine] Gemini optimization fallback:', err);
      }
    }

    return defaultPackage;
  }
}

export const recommendationEngine = new RecommendationEngine();
