import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

enum SSEEvent {
  GENERATE = 'generate',
  POLL = 'poll',
  END = 'end',
}

enum PollQrResultCode {
  SUCCESS = 0,
  EXPIRED = 86038,
  NOT_CONFIRMED = 86090,
  NOT_SCANNED = 86101,
}

const keepPollQrResultCode = new Set([PollQrResultCode.NOT_CONFIRMED, PollQrResultCode.NOT_SCANNED]);

export const app = new Hono();

let globalId = 0;

app.get('/api/qr', c => {
  if (process.env.NODE_ENV !== 'development') {
    try {
      const host = c.req.header('Host');
      const referer = c.req.header('Referer');
      if (!referer || new URL(referer).host !== host) {
        return c.text('', 403);
      }
    } catch {
      return c.text('', 403);
    }
  }
  return streamSSE(c, async stream => {
    // 编码加上 charset
    c.header('Content-Type', 'text/event-stream; charset=utf-8');

    const id = globalId++;
    let streamClosed = false;
    stream.onAbort(() => {
      streamClosed = true;
      console.log(id, 'closed');
    });

    // 断线重连时的 key
    const lastEventID = c.req.header('Last-Event-ID');

    try {
      // 获取登录链接
      const qr = new LoginQr(c.req.header('User-Agent'), lastEventID);
      if (!lastEventID) {
        const genRes = await qr.generate();
        console.log(id, 'generate');
        await stream.writeSSE({ data: JSON.stringify(genRes), event: SSEEvent.GENERATE, id: genRes.key });
        if (genRes.code !== 0) {
          await stream.writeSSE({ data: '', event: SSEEvent.END });
          await stream.close();
          return;
        }
        await stream.sleep(2000);
      }

      // 轮询
      for (let i = 0; i < 100 && !streamClosed; i++) {
        console.log(id, 'poll', i);
        const result = await qr.poll();
        await stream.writeSSE({ data: JSON.stringify(result), event: SSEEvent.POLL });
        if (!keepPollQrResultCode.has(result.code)) {
          await stream.writeSSE({ data: '', event: SSEEvent.END });
          await stream.close();
          return;
        }
        await stream.sleep(2000);
      }
    } catch (error) {
      await stream.writeSSE({ data: String(error), event: SSEEvent.END });
      await stream.close();
      return;
    }

    await stream.writeSSE({ data: '超时终止', event: SSEEvent.END });
    await stream.close();
  });
});

interface GenerateQrResp {
  code: number;
  message: string;
  ttl: number;
  data: {
    url: string;
    qrcode_key: string;
  };
}

interface PollQrResp {
  code: number;
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
  private readonly header: Record<string, string> = {};

  public constructor(
    userAgent = '',
    private key = '',
  ) {
    this.header = {
      'User-Agent': userAgent,
      Origin: 'https://www.bilibili.com',
      Referer: 'https://www.bilibili.com/',
    };
  }

  public async generate() {
    const r = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header', {
      headers: this.header,
    });
    const {
      code,
      message,
      data: { url, qrcode_key: key } = { url: '', qrcode_key: '' },
    } = (await r.json()) as GenerateQrResp;
    this.key = key;
    return { code, msg: message, url, key };
  }

  public async poll() {
    const r0 = await fetch(
      `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${this.key}&source=main-fe-header`,
      { headers: this.header },
    );
    const { code, message, data } = (await r0.json()) as PollQrResp;
    const result: PollQrResult =
      code === 0
        ? {
            code: data.code,
            msg: data.message,
          }
        : {
            code: Number(code),
            msg: message,
          };

    if (result.code !== 0) return result;

    const cookie = new Cookie(r0.headers.getSetCookie());
    const r1 = await fetch(data.url);

    cookie.add(r1.headers.getSetCookie());
    result.cookie = cookie.del('i-wanna-go-back').toString();

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
    return this;
  }

  public del(name: string) {
    this.cookie.delete(name);
    return this;
  }

  public toString() {
    return Array.from(this.cookie.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}
