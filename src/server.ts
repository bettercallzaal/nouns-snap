import { serve } from '@hono/node-server';
import app from './app.js';

const port = 3004;
console.log(`Nouns Snap running at http://localhost:${port}`);
serve({ fetch: app.fetch, port });
