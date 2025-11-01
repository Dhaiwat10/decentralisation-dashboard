import { unstable_cache } from "next/cache";
import { Connection } from "@solana/web3.js";

export const runtime = "nodejs";

const ONE_DAY_SECONDS = 60 * 60 * 24;

async function fetchTotalSolanaVoteAccounts(): Promise<number> {
  const rpc = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";
  const connection = new Connection(rpc, { commitment: "finalized" });
  const voteAccounts = await connection.getVoteAccounts();
  return voteAccounts.current.length; // actively voting validators
}

const getCachedTotalVoteAccounts = unstable_cache(
  async () => {
    const total = await fetchTotalSolanaVoteAccounts();
    return { total, updatedAt: new Date().toISOString() } as const;
  },
  ["solana-total-vote-accounts"],
  { revalidate: ONE_DAY_SECONDS, tags: ["solana-total-vote-accounts"] }
);

export async function GET() {
  try {
    const data = await getCachedTotalVoteAccounts();
    return Response.json({ ...data, ttlSeconds: ONE_DAY_SECONDS });
  } catch (error) {
    return new Response("Failed to fetch Solana total vote accounts", {
      status: 500,
    });
  }
}


