import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { registerSnapHandler } from '@farcaster/snap-hono';
import { getTotalSupply, getNounOwner, getNounImageUrl } from './nouns.js';
import { buildInputPage } from './pages/input.js';
import { buildNounPage } from './pages/noun.js';

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
  const totalSupply = await getTotalSupply();
  return buildInputPage(baseUrl, totalSupply);
}, skipJFS);

// ── Show Noun result ─────────────────────────────────────

registerSnapHandler(
  app,
  async (ctx) => {
    const baseUrl = getBaseUrl(ctx.request);

    if (ctx.action.type === 'get') {
      const totalSupply = await getTotalSupply();
      return buildInputPage(baseUrl, totalSupply);
    }

    const tokenIdStr = (ctx.action.inputs?.tokenId as string) || '0';
    const tokenId = parseInt(tokenIdStr, 10);

    if (isNaN(tokenId) || tokenId < 0) {
      const totalSupply = await getTotalSupply();
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
    const totalSupply = await getTotalSupply();
    const tokenId = Math.floor(Math.random() * totalSupply);

    const [owner, imageUrl] = await Promise.all([
      getNounOwner(tokenId),
      Promise.resolve(getNounImageUrl(tokenId)),
    ]);

    return buildNounPage(tokenId, owner, imageUrl, baseUrl);
  },
  { path: '/random', ...skipJFS },
);

export default app;
