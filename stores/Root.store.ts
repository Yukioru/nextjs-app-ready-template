import { enableStaticRendering } from 'mobx-react-lite';

import HydratedStore from '@/stores/base/Hydrated.store';
import UserStore from '@/stores/User.store';
import { isServer } from '@/lib/config';

enableStaticRendering(isServer);

interface IRootStore {
  user: UserStore;
}

class RootStore extends HydratedStore implements IRootStore {
  hydrateType = 'root';
  user = new UserStore();
}

export default RootStore;
