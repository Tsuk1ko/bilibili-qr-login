import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { streamSSE } from 'hono/streaming';
import type { StreamingApi } from 'hono/utils/stream';

export const runtime = 'edge';

export const app = new Hono().basePath('/api');

app.get('/qr', c =>
  streamSSE(c, async stream => {
    let streamClosed = false;
    handleStreamClose(stream, () => {
      streamClosed = true;
    });
    while (!streamClosed) {
      // await stream.writeSSE({ data: message, event: 'time-update' });
      await stream.sleep(1000);
    }
  }),
);

export const GET = handle(app);

interface GenerateQrResp {
  code: string;
  message: string;
  ttl: number;
  data: {
    url: string;
    qrcode_key: string;
  };
}

const generateQr = async () => {
  const r = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate');
  const {
    data: { url, qrcode_key },
  } = (await r.json()) as GenerateQrResp;
  return { url, key: qrcode_key };
};

interface PollQrResp {
  code: string;
  message: string;
  ttl: number;
  data: {
    url: string;
    refresh_token: string;
    timestamp: string;
    code: number;
    message: string;
  };
}

class Cookie {
  private cookie = new Map<string, string>();

  public constructor(cookies?: string[]) {
    if (cookies) this.add(cookies);
  }

  public add(cookies: string[]) {
    cookies.forEach(str => {
      const [name, ...values] = str.split('=');
      this.cookie.set(name, values.join('='));
    });
  }

  public toString() {
    return Array.from(this.cookie.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}

const pollQr = async (key: string) => {
  const r0 = await fetch(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}`);
  const { data } = (await r0.json()) as PollQrResp;

  if (data.code !== 0) {
    return {
      code: data.code,
      message: data.message,
      cookie: '',
    };
  }

  const cookie = new Cookie(r0.headers.getSetCookie());
  console.log('cookie1', cookie.toString());
  const r1 = await fetch(data.url, { headers: { cookie: cookie.toString() } });

  cookie.add(r1.headers.getSetCookie());
  console.log('cookie2', cookie.toString());

  return {
    code: data.code,
    message: data.message,
    cookie: cookie.toString(),
  };
};

const handleStreamClose = (stream: StreamingApi, onClose: () => any) => {
  const close = stream.close.bind(stream);
  stream.close = async () => {
    try {
      await onClose();
    } finally {
      await close();
    }
  };
};
