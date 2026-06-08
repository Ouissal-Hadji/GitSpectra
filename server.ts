/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyticsData, GitHubProfile, GitHubRepository, LanguageStat, DeveloperScoreDetail, DeveloperAchievement, DeveloperInsights } from "./src/types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client globally with proper header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

// GitHub API Token
const githubToken = process.env.GITHUB_TOKEN;

// Standard Color palette for languages
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

// Helper for fetching GitHub APIs with optional user token support
async function fetchGitHub(endpoint: string, customToken?: string) {
  const url = `https://api.github.com/${endpoint}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitSpectra-Application",
  };

  // ✅ تصحيح نهائي وشامل لحالة الأحرف ليتطابق مع السطر 36
  const activeToken = customToken || githubToken;
  if (activeToken) {
    headers["Authorization"] = `token ${activeToken}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("USER_NOT_FOUND");
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw new Error(`GITHUB_API_ERROR: ${response.statusText}`);
  }
  return response.json();
}

// Master endpoint for developer profiling
app.get("/api/analyze/:username", async (req, res) => {
  const { username } = req.params;
  const customToken = req.headers["x-github-token"] as string | undefined;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    let profile: GitHubProfile | null = null;
    let repositories: GitHubRepository[] = [];
    let isSelf = false;

    // 1. Fetch user profile
    if (customToken) {
      try {
        const authenticatedUser = await fetchGitHub("user", customToken);
        if (authenticatedUser && authenticatedUser.login && authenticatedUser.login.toLowerCase() === username.toLowerCase()) {
          profile = authenticatedUser;
          isSelf = true;
          console.log(`Auditing matching authenticated developer ${username} (private/public enabled)`);
        }
      } catch (authErr) {
        console.warn("Failed to authorize custom token owner identity; falling back to profile checks:", authErr);
      }
    }

    if (!profile) {
      profile = await fetchGitHub(`users/${username}`, customToken);
    }

    // 2. Fetch up to 100 repositories
    if (isSelf) {
      repositories = await fetchGitHub("user/repos?per_page=100&sort=updated&type=all", customToken);
    } else {
      repositories = await fetchGitHub(`users/${username}/repos?per_page=100&sort=updated`, customToken);
    }

    // 3. Compute overall language statistics
    const languageCounts: Record<string, number> = {};
    let totalLanguageCount = 0;
    repositories.forEach((repo) => {
      if (repo.language) {
        const lang = repo.language.toLowerCase();
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        totalLanguageCount++;
      }
    });

    const parsedLanguages: LanguageStat[] = Object.entries(languageCounts)
      .map(([name, count]) => {
        const pct = totalLanguageCount > 0 ? (count / totalLanguageCount) * 100 : 0;
        const color = LANGUAGE_COLORS[name] || LANGUAGE_COLORS["other"];
        const formatName = name.charAt(0).toUpperCase() + name.slice(1);
        return {
          name: formatName,
          count,
          percentage: Math.round(pct * 10) / 10,
          color,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Keep top 5 and bundle other
    let languages: LanguageStat[] = [];
    if (parsedLanguages.length > 5) {
      languages = parsedLanguages.slice(0, 5);
      const otherPct = parsedLanguages.slice(5).reduce((sum, item) => sum + item.percentage, 0);
      const otherCount = parsedLanguages.slice(5).reduce((sum, item) => sum + item.count, 0);
      languages.push({
        name: "Other",
        count: otherCount,
        percentage: Math.round(otherPct * 10) / 10,
        color: LANGUAGE_COLORS["other"],
      });
    } else {
      languages = parsedLanguages;
    }

    // Default if no languages used
    if (languages.length === 0) {
      languages.push({ name: "Markdown", count: 0, percentage: 100, color: "#71717a" });
    }

    // 4. Calculate total stars and forks
    const totalStars = repositories.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, r) => sum + r.forks_count, 0);
    const totalSizeKB = repositories.reduce((sum, r) => sum + r.size, 0);

    // 5. Activity status (last pushed repo)
    let lastPushedDate: Date | null = null;
    repositories.forEach((repo) => {
      const d = new Date(repo.pushed_at);
      if (!lastPushedDate || d > lastPushedDate) {
        lastPushedDate = d;
      }
    });

    const now = new Date();
    const daysSinceLastPush = lastPushedDate
      ? Math.round((now.getTime() - lastPushedDate.getTime()) / (1000 * 60 * 60 * 24))
      : 365;

    // 6. Calculate Developer Score (100 Max)
    const repoCountScore = Math.min(repositories.length * 0.8, 20);
    const langDiversityScore = Math.min(Object.keys(languageCounts).length * 3, 15);
    const popularityScore = Math.min((totalStars * 1.5) + (totalForks * 2), 35);
    const consistencyScore = daysSinceLastPush <= 7 ? 15 : daysSinceLastPush <= 30 ? 12 : daysSinceLastPush <= 90 ? 8 : 4;
    const codeSizeScore = Math.min((totalSizeKB / 1000) * 1.5, 15);

    const overallScore = Math.round(repoCountScore + langDiversityScore + popularityScore + consistencyScore + codeSizeScore);
    const scoreVal = Math.min(Math.max(overallScore, 10), 99);

    let tier: DeveloperScoreDetail["tier"] = "Beginner Developer";
    if (scoreVal >= 90) tier = "Elite Developer";
    else if (scoreVal >= 80) tier = "Advanced Developer";
    else if (scoreVal >= 70) tier = "Strong Developer";
    else if (scoreVal >= 60) tier = "Growing Developer";

    const score: DeveloperScoreDetail = {
      overall: scoreVal,
      tier,
      breakdown: {
        repoCount: Math.round(repoCountScore),
        languageDiversity: Math.round(langDiversityScore),
        popularity: Math.round(popularityScore),
        consistency: Math.round(consistencyScore),
        codeSize: Math.round(codeSizeScore),
      },
    };

    // 7. Calculate Achievements
    const achievements: DeveloperAchievement[] = [
      {
        id: "open_source_explorer",
        title: "Open Source Explorer",
        description: "Embarked on the public coding journey with public repositories.",
        icon: "Globe",
        unlocked: repositories.length > 0,
        category: "repos",
      },
      {
        id: "code_warrior",
        title: "Code Warrior",
        description: "Built a robust hub of codebase products with over 15 public repositories.",
        icon: "ShieldAlert",
        unlocked: repositories.length >= 15,
        category: "repos",
      },
      {
        id: "frontend_expert",
        title: "Frontend Expert",
        description: "Mastered front-end interactivity with hefty JavaScript or TypeScript repositories.",
        icon: "Code",
        unlocked: (languageCounts["typescript"] || 0) + (languageCounts["javascript"] || 0) >= 5,
        category: "languages",
      },
      {
        id: "backend_engineer",
        title: "Backend Engineer",
        description: "Adept in backend logic and microservices using Python, Go, Rust, C++, Java, or C#.",
        icon: "Cpu",
        unlocked: (languageCounts["python"] || 0) + (languageCounts["go"] || 0) + (languageCounts["rust"] || 0) + (languageCounts["java"] || 0) > 2,
        category: "languages",
      },
      {
        id: "full_stack_developer",
        title: "Full Stack Developer",
        description: "Bridges both frontend and backend worlds seamlessly in modern engineering.",
        icon: "Layers",
        unlocked:
          ((languageCounts["typescript"] || 0) + (languageCounts["javascript"] || 0) >= 3) &&
          ((languageCounts["python"] || 0) + (languageCounts["go"] || 0) + (languageCounts["rust"] || 0) + (languageCounts["java"] || 0) >= 1),
        category: "languages",
      },
      {
        id: "repo_master",
        title: "Repository Master",
        description: "Penned a highly-starred popular engineering project with over 10 stars.",
        icon: "Award",
        unlocked: repositories.some((r) => r.stargazers_count >= 10),
        category: "influence",
      },
      {
        id: "community_contributor",
        title: "Community Contributor",
        description: "Helped others or built based on forks, enriching the overall developer ecosystem.",
        icon: "Boxes",
        unlocked: repositories.some((r) => r.fork || r.forks_count > 0),
        category: "influence",
      },
    ];

    // 8. Compute Stars Trend and Activity Trend
    const sortedByStars = [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
    const starsTrend = sortedByStars.map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
    }));

    const yearlyMap: Record<number, number> = {};
    repositories.forEach((repo) => {
      const year = new Date(repo.created_at).getFullYear();
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;
    });
    const activityTrend = Object.entries(yearlyMap)
      .map(([year, count]) => ({
        year: parseInt(year),
        count,
      }))
      .sort((a, b) => a.year - b.year);

    if (activityTrend.length === 1) {
      activityTrend.unshift({ year: activityTrend[0].year - 1, count: 0 });
    }

    // 9. Generate AI Portfolio Insights
    let insights: DeveloperInsights;

    if (ai) {
      try {
        const top5LanguagesStr = languages.slice(0, 5).map(l => `${l.name} (${l.percentage}%)`).join(', ');
        const top3ReposStr = sortedByStars.slice(0, 3).map(r => `${r.name} (Stars: ${r.stargazers_count}, Fork: ${r.fork ? "Yes" : "No"})`).join(', ');
        const bioStr = profile.bio || "No biography provided.";

        const prompt = `You are an elite developer reviewer. Analyze the following GitHub developer stats for "${username} (${profile.name || ''})":
- Bio: "${bioStr}"
- Total Repos: ${profile.public_repos}
- Total Stars: ${totalStars}
- Total Forks: ${totalForks}
- Top Languages: ${top5LanguagesStr}
- Repositories context: ${top3ReposStr}
- Developer Score Segment: ${tier} (Overall score: ${scoreVal}/100)

Provide:
1. A summary describing their engineering profile.
2. Exactly 3 strengths.
3. Exactly 2 constructive growth areas / gaps.
4. Top 3 tech trends that align with their profile.
5. Technical observations regarding repository selection, open source participation, or overall code consistency.

Format the output strictly as a JSON object matching this TypeScript interface:
{
  "summary": "Full summary statement...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "gaps": ["Area for growth 1", "Area for growth 2"],
  "techTrends": ["Trend 1", "Trend 2", "Trend 3"],
  "observations": ["Observation 1", "Observation 2"]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          model: "gemini-1.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                techTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
                observations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["summary", "strengths", "gaps", "techTrends", "observations"]
            }
          }
        });

        const textOutput = response.text || "{}";
        insights = JSON.parse(textOutput) as DeveloperInsights;
      } catch (geminiError) {
        console.error("Gemini failed, using rule fallback:", geminiError);
        insights = generateFallbackInsights(username, profile, languages, repositories, totalStars, tier);
      }
    } else {
      insights = generateFallbackInsights(username, profile, languages, repositories, totalStars, tier);
    }

    const result: AnalyticsData = {
      profile,
      repositories,
      languages,
      score,
      achievements,
      insights,
      starsTrend,
      activityTrend,
    };

    res.json(result);
  } catch (error: any) {
    console.error("Profile analysis error:", error);
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "GitHub user not found. Please check the spelling and try again." });
    } else if (error.message === "RATE_LIMIT_EXCEEDED") {
      res.status(429).json({ error: "GitHub API rate limit exceeded. Please try again later or add GITHUB_TOKEN to settings." });
    } else {
      res.status(500).json({ error: error.message || "An unexpected error occurred while analyzing the profile." });
    }
  }
});

function generateFallbackInsights(
  username: string,
  profile: GitHubProfile,
  languages: LanguageStat[],
  repositories: GitHubRepository[],
  totalStars: number,
  tier: string
): DeveloperInsights {
  const topLang = languages[0]?.name || "Unknown";
  const repoCount = repositories.length;

  return {
    summary: `${username} is a ${tier} with a focus on ${topLang}. Across ${repoCount} public repositories, they show dedicated investment in structured programming practices and regular asset updates.`,
    strengths: [
      `Strong execution in ${topLang} with a reliable repository base.`,
      `Pioneered ${repoCount} projects demonstrating hands-on development experience.`,
      totalStars > 0 ? `Secured positive social interaction with ${totalStars} stars across portfolios.` : `Maintains visible version histories on public repos.`
    ],
    gaps: [
      `Active engagement in open-source discussions and issue contributions beyond owned portfolios.`,
      `Increasing the density of custom stars and forks by publishing high-impact production apps.`
    ],
    techTrends: [
      `Advancements in the modular ${topLang} ecosystem.`,
      `CI/CD integration for automated code quality guardrails.`,
      `Cloud native microservice deployment setups.`
    ],
    observations: [
      `The engineering directory contains structured code histories with clear separation in repositories.`,
      `Most metrics show active repository updates, suggesting clean developer workflow and focus.`
    ]
  };
}

// التعديل السحابي الحاسم لتوافق وتصدير محرك Express عبر منصة Vercel 
export default app;

if (process.env.NODE_ENV !== "production") {
  async function startServer() {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  startServer();
}