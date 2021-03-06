import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useStore } from '@/components/StoreProvider';
import HomeLayout from '@/layouts/HomeLayout';
import api from '@/lib/api';
import { IApiResponse } from '@/typings/types';

function Home() {
  const rootStore = useStore('rootStore');
  const router = useRouter();

  async function logout() {
    const res = await api.get<{}, IApiResponse>('/api/auth/logout');
    if (res.code === 200) {
      rootStore.user.clear();
      router.replace('/');
    }
  }

  return (
    <div>
      {rootStore.user.isAuth() && <button onClick={logout}>Logout</button>}
      <div>
        <Link href="/settings">Go to settings</Link>
        {` | `}
        <Link href="/auth/login">Go to auth</Link>
      </div>

      <div>
        <b>{rootStore.user?._id}</b>
        <h1>{rootStore.user?.name}</h1>
        <p>{rootStore.user?.username}</p>
        {rootStore.user?.avatar && (
          <Image
            alt={rootStore.user?.name}
            src={rootStore.user?.avatar}
            width={100}
            height={100}
          />
        )}
      </div>
    </div>
  );
}

Home.Layout = HomeLayout;

export default Home;
