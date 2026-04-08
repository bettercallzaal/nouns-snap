import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { mainnet } from 'viem/chains';

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
