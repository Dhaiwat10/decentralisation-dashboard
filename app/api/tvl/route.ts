import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

const ONE_DAY_SECONDS = 60 * 60 * 24;
const DEFI_LLAMA_CHAINS = "https://api.llama.fi/chains";

type ChainsResponseItem = {
  name?: string;
  tvl?: number;
  [key: string]: unknown;
};

async function fetchChainTvl(): Promise<{ ethUsd: number; solUsd: number }> {
  const res = await fetch(DEFI_LLAMA_CHAINS, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`DeFiLlama fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as ChainsResponseItem[];
  if (!Array.isArray(data)) {
    throw new Error("Unexpected DeFiLlama response");
  }
  const byName = new Map<string, ChainsResponseItem>();
  for (const item of data) {
    const key = (item.name ?? "").toLowerCase();
    if (key) byName.set(key, item);
  }
  const eth = byName.get("ethereum");
  const sol = byName.get("solana");
  const ethUsd = typeof eth?.tvl === "number" ? eth.tvl : 0;
  const solUsd = typeof sol?.tvl === "number" ? sol.tvl : 0;
  return { ethUsd, solUsd };
}

const getCachedTvl = unstable_cache(
  async () => {
    const { ethUsd, solUsd } = await fetchChainTvl();
    return {
      eth: { tvlUsd: ethUsd },
      solana: { tvlUsd: solUsd },
      updatedAt: new Date().toISOString(),
    } as const;
  },
  ["tvl-defillama-chains"],
  { revalidate: ONE_DAY_SECONDS, tags: ["tvl-defillama-chains"] }
);

export async function GET() {
  try {
    const payload = await getCachedTvl();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch TVL" }, { status: 500 });
  }
}



