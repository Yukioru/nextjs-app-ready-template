import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext } from 'next';
import { AppContext } from 'next/app';

import { ReqOrContextType } from '@/typings/types';

function getReqRes(reqOrContext: ReqOrContextType, res?: ServerResponse) {
  const isSSP = Boolean(
    (reqOrContext as GetServerSidePropsContext)?.req && !res
  );
  const isAppCtx = Boolean((reqOrContext as AppContext)?.ctx?.req && !res);

  let _req = reqOrContext as IncomingMessage;
  let _res = res;

  if (isSSP && !isAppCtx) {
    _req = (reqOrContext as GetServerSidePropsContext).req;
    _res = (reqOrContext as GetServerSidePropsContext).res;
  } else if (isAppCtx) {
    _req = (reqOrContext as AppContext).ctx.req as IncomingMessage;
    _res = (reqOrContext as AppContext).ctx.res;
  }

  return { req: _req, res: _res, isContext: isSSP || isAppCtx };
}

export default getReqRes;
