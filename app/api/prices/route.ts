import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

const ONE_DAY_SECONDS = 60 * 60 * 24;
const DEFI_LLAMA_COINS =
  "https://coins.llama.fi/prices/current/coingecko:ethereum,coingecko:solana";

type CoinsApiResponse = {
  coins?: Record<
    string,
    {
      price?: number;
      symbol?: string;
      timestamp?: number;
      confidence?: number;
      [key: string]: unknown;
    }
  >;
  [key: string]: unknown;
};

async function fetchPrices(): Promise<{ ethUsd: number; solUsd: number }> {
  const res = await fetch(DEFI_LLAMA_COINS, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`DeFiLlama coins fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as CoinsApiResponse;
  const coins = data?.coins ?? {};
  const eth = coins["coingecko:ethereum"];
  const sol = coins["coingecko:solana"];
  const ethUsd = typeof eth?.price === "number" ? eth.price : 0;
  const solUsd = typeof sol?.price === "number" ? sol.price : 0;
  return { ethUsd, solUsd };
}

const getCachedPrices = unstable_cache(
  async () => {
    const { ethUsd, solUsd } = await fetchPrices();
    return {
      eth: { priceUsd: ethUsd },
      solana: { priceUsd: solUsd },
      updatedAt: new Date().toISOString(),
    } as const;
  },
  ["defillama-coins-eth-sol"],
  { revalidate: ONE_DAY_SECONDS, tags: ["defillama-coins-eth-sol"] }
);

export async function GET() {
  try {
    const payload = await getCachedPrices();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}


