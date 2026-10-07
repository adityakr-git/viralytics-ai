# VIRALYTICS AI

> **"Upload. Analyze. Optimize. Go Viral."**  
> *Core Promise: "We predict potential. We don't promise virality."*

Built with passion for hackathon innovation by **Team Go-Gitters**:
- **Aditya Kumar**
- **Virat Saroj**
- **Vishal Kumar Yadav**
- **Vipin Prajapati**

---

## 1. Product Overview

VIRALYTICS AI is an AI-powered video virality prediction & optimization platform. Before publishing a short-form video (YouTube Shorts, Instagram Reels, TikTok) or YouTube Long-form video, creators and growth teams get empirical answers to:
- Is the viral potential real?
- Is the hook strong enough (0-5s retention)?
- Is length and pacing right?
- Do caption and hashtags work?
- Is the thumbnail attractive & readable on mobile?
- Which platform fits best?
- What should be fixed first?

---

## 2. Key Architecture & Pipeline

```text
User Video Upload
       │
       ▼
[ Video Processing Engine ]
       │
       ├─► Feature Extraction Layer:
       │     ├─ Computer Vision (Cut frequency, lighting, movement, text overlay)
       │     ├─ Audio Analysis (Voice clarity, SNR, speech rate, silence ratio)
       │     ├─ Speech-to-Text & NLP (Transcript, curiosity hook score, sentiment)
       │     └─ Metadata Analysis (Duration, aspect ratio, caption, hashtags)
       │
       ▼
[ ML Prediction Engine ]
       │  (Pluggable scikit-learn / XGBoost interface + heuristic ensemble)
       ▼
[ Virality Scoring Engine ]
       │  (Weights: Retention 25%, Hook 15%, Engagement 15%, Visual 10%,
       │   Emotion 10%, Relevance 10%, Audio 5%, Caption 5%, Shareability 5%)
       │  (Dynamic Confidence: computed from coverage, SNR, heuristic bounds)
       ▼
[ TinyFish Integration Layer ]
       │  (Search API -> Trend Radar, Fetch API -> Category Benchmarks,
       │   Research API -> Platform Rules, with offline fallback cache)
       ▼
[ Recommendation & Optimizer Engine ]
       │  (Ordered findings by severity, 5 improvements, Gemini hook rewrite, edit plan)
       ▼
[ Creator Dashboard ]
```

---

## 3. Demo Fixture Single Source of Truth

When run in `DEMO_MODE=true` or when loading the demo video (`AI Tools You Need in 2026.mp4`):
- **Overall Viral Potential Score**: `87%`
- **Prediction Confidence**: `74%`
- **Retention Curve**: `[100, 92, 84, 73, 61, 49]`
- **Subscores**:
  - Hook Strength: `94`
  - Audience Retention: `82`
  - Engagement Potential: `89`
  - Visual Quality: `86`
  - Trend Match: `91`
  - Emotional Impact: `86`
  - Content Relevance: `89`
  - Audio Quality: `91`
  - Caption Quality: `82`
  - Hashtag Quality: `78`
  - Shareability: `90`
- **Category Top Benchmarks**: Retention `89`, Hook `90`, Engagement `88`
- **AI Summary**: *"Your video has strong viral potential, but the first 4 seconds can be improved."*
- **Rewritten Hook**: *"5 AI tools that do my job in 10 seconds..."*

---

## 4. Quick Start & Execution

### One-Command Start:
```bash
npm run dev
```
Runs the unified full-stack server on `http://localhost:3000`.

### Docker:
```bash
docker-compose up --build
```

---

## 5. API Endpoints

- `POST /api/videos`: Upload video file / metadata.
- `POST /api/analyses`: Trigger background analysis job.
- `GET /api/analyses/:id`: Poll background job progress stages.
- `GET /api/analyses/:id/report`: Get complete virality report.
- `POST /api/optimize`: Generate LLM hook rewrites, captions & edit plans.
- `GET /api/trends`: TinyFish Trend Radar.
- `GET /api/benchmarks`: TinyFish category benchmarks.
- `GET /api/user/usage`: Plan and analysis status (Unlimited analyses).
