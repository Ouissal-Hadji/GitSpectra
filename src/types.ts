/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  size: number; // in KB
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  open_issues_count: number;
  fork: boolean;
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface YearStats {
  year: number;
  count: number;
}

export interface DeveloperScoreDetail {
  overall: number;
  tier: "Elite Developer" | "Advanced Developer" | "Strong Developer" | "Growing Developer" | "Beginner Developer";
  breakdown: {
    repoCount: number; // Max 20
    languageDiversity: number; // Max 15
    popularity: number; // Max 35
    consistency: number; // Max 15
    codeSize: number; // Max 15
  };
}

export interface DeveloperAchievement {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  category: "repos" | "languages" | "influence" | "general";
}

export interface DeveloperInsights {
  summary: string;
  strengths: string[];
  gaps: string[];
  techTrends: string[];
  observations: string[];
}

export interface AnalyticsData {
  profile: GitHubProfile;
  repositories: GitHubRepository[];
  languages: LanguageStat[];
  score: DeveloperScoreDetail;
  achievements: DeveloperAchievement[];
  insights: DeveloperInsights;
  starsTrend: { name: string; stars: number }[];
  activityTrend: YearStats[];
}
