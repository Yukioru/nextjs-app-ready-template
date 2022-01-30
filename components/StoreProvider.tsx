import React, { FC, createContext, useContext } from 'react';

import { IHydratedStore, IHydrationData } from '@/stores/base/Hydrated.store';
import initializeStore from '@/lib/initializeStore';

interface IStore {
  name: string;
  Store: new() => IHydratedStore;
}

interface IStoreProviderProps {
  store: IStore;
  initialState: IHydrationData;
}

interface IStoreContext {
  [key: string]: IHydratedStore;
}

export const StoreContext = createContext({});

export function useStore(name?: string) {
  const context = useContext<IStoreContext>(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context[name as string] as IHydratedStore ?? context;
}

export const StoreProvider: FC<IStoreProviderProps> = ({ store, children, initialState }) => {
  const savedStore = useContext(StoreContext);
  const _store = initializeStore({
    initialState,
    ...store,
  });

  return (
    <StoreContext.Provider
      value={{
        ...savedStore,
        [store.name]: _store,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
