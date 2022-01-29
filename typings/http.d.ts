declare module 'http' {
  interface IncomingMessage {
    session: {
      user?: any;
      save(): any;
      destroy(): any;
    };
  }
}
