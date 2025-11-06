import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const runtime = "nodejs";
export const revalidate = 86400;

const ONE_DAY_SECONDS = 60 * 60 * 24;

async function fetchTotalSolanaStaked(): Promise<number> {
  const rpc = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";
  const connection = new Connection(rpc, { commitment: "finalized" });
  const voteAccounts = await connection.getVoteAccounts();
  const all = [...voteAccounts.current, ...voteAccounts.delinquent];
  const totalLamports = all.reduce((sum, va) => {
    const lamports =
      typeof (va as any)?.activatedStake === "number"
        ? (va as any).activatedStake
        : 0;
    return sum + lamports;
  }, 0);
  const totalSol = totalLamports / LAMPORTS_PER_SOL;
  return totalSol;
}

const getCachedTotalSolanaStaked = unstable_cache(
  async () => {
    const totalSol = await fetchTotalSolanaStaked();
    return {
      totalSol,
      updatedAt: new Date().toISOString(),
    } as const;
  },
  ["solana-total-staked"],
  { revalidate: ONE_DAY_SECONDS, tags: ["solana-total-staked"] }
);

export async function GET() {
  try {
    const payload = await getCachedTotalSolanaStaked();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Solana total staked" },
      { status: 500 }
    );
  }
}


