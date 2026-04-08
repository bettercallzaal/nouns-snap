import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { mainnet } from 'viem/chains';

// ── Auction ABI ──────────────────────────────────────────
const auctionAbi = parseAbi([
  'function auction() view returns (uint256 nounId, uint256 amount, uint40 startTime, uint40 endTime, address payable bidder, bool settled)',
]);

const AUCTION_PROXY = '0x830BD73E4184ceF73443C15111a1DF14e495C706' as Address;

export interface AuctionData {
  nounId: number;
  currentBid: string; // formatted ETH
  bidder: string;
  endTime: number; // unix timestamp
  timeRemaining: string; // formatted
  settled: boolean;
}

export async function getCurrentAuction(): Promise<AuctionData> {
  try {
    const result = await client.readContract({
      address: AUCTION_PROXY,
      abi: auctionAbi,
      functionName: 'auction',
    });

    const [nounId, amount, , endTime, bidder, settled] = result;
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;

    let timeRemaining = 'Ended';
    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      timeRemaining = hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;
    }

    const ethAmount = Number(amount) / 1e18;

    return {
      nounId: Number(nounId),
      currentBid: ethAmount > 0 ? `${ethAmount.toFixed(2)} ETH` : 'No bids yet',
      bidder: bidder as string,
      endTime: Number(endTime),
      timeRemaining,
      settled,
    };
  } catch {
    return {
      nounId: 0,
      currentBid: 'Error loading',
      bidder: '0x0',
      endTime: 0,
      timeRemaining: 'Unknown',
      settled: false,
    };
  }
}

export const NOUNS = {
  address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03' as Address,
  chainId: 1,
} as const;

const nounsAbi = parseAbi([
  'function totalSupply() view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
]);

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.merkle.io', { timeout: 5_000 }),
});

// Hardcode supply - updates daily, no need to hit RPC on every page load
const KNOWN_SUPPLY = 1869;

export function getTotalSupply(): number {
  return KNOWN_SUPPLY;
}

export async function getNounOwner(tokenId: number): Promise<string> {
  try {
    const owner = await client.readContract({
      address: NOUNS.address,
      abi: nounsAbi,
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
    });
    return owner;
  } catch {
    return 'Unknown';
  }
}

export function getNounImageUrl(tokenId: number): string {
  return `https://noun.pics/${tokenId}`;
}
