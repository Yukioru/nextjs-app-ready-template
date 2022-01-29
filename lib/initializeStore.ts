import MemoryStorage from 'memorystorage';

import { IHydratedStore, IHydrationData } from '@/stores/base/Hydrated.store';

interface IInitializeStore {
  name: string;
  Store: new() => IHydratedStore;
  initialState: IHydrationData | null;
}

const ms = new MemoryStorage<IHydratedStore>('stores');

function initializeStore({ name, Store, initialState = null }: IInitializeStore) {
  // Возьми стор, если его нет - создай и сохрани стор
  let _store = ms.getItem(name);
  if (!_store) {
    _store = new Store();
    ms.setItem(name, _store);
  }

  // Если пришла дата, обнови сторы
  if (initialState) {
    _store.hydrate(initialState);
  }

  // Для сервера всегда возвращай заново созданный стор
  if (typeof window === 'undefined') {
    ms.clear();
    return _store;
  }

  // Для клиента, если стор не был сохранён - сохрани стор
  if (!ms.getItem(name)) {
    ms.setItem(name, _store);
  }

  // Для клиента, верни стор из памяти
  return ms.getItem(name);
}

export default initializeStore;
