import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ONE_DAY_SECONDS = 60 * 60 * 24;
export const revalidate = ONE_DAY_SECONDS;

const NODEWATCH_URL = process.env.NODEWATCH_URL || "https://nodewatch.io/";

function extractNodeCountFromHtml(html: string): number | null {
  // Try to find a <p> number near the "Node count" label
  const pNearLabel = html.match(/Node\s*count[\s\S]{0,800}?<p[^>]*>\s*([0-9,]+)\s*<\/p>/i);
  if (pNearLabel?.[1]) {
    return parseInt(pNearLabel[1].replace(/,/g, ""), 10);
  }
  // Fallback: first integer after the label within a short window
  const nearLabel = html.match(/Node\s*count[\s\S]{0,400}?([0-9]{3,7})/i);
  if (nearLabel?.[1]) {
    return parseInt(nearLabel[1], 10);
  }
  // Fallback: parse Next.js __NEXT_DATA__ script if present and search for "nodeCount"-like key
  const nextDataMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (nextDataMatch?.[1]) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      const queue: Array<any> = [data];
      while (queue.length) {
        const current = queue.shift();
        if (!current) continue;
        if (typeof current === "number" && Number.isInteger(current) && current > 0 && current < 200000) {
          return current;
        }
        if (typeof current === "string") {
          const m = current.match(/^\d{3,7}$/);
          if (m) return parseInt(m[0], 10);
        }
        if (Array.isArray(current)) {
          for (const v of current) queue.push(v);
        } else if (typeof current === "object") {
          for (const [k, v] of Object.entries(current)) {
            if (/node\s*count/i.test(k) && typeof v === "number") return v as number;
            queue.push(v);
          }
        }
      }
    } catch {}
  }
  return null;
}

async function fetchBeaconNodeCount(): Promise<number> {
  const commonHeaders = {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
  } as const;

  // Attempt 1: Fetch the site directly (may fail due to CF/JS challenges)
  try {
    const res = await fetch(NODEWATCH_URL, {
      cache: "no-store",
      headers: commonHeaders,
    });
    if (res.ok) {
      const html = await res.text();
      const count = extractNodeCountFromHtml(html);
      if (count && Number.isFinite(count)) return count;
    }
  } catch {}

  // Attempt 2: Use a text mirror to bypass client-side rendering
  try {
    const mirrorUrl = `https://r.jina.ai/http://nodewatch.io/`;
    const res = await fetch(mirrorUrl, {
      cache: "no-store",
      headers: { ...commonHeaders, accept: "text/plain" },
    });
    if (res.ok) {
      const text = await res.text();
      const m = text.match(/Node\s*count[^\d]*([0-9,]{3,7})/i);
      if (m?.[1]) return parseInt(m[1].replace(/,/g, ""), 10);
    }
  } catch {}

  throw new Error("Unable to fetch or extract Node count from Nodewatch");
}

const getCachedBeaconNodeCount = unstable_cache(
  async () => {
    const total = await fetchBeaconNodeCount();
    return { total, updatedAt: new Date().toISOString() } as const;
  },
  ["ethereum-beacon-node-count"],
  { revalidate: ONE_DAY_SECONDS, tags: ["ethereum-beacon-node-count"] }
);

export async function GET() {
  try {
    const data = await getCachedBeaconNodeCount();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch beacon node count" },
      { status: 500 }
    );
  }
}


