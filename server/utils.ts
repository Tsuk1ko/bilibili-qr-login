import { createServer } from 'net';
import nodemon from 'nodemon';
import type { Server } from 'net';

const checkPortInUse = (port = 3000) =>
  new Promise<boolean>(resolve => {
    const tester: Server = createServer()
      .once('error', (err: any) => {
        resolve(err.code === 'EADDRINUSE');
      })
      .once('listening', () => tester.once('close', () => resolve(false)).close())
      .listen(port, '0.0.0.0');
  });

export const startApiServer = async () => {
  if (await checkPortInUse()) return;
  nodemon({
    script: 'server/dev.ts',
    ext: 'ts',
    watch: ['server'],
    execMap: {
      ts: 'tsx',
    },
  });
};
