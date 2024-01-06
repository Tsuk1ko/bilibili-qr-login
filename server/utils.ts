import { createServer } from 'net';
import nodemon from 'nodemon';

const checkPortInUse = (port = 3000) =>
  new Promise<boolean>(resolve => {
    const tester = createServer()
      .once('error', (err: any) => {
        resolve(err.code === 'EADDRINUSE');
      })
      .once('listening', () => tester.once('close', () => resolve(false)).close())
      .listen(port, '0.0.0.0');
  });

export const startApiServer = async () => {
  if (await checkPortInUse()) return;
  nodemon({
    script: 'server/index.ts',
    ext: 'ts',
    watch: ['_api', 'server'],
    execMap: {
      ts: 'tsx',
    },
  });
};
