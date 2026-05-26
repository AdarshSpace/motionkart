"use client";

import { useState } from "react";
import {
  X, Sparkles, ChevronRight, Play,
  TrendingUp, Briefcase, Layers, Zap, Film, Monitor,
  Megaphone, Gamepad2, Globe, Star, Eye, Clock3, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

// ─── MOTION DESIGN FRAMEWORKS ───────────────────────────────────────────────
const frameworks = [
  {
    title: "Hierarchy",
    icon: Eye,
    tag: "Attention Control",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    desc:
      "Guide where viewers look first, second, and third. Use scale, motion intensity, contrast, and timing to direct attention.",
    examples: [
      "Product reveals",
      "YouTube intros",
      "UI animations",
    ],
    tip:
      "If everything moves equally, nothing feels important.",
  },

  {
    title: "Timing",
    icon: Clock3,
    tag: "Perceived Quality",
    color: "bg-orange-50 text-orange-700 border-orange-100",
    desc:
      "Good motion is rarely about speed. Fast → energy. Slow → premium. Hold → anticipation.",
    examples: [
      "12–16 frame transitions",
      "Ease curves",
      "Speed ramps",
    ],
    tip:
      "Most beginner animations are too fast.",
  },

  {
    title: "Layering",
    icon: Layers,
    tag: "Depth & Story",
    color: "bg-violet-50 text-violet-700 border-violet-100",
    desc:
      "Foreground, midground, and background motion create cinematic depth in Blender and AE.",
    examples: [
      "Camera parallax",
      "DOF",
      "Object separation",
    ],
    tip:
      "Move multiple layers at different speeds.",
  },

  {
    title: "Color & Mood",
    icon: Palette,
    tag: "Visual Emotion",
    color: "bg-teal-50 text-teal-700 border-teal-100",
    desc:
      "Color determines feeling before motion starts. Warm = energy. Cool = premium. Muted = cinematic.",
    examples: [
      "Brand videos",
      "Title sequences",
      "Social ads",
    ],
    tip:
      "Reduce saturation before increasing complexity.",
  },
];

export function MotionDesignFrameworks() {
  const [active, setActive] = useState(0);

  const item = frameworks[active];
  const Icon = item.icon;

  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Thinking Like a Motion Designer
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Learn creative decisions — not just software buttons
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-[#0039a6]" />
        </div>

        {/* Pills */}

        <div className="flex flex-wrap gap-2 mb-5">
          {frameworks.map((f, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                px-3
                py-2
                rounded-full
                border
                text-xs
                font-semibold
                transition

                ${
                  active === i
                    ? "bg-[#0039a6] text-white border-[#0039a6]"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }
              `}
            >
              {f.title}
            </button>
          ))}
        </div>

        {/* Detail */}

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#0039a6]" />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                {item.title}
              </h3>

              <span
                className={`
                  inline-block
                  mt-1
                  px-2
                  py-1
                  rounded-full
                  text-[10px]
                  border
                  font-semibold
                  ${item.color}
                `}
              >
                {item.tag}
              </span>
            </div>

          </div>

          <p className="text-sm text-slate-600 leading-7 mb-5">
            {item.desc}
          </p>

          <div className="mb-5">
            <p className="text-xs font-bold text-slate-700 mb-2">
              Used In
            </p>

            <div className="flex flex-wrap gap-2">
              {item.examples.map((e) => (
                <span
                  key={e}
                  className="px-2 py-1 rounded-md text-[11px]
                  bg-white border text-slate-500"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#0039a6]/5 p-4 border border-[#0039a6]/10">
            <p className="text-xs font-semibold text-[#0039a6]">
              Pro Insight
            </p>

            <p className="text-sm text-slate-600 mt-1">
              {item.tip}
            </p>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <Card className="bg-[#0039a6] text-white overflow-hidden border-none shadow-xl mb-6 relative">
      <CardContent className="p-0 flex h-72">
        <div className="flex-1 p-10 flex flex-col justify-center">
          <p className="text-blue-200 text-sm font-medium mb-2">Welcome to the Studio</p>
          <h1 className="text-4xl font-bold mb-3 leading-tight">
            Motion Design <br />& 3D Animation
          </h1>
          <p className="text-blue-100 max-w-md opacity-80 text-sm leading-relaxed">
            Learn the craft behind commercials, title sequences, social media content, and interactive visuals — using industry tools like Blender.
          </p>
          <div className="flex gap-3 mt-5">
            <Badge className="bg-white/20 text-white border-none text-xs px-3 py-1">Blender 4.x</Badge>
            <Badge className="bg-white/20 text-white border-none text-xs px-3 py-1">After Effects</Badge>
            <Badge className="bg-white/20 text-white border-none text-xs px-3 py-1">Real-world Projects</Badge>
          </div>
        </div>

        <div className="w-[420px] relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] border border-white rounded-full" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center py-0 pl-0 pr-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full shadow-2xl py-0">
              <div className="w-full">
                <iframe
                  src="https://player.mux.com/O01kuuQR9m7Or7t6seBxdw7E00sqGSW485EMFP2e01Hkfk?metadata-video-title=happy-editing&video-title=happy-editing"
                  style={{ width: "100%", border: "none", height: "100%", aspectRatio: "16/9" }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  className="w-full"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── INDUSTRY SNAPSHOT ───────────────────────────────────────────────────────

export function IndustrySnapshot() {
  const stats = [
    { value: "$76K+", label: "Avg. annual salary", sub: "Motion Designer (US)" },
    { value: "Free", label: "Blender is open source", sub: "Rivals $4K/yr software" },
    { value: "2026", label: "Fastest-growing trend", sub: "AI + handcraft hybrid" },
    { value: "100%", label: "Remote-friendly", sub: "Freelance & studio roles" },
  ];

  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">The Industry in Numbers</h2>
            <p className="text-xs text-slate-400 mt-1">Why motion design & Blender is worth learning right now</p>
          </div>
          <TrendingUp className="w-5 h-5 text-[#0039a6]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <p className="text-2xl font-bold text-[#0039a6]">{s.value}</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">{s.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── ANIMATION TECHNIQUES ────────────────────────────────────────────────────

const techniques = [
  {
    name: "Kinetic Typography",
    tag: "2D / 3D",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-[#0039a6]",
    desc: "Animate text to carry rhythm, emotion, and meaning. Used in trailers, ads, and social content.",
    tools: ["After Effects", "Blender"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80",
  },
  {
    name: "Procedural Animation",
    tag: "Geometry Nodes",
    color: "bg-orange-50 text-orange-700 border-orange-100",
    dot: "bg-[#f4613b]",
    desc: "Drive complex organic motion with logic rather than keyframes — flowers blooming, particles swarming, liquids flowing.",
    tools: ["Blender GeoNodes"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
  },
  {
    name: "2.5D Hybrid Animation",
    tag: "Mixed Media",
    color: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
    desc: "Combine flat 2D illustration with 3D depth and lighting for a modern aesthetic seen in studios like Buck and Oddfellows.",
    tools: ["Blender", "After Effects", "Illustrator"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
  },
  {
    name: "Physics Simulation",
    tag: "VFX",
    color: "bg-teal-50 text-teal-700 border-teal-100",
    dot: "bg-teal-500",
    desc: "Realistic cloth, fluid, rigid-body, and smoke simulations that make scenes feel grounded and cinematic.",
    tools: ["Blender Mantaflow", "Rigid Body"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
];

export function AnimationTechniques() {
  const [active, setActive] = useState(0);
  const t = techniques[active];

  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Core Techniques to Master</h2>
            <p className="text-xs text-slate-400 mt-1">The building blocks every motion designer needs</p>
          </div>
          <Layers className="w-5 h-5 text-[#0039a6]" />
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {techniques.map((tech, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                active === i
                  ? "bg-[#0039a6] text-white border-[#0039a6]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active === i ? "bg-white" : tech.dot}`} />
              {tech.name}
            </button>
          ))}
        </div>

        {/* Detail Card */}
        <div className="flex gap-5 bg-slate-50 rounded-xl p-5 border border-slate-100">
          <img
            src={t.image}
            alt={t.name}
            className="w-36 h-28 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-slate-800">{t.name}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.color}`}>{t.tag}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{t.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.tools.map((tool, i) => (
                <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── WHAT YOU CAN CREATE ─────────────────────────────────────────────────────

const creations = [
  { icon: Film, label: "Title Sequences", desc: "Film & series openers", color: "text-blue-600 bg-blue-50" },
  { icon: Megaphone, label: "Brand Ads", desc: "Product & social campaigns", color: "text-orange-600 bg-orange-50" },
  { icon: Monitor, label: "UI Animations", desc: "App & web micro-interactions", color: "text-violet-600 bg-violet-50" },
  { icon: Globe, label: "Explainer Videos", desc: "SaaS & startup storytelling", color: "text-teal-600 bg-teal-50" },
  { icon: Gamepad2, label: "Game Assets", desc: "3D models, VFX & cutscenes", color: "text-pink-600 bg-pink-50" },
  { icon: Star, label: "Personal Showreel", desc: "Your portfolio centrepiece", color: "text-amber-600 bg-amber-50" },
];

export function WhatYouCanCreate() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">What You Can Create</h2>
            <p className="text-xs text-slate-400 mt-1">Real-world output from motion designers & 3D artists</p>
          </div>
          <Zap className="w-5 h-5 text-[#f4613b]" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {creations.map(({ icon: Icon, label, desc, color }, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-default">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── TRENDS TICKER ───────────────────────────────────────────────────────────

const trends = [
  {
    title: "AI + Craft Hybrid",
    year: "2026 Trend",
    desc: "The sharpest designers use AI tools for speed, then layer in handcrafted detail — stop-motion textures, hand-drawn overlays — to stand out from fully generated content.",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    title: "Short-Form 3D",
    year: "Social Dominant",
    desc: "TikTok, Reels, and Shorts now reward 3D motion content. Loop-friendly, sound-synced animations under 15 seconds are the highest-engagement format for motion designers right now.",
    badge: "bg-orange-50 text-orange-700",
  },
  {
    title: "Retro Futurism",
    year: "Aesthetic Wave",
    desc: "1960s–80s geometric shapes and bold palettes fused with modern 3D rendering. Blender's EEVEE renderer makes this achievable without the render-farm costs of a studio.",
    badge: "bg-violet-50 text-violet-700",
  },
  {
    title: "Blender Goes Pro",
    year: "Industry Shift",
    desc: "The Oscar-winning animated film FLOW was made entirely in Blender. Even Cinema 4D veterans are switching. Blender is no longer just a hobbyist tool — it's studio-grade.",
    badge: "bg-teal-50 text-teal-700",
  },
];

export function TrendsSection() {
  const [active, setActive] = useState(0);

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Industry Trends</h2>
            <p className="text-xs text-slate-400 mt-1">What's shaping motion design in 2025–2026</p>
          </div>
          <TrendingUp className="w-5 h-5 text-[#0039a6]" />
        </div>

        <div className="flex gap-4">
          {/* Sidebar list */}
          <div className="w-40 flex-shrink-0 space-y-1">
            {trends.map((tr, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-all ${
                  active === i
                    ? "bg-[#0039a6] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tr.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-slate-800">{trends[active].title}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${trends[active].badge}`}>
                {trends[active].year}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{trends[active].desc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────
const careerPaths = [
  {
    title: "Motion Graphics Artist",
    rate: 88,
    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&q=80",
    color: "#0039a6",
  },
  {
    title: "3D Generalist",
    rate: 73,
    img: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=100&q=80",
    color: "#f4613b",
  },
  {
    title: "VFX Artist",
    rate: 100,
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&q=80",
    color: "#22c55e",
  },
];

export function RightSidebar() {
  return (
    <div className="space-y-6">
      {/* Career paths */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Career Paths</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Job-market demand for our graduates</p>
            </div>
          </div>

          <div className="space-y-4">
            {careerPaths.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img src={item.img} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-tight mb-1">{item.title}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500">{item.rate}%</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 mt-4 text-center">Based on learner placement surveys</p>
        </CardContent>
      </Card>

      {/* Quick fact card */}
      <Card className="bg-[#0039a6] border-none shadow-sm text-white">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100">Did You Know?</p>
              <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                Blender artists earn up to 100% more than average motion designers
              </p>
            </div>
          </div>
          <p className="text-[11px] text-blue-200 leading-relaxed">
            Blender Animator roles average $81,974/yr vs $76,634 for general motion design — and demand is growing fast with studios adopting it for production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}