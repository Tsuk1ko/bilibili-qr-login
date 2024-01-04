import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { streamSSE } from 'hono/streaming';
import type { StreamingApi } from 'hono/utils/stream';

enum SSEEvent {
  GENERATE = 'generate',
  POLL = 'poll',
}

export const runtime = 'edge';

export const app = new Hono().basePath('/api');

app.get('/qr', c =>
  streamSSE(c, async stream => {
    // 指定编码
    c.header('Content-Type', 'text/event-stream; charset=utf-8');

    let streamClosed = false;
    handleStreamClose(stream, () => {
      streamClosed = true;
    });

    // 获取登录链接
    const qr = new LoginQr();
    await stream.writeSSE({ data: JSON.stringify(await qr.generate()), event: SSEEvent.GENERATE });
    await stream.sleep(2000);

    while (!streamClosed) {
      console.log('poll', Date.now());
      const result = await qr.poll();
      await stream.writeSSE({ data: JSON.stringify(result), event: SSEEvent.POLL });
      if (result.code === 0) {
        stream.close();
        break;
      }
      await stream.sleep(2000);
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

interface PollQrResult {
  code: number;
  msg: string;
  cookie?: string;
}

class LoginQr {
  private key = '';

  public async generate() {
    const r = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate');
    const {
      data: { url, qrcode_key: key },
    } = (await r.json()) as GenerateQrResp;
    this.key = key;
    return { url, key };
  }

  public async poll() {
    const r0 = await fetch(`https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${this.key}`);
    const { data } = (await r0.json()) as PollQrResp;
    const result: PollQrResult = {
      code: data.code,
      msg: data.message,
    };

    if (data.code !== 0) return result;

    const cookie = new Cookie(r0.headers.getSetCookie());
    const r1 = await fetch(data.url);

    cookie.add(r1.headers.getSetCookie());
    result.cookie = cookie.toString();

    return result;
  }
}

class Cookie {
  private cookie = new Map<string, string>();

  public constructor(cookies?: string[]) {
    if (cookies) this.add(cookies);
  }

  public add(cookies: string[]) {
    cookies.forEach(str => {
      const [nv] = str.split(';');
      const [name, ...values] = nv.split('=');
      this.cookie.set(name, values.join('='));
    });
  }

  public toString() {
    return Array.from(this.cookie.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}

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
