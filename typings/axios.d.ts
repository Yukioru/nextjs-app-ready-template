import { ReqOrContextType } from '@/lib/types';

declare module 'axios' {
  interface AxiosInstance {
    update(req: ReqOrContextType): AxiosInstance;
  }
}
