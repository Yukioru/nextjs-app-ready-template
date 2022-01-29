import { ServerResponse } from 'http';

import sessionDescriptor from '@/lib/sessionDescriptor';
import getReqRes from '@/lib/getReqRes';
import { ReqOrContextType } from '@/typings/types';

function withSession(handler: Function) {
  if (typeof window !== 'undefined') {
    return handler;
  }

  async function wrappedNextHandler(
    reqOrContext: ReqOrContextType,
    _res: ServerResponse
  ) {
    // Because it should not be called on the client
    const getSession = require('@/lib/getSession').default;

    const { req, res, isContext } = getReqRes(reqOrContext, _res);

    const args = isContext ? [reqOrContext] : [req, res];
    const session = await getSession(req, res);

    if (!req.session) {
      Object.defineProperty(req, 'session', sessionDescriptor(session));
    } else {
      req.session = session;
    }

    return handler(...args);
  }

  return wrappedNextHandler;
}

export default withSession;
