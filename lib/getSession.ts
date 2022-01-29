import cookie, { CookieSerializeOptions } from 'cookie';
import Iron from '@hapi/iron';
import { IncomingMessage, ServerResponse } from 'http';

import { getDefaultExpireTime } from '@/lib/config';

const SESSION_PASSWORD = process.env.SESSION_PASSWORD;
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;

if (!SESSION_COOKIE_NAME) {
  throw new Error(
    'Please define the SESSION_COOKIE_NAME environment variable inside .env.local'
  );
}

if (!SESSION_PASSWORD) {
  throw new Error(
    'Please define the SESSION_PASSWORD environment variable inside .env.local'
  );
}

const ttl = getDefaultExpireTime().getTime() - new Date().getTime();


const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: ttl / 1000 - 60,
  path: '/',
};

export const options = {
  password: SESSION_PASSWORD,
  cookieName: SESSION_COOKIE_NAME,
  ttl,
  cookieOptions,
};

async function decodeCookie(cookieValue: string) {
  try {
    const data = await Iron.unseal(cookieValue, options.password, {
      ...Iron.defaults,
      ttl: options.ttl,
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Expired seal' ||
        error.message === 'Bad hmac value' ||
        error.message === 'Cannot find password: ' ||
        error.message === 'Incorrect number of sealed components'
      ) {
        return {};
      }
    }

    throw error;
  }
}

function addToCookies(cookieValue: string, res: ServerResponse) {
  let cookiesArr = res.getHeader('set-cookie') ?? [];
  if (typeof cookiesArr === 'string') cookiesArr = [cookiesArr];
  res.setHeader('set-cookie', [...(cookiesArr as string[]), cookieValue]);
}

async function getSession(req: IncomingMessage, res: ServerResponse) {
  const sessionCookie = cookie.parse(req.headers.cookie || '')[
    options.cookieName
  ];

  const session = Boolean(sessionCookie)
    ? await decodeCookie(sessionCookie)
    : {};

  Object.defineProperties(session, {
    save: {
      value: async function save() {
        const seal = await Iron.seal(session, options.password, {
          ...Iron.defaults,
          ttl: options.ttl,
        });

        const cookieValue = cookie.serialize(
          options.cookieName,
          seal,
          options.cookieOptions
        );

        addToCookies(cookieValue, res);
        return seal;
      },
    },
    destroy: {
      value: function destroy() {
        Object.keys(session).forEach((key) => {
          delete session[key];
        });

        const cookieValue = cookie.serialize(options.cookieName, '', {
          ...options.cookieOptions,
          maxAge: 0,
        });

        addToCookies(cookieValue, res);
      },
    },
  });

  return session;
}

export default getSession;
