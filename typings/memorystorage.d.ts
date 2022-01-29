declare module 'memorystorage' {
  class MemoryStorage<T> {
    constructor(name?: string);

    getItem(key: string): T;

    setItem(key: string, value: T): void;

    clear(): void;
  }

  export = MemoryStorage;
}