import { unstable_cache } from "next/cache";

const LOGIN = "divya-soni";
const REVALIDATE = 600; // ten minutes
const UA = "dvysn.com";

type Day = { date: string; count: number };

export interface Contributions {
  /** contributions per day for the last 365 days, oldest first */
  days: number[];
  /** ISO date of the last day */
  end: string;
  total: number;
  /** when anything was last pushed; only known when GITHUB_TOKEN is set */
  lastPush: string | null;
}

/**
 * Preferred source: GitHub's GraphQL API, which needs a read-only token in
 * GITHUB_TOKEN. Returns the same calendar as the profile page plus the time of
 * the latest push (no repository names).
 */
const fromApi = unstable_cache(
  async (): Promise<{ days: Day[]; lastPush: string | null } | null> => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return null;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "User-Agent": UA, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) { contributionsCollection { contributionCalendar {
            weeks { contributionDays { date contributionCount } } } } }
          viewer { repositories(first: 1, orderBy: {field: PUSHED_AT, direction: DESC}) { nodes { pushedAt } } }
        }`,
        variables: { login: LOGIN },
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const json = await res.json();
    const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
      json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const days = weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })));
    if (!days.length) throw new Error("GitHub API returned no calendar");
    return { days, lastPush: json?.data?.viewer?.repositories?.nodes?.[0]?.pushedAt ?? null };
  },
  ["github-calendar"],
  { revalidate: REVALIDATE, tags: ["github"] },
);

/**
 * Fallback without a token: the public contribution calendar from the profile
 * page. It works, but github.com sometimes turns away automated requests.
 */
async function fromProfile(): Promise<Day[]> {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    next: { revalidate: REVALIDATE, tags: ["github"] },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const html = await res.text();

  const tips = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].trim().match(/^(\d[\d,]*) contribution/);
    tips.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: Day[] = [];
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const tag = m[0];
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    if (date) days.push({ date, count: (id && tips.get(id)) || 0 });
  }
  return days;
}

export async function getContributions(): Promise<Contributions | null> {
  try {
    const api = await fromApi().catch(() => null);
    const all = (api?.days ?? (await fromProfile())).sort((a, b) => a.date.localeCompare(b.date));
    if (all.length < 7) return null;
    const year = all.slice(-365);
    return {
      days: year.map((d) => d.count),
      end: year[year.length - 1].date,
      total: year.reduce((s, d) => s + d.count, 0),
      lastPush: api?.lastPush ?? null,
    };
  } catch {
    return null;
  }
}
