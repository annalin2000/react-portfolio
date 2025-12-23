import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";

const GITHUB_USER = "annalin2000";
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

const WEEKLY_REPOS = [
  "RecipeSearch",
  "AnnaPortfolio",
  "WebDevelopmentQuiz",
  "GreenLeaf",
  "AnnaPortfolioBootstrap",
  "ToDoApp",
  "README-File-Generator",
  "Notes-Application",
];

const CACHE_KEY = "gh_repos_cache_v1";
const CACHE_AT_KEY = "gh_repos_cache_at_v1";
const CACHE_TTL_MS = 20 * 60 * 1000; // 10 minutes

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setStatus("loading");
        setErrorMsg("");

        // 1) Use cached GitHub response to avoid rate limit during dev refreshes
        const cached = sessionStorage.getItem(CACHE_KEY);
        const cachedAt = sessionStorage.getItem(CACHE_AT_KEY);

        let data = null;
        if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_TTL_MS) {
          try {
            data = JSON.parse(cached);
          } catch {
            sessionStorage.removeItem(CACHE_KEY);
            sessionStorage.removeItem(CACHE_AT_KEY);
          }
        }

        // 2) If no cache, fetch from GitHub (optionally with token for local dev)
        if (!data) {
          const token = import.meta.env.VITE_GITHUB_TOKEN;

          const res = await fetch(API_URL, {
            headers: {
              Accept: "application/vnd.github+json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          });

          const text = await res.text();

          if (!res.ok) {
            // Try to show GitHub's message if present
            let message = text;
            try {
              const parsed = JSON.parse(text);
              message = parsed?.message || text;
            } catch {}

            const remaining = res.headers.get("x-ratelimit-remaining");
            const reset = res.headers.get("x-ratelimit-reset");

            if (
              res.status === 403 &&
              (message.toLowerCase().includes("rate limit") || remaining === "0")
            ) {
              const resetTime = reset
                ? new Date(Number(reset) * 1000).toLocaleString()
                : "";
              throw new Error(
                `GitHub rate limit hit (403). ${
                  resetTime ? `Resets at: ${resetTime}. ` : ""
                }Add VITE_GITHUB_TOKEN for local dev, or reduce refreshes.`
              );
            }

            throw new Error(`GitHub API error ${res.status}: ${message}`);
          }

          data = JSON.parse(text);

          // Save cache for 10 minutes
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
          sessionStorage.setItem(CACHE_AT_KEY, String(Date.now()));
        }

        // 3) Map repos into your weekly cards
        const mapByName = new Map(data.map((r) => [r.name, r]));

        const weekly = WEEKLY_REPOS.map((name, idx) => {
          const r = mapByName.get(name);

          if (!r) {
            return {
              id: `missing-${name}`,
              weekLabel: `Week ${idx + 1}`,
              name,
              description: "Repo not found (check spelling/case).",
              stars: 0,
              githubUrl: `https://github.com/${GITHUB_USER}/${name}`,
              liveUrl: "",
            };
          }

          return {
            id: r.id,
            weekLabel: `Week ${idx + 1}`,
            name: r.name,
            description: r.description || "",
            stars: r.stargazers_count || 0,
            githubUrl: r.html_url,
            liveUrl: r.homepage || "",
          };
        });

        if (!alive) return;
        setProjects(weekly);
        setStatus("ok");
      } catch (e) {
        console.error("GitHub fetch error:", e);
        if (!alive) return;
        setErrorMsg(e?.message || "Unknown error");
        setStatus("error");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="container">
      <div className="page-head">
        <h1 className="page-title">Projects</h1>
      </div>

      {status === "loading" && <div className="notice">Loading projects…</div>}

      {status === "error" && (
        <div className="notice error">
          Couldn’t load GitHub repos.
          <br />
          <span className="small">{errorMsg}</span>
          <br />
          <button
            className="btn"
            type="button"
            onClick={() => {
              sessionStorage.removeItem(CACHE_KEY);
              sessionStorage.removeItem(CACHE_AT_KEY);
              setStatus("loading");
              window.location.reload();
            }}
            style={{ marginTop: 12 }}
          >
            Retry
          </button>
        </div>
      )}

      {status === "ok" && (
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
