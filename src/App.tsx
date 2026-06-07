/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import { AnalyticsData } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, AlertCircle, Sparkles, Code2, RefreshCw } from "lucide-react";

export default function App() {
  const [viewState, setViewState] = useState<"landing" | "dashboard">("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Sync theme with document layout root element
  useEffect(() => {
    const savedTheme = localStorage.getItem("devinsight-theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("devinsight-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Simulation steps for the beautiful profile loading screen
  const loadingStepsList = [
    "Contacting raw GitHub V3 secure API proxies...",
    "Retrieving repository histories and size matrices...",
    "Compiling language distributions & computing weights...",
    "Determining achievement checkpoints and unlocks...",
    "Querying Gemini models for active portfolio review...",
    "Rerouting final dashboard metrics packet..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStepsList.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Main fetch function to retrieve comprehensive analytics
  const handleAnalyzeProfile = async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("devinsight-gh-token") || "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["x-github-token"] = token;
      }

      const response = await fetch(`/api/analyze/${encodeURIComponent(username)}`, {
        headers
      });
      
      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        const errMsg = errPayload.error || "Failed to analyze developer profile.";
        throw new Error(errMsg);
      }

      const payload: AnalyticsData = await response.json();
      setData(payload);
      setViewState("dashboard");
    } catch (err: any) {
      console.error("App catch error:", err);
      // Clean custom messages for standard expected errors
      if (err.message.includes("USER_NOT_FOUND") || err.message.toLowerCase().includes("not found")) {
        setError("GitHub username not found. Verify the spelling or check if it's a private profile.");
      } else if (err.message.includes("RATE_LIMIT") || err.message.includes("429")) {
        setError("GitHub API limit reached. Standard audits are temporarily throttled; please retry in a few moments.");
      } else {
        setError(err.message || "Unable to retrieve GitHub repositories. Check your network connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setViewState("landing");
    setData(null);
    setError(null);
  };

  return (
    <div id="app-root-shell" className="min-h-screen relative font-sans select-none antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {/* VIEW: Loading Stage with interactive steps & shimmer */}
        {isLoading && (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] text-[#fafafa] font-sans p-6 text-center"
          >
            {/* Ambient visual background glow effects */}
            <div className="absolute top-20 left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="max-w-md w-full space-y-8 relative z-10">
              {/* Rotating spinner card */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/20 relative animate-pulse">
                  <Terminal className="w-8 h-8 text-white scale-110" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-indigo-300 border-t-transparent animate-spin" />
                </div>
              </div>

              {/* Title descriptions */}
              <div className="space-y-2.5">
                <h2 className="text-xl font-bold tracking-tight">Assembling Portfolio Metrics</h2>
                <p className="text-xs text-zinc-500 font-mono tracking-wide uppercase">GitSpectra Analytics Core</p>
              </div>

              {/* Shimmer skeleton elements representation */}
              <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 shadow-inner">
                <div className="h-2 w-1/3 bg-zinc-800 rounded animate-pulse" />
                <div className="h-1.5 w-full bg-zinc-800 rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="h-1.5 w-5/6 bg-zinc-800 rounded animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>

              {/* Scrolling status indicators */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-[#6366F1] font-mono">
                  {loadingStepsList[loadingStep]}
                </div>
                <div className="flex justify-center gap-1">
                  {loadingStepsList.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 transition-all duration-300 rounded-full ${
                        idx <= loadingStep ? "w-6 bg-[#6366F1]" : "w-1.5 bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto font-sans">
                GitHub responses are usually aggregated within 4 seconds. Thank you for your patience.
              </p>
            </div>
          </motion.div>
        )}

        {/* VIEW: Handling custom Errors overlay notifications */}
        {error && !isLoading && (
          <motion.div
            key="error-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
          >
            <div className="max-w-md w-full bg-[#18181b] border border-[#27272a] p-6 rounded-2xl text-white text-center shadow-2xl relative space-y-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center text-rose-500">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#fafafa]">Analysis Terminated</h3>
                <p className="text-zinc-500 text-xs font-sans">An issue was flagged during the GitHub portfolio audit.</p>
              </div>

              <p className="text-xs bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-mono leading-relaxed text-left">
                {error}
              </p>

              <div className="flex gap-3">
                <button
                  id="error-resolve-btn"
                  onClick={handleBackToSearch}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-600 border border-zinc-700 text-xs font-bold transition-all text-zinc-300"
                >
                  Return to Search
                </button>
                <button
                  id="error-retry-btn"
                  onClick={() => {
                    setError(null);
                    // Clear error and attempt fetching the landing search context repo username
                    if (data?.profile?.login) {
                      handleAnalyzeProfile(data.profile.login);
                    } else {
                      handleBackToSearch();
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Audit</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW ROUTING: Landing View or active Dashboard */}
        {viewState === "landing" ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingView 
              onSearch={handleAnalyzeProfile} 
              isLoading={isLoading} 
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {data && (
              <DashboardView
                data={data}
                onBackToSearch={handleBackToSearch}
                onSearchNewUser={handleAnalyzeProfile}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
