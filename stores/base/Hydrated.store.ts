export interface IHydrationData {
  [key: string]: IHydratedStore;
}

export interface IHydratedStore {
  _hydrateSupport: boolean;
  hydrateType: string;
  assignData(data: IHydrationData, hydrateType?: string): void;
  hydrate(data?: IHydrationData): void;
}


class HydratedStore implements IHydratedStore {
  [key: number]: IHydratedStore;

  _hydrateSupport = true;
  hydrateType = 'single';

  assignData(data: IHydrationData = {}, hydrateType = this.hydrateType) {
    for (let key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const _key = key as unknown as number;
        if (hydrateType === 'single') {
          this[_key] = data[_key];
        }
        if (hydrateType === 'root' && this[_key]?._hydrateSupport) {
          this[_key].hydrate(data[_key] as unknown as IHydrationData);
        }
      }
    }
  }

  hydrate(data: IHydrationData) {
    if (!data) return;
    this.assignData(data);
  }
}

export default HydratedStore;
