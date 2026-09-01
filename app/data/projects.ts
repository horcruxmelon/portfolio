export type Project = {
  title: string;
  description: string;
  repo: string;
  gradient: string;
  thumbnail: string;
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
      thumbnail: `https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo.name}`,
    }));

  cache = { data, fetchedAt: Date.now() };
  return data;
}
