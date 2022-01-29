import { makeObservable, observable } from 'mobx';

import HydratedStore, { IHydrationData } from '@/stores/base/Hydrated.store';

class UserStore extends HydratedStore {
  _id?: string;
  name = '';
  username = '';
  avatar = '';

  constructor(initialData?: IHydrationData) {
    super();

    makeObservable(this, {
      name: observable,
      username: observable,
      avatar: observable,
    });

    this.assignData(initialData);
  }

  isAuth() {
    return Boolean(this._id);
  }
}

export default UserStore;