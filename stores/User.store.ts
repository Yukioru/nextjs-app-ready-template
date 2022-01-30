import { makeObservable, observable } from 'mobx';

import HydratedStore, { IHydrationData } from '@/stores/base/Hydrated.store';

class UserStore extends HydratedStore {
  _id?: string | null = null;
  name?: string | null = null;
  username?: string | null = null;
  avatar?: string | null = null;
  email?: string | null = null;
  createdAt?: string | null = null;
  updatedAt?: string | null = null;

  constructor(initialData?: IHydrationData) {
    super();

    makeObservable(this, {
      name: observable,
      username: observable,
      avatar: observable,
    });

    this.assignData(initialData);
  }

  clear() {
    this._id = null;
    this.name = null;
    this.username = null;
    this.avatar = null;
    this.email = null;
    this.createdAt = null;
    this.updatedAt = null;
  }

  isAuth() {
    return Boolean(this._id);
  }
}

export default UserStore;
