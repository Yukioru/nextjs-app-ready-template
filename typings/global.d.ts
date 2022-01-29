import { Mongoose } from 'mongoose';

declare var global: NodeJS.Global & typeof globalThis;

interface ICachedMongoose {
  conn?: Mongoose;
  promise?: Promise<Mongoose>;
}

declare global {
  var mongoose: ICachedMongoose;
}
