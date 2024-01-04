import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { app as qr } from '../_api/qr';

const app = new Hono();
app.route('/', qr);

serve(app, () => {
  console.log('API server start running.');
});
