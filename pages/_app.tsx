import '@/styles/globals.css';

import App, { AppContext, AppProps } from 'next/app';

import { StoreProvider } from '@/components/StoreProvider';
import { useLayout } from '@/lib/hooks/useLayout';
import RootStore from '@/stores/Root.store';
import { IHydrationData } from '@/stores/base/Hydrated.store';
import { isServer } from '@/lib/config';
import api from '@/lib/api';

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
  api.update(appContext);

  let user = null;
  if (isServer) {
    const res = await api.get('/api/auth/user');
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
