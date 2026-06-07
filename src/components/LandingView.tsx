/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { GitSpectraLogo } from "./GitSpectraLogo";
import {
  Search,
  Sparkles,
  TrendingUp,
  BarChart2,
  PieChart,
  Github,
  Award,
  Shield,
  Layers,
  ArrowRight,
  Terminal,
  Cpu,
  Globe,
  Boxes,
  Key,
  Sun,
  Moon,
} from "lucide-react";

interface LandingViewProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function LandingView({ onSearch, isLoading, theme, toggleTheme }: LandingViewProps) {
  const [username, setUsername] = useState("");
  const [tokenInput, setTokenInput] = useState(() => localStorage.getItem("devinsight-gh-token") || "");
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [tokenSavedStatus, setTokenSavedStatus] = useState(!!localStorage.getItem("devinsight-gh-token"));

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("devinsight-gh-token", tokenInput.trim());
      setTokenSavedStatus(true);
      alert("GitHub Access Token saved securely! Try running your scan now.");
    } else {
      localStorage.removeItem("devinsight-gh-token");
      setTokenSavedStatus(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const features = [
    {
      icon: <BarChart2 id="feat-icon-1" className="w-6 h-6 text-indigo-500" />,
      title: "Repository Analytics",
      description: "Audit public repositories for creation dates, codebase sizes, issue density, and popularity scales.",
    },
    {
      icon: <PieChart id="feat-icon-2" className="w-6 h-6 text-purple-500" />,
      title: "Language Insights",
      description: "Dive deep into language distributions with a custom computed donut layout of portfolio codebases.",
    },
    {
      icon: <TrendingUp id="feat-icon-3" className="w-6 h-6 text-cyan-500" />,
      title: "Contribution Tracking",
      description: "Visualize push frequency trends, year-over-year repository counts, and historical progression.",
    },
    {
      icon: <Cpu id="feat-icon-4" className="w-6 h-6 text-emerald-500" />,
      title: "Developer Metrics",
      description: "Explore computed tech stack matches, framework categories, and relative skill distribution reports.",
    },
    {
      icon: <Award id="feat-icon-5" className="w-6 h-6 text-amber-500" />,
      title: "Performance Reports",
      description: "An intelligent, mathematically grounded Developer Score based on popularity, consistency, and scale.",
    },
    {
      icon: <Globe id="feat-icon-6" className="w-6 h-6 text-rose-500" />,
      title: "Open Source Activity",
      description: "Diagnose community alignment via forks, original source directories, and personal star milestones.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Enter GitHub Username",
      desc: "Specify any public GitHub alias to trigger audit calculations.",
    },
    {
      num: "02",
      title: "Fetch Public Data",
      desc: "Retrieve repository arrays, stars, and language files safely.",
    },
    {
      num: "03",
      title: "Generate Analytics",
      desc: "Run calculated aggregation engines to compute metrics and scores.",
    },
    {
      num: "04",
      title: "Explore Insights",
      desc: "Gain a dashboard view of developer performance with Gemini AI critiques.",
    },
  ];

  return (
    <div id="landing-root" className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* Back grid overlay */}
      <div id="landing-grid-overlay" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-80" />

      {/* Navigation header */}
      <header id="landing-header" className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div id="landing-logo-container" className="flex items-center gap-2.5">
          <GitSpectraLogo className="w-10 h-10" />
          <div>
            <span id="logo-text" className="font-sans font-bold text-xl tracking-tight text-[#fafafa]">
              Git<span className="text-[#6366F1]">Spectra</span>
            </span>
            <span id="logo-badge" className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v3.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light Mode Switcher inside Landing page */}
          <button
            id="theme-toggle-landing"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun id="sun-landing" className="w-4 h-4 text-amber-400" /> : <Moon id="moon-landing" className="w-4 h-4 text-[#8B5CF6]" />}
          </button>

          <a
            id="landing-github-link"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <Github id="header-gh-icon" className="w-4 h-4" />
            <span className="hidden sm:inline">Documentation</span>
          </a>
        </div>
      </header>

      {/* Hero Content */}
      <main id="landing-main" className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div id="landing-hero-center" className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            id="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#18181b] text-indigo-400 border border-[#27272a] mb-8"
          >
            <Sparkles id="spark-icon" className="w-3.5 h-3.5" />
            <span>Introducing Developer Audits for Tech Portfolios</span>
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-[#fafafa] leading-[1.1] mb-6"
          >
            Understand Your GitHub Profile <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-cyan-500">
              Like Never Before
            </span>
          </motion.h1>

          <motion.p
            id="hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 font-sans leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Analyze repositories, programming languages, coding activity, and developer performance. Get intelligent insights powered by Gemini AI.
          </motion.p>

          {/* Prompt search bar */}
          <motion.div
            id="hero-search-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md mx-auto mb-16"
          >
            <form id="landing-search-form" onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 rounded-2xl bg-[#18181b] border border-[#27272a] shadow-2xl focus-within:ring-2 focus-within:ring-[#6366F1] focus-within:border-transparent transition-all gap-2 sm:gap-0">
              <div className="flex flex-1 items-center">
                <div id="search-input-icon-container" className="pl-3 py-1 text-zinc-500">
                  <Search id="form-search-icon" className="w-4 h-4" />
                </div>
                <input
                  id="search-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username..."
                  className="w-full pl-2 pr-3 py-2.5 bg-transparent text-[#fafafa] font-medium text-sm focus:outline-none placeholder-zinc-500"
                  disabled={isLoading}
                />
              </div>
              <button
                id="search-submit-btn"
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer whitespace-nowrap"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div id="loading-spinner" className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Profile</span>
                    <ArrowRight id="search-arrow-icon" className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <p id="search-disclaimer" className="text-xs text-zinc-500 mt-3 font-sans">
              No registration required. Audits public repositories immediately.
            </p>

            {/* Collapsible Token Settings Context Block */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 text-left">
              <button
                type="button"
                onClick={() => setShowTokenPanel(!showTokenPanel)}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Private repositories missing? {tokenSavedStatus ? "✓ Premium Token Active" : "Configure Access Token"}</span>
              </button>

              {showTokenPanel && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 rounded-xl bg-[#0e0e11] border border-[#27272a] space-y-3 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scan Private Repositories</span>
                    <a
                      href="https://github.com/settings/tokens/new?description=GitSpectra&scopes=repo"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#6366F1] hover:underline flex items-center gap-0.5"
                    >
                      <span>Create Token ↗</span>
                    </a>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    By default, standard search only accesses <strong>public</strong> repositories. To retrieve private and public codebases, generate a <span className="text-zinc-200 font-semibold">Personal Access Token (classic)</span> with the <code className="bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded font-mono text-zinc-300">repo</code> scope, then save it below.
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] placeholder-zinc-600 focus:outline-none focus:border-[#6366F1]"
                    />
                    <button
                      type="button"
                      onClick={saveToken}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      {tokenSavedStatus ? "Update" : "Save"}
                    </button>
                    {tokenSavedStatus && (
                      <button
                        type="button"
                        onClick={() => {
                          setTokenInput("");
                          localStorage.removeItem("devinsight-gh-token");
                          setTokenSavedStatus(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-sans">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Stored securely in local storage. Never leaves your hardware.</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Interactive Mockup dashboard preview */}
          <motion.div
            id="hero-mockup-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-2xl border border-[#27272a] bg-[#18181b] p-4 shadow-2xl shadow-black/80 overflow-hidden max-w-5xl mx-auto"
          >
            {/* Window chrome header */}
            <div id="mockup-header" className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-3 mb-4">
              <div id="mockup-dots" className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div id="mockup-address" className="px-5 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-mono text-slate-400 dark:text-zinc-500">
                devinsight.app/profile/torvalds
              </div>
              <div id="mockup-actions" className="flex items-center gap-1.5 text-slate-300 dark:text-zinc-700">
                <Layers id="mockup-layer-icon" className="w-4 h-4" />
              </div>
            </div>

            {/* Dashboard content screenshot/mockup */}
            <div id="mockup-grid-layout" className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2">
              <div id="mockup-col-1" className="md:col-span-1 space-y-4">
                <div id="mock-person-card" className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-zinc-800" />
                    <div>
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-zinc-800" />
                      <div className="h-3 w-16 rounded bg-slate-100 dark:bg-zinc-900 mt-1.5" />
                    </div>
                  </div>
                  <div className="h-2 w-full rounded bg-slate-100 dark:bg-zinc-900" />
                  <div className="h-2 w-5/6 rounded bg-slate-100 dark:bg-zinc-900" />
                </div>
                <div id="mock-score-card" className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-lg text-indigo-500">
                    94%
                  </div>
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-zinc-800 mt-3" />
                  <div className="h-3 w-16 rounded bg-slate-100 dark:bg-zinc-900 mt-1.5" />
                </div>
              </div>

              <div id="mockup-col-2" className="md:col-span-2 space-y-4">
                <div id="mock-stats-row" className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                    <div className="h-3 w-10 bg-slate-200 dark:bg-zinc-800 rounded" />
                    <div className="h-6 w-14 bg-slate-300 dark:bg-zinc-700 rounded mt-2" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                    <div className="h-3 w-10 bg-slate-200 dark:bg-zinc-800 rounded" />
                    <div className="h-6 w-14 bg-slate-300 dark:bg-zinc-700 rounded mt-2" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                    <div className="h-3 w-10 bg-slate-200 dark:bg-zinc-800 rounded" />
                    <div className="h-6 w-14 bg-slate-300 dark:bg-zinc-700 rounded mt-2" />
                  </div>
                </div>

                <div id="mock-chart-container" className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-16 bg-slate-100 dark:bg-zinc-900 rounded" />
                  </div>
                  <div className="h-28 flex items-end justify-between px-2 pt-2">
                    <div className="w-10 h-10 rounded bg-indigo-200 dark:bg-indigo-950/50 hover:bg-indigo-300 dark:hover:bg-indigo-900/50 transition-colors" />
                    <div className="w-10 h-14 rounded bg-indigo-300 dark:bg-indigo-900 hover:bg-indigo-400 dark:hover:bg-indigo-800 transition-colors" />
                    <div className="w-10 h-20 rounded bg-indigo-400 dark:bg-indigo-800/80 hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-colors" />
                    <div className="w-10 h-24 rounded bg-indigo-500 hover:bg-indigo-600 transition-colors" />
                    <div className="w-10 h-16 rounded bg-purple-400 dark:bg-purple-900/80 hover:bg-purple-500 dark:hover:bg-purple-800 transition-colors" />
                    <div className="w-10 h-22 rounded bg-purple-500 hover:bg-purple-600 transition-colors" />
                    <div className="w-10 h-12 rounded bg-cyan-400 dark:bg-cyan-900 hover:bg-cyan-500 dark:hover:bg-cyan-800 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <section id="features-section" className="pt-24 pb-16">
          <div id="features-header" className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans text-3xl font-bold text-[#fafafa] tracking-tight">
              A Complete Developer Diagnostic Suite
            </h2>
            <p className="text-zinc-400 font-sans mt-3">
              GitSpectra maps dozens of metrics to assemble an elegant, client-ready review of standard software engineering properties.
            </p>
          </div>

          <div id="features-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                id={`feature-card-${idx}`}
                className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] relative overflow-hidden group hover:border-[#6366F1]/50 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div id={`feat-icon-container-${idx}`} className="p-3 w-fit rounded-xl bg-[#09090b] border border-[#27272a] mb-5 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 id={`feat-title-${idx}`} className="font-sans font-bold text-lg text-[#fafafa] mb-2">
                  {feat.title}
                </h3>
                <p id={`feat-desc-${idx}`} className="text-sm font-sans text-zinc-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 border-t border-[#18181b] mt-12">
          <div id="steps-header" className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#fafafa] tracking-tight">
              Simple 4-Step Analysis Cycle
            </h2>
            <p className="text-zinc-400 font-sans mt-3">
              A streamlined, high-speed architecture guarantees safe computation with zero account registration hurdles.
            </p>
          </div>

          <div id="steps-row" className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} id={`step-card-${idx}`} className="p-5 rounded-2xl relative bg-[#18181b] border border-[#27272a] shadow-lg">
                <span id={`step-num-${idx}`} className="font-mono font-black text-4xl text-indigo-500/15 dark:text-indigo-500/20 block mb-3">
                  {step.num}
                </span>
                <h4 id={`step-title-${idx}`} className="font-sans font-bold text-base text-[#fafafa] mb-1.5">
                  {step.title}
                </h4>
                <p id={`step-desc-${idx}`} className="text-xs font-sans text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="landing-footer" className="max-w-7xl mx-auto px-6 py-12 border-t border-[#18181b] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans relative z-10">
        <div>
          &copy; 2026 GitSpectra Systems Inc. All analytics calculations are generated client-side from public arrays.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span>&middot;</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}
