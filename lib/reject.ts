import { IncomingMessage } from 'http';
import { NextApiResponse } from 'next';

interface IRejectState {
  code: number;
  message: string;
  error?: typeof Error;
  fields?: string[];
}

interface IRejectOptions {
  [key: string]: string | typeof Error | string[] | IncomingMessage['method'];
}

function reject(res: NextApiResponse, type: string, opts: IRejectOptions = {}) {
  const state: IRejectState = {
    code: 500,
    message: 'errors.internal',
  };

  switch (type) {
    case 'internal': {
      state.error = opts.error as typeof Error;
      break;
    }
    case 'not-found': {
      state.code = opts.entity ? 400 : 404;
      state.message = `errors.not_found.${opts.entity}`;
      break;
    }
    case 'exists': {
      state.code = 400;
      state.message = `errors.exists.${opts.entity}`;
      break;
    }
    case 'not-allowed': {
      state.code = 405;
      state.message = `errors.not_allowed.${opts.method}`;
      break;
    }
    case 'body-type': {
      state.code = 415;
      state.message = 'errors.unsupported_type';
      break;
    }
    case 'fields-required': {
      state.code = 400;
      state.message = 'errors.fields_required';
      state.fields = opts.fields as string[];
      break;
    }
    case 'password-incorrect': {
      state.code = 400;
      state.message = 'errors.password_incorrect';
      break;
    }
  }

  return res.status(state.code).send(state);
}

export default reject;
