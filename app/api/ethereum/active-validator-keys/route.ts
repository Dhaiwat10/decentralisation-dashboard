import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

// Cache duration: 24 hours = 86400 seconds
const CACHE_DURATION = 86400;

// Export revalidate for route segment config
export const revalidate = CACHE_DURATION;

const ETH_BEACON_API =
  process.env.ETHEREUM_BEACON_API ||
  'https://docs-demo.quiknode.pro/eth/v1/beacon/states/head/validators?status=active';

const getCachedActiveValidatorKeyCount = unstable_cache(
  async (): Promise<{ total: number; updatedAt: string }> => {
    // Avoid caching the huge upstream response; only cache the derived number
    const res = await fetch(ETH_BEACON_API, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Upstream fetch failed: ${res.status}`);
    }
    const data = await res.json();
    const total = Array.isArray((data as any)?.data) ? (data as any).data.length : 0;
    return { total, updatedAt: new Date().toISOString() } as const;
  },
  ['ethereum-active-validator-keys'],
  { revalidate: CACHE_DURATION, tags: ['ethereum-active-validator-keys'] }
);

export async function GET() {
  try {
    const payload = await getCachedActiveValidatorKeyCount();
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Ethereum validators' },
      { status: 500 }
    );
  }
}


