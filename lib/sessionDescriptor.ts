interface ISession {
  [key: string]: string;
}

function sessionDescriptor(session: ISession) {
  return {
    enumerable: true,
    get() {
      return session;
    },
    set(value: ISession) {
      const keys = Object.keys(value);
      const currentKeys = Object.keys(session);

      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          delete session[key];
        }
      });

      keys.forEach((key) => {
        session[key] = value[key];
      });
    },
  };
}

export default sessionDescriptor;
