"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play, Video, MessageCircle, BookOpen, Heart,
  ChevronRight, Check, Film, Sparkles, ArrowRight,
  Menu, X, PlayCircle, Lock, LogOut, Layers,
  User,
  GraduationCap,
  ArrowUpRightFromSquare,
  ArrowBigRight,
} from "lucide-react";

//  Brand tokens
const ORANGE = "#f4613b";
const TEAL   = "#12b373";
const NAVY   = "#0a2463";
const BLUE   = "#1a3a8f";
const CREAM  = "#fdf8f3";

//  Small reusable pieces
const Tag = ({ children, color = TEAL }: { children: React.ReactNode; color?: string }) => (
  <span
    style={{ background: color + "18", color, border: `1px solid ${color}40` }}
    className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
  >
    {children}
  </span>
);

const CheckItem = ({ children, color = TEAL }: { children: React.ReactNode; color?: string }) => (
  <li className="flex items-start gap-3 text-slate-600 text-[15px]">
    <div
      style={{ background: color + "18", flexShrink: 0 }}
      className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
    >
      <Check style={{ color }} className="w-3 h-3" />
    </div>
    {children}
  </li>
);

//  Dashboard mockup
const HeroDashboard = () => (
  <div
    className="w-full rounded-2xl overflow-hidden border border-5 border-gray-900/0.95"
    style={{
      // border: "1px solid rgba(255,255,255,0.15)",
      // border: "7px solid rgba(15, 15, 15, 0.05)",
      background: "#ffffff",
      boxShadow: "0 -20px 80px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.2)",
    }}
  >
    <div className="flex" style={{ minHeight: 420 }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col items-center py-4 gap-2 flex-shrink-0"
        style={{ width: 60, background: "#0039a6" }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" fill="white" fillOpacity="0.9"/>
            <path d="M6 11.2V16.5C6 16.5 8.5 19 12 19C15.5 19 18 16.5 18 16.5V11.2L12 14.5L6 11.2Z" fill="white" fillOpacity="0.7"/>
          </svg>
        </div>
        {[
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="g"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="v"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>,
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" key="l"><path d="M3 7h18M3 12h18M3 17h18"/></svg>,
        ].map((icon, i) => (
          <div key={i} className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: i === 0 ? "rgba(255,255,255,0.18)" : "transparent", color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)" }}>
            <span className="w-4 h-4">{icon}</span>
          </div>
        ))}
        <div className="mt-auto w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
          <LogOut color="white" size={16}/>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 gap-3">

          {/* Brand name */}
          <div className="text-left">
            <div className="text-[19px] font-bold text-[#0039A6]">motionkart</div>
          </div>

          {/* User Info */}
          <div className="text-right flex items-center gap-3">
            <div>
              <div className="text-[13px] font-semibold text-slate-800">Adarsh Kumar</div>
              <div className="text-[10px] text-slate-400">adarshkumar@gmail.com</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center"> 
              <User size={16} color="gray"/>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1">
          {/* Video col */}
          <div className="flex-1 px-7 py-5">
            <div className="relative rounded-xl overflow-hidden w-full" style={{ height: 310, background: "#0d1117" }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d1117"/>
                    <stop offset="100%" stopColor="#161b22"/>
                  </linearGradient>
                  <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0039a6" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#0066ff" stopOpacity="0"/>
                  </linearGradient>
                  <filter id="hblur"><feGaussianBlur stdDeviation="30"/></filter>
                </defs>
                <rect width="700" height="280" fill="url(#hbg)"/>
                <ellipse cx="150" cy="240" rx="220" ry="160" fill="url(#hg1)" filter="url(#hblur)" opacity="0.8"/>
                <g stroke="#1e2a3a" strokeWidth="1" opacity="0.5">
                  {[60,120,180,240].map(y=><line key={y} x1="0" y1={y} x2="700" y2={y}/>)}
                  {[100,200,300,400,500,600].map(x=><line key={x} x1={x} y1="0" x2={x} y2="280"/>)}
                </g>
                <rect x="40" y="40" width="340" height="200" rx="10" fill="#161b22" stroke="#30363d" strokeWidth="1"/>
                <rect x="40" y="40" width="340" height="28" rx="10" fill="#1c2128"/>
                <rect x="40" y="56" width="340" height="12" fill="#1c2128"/>
                <circle cx="58" cy="54" r="4" fill="#ff5f57"/><circle cx="72" cy="54" r="4" fill="#febc2e"/><circle cx="86" cy="54" r="4" fill="#28c840"/>

                {/* Blender Viewport Background */}
                <rect x="40" y="68" width="340" height="172" fill="#232323" />
                
                {/* 3D Perspective Grid lines */}
                <g stroke="#333333" strokeWidth="1" opacity="0.6">
                  <line x1="40" y1="200" x2="380" y2="200" stroke="#4a4a4a" /> {/* Floor */}
                  <line x1="210" y1="68" x2="210" y2="240" stroke="#3b5998" opacity="0.4" /> {/* Z Axis */}
                  <line x1="40" y1="180" x2="380" y2="220" stroke="#557a2b" strokeWidth="1.5" /> {/* X Axis */}
                </g>

                {/* Stylized Low-Poly 3D Monkey/Shape placeholder */}
                <polygon points="170,160 210,130 250,160 210,190" fill="#3d3d3d" stroke="#f4613b" strokeWidth="1.5" />
                <polygon points="210,130 210,190 250,160" fill="#4a4a4a" stroke="#f4613b" strokeWidth="1" />
                <line x1="170" y1="160" x2="250" y2="160" stroke="#f4613b" strokeWidth="1" />

                {/* UI Text overlay on viewport top left */}
                <text x="55" y="88" fontFamily="sans-serif" fontSize="10" fill="#ffffff" opacity="0.4" fontWeight="bold">User Perspective</text>
                
                {/* Official Blender Logo Vector layout */}
                <g transform="translate(315, 80) scale(0.75)">
                  {/* Eye outline / white circle base */}
                  <circle cx="20" cy="20" r="14" fill="#ffffff" />
                  {/* Trademark Orange Body */}
                  <path d="M20,2 C10,2 2,10 2,20 C2,30 10,38 20,38 C28,38 35,32 37,24 L29,22 C27,26 24,28 20,28 C15.5,28 12,24.5 12,20 C12,15.5 15.5,12 20,12 C24,12 27,14 29,18 L37,16 C35,8 28,2 20,2 Z" fill="#ea761c" />
                  {/* Center Pupil */}
                  <circle cx="20" cy="20" r="5" fill="#0b64a0" />
                  {/* Top brand prongs */}
                  <path d="M22,5 L32,1 C33,1 34,2 33,3 L26,9 Z" fill="#ea761c" />
                  <path d="M27,10 L39,9 C40,9 40,10 39,11 L29,13 Z" fill="#ea761c" />
                  <path d="M26,14 L37,19 C38,19 38,20 37,20 L26,17 Z" fill="#ea761c" />
                </g>
                <rect x="410" y="40" width="250" height="200" rx="10" fill="#0d1117" stroke="#30363d" strokeWidth="1"/>
                <rect x="410" y="40" width="250" height="28" rx="10" fill="#161b22"/>
                <rect x="420" y="52" width="140" height="14" rx="3" fill="#21262d"/>
                <text x="490" y="63" fontFamily="monospace" fontSize="9" fill="#6e7681" textAnchor="middle">localhost:3000</text>
                <rect x="410" y="68" width="250" height="172" fill="#0d1117"/>
                <rect x="410" y="68" width="26" height="172" fill="#0039a6" opacity="0.9"/>
                <rect x="436" y="68" width="224" height="18" fill="#161b22" opacity="0.8"/>
                <rect x="440" y="92" width="150" height="80" rx="5" fill="#1c2128"/>
                <polygon points="510,124 510,140 525,132" fill="white" opacity="0.7"/>
                <rect x="440" y="186" width="110" height="40" rx="8" fill="#161b22" stroke="#30363d" strokeWidth="1"/>
                <text x="450" y="200" fontFamily="monospace" fontSize="8" fill="#7ee787">✓ Compiled</text>
                <text x="450" y="212" fontFamily="monospace" fontSize="7" fill="#6e7681">Ready in 892ms</text>
              </svg>
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>

            {/* Below video */}
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-[15px]">Introduction to motion design</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Section 1 · 5 min</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-[#0039a6] text-white font-semibold text-[12px]">Saved</button>
                <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-[12px]">Share</button>
              </div>
            </div>

            {/* Navigation Tabs (Matches your real layout perfectly) */}
            <div className="mt-6 flex items-center gap-1  bg-slate-100 p-1 rounded-xl w-fit">
              <button className="px-5 py-2 text-[13px] font-semibold rounded-lg bg-white text-slate-800 shadow-sm border border-slate-100 outline-none">
                Description
              </button>
              <button className="px-5 py-2 text-[13px] font-medium rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                Resources
              </button>
              <button className="px-5 py-2 text-[13px] font-medium rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5">
                <Sparkles size={13} className="text-slate-400" /> Ask Doubt
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="border-l border-slate-100 flex-shrink-0 overflow-y-auto" style={{ width: 280, background: "#fafbfc" }}>
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-slate-900">Course Content</h3>
                <span className="text-[12px] font-bold text-[#0039a6]">25%</span>
              </div>
              <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-1/4 rounded-full bg-[#0039a6]"/>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {["Introduction","Modifiers","Rigging","Rendering","Materials", "Project"].map((s, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5 cursor-pointer">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Section {i+1}</div>
                      <div className="text-[12px] font-semibold text-slate-700 mt-0.5">{s}</div>
                    </div>
                    <span className="text-slate-300 text-[10px]">{i === 0 ? "▲" : "▼"}</span>
                  </div>
                  {i === 0 && (
                    <div className="px-3 pb-3 flex flex-col gap-2">
                      {[{l:"Introduction",a:true},{l:"Getting started",a:false},{l:"First render",a:false}].map((lesson,idx)=>(
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                            style={{ background: lesson.a ? "#0039a6" : "transparent", borderColor: lesson.a ? "#0039a6" : "#cbd5e1" }}/>
                          <div className="text-[11px]" style={{ color: lesson.a ? "#0039a6" : "#64748b", fontWeight: lesson.a ? 600 : 400 }}>{lesson.l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
);

//  Feature screenshot placeholders
const FeatureScreenshot = ({ accent, children }: { accent: string; children: React.ReactNode }) => (
  <div
    className="w-full rounded-2xl overflow-hidden"
    style={{
      border: "1px solid #e5e7eb",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      background: "#fff",
    }}
  >
    {/* Browser chrome */}
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100" style={{ background: "#f8f9fa" }}>
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
      <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
      <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
      <div className="ml-3 flex-1 h-6 rounded-md bg-slate-200 max-w-[200px] flex items-center px-2">
        <span className="text-[10px] text-slate-400">motionkart.online</span>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Video player mock
const VideoPlayerMock = () => (
  <FeatureScreenshot accent={TEAL}>
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="rounded-xl overflow-hidden aspect-video bg-[#0d1117] flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-30"
            style={{ background: "linear-gradient(135deg, #0039a6, #7c3aed)" }}/>
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center z-10">
            <Play className="w-5 h-5 text-white ml-0.5"/>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/5 rounded-full" style={{ background: ORANGE }}/>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-semibold text-slate-800 text-sm">Blender Rigging — Chapter 4</div>
          <div className="text-xs text-slate-400 mt-0.5">62% complete · 12 min remaining</div>
        </div>
      </div>
      <div className="w-40 flex flex-col gap-2">
        {["Intro","Modifiers","Rigging","Animation","Export"].map((l,i)=>(
          <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${i===2?"bg-[#0039a6]/10 text-[#0039a6] font-semibold":"text-slate-500"}`}>
            <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${i<2?"bg-[#0039a6] border-[#0039a6]":i===2?"border-[#0039a6]":"border-slate-300"}`}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  </FeatureScreenshot>
);

// Doubt chat mock
const DoubtChatMock = () => (
  <FeatureScreenshot accent={ORANGE}>
    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      {[
        { msg: "Why are my normals flipped after applying modifiers?", me: false },
        { msg: "Go to Edit Mode → Select All → Mesh → Normals → Recalculate Outside. That fixes it!", me: true },
        { msg: "It worked! Thank you 🎉", me: false },
      ].map((m, i) => (
        <div key={i} className={`flex gap-2 ${m.me ? "flex-row-reverse" : ""}`}>
          <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${m.me ? "bg-[#0039a6]" : "bg-slate-300 text-slate-600"}`}>
            {m.me ? "AI" : "Y"}
          </div>
          <div className={`rounded-2xl px-3 py-2 text-xs max-w-[78%] ${m.me ? "bg-[#0039a6] text-white rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"}`}>
            {m.msg}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-2 mt-1">
        <span className="text-slate-400 text-xs flex-1">Ask your doubt…</span>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: TEAL }}>
          <ArrowRight className="w-3 h-3 text-white"/>
        </div>
      </div>
    </div>
  </FeatureScreenshot>
);

// Notes mock
const NotesMock = () => (
  <FeatureScreenshot accent="#7c3aed">
    <div className="flex flex-col gap-3">
      {["Chapter 1 — Blender Interface.pdf","Chapter 2 — Modifiers Deep Dive.pdf","Chapter 3 — Rigging Basics.pdf"].map((f,i)=>(
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#7c3aed18" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#7c3aed" }}/>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-slate-700">{f}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">PDF · 2.4 MB</div>
          </div>
          <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">Download</button>
        </div>
      ))}
    </div>
  </FeatureScreenshot>
);

//  Testimonial
const Testimonial = ({ quote, name, role, metric, bg }: any) => (
  <div style={{ background: bg }} className="rounded-2xl p-7 flex flex-col gap-4">
    {metric && <div className="text-4xl font-black text-slate-800">{metric}</div>}
    <p className="text-slate-600 text-sm leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-3 pt-3 border-t border-black/8">
      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-bold text-sm text-slate-600">{name[0]}</div>
      <div>
        <div className="font-bold text-slate-800 text-sm">{name}</div>
        <div className="text-slate-500 text-xs">{role}</div>
      </div>
    </div>
  </div>
);

//  Main page
export default function LandingPage({authenticated}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ background: BLUE }} className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white font-bold"/>
            </div>
            <span className={`font-black text-xl tracking-tight ${scrolled ? "text-slate-800" : "text-white"}`}>
              motionkart
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            { authenticated ? 
            <Link href="/home">
                <Button style={{ background: TEAL }} className="text-white font-semibold rounded-full px-6 py-5 cursor-pointer hover:opacity-90 shadow-lg">
                Go to Dashboard
                </Button>
            </Link>
            :
            <>
                <Link href="/login">
                <Button variant="ghost" className={`font-bold cursor-pointer text-sm ${scrolled ? "text-slate-700" : "text-white hover:bg-white/10"}`}>
                    Login
                </Button>
                </Link>
                <Link href="/signup">
                <Button style={{ background: TEAL }} className="text-white font-bold rounded-full px-6 hover:opacity-90 shadow-lg">
                    Sign up free
                </Button>
                </Link>
            </>
            }

          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden ${scrolled ? "text-slate-700" : "text-white"}`}>
            {menuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
            {["Courses","Platform","About"].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="font-semibold text-slate-700">{item}</Link>
            ))}
            <Link href="/signup">
              <Button style={{ background: TEAL }} className="w-full text-white font-bold rounded-full">Sign up free</Button>
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      {/*
        Key fix: hero has NO overflow-hidden and NO pb-0.
        The dashboard sits at the bottom of the hero with a negative margin-bottom
        so it "bleeds" out into the next section visually.
        The next section gets padding-top to compensate for the bleed.
      */}
      <section
        style={{ background: "linear-gradient(175deg, #0a2463 0%, #1a3a8f 50%, #0d2d7a 100%)" }}
        className="relative pt-32 pb-16"
      >
        {/* Concentric rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center" style={{ bottom: "30%" }}>
          <svg className="w-[680px] h-[680px] opacity-[0.07]" viewBox="0 0 680 680">
            <circle cx="340" cy="340" r="140" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="340" cy="340" r="240" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="340" cy="340" r="320" fill="none" stroke="white" strokeWidth="1"/>
          </svg>
        </div>

        {/* Floating icon badges */}
        {[
          { icon: Layers,         top: "16%", left:  "6%",  rotate: "-8deg"  },
          { icon: Film,           top: "52%", left:  "4%",  rotate:  "6deg"  },
          { icon: BookOpen,       top: "76%", left: "11%",  rotate: "-5deg"  },
          { icon: Sparkles,       top: "14%", right: "6%",  rotate:  "8deg"  },
          { icon: MessageCircle,  top: "50%", right: "4%",  rotate: "-7deg"  },
          { icon: Heart,          top: "74%", right:"10%",  rotate:  "5deg"  },
        ].map(({ icon: Icon, rotate, ...pos }) => (
          <div
            key={rotate}
            className="hidden lg:flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              ...pos, rotate, position: "absolute",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Icon className="w-6 h-6 text-white/60"/>
          </div>
        ))}

        {/* Center text */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pb-14">
          <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-5">
            The #1 platform for motion designers
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Learn Blender &<br/>
            <span style={{ color: "#a8d5a2" }}>After Effects</span><br/>
            the right way.
          </h1>
          <p className="mt-5 text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            A platform built for motion designers — from day one to professional.
            Watch lessons, get doubts answered 24×7, and download notes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Link href="/signup">
              <Button
                style={{ background: "#c2e5b4", color: "#0a2463" }}
                className="font-black text-base px-12 py-5 rounded-full shadow-xl hover:scale-105 transition-transform duration-200"
              >
                Start Learning Free
              </Button>
            </Link>
            <p className="text-white/30 text-sm">No credit card needed</p>
          </div>
        </div>

        {/* Dashboard — bleeds below hero via negative margin-bottom */}
        <div className="relative z-10 max-w-5xl mx-auto px-6" style={{ marginBottom: "-220px" }}>
          <HeroDashboard/>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────────── */}
      {/* padding-top accounts for the dashboard bleed (220px) + breathing room (40px) */}
      <section className="border-b border-slate-100" style={{ paddingTop: "260px", paddingBottom: "40px" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-slate-400 text-xs font-bold tracking-widest uppercase mb-6">
            Trusted by designers at top companies.
          </p>
          {/* <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {["Publicis","WPP","Dentsu","Ogilvy","BBDO","Leo Burnett"].map(b => (
              <span key={b} className="text-slate-600 font-black text-lg tracking-tight">{b}</span>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── FEATURE SECTIONS ────────────────────────────────────── */}

      {/* 1 — Video on demand */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-5">
            <Tag >Learn & Stream</Tag>
            <h2 className="text-4xl font-black text-slate-800 leading-tight">
              HD video lessons,<br/>watch anytime.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Every lesson recorded in HD and available forever after purchase.
              Rewatch at your pace — at 2 AM or your lunch break.
            </p>
            <ul className="flex flex-col gap-3 mt-1">
              {["Unlimited replays after purchase","Organised by chapters & skill level","Stream on any device","Progress tracked automatically"].map(item => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
            <Link href="/courses" className="inline-flex items-center gap-2 font-bold mt-2 hover:gap-3 transition-all" style={{ color: ORANGE }}>
              Browse courses <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
          <VideoPlayerMock/>
        </div>
      </section>

      {/* 2 — Ask Doubts */}
      <section className="py-24 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <DoubtChatMock/>
          <div className="flex flex-col gap-5">
            <Tag color={ORANGE}>Support</Tag>
            <h2 className="text-4xl font-black text-slate-800 leading-tight">
              Ask doubts<br/>
              <span style={{ color: ORANGE }}>anytime.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Stuck on a keyframe? Confused about nodes? Our AI Doubt assistant responds instantly — around the clock, every day.
            </p>
            <ul className="flex flex-col gap-3 mt-1">
              {["Ask doubts anytime","AI Assistant will respond shortly","Community of 5,000+ fellow artists","Powered by RAG"].map(item => (
                <CheckItem key={item} color={ORANGE}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 — Lecture Notes */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-5">
            <Tag color="#7c3aed">Lecture Notes</Tag>
            <h2 className="text-4xl font-black text-slate-800 leading-tight">
              Every chapter,<br/>downloadable.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Stop screenshotting slides. Get beautifully formatted PDF notes for every chapter — perfect for offline reference while you build.
            </p>
            <ul className="flex flex-col gap-3 mt-1">
              {["PDF for every chapter","Download once, keep forever","Covers key concepts & shortcuts","Great for revision before projects"].map(item => (
                <CheckItem key={item} color="#7c3aed">{item}</CheckItem>
              ))}
            </ul>
          </div>
          <NotesMock/>
        </div>
      </section>

            {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Tag color={ORANGE}>Real results</Tag>
            <h2 className="mt-4 text-4xl font-black text-slate-800">
              Real students.<br/>Real breakthroughs.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              metric="3×"
              quote="I went from zero Blender knowledge to landing a freelance gig in 4 months. The 24×7 doubt support was a game-changer."
              name="Rohan M."
              role="Freelance 3D Artist"
              bg="#e8e4ff"
            />
            <Testimonial
              metric="₹0"
              quote="The lecture notes alone are worth it. I stopped screenshotting every slide and can now focus on actually animating."
              name="Priya S."
              role="Motion Designer, Bangalore"
              bg="#fef3c7"
            />
            <Testimonial
              metric="6"
              quote="Saving favourite videos completely changed how I study. I have my own personal playlist of clips I replay most."
              name="Aditya K."
              role="AE Student, Mumbai"
              bg="#dcfce7"
            />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section
        style={{ background: "linear-gradient(175deg, #0a2463 0%, #1a3a8f 100%)" }}
        className="relative py-24 px-6 text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06]">
          <svg className="w-[500px] h-[500px]" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="100" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="250" cy="250" r="180" fill="none" stroke="white" strokeWidth="1"/>
            <circle cx="250" cy="250" r="240" fill="none" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            The motion design<br/>course you need<br/>starts here!
          </h2>
          <p className="mt-5 text-white/50 text-lg">
            Join 5,000+ students learning Blender & After Effects.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Link href="/signup">
              <Button
                style={{ background: "#c2e5b4", color: "#0a2463" }}
                className="font-black text-base px-12 py-5 rounded-full shadow-xl hover:scale-105 transition-transform duration-200"
              >
                Get started free
              </Button>
            </Link>
            <p className="text-white/30 text-sm">No credit card · Free forever plan · Upgrade anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
}