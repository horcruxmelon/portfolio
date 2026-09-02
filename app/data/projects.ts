export type Project = {
  title: string;
  description: string;
  repo: string;
  gradient: string;
  repoName: string;
  image: string;
  demoUrl?: string;
};

const GITHUB_USER = "horcruxmelon";

const GRADIENTS = [
  "from-emerald-700 to-emerald-950",
  "from-sky-700 to-sky-950",
  "from-orange-700 to-orange-950",
  "from-rose-700 to-rose-950",
  "from-violet-700 to-violet-950",
  "from-teal-700 to-teal-950",
  "from-amber-700 to-amber-950",
  "from-fuchsia-700 to-fuchsia-950",
];

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  updated_at: string;
};

function prettify(name: string): string {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Fill in as demo links become available, keyed by lowercase repo name.
const DEMO_URLS: Record<string, string> = {
  iqoo: "https://youtu.be/bMo95g0SFOA",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1200&q=80";

// Curated Unsplash photos matched to what each project actually is.
const THUMBNAIL_IMAGES: Record<string, string> = {
  "runbook-executor":
    "https://images.unsplash.com/photo-1610337673044-720471f83677?auto=format&fit=crop&w=1200&q=80",
  iqoo:
    "https://images.unsplash.com/photo-1523371683773-affcb4a2e39e?auto=format&fit=crop&w=1200&q=80",
  "ml-platform":
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
  "task-management-command-center":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "task-management-system":
    "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=1200&q=80",
  "login-auth-system":
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
};

let cache: { data: Project[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function fetchProjects(): Promise<Project[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const repos: GithubRepo[] = await res.json();
  const data: Project[] = repos
    .filter((repo) => !repo.fork)
    .map((repo, i) => ({
      title: prettify(repo.name),
      description: repo.description || "No description yet.",
      repo: repo.html_url,
      gradient: GRADIENTS[i % GRADIENTS.length],
      repoName: repo.name,
      image: THUMBNAIL_IMAGES[repo.name.toLowerCase()] ?? FALLBACK_IMAGE,
      demoUrl: DEMO_URLS[repo.name.toLowerCase()],
    }));

  cache = { data, fetchedAt: Date.now() };
  return data;
}
