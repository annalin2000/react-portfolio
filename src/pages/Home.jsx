import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  useEffect(() => {
    async function load() {
      try {
        setStatus("loading");
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();

        const mapByName = new Map(data.map((r) => [r.name, r]));

        const weekly = WEEKLY_REPOS.map((name, idx) => {
          const r = mapByName.get(name);

          if (!r) {
            return {
              id: `missing-${name}`,
              weekLabel: `Week ${idx + 1}`,
              name,
              description: "Repo not found (check spelling/case).",
              language: "Other",
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
            language: r.language || "Other",
            stars: r.stargazers_count || 0,
            githubUrl: r.html_url,
            liveUrl: r.homepage || "",
          };
        });

        setProjects(weekly);
        setStatus("ok");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }

    load();
  }, []);

  const topFour = useMemo(() => projects.slice(0, 4), [projects]);

  return (
    <section className="container home">
      {/* HERO */}
      <h1 className="home-title">Hi, I am Anna...</h1>
      <div className="home-underline" />

      <p className="home-text">
        I am a pharmacist turned software engineer passionate about building efficient, user centered full stack
        applications. I enjoy solving problems, exploring new technologies, and turning ideas into functional products.
      </p>

      {/* Single button like you wanted */}

      {/* Featured preview (ONLY 4) */}
      <div className="home-projects">
        <div className="home-projects-head">
          <h2 className="home-projects-title">Projects</h2>
        </div>

        {status === "loading" && <div className="notice">Loading projects…</div>}
        {status === "error" && (
          <div className="notice error">Couldn’t load GitHub repos. Refresh and try again.</div>
        )}

        {status === "ok" && (
          <>
            <div className="grid">
              {topFour.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>

            {}
            <div className="home-projects-actions">
              <Link className="btn btn-ghost" to="/projects">
                Show more →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
