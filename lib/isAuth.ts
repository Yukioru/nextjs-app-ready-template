import { ReqOrContextType } from '@/typings/types';
import getReqRes from '@/lib/getReqRes';

function isAuth(reqOrContext: ReqOrContextType) {
  const { req } = getReqRes(reqOrContext);
  return Boolean(req?.session?.user);
}

export default isAuth;
