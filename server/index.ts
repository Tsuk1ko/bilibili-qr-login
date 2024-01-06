import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { app } from './app';

app.get('*', serveStatic({ root: './static' }));

serve(app, () => {
  console.log('Server start.');
});
