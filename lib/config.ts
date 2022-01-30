export function getDefaultExpireTime() {
  const date = new Date();
  return new Date(date.setMonth(date.getMonth() + 1));
}

export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;
