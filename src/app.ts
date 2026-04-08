import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { registerSnapHandler } from '@farcaster/snap-hono';
import { getTotalSupply, getNounOwner, getNounImageUrl, getCurrentAuction } from './nouns.js';
import { buildInputPage } from './pages/input.js';
import { buildNounPage } from './pages/noun.js';
import { buildAuctionPage } from './pages/auction.js';
import { buildAvatarInputPage, buildAvatarResultPage } from './pages/avatar.js';

const app = new Hono();
app.use('*', cors({ origin: '*' }));

const skipJFS = { skipJFSVerification: true } as any;

function getBaseUrl(req: Request): string {
  if (process.env.SNAP_PUBLIC_BASE_URL) {
    const url = process.env.SNAP_PUBLIC_BASE_URL.replace(/\/$/, '');
    return url.startsWith('http') ? url : `https://${url}`;
  }
  const forwarded = req.headers.get('x-forwarded-host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  if (forwarded) return `${proto}://${forwarded}`;
  const host = req.headers.get('host') ?? 'localhost:3004';
  return `http://${host}`;
}

// ── Input page (landing) ─────────────────────────────────

registerSnapHandler(app, async (ctx) => {
  const baseUrl = getBaseUrl(ctx.request);
  const totalSupply = getTotalSupply();
  return buildInputPage(baseUrl, totalSupply);
}, skipJFS);

// ── Show Noun result ─────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);

    // Check for gallery navigation via ?id= query param
    const url = new URL(ctx.request.url);
    const idParam = url.searchParams.get('id');
    if (idParam) {
      const tokenId = parseInt(idParam, 10);
      if (!isNaN(tokenId) && tokenId >= 0) {
        const [owner, imageUrl] = await Promise.all([
          getNounOwner(tokenId),
          Promise.resolve(getNounImageUrl(tokenId)),
        ]);
        return buildNounPage(tokenId, owner, imageUrl, baseUrl);
      }
    }

    if (ctx.action.type === 'get') {
      const totalSupply = getTotalSupply();
      return buildInputPage(baseUrl, totalSupply);
    }

    const tokenIdStr = (ctx.action.inputs?.tokenId as string) || '0';
    const tokenId = parseInt(tokenIdStr, 10);

    if (isNaN(tokenId) || tokenId < 0) {
      const totalSupply = getTotalSupply();
      return buildInputPage(baseUrl, totalSupply);
    }

    const [owner, imageUrl] = await Promise.all([
      getNounOwner(tokenId),
      Promise.resolve(getNounImageUrl(tokenId)),
    ]);

    return buildNounPage(tokenId, owner, imageUrl, baseUrl);
  },
  { path: '/noun', ...skipJFS },
);

// ── Random Noun ──────────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    const totalSupply = getTotalSupply();
    const tokenId = Math.floor(Math.random() * totalSupply);

    const [owner, imageUrl] = await Promise.all([
      getNounOwner(tokenId),
      Promise.resolve(getNounImageUrl(tokenId)),
    ]);

    return buildNounPage(tokenId, owner, imageUrl, baseUrl);
  },
  { path: '/random', ...skipJFS },
);

// ── Live Auction ─────────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    const auction = await getCurrentAuction();
    return buildAuctionPage(auction, baseUrl);
  },
  { path: '/auction', ...skipJFS },
);

// ── Avatar input ─────────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    return buildAvatarInputPage(baseUrl);
  },
  { path: '/avatar-input', ...skipJFS },
);

// ── Avatar result ────────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);
    if (ctx.action.type === 'get') {
      return buildAvatarInputPage(baseUrl);
    }
    const name = (ctx.action.inputs?.avatarName as string) || 'anon';
    const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'anon';
    const imageUrl = `https://noun-api.com/beta/pfp?name=${encodeURIComponent(sanitized)}`;
    return buildAvatarResultPage(sanitized, imageUrl, baseUrl);
  },
  { path: '/avatar', ...skipJFS },
);

export default app;
