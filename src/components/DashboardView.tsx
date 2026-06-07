/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GitSpectraLogo } from "./GitSpectraLogo";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  BarChart3,
  Award,
  Sparkles,
  Search,
  Moon,
  Sun,
  Bell,
  LogOut,
  MapPin,
  Link as LinkIcon,
  Building,
  Mail,
  Calendar,
  Users,
  Star,
  GitFork,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  Zap,
  Globe,
  Cpu,
  Layers,
  ShieldAlert,
  Boxes,
  Key,
} from "lucide-react";
import { AnalyticsData, GitHubRepository, LanguageStat } from "../types";

// Animated Counter helper to count up from 0 to value smoothly over 1s
function AnimatedCount({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end <= 0) {
      setCount(0);
      return;
    }
    const duration = 1000; // ms
    const stepTime = 16; // approx 60fps
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

interface DashboardViewProps {
  data: AnalyticsData;
  onBackToSearch: () => void;
  onSearchNewUser: (username: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function DashboardView({ data, onBackToSearch, onSearchNewUser, theme, toggleTheme }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "repositories" | "languages" | "analytics" | "achievements" | "insights">("overview");
  const [newSearchQuery, setNewSearchQuery] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Private repositories secure local states
  const [dbTokenInput, setDbTokenInput] = useState(() => localStorage.getItem("devinsight-gh-token") || "");
  const [showDbToken, setShowDbToken] = useState(false);
  const [dbTokenActive, setDbTokenActive] = useState(!!localStorage.getItem("devinsight-gh-token"));

  const saveDbToken = () => {
    const trimmed = dbTokenInput.trim();
    if (trimmed) {
      localStorage.setItem("devinsight-gh-token", trimmed);
      setDbTokenActive(true);
      setShowDbToken(false);
      // Instantly trigger re-fetch using the updated credentials
      onSearchNewUser(data.profile.login);
    } else {
      localStorage.removeItem("devinsight-gh-token");
      setDbTokenActive(false);
      setShowDbToken(false);
      onSearchNewUser(data.profile.login);
    }
  };

  // Repository view states
  const [repoSearch, setRepoSearch] = useState("");
  const [repoLanguageFilter, setRepoLanguageFilter] = useState("all");
  const [repoSortField, setRepoSortField] = useState<"stars" | "forks" | "size" | "name">("stars");

  // Custom Technology Badges (interactive skill checklists)
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([
    "React", "TypeScript", "Node.js", "Vite", "Tailwind CSS", "Docker", "Git"
  ]);

  const allAvailableStack = [
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "Vue.js", category: "frontend" },
    { name: "TypeScript", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Framer Motion", category: "frontend" },
    { name: "Node.js", category: "backend" },
    { name: "Express", category: "backend" },
    { name: "Python", category: "backend" },
    { name: "Django", category: "backend" },
    { name: "Java", category: "backend" },
    { name: "Go", category: "backend" },
    { name: "Rust", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "MongoDB", category: "database" },
    { name: "Docker", category: "devops" },
    { name: "AWS", category: "devops" },
    { name: "GitHub Actions", category: "devops" },
    { name: "Git", category: "devops" }
  ];

  const toggleTech = (name: string) => {
    if (selectedTechStack.includes(name)) {
      setSelectedTechStack(selectedTechStack.filter(t => t !== name));
    } else {
      setSelectedTechStack([...selectedTechStack, name]);
    }
  };

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSearchQuery.trim()) {
      onSearchNewUser(newSearchQuery.trim());
      setNewSearchQuery("");
    }
  };

  const profile = data.profile;
  const repositories = data.repositories;
  const languages = data.languages;
  const score = data.score;
  const achievements = data.achievements;
  const insights = data.insights;

  // Account Age calculation helper
  const getAccountAge = () => {
    const created = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return { years, months, days: diffDays };
  };
  const accAge = getAccountAge();

  // Find specialized repositories
  const sortedByStars = [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const sortedByForks = [...repositories].sort((a, b) => b.forks_count - a.forks_count);
  const sortedBySize = [...repositories].sort((a, b) => b.size - a.size);
  const sortedByNewest = [...repositories].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const sortedByOldest = [...repositories].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const highlights = {
    starred: sortedByStars[0] || null,
    forked: sortedByForks[0] || null,
    largest: sortedBySize[0] || null,
    newest: sortedByNewest[0] || null,
    oldest: sortedByOldest[0] || null,
  };

  // Language distinct list for filter selector
  const distinctLanguages = Array.from(new Set(repositories.map(r => r.language).filter(Boolean))) as string[];

  // Filter & sort repositories
  const filteredRepos = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(repoSearch.toLowerCase()) || 
                          (repo.description && repo.description.toLowerCase().includes(repoSearch.toLowerCase()));
    
    const matchesLanguage = repoLanguageFilter === "all" || 
                            (repo.language && repo.language.toLowerCase() === repoLanguageFilter.toLowerCase());
    
    return matchesSearch && matchesLanguage;
  }).sort((a, b) => {
    if (repoSortField === "stars") return b.stargazers_count - a.stargazers_count;
    if (repoSortField === "forks") return b.forks_count - a.forks_count;
    if (repoSortField === "size") return b.size - a.size;
    return a.name.localeCompare(b.name);
  });

  // Score circular config
  const circleRadius = 50;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const dashOffset = circleCircumference - (score.overall / 100) * circleCircumference;

  const getScoreColor = () => {
    if (score.overall >= 85) return "stroke-emerald-500 text-emerald-500 shadow-emerald-500/20";
    if (score.overall >= 70) return "stroke-indigo-500 text-indigo-500 shadow-indigo-500/20";
    if (score.overall >= 55) return "stroke-cyan-500 text-cyan-500 shadow-cyan-500/20";
    return "stroke-amber-500 text-amber-500 shadow-amber-500/20";
  };

  return (
    <div id="analytics-app-shell" className="min-h-screen flex flex-col md:flex-row bg-[#09090b] text-[#fafafa] font-sans antialiased transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <aside id="sidebar-container" className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#18181b] bg-[#09090b] p-4 md:p-5 flex flex-col justify-between relative z-20">
        <div id="sidebar-top-wrapper">
          {/* Dashboard branding Logo */}
          <div id="sidebar-branding" className="flex items-center gap-2.5 pb-3 md:pb-6 border-b border-[#18181b] mb-3 md:mb-6 cursor-pointer" onClick={onBackToSearch}>
            <GitSpectraLogo className="w-9 h-9" />
            <div>
              <h2 className="font-sans font-bold text-lg tracking-tight text-[#fafafa]">
                Git<span className="text-[#6366F1]">Spectra</span>
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Active Reviewer</p>
            </div>
          </div>
 
          {/* Nav list */}
          <nav id="sidebar-nav" className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 md:space-y-1.5 py-1 md:py-0 no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: "repositories", label: "Repositories", icon: <FolderGit2 className="w-4 h-4" /> },
              { id: "languages", label: "Languages", icon: <Code2 className="w-4 h-4" /> },
              { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "achievements", label: "Achievements", icon: <Award className="w-4 h-4" /> },
              { id: "insights", label: "AI Insights", icon: <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> },
            ].map(tab => (
              <button
                key={tab.id}
                id={`sidebar-link-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center gap-2.5 md:gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 text-left ${
                  activeTab === tab.id
                    ? "bg-[#6366f110] text-[#6366F1] font-semibold border-b-2 md:border-b-0 md:border-r-2 border-[#6366F1]"
                    : "text-zinc-500 hover:text-white hover:bg-[#18181b]/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer context profile */}
        <div id="sidebar-footer" className="mt-3 md:mt-8 pt-3 md:pt-5 border-t border-[#18181b] flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="w-9 h-9 rounded-full border border-indigo-500/20"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate text-[#fafafa]">{profile.name || profile.login}</h4>
              <p className="text-[10px] text-zinc-500 truncate font-mono">@{profile.login}</p>
            </div>
          </div>
          <button
            id="back-search-btn"
            onClick={onBackToSearch}
            className="w-auto md:w-full py-2 px-3.5 rounded-lg border border-[#27272a] bg-[#18181b] text-xs text-zinc-400 hover:text-[#fafafa] hover:bg-[#27272a] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline md:inline">Search Another</span>
            <span className="sm:hidden md:hidden">Back</span>
          </button>
        </div>
      </aside>

      {/* Main page Container */}
      <div id="main-content-flow" className="flex-1 min-w-0 flex flex-col relative bg-[#09090b]">
        
        {/* Top Header navbar */}
        <header id="dashboard-navbar" className="h-16 border-b border-[#18181b] bg-[#09090b] px-6 flex items-center justify-between relative z-10 gap-4">
          {/* Quick inline search form */}
          <form id="navbar-quick-search" onSubmit={handleNewSearch} className="relative max-w-sm w-full hidden sm:block">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search or audit another GitHub user..."
              value={newSearchQuery}
              onChange={(e) => setNewSearchQuery(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-[#6366F1] focus:outline-none text-[#fafafa] placeholder-zinc-500"
            />
          </form>

          {/* Small responsive brand text for mobile screens */}
          <div className="sm:hidden font-sans font-bold text-sm text-[#fafafa]">
            Dev<span className="text-[#6366F1]">Insight</span> &middot; <span className="capitalize text-zinc-400 font-semibold">{activeTab}</span>
          </div>

          {/* Action buttons list */}
          <div id="navbar-actions-list" className="flex items-center gap-3">
            {/* Theme trigger */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 mr-1 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun id="sun" className="w-4 h-4" /> : <Moon id="moon" className="w-4 h-4" />}
            </button>

            {/* Notification triggers */}
            <div className="relative">
              <button
                id="noti-btn"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-400 relative hover:text-white transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="w-1.5 h-1.5 bg-[#6366F1] rounded-full absolute top-1.5 right-1.5" />
              </button>
              {notificationOpen && (
                <div id="noti-dropdown" className="absolute right-0 mt-2.5 w-64 rounded-xl border border-[#27272a] bg-[#18181b] p-4 shadow-xl text-left z-30">
                  <h4 className="text-xs font-bold mb-2 text-[#fafafa] tracking-tight">Systems Status</h4>
                  <div className="space-y-2 text-[10px]">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/25">
                      GitHub API loaded safely using dedicated fallback tokens.
                    </div>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/25">
                      Portfolio metrics processed for @{profile.login}.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Top right Avatar bubble */}
            <div id="nav-user-profile-bubble" className="flex items-center gap-2 pl-2 border-l border-[#18181b]">
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="w-8 h-8 rounded-full border border-zinc-800"
              />
              <span className="text-xs font-semibold hidden md:block text-zinc-300">{profile.name || profile.login}</span>
            </div>
          </div>
        </header>

        {/* Center content slot */}
        <main id="dashboard-center-wrapper" className="flex-1 p-6 overflow-y-auto relative">
          
          {/* TAB CONTENT: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div
              id="tab-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Profile banner section */}
              <div id="overview-banner-panel" className="relative p-6 rounded-2xl border border-[#27272a] bg-[#18181b] overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-20 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                    <img
                      src={profile.avatar_url}
                      alt={profile.login}
                      className="w-20 h-20 rounded-2xl shadow-lg border-2 border-indigo-500"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h1 className="font-sans font-bold text-2xl tracking-tight">{profile.name || profile.login}</h1>
                        <a
                          href={profile.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#09090b] border border-[#27272a] text-zinc-400 hover:text-[#6366F1] transition-colors"
                        >
                          <span>Profile</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-xs font-mono text-indigo-500 hover:underline">@{profile.login}</p>
                      {profile.bio && <p className="text-sm text-slate-500 dark:text-zinc-400 font-sans max-w-xl">{profile.bio}</p>}
                    </div>
                  </div>

                  {/* High level rating score status */}
                  <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] text-center flex flex-col items-center justify-center min-w-[130px] self-stretch md:self-auto py-5">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Score badge</span>
                    <span className="text-2xl font-black text-[#6366F1] tracking-tight mt-1">{score.overall}/100</span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 border border-emerald-500/20">{score.tier}</span>
                  </div>
                </div>

                {/* Secondary list indicators */}
                <div id="profile-meta-grid" className="mt-6 pt-5 border-t border-[#27272a] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-zinc-400">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-500" />
                      <span className="truncate">{profile.company}</span>
                    </div>
                  )}
                  {profile.blog && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-cyan-500" />
                      <a href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="truncate hover:underline text-indigo-500">
                        {profile.blog}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Member for {accAge.years > 0 ? `${accAge.years} yr ${accAge.months} mo` : `${accAge.months} months`}</span>
                  </div>
                </div>
              </div>

              {/* Number overview counters */}
              <div id="overview-cards-grid" className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { title: "Public Repos", count: profile.public_repos, icon: <FolderGit2 className="w-4 h-4 text-indigo-500" />, border: "border-indigo-500/20" },
                  { title: "Total Stars", count: repositories.reduce((sum, r) => sum + r.stargazers_count, 0), icon: <Star className="w-4 h-4 text-amber-500" />, border: "border-amber-500/20" },
                  { title: "Total Forks", count: repositories.reduce((sum, r) => sum + r.forks_count, 0), icon: <GitFork className="w-4 h-4 text-cyan-500" />, border: "border-cyan-500/20" },
                  { title: "Followers", count: profile.followers, icon: <Users className="w-4 h-4 text-emerald-500" />, border: "border-emerald-500/20" },
                  { title: "Following", count: profile.following, icon: <Users className="w-4 h-4 text-rose-500" />, border: "border-rose-500/20" },
                  { title: "Gists Count", count: profile.public_gists, icon: <Layers className="w-4 h-4 text-indigo-400" />, border: "border-indigo-500/20" },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    id={`stat-card-${idx}`}
                    className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] shadow-lg flex flex-col justify-between hover:border-[#6366F1]/50 transition-all group"
                  >
                    <div className="flex items-center justify-between text-zinc-500 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{card.title}</span>
                      {card.icon}
                    </div>
                    <span className="font-sans font-black text-2xl tracking-tight text-[#fafafa] pt-2">
                      <AnimatedCount value={card.count} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Languages donut diagram + Repository specialized milestones */}
              <div id="language-donut-milestones-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Donut chart analysis */}
                <div id="donut-chart-card" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-base mb-1">Language Allocation</h3>
                    <p className="text-xs text-zinc-500">Distribution of programming languages across repositories.</p>
                  </div>

                  {/* Chart view container */}
                  <div className="h-44 my-4 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languages}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="percentage"
                        >
                          {languages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: "#18181b", borderColor: "#27272a", borderRadius: "10px", fontSize: "11px", color: "#f4f4f5" }}
                          formatter={(value) => [`${value}%`, "Allocation"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Total</span>
                      <p className="text-xl font-bold">{repositories.length} repos</p>
                    </div>
                  </div>

                  {/* Legend list block */}
                  <div className="space-y-1.5 pt-2 border-t border-[#27272a] text-xs">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                          <span className="font-semibold">{lang.name}</span>
                        </div>
                        <span className="text-zinc-400 font-mono text-[11px]">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone cards block */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-base mb-1">Specialized Milestones</h3>
                    <p className="text-xs text-zinc-500">Highlighted repository checkpoints identified within public data.</p>
                  </div>

                  <div id="milestones-card-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {highlights.starred && (
                      <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 mt-0.5">
                          <Star className="w-4 h-4 fill-amber-500/10" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-amber-500 uppercase font-black tracking-wider block mb-0.5">Most Starred Codebase</span>
                          <a href={highlights.starred.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold font-mono truncate hover:underline block text-[#fafafa]">{highlights.starred.name}</a>
                          <span className="text-[10px] text-zinc-500 font-medium block mt-1">{highlights.starred.stargazers_count} stars &middot; {highlights.starred.language || "Markdown"}</span>
                        </div>
                      </div>
                    )}

                    {highlights.forked && (
                      <div className="p-3.5 rounded-xl border border-purple-500/10 bg-purple-500/5 flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 mt-0.5">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-purple-400 uppercase font-black tracking-wider block mb-0.5">Most Forked Codebase</span>
                          <a href={highlights.forked.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold font-mono truncate hover:underline block text-[#fafafa]">{highlights.forked.name}</a>
                          <span className="text-[10px] text-zinc-500 font-medium block mt-1">{highlights.forked.forks_count} forks &middot; {highlights.forked.language || "Unknown"}</span>
                        </div>
                      </div>
                    )}

                    {highlights.largest && (
                      <div className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-indigo-400 uppercase font-black tracking-wider block mb-0.5">Largest Workspace</span>
                          <a href={highlights.largest.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold font-mono truncate hover:underline block text-[#fafafa]">{highlights.largest.name}</a>
                          <span className="text-[10px] text-zinc-500 font-medium block mt-1">{(highlights.largest.size / 1024).toFixed(1)} MB &middot; {highlights.largest.language || "Unknown"}</span>
                        </div>
                      </div>
                    )}

                    {highlights.newest && (
                      <div className="p-3.5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-500 mt-0.5">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block mb-0.5">Newest Hub</span>
                          <a href={highlights.newest.html_url} target="_blank" rel="noreferrer" className="text-xs font-bold font-mono truncate hover:underline block text-[#fafafa]">{highlights.newest.name}</a>
                          <span className="text-[10px] text-zinc-500 font-medium block mt-1">Created: {new Date(highlights.newest.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#09090b] flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="font-bold flex items-center gap-1.5 text-[#fafafa]">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        AI Insights Available
                      </span>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Gemini processed strengths and observative analyses for this portfolio profile.</p>
                    </div>
                    <button
                      id="overview-to-insights-btn"
                      onClick={() => setActiveTab("insights")}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-[11px] shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Audit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: REPOSITORIES */}
          {activeTab === "repositories" && (
            <motion.div
              id="tab-repositories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Repository header metrics */}
              <div id="repositories-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa]">
                    {dbTokenActive ? "Public & Private Repositories" : "Public Repositories"}
                  </h1>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">Explore, search, filter, and drill into specialized workspace repositories.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-400 text-xs font-bold tracking-tight">
                    {repositories.length} Total Repositories
                  </div>
                </div>
              </div>

              {/* Secure Token / Missing private repos explanatory panel */}
              <div id="private-repos-advisory" className="p-4 rounded-xl border border-dashed border-[#27272a] bg-[#141416]/40 space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                      <span className={`w-2 h-2 rounded-full ${dbTokenActive ? "bg-emerald-500" : "bg-indigo-500"}`} />
                      <span>{dbTokenActive ? "Private repository scanning authenticated" : "Missing private repositories in the audited catalog?"}</span>
                    </div>
                    <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                      {dbTokenActive 
                        ? `Auditing user profile "${data.profile.login}" using your customized Personal Access Token (PAT).`
                        : "Due to standard privacy boundaries, GitHub restricts unauthenticated queries to public codebases only."
                      }
                    </p>
                  </div>
                  <button
                    id="manage-db-token"
                    onClick={() => setShowDbToken(!showDbToken)}
                    className="px-3.5 py-1.5 self-start sm:self-center bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-xs font-bold text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{dbTokenActive ? "Manage Access Token" : "Link Private Repos"}</span>
                  </button>
                </div>

                {showDbToken && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 border-t border-[#27272a]/70 space-y-3"
                  >
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                      Supply a GitHub <span className="text-zinc-200">Personal Access Token (classic)</span> that has the <code className="bg-zinc-900 px-1 py-0.5 rounded font-mono text-zinc-300 text-[10px]">repo</code> scope selected. It is securely saved in your browser storage and is with each profile request.
                    </p>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxx"
                        value={dbTokenInput}
                        onChange={(e) => setDbTokenInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] placeholder-zinc-700 font-mono focus:outline-none focus:border-[#6366F1]"
                      />
                      <button
                        onClick={saveDbToken}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        {dbTokenActive ? "Update" : "Save & Scan"}
                      </button>
                      {dbTokenActive && (
                        <button
                          onClick={() => {
                            setDbTokenInput("");
                            localStorage.removeItem("devinsight-gh-token");
                            setDbTokenActive(false);
                            setShowDbToken(false);
                            onSearchNewUser(data.profile.login);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-450 text-xs transition-all cursor-pointer"
                        >
                          Clear Token
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Filtering Controls */}
              <div id="repo-controls-panel" className="p-4 rounded-xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Text query input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by repository name/description..."
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-4 py-2.5 text-xs focus:ring-1.5 focus:ring-[#6366F1] focus:outline-none text-[#fafafa] placeholder-zinc-500"
                  />
                </div>

                {/* Filters right selectors */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  
                  {/* Select Language dropdown */}
                  <div className="flex items-center gap-2 bg-[#09090b] px-3 py-1.5 rounded-lg border border-[#27272a]">
                    <Filter className="w-3.5 h-3.5 text-[#6366F1]" />
                    <select
                       id="lang-select-filter"
                       value={repoLanguageFilter}
                       onChange={(e) => setRepoLanguageFilter(e.target.value)}
                       className="bg-[#09090b] text-[#fafafa] border-none text-xs focus:outline-none focus:ring-0 font-medium cursor-pointer"
                    >
                      <option value="all" className="bg-[#18181b] text-[#fafafa]">All Languages</option>
                      {distinctLanguages.map((l, idx) => (
                        <option key={idx} value={l} className="bg-[#18181b] text-[#fafafa]">{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort selector dropdown */}
                  <div className="flex items-center gap-2 bg-[#09090b] px-3 py-1.5 rounded-lg border border-[#27272a]">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sort:</span>
                    <select
                      id="sort-select-filter"
                      value={repoSortField}
                      onChange={(e) => setRepoSortField(e.target.value as any)}
                      className="bg-[#09090b] text-[#fafafa] border-none text-xs focus:outline-none focus:ring-0 font-semibold cursor-pointer"
                    >
                      <option value="stars" className="bg-[#18181b] text-[#fafafa]">Popularity (Stars)</option>
                      <option value="forks" className="bg-[#18181b] text-[#fafafa]">Forks Density</option>
                      <option value="size" className="bg-[#18181b] text-[#fafafa]">Codebase Size</option>
                      <option value="name" className="bg-[#18181b] text-[#fafafa]">Name (Alpha)</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Repositories grid/list table */}
              <div id="repos-table-box" className="border border-[#27272a] rounded-2xl bg-[#18181b] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#09090b] font-bold text-zinc-400 border-b border-[#27272a] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-4">Repository Name</th>
                        <th className="px-6 py-4">Security Stars</th>
                        <th className="px-6 py-4">Forks</th>
                        <th className="px-6 py-4">Primary Language</th>
                        <th className="px-6 py-4">Code Size</th>
                        <th className="px-6 py-4">Created Date</th>
                        <th className="px-6 py-4 text-right">Reference Page</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {filteredRepos.length > 0 ? (
                        filteredRepos.map((repo) => (
                          <tr key={repo.id} className="hover:bg-zinc-800/10 transition-colors">
                            <td className="px-6 py-4.5 font-bold font-mono">
                              <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                                <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-sm text-[#6366F1] hover:underline flex items-center gap-1.5">
                                  <span>{repo.name}</span>
                                  {repo.fork && <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/15">fork</span>}
                                </a>
                                {repo.description && (
                                  <p className="text-[11px] text-zinc-500 truncate font-sans tracking-normal font-normal">
                                    {repo.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4.5 font-serif">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                                <GitFork className="w-3.5 h-3.5 text-purple-500" />
                                <span>{repo.forks_count}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5">
                              {repo.language ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language.toLowerCase()] || LANGUAGE_COLORS["other"] }} />
                                  <span className="font-semibold text-slate-700 dark:text-zinc-300">{repo.language}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 dark:text-zinc-500 font-medium">Markdown</span>
                              )}
                            </td>
                            <td className="px-6 py-4.5 font-mono text-xs">
                              {repo.size > 1024 ? `${(repo.size / 1024).toFixed(1)} MB` : `${repo.size} KB`}
                            </td>
                            <td className="px-6 py-4.5 text-slate-400 dark:text-zinc-500 text-[11px]">
                              {new Date(repo.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 dark:bg-zinc-800 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-400 dark:text-zinc-500">
                            No matching repositories found. Adjust filters and try again.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: LANGUAGES */}
          {activeTab === "languages" && (
            <motion.div
              id="tab-languages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Languages banner */}
              <div id="languages-header">
                <h1 className="font-sans font-bold text-2xl tracking-tight">Codebase Languages</h1>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-sans mt-0.5">Explore detailed language distributions and customize tech stack highlights.</p>
              </div>

              {/* Dual grid mapping distributions and custom technology generator */}
              <div id="languages-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left hand distribution details */}
                <div id="distribution-metrics-card" className="lg:col-span-1 p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl space-y-4">
                  <h3 className="font-sans font-bold text-base mb-2 text-[#fafafa]">Detailed Allocations</h3>
                  {languages.map((lang, idx) => (
                    <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-[#09090b] border border-[#27272a]">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                          <span>{lang.name}</span>
                        </span>
                        <span className="font-mono">{lang.percentage}%</span>
                      </div>
                      {/* Percent visual progress bar */}
                      <div className="w-full h-1.5 bg-[#18181b] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right hand interactive technology stack select tags */}
                <div id="interactive-skills-card" className="lg:col-span-2 p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-base text-[#fafafa]">Technology Stack Analysis</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Toggle technologies or tools used in coordination with this developer's public language profile.</p>
                  </div>

                  {/* Categories layout slots */}
                  <div id="interactive-badge-columns" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Front-end technologies selection */}
                    <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b]/55">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Frontend Hub</h4>
                      <div className="flex flex-wrap gap-2">
                        {allAvailableStack.filter(t => t.category === "frontend").map((tech, idx) => {
                          const isSelected = selectedTechStack.includes(tech.name);
                          return (
                            <button
                              key={idx}
                              id={`tech-badge-${tech.name}`}
                              onClick={() => toggleTech(tech.name)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold"
                                  : "bg-[#09090b] border border-[#27272a] text-zinc-400 hover:border-indigo-500/30"
                              }`}
                            >
                              {tech.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Backend, database and devops selection */}
                    <div className="p-4 rounded-xl border border-[#27272a] bg-[#18181b]/55">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Backend & DevOps</h4>
                      <div className="flex flex-wrap gap-2">
                        {allAvailableStack.filter(t => ["backend", "database", "devops"].includes(t.category)).map((tech, idx) => {
                          const isSelected = selectedTechStack.includes(tech.name);
                          return (
                            <button
                              key={idx}
                              id={`tech-badge-${tech.name}`}
                              onClick={() => toggleTech(tech.name)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold"
                                  : "bg-[#09090b] border border-[#27272a] text-zinc-400 hover:border-purple-500/30"
                              }`}
                            >
                              {tech.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Summary showcase list of badges and total parsed summary */}
                  <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-[#fafafa]">Active Skill Palette:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTechStack.map((tech, idx) => (
                        <span key={idx} id={`selected-badge-${tech}`} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-600 border border-indigo-500/30 text-white uppercase tracking-wider font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div
              id="tab-analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Analytics header metrics */}
              <div id="analytics-header">
                <h1 className="font-sans font-bold text-2xl tracking-tight">Activity Analytics & Charts</h1>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-sans mt-0.5">Inspect repository distributions, star trajectories, and chronologies over time.</p>
              </div>

              {/* Developer Score Circular Gauge Widget & Metrics */}
              <div id="score-overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Circular chart circle widget */}
                <div id="circular-score-card" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col items-center justify-center text-center">
                  <h3 className="font-sans font-bold text-base mb-4 text-[#fafafa]">Developer Performance Score</h3>
                  
                  {/* Circle progress container */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r={circleRadius}
                        className="stroke-[#27272a] fill-none"
                        strokeWidth="11"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r={circleRadius}
                        className={`fill-none ${getScoreColor()}`}
                        strokeWidth="11"
                        strokeDasharray={circleCircumference}
                        initial={{ strokeDashoffset: circleCircumference }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute text-center text-[#fafafa]">
                      <span className="text-3xl font-black tracking-tight">{score.overall}%</span>
                      <p className="text-[9px] font-bold uppercase text-zinc-500 mt-0.5">Rating Index</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mt-4">
                    {score.tier}
                  </span>
                </div>

                {/* Score criteria breakdown parameters */}
                <div id="score-breakdown-card" className="md:col-span-2 p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-base mb-1 text-[#fafafa]">Index Breakdown Criteria</h3>
                    <p className="text-xs text-zinc-500 mb-4">Calculated weights mapped according to public repositories.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Public Repo Weight (Max 20)", val: score.breakdown.repoCount, pct: (score.breakdown.repoCount / 20) * 100, color: "bg-indigo-500" },
                      { label: "Language Diversity Weight (Max 15)", val: score.breakdown.languageDiversity, pct: (score.breakdown.languageDiversity / 15) * 100, color: "bg-purple-500" },
                      { label: "Social Stature / Popularity (Max 35)", val: score.breakdown.popularity, pct: (score.breakdown.popularity / 35) * 100, color: "bg-amber-500" },
                      { label: "Push Engagement Consistency (Max 15)", val: score.breakdown.consistency, pct: (score.breakdown.consistency / 15) * 100, color: "bg-emerald-500" },
                      { label: "Code Size Weight (Max 15)", val: score.breakdown.codeSize, pct: (score.breakdown.codeSize / 15) * 100, color: "bg-cyan-500" },
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-zinc-400">{row.label}</span>
                          <span className="font-mono font-bold text-[#fafafa]">{row.val} pts</span>
                        </div>
                        <div className="w-full h-1 bg-[#09090b] border border-[#27272a] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Data visualizations and charts block */}
              <div id="charts-grid-analytics" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Trend: repos created per year */}
                <div id="area-chart-card" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl space-y-4">
                  <div>
                    <h3 className="font-sans font-bold text-base mb-1 text-[#fafafa]">Creation Timeline</h3>
                    <p className="text-xs text-zinc-500">Repositories created year-over-year.</p>
                  </div>
                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis dataKey="year" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#18181b", borderColor: "#27272a", borderRadius: "10px", color: "white" }} />
                        <Area type="monotone" dataKey="count" name="Repos Created" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Star earned per repo */}
                <div id="bar-chart-card" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl space-y-4">
                  <div>
                    <h3 className="font-sans font-bold text-base mb-1 text-[#fafafa]">Star Distribution</h3>
                    <p className="text-xs text-zinc-500">Top 5 most prominent repositories compared.</p>
                  </div>
                  <div className="h-64 pt-2">
                    {data.starsTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.starsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "#27272a" : "#f1f5f9"} />
                          <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                          <Tooltip contentStyle={{ background: "#18181b", borderColor: "#27272a", borderRadius: "10px", color: "white" }} />
                          <Bar dataKey="stars" name="Stars Earned" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={25} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
                        Insufficient repository stars to show historical comparisons.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <motion.div
              id="tab-achievements"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Achievements header metrics */}
              <div id="achievements-header">
                <h1 className="font-sans font-bold text-2xl tracking-tight">Achievements & Badges</h1>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-sans mt-0.5">Explore standard developer accomplishments auto-unlocked based on public indicators.</p>
              </div>

              {/* Achievements visual grid */}
              <div id="achievements-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    id={`achievement-card-${ach.id}`}
                    className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                      ach.unlocked
                        ? "bg-[#18181b] border-[#27272a] shadow-xl hover:border-[#6366F1]/55"
                        : "bg-[#18181b]/35 border-[#27272a]/45 opacity-55"
                    }`}
                  >
                    {/* Visual pattern behind badge */}
                    {ach.unlocked && (
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full pointer-events-none" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon container bubble */}
                      <div className={`p-3.5 rounded-xl border ${
                        ach.unlocked
                          ? "bg-indigo-950/45 border-indigo-900/30 text-[#6366F1]"
                          : "bg-[#09090b] border-[#27272a] text-zinc-500"
                      }`}>
                        {/* Mapped icon rendering */}
                        {ach.icon === "Globe" && <Globe className="w-5 h-5" />}
                        {ach.icon === "Award" && <Award className="w-5 h-5 text-amber-500" />}
                        {ach.icon === "Code" && <Code2 className="w-5 h-5 text-indigo-400" />}
                        {ach.icon === "Cpu" && <Cpu className="w-5 h-5 text-emerald-500" />}
                        {ach.icon === "Layers" && <Layers className="w-5 h-5 text-purple-400" />}
                        {ach.icon === "Boxes" && <Boxes className="w-5 h-5" />}
                        {ach.icon === "ShieldAlert" && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                      </div>

                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#fafafa]">{ach.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed leading-relaxed">{ach.description}</p>
                      </div>
                    </div>

                    {/* Unlock badge tag bottom */}
                    <div className="mt-4 pt-3.5 border-t border-[#27272a] flex items-center justify-between text-[11px] font-sans font-bold">
                      <span className="text-[10px] uppercase text-zinc-500 tracking-wider">category: {ach.category}</span>
                      {ach.unlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="text-zinc-650">Locked</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: INSIGHTS */}
          {activeTab === "insights" && (
            <motion.div
              id="tab-insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div id="insights-header">
                <h1 className="font-sans font-bold text-2xl tracking-tight">AI Diagnostic Insights</h1>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-sans mt-0.5">Custom developer quality notes and growth indicators analyzed using Gemini AI.</p>
              </div>

              {/* Summary details container card */}
              <div id="insights-detail-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Big Summary Callout */}
                <div id="big-summary-card" className="md:col-span-2 p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#6366F1] block mb-2">Audit Report</span>
                    <h3 className="font-sans font-bold text-base mb-3 text-[#fafafa]">Developer Assessment</h3>
                    <p className="text-sm font-sans text-zinc-300 leading-relaxed font-sans mt-2">
                      {insights.summary}
                    </p>
                  </div>
                  
                  {/* Observation lists */}
                  <div className="pt-6 border-t border-[#27272a] mt-6 space-y-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Structural Observations</span>
                    <ul className="space-y-2 text-xs font-sans">
                      {insights.observations.map((obs, idx) => (
                        <li key={idx} className="flex gap-2 text-zinc-400 leading-relaxed">
                          <span className="text-[#6366F1] font-bold">•</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right side Strengths / Gaps listing */}
                <div id="pros-cons-card" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl flex flex-col gap-6">
                  
                  {/* Strengths card */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Diagnosed Strengths</span>
                    </h4>
                    <div className="space-y-2">
                      {insights.gaps.map((gap, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-400 font-semibold leading-relaxed">
                          {gap}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constructive Gaps list */}
                  <div className="space-y-3 pt-4 border-t border-[#27272a]">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>Career Gaps / Growth</span>
                    </h4>
                    <div className="space-[#27272a] space-y-2">
                      {insights.gaps.map((gap, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-400 font-semibold leading-relaxed">
                          {gap}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Aligning Tech Trends badges container */}
              <div id="tech-trends" className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b] shadow-xl space-y-4">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#fafafa]">Trending Alignments</h3>
                  <p className="text-xs text-zinc-500 mt-1">Highlighted technology waves matching this engineer's development footprint.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {insights.techTrends.map((trend, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#27272a] bg-[#09090b] text-xs text-zinc-300 font-bold text-center">
                      {trend}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </main>

        {/* Global sticky footer info */}
        <footer id="dashboard-sticky-footer" className="bg-white/40 dark:bg-zinc-900/10 backdrop-blur-md py-4 px-6 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 z-10">
          <span>GitSpectra Developer Suite &middot; Calculated in Live session</span>
          <span className="font-mono">UTC: 2026-06-07 21:14</span>
        </footer>

      </div>
    </div>
  );
}

// Global static color lookup matching languages exactly inside server
const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "#f1e05a",
  typescript: "#3178c6",
  python: "#3572a5",
  html: "#e34c26",
  css: "#563d7c",
  go: "#00add8",
  rust: "#dea584",
  "c++": "#f34b7d",
  c: "#555555",
  "c#": "#178600",
  java: "#b07219",
  php: "#4f5d95",
  ruby: "#701516",
  shell: "#89e051",
  swift: "#f05138",
  kotlin: "#a97bff",
  dart: "#00b4ab",
  r: "#198ce7",
  jupyter: "#da5b0b",
  vue: "#41b883",
  other: "#71717a",
};
