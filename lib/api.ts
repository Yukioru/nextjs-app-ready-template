import axios, { AxiosInstance } from 'axios';

import { ReqOrContextType } from '@/typings/types';
import { isServer } from '@/lib/config';
import getReqRes from '@/lib/getReqRes';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const instance = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL,
  timeout: 2000,
});

instance.update = function update(_req?: ReqOrContextType): AxiosInstance {
  if (isServer && _req) {
    const { req } = getReqRes(_req);
    instance.defaults.headers.common.cookie = String(req.headers.cookie);
  }

  return instance;
};

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error(error);
    return error?.response?.data;
  }
);

export default instance;
