import '@/styles/globals.css';

import App, { AppContext, AppProps } from 'next/app';

import { StoreProvider } from '@/components/StoreProvider';
import { useLayout } from '@/lib/hooks/useLayout';
import RootStore from '@/stores/Root.store';
import { IHydrationData } from '@/stores/base/Hydrated.store';

interface IIndexApp {
  initialState: IHydrationData;
}

function IndexApp({
  Component,
  pageProps,
  initialState,
}: AppProps & IIndexApp) {
  const Layout = useLayout(Component);
  return (
    <StoreProvider
      store={{
        name: 'rootStore',
        Store: RootStore,
      }}
      initialState={initialState}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

IndexApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  let user = null;
  if (typeof window === 'undefined') {
    const res = await fetch('http://localhost:3000/api/auth/user', {
      headers: {
        cookie: (appContext.ctx.req
          ? appContext.ctx.req.headers.cookie
          : undefined) as string,
      },
    }).then((res) => res.json());
    ({ user } = res?.data || {});
  }
  return {
    ...appProps,
    initialState: {
      user,
    },
  };
};

export default IndexApp;
