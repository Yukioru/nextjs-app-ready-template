import { NextApiRequest, NextApiResponse } from 'next';
import omit from 'lodash/omit';

import dbConnect from '@/lib/dbConnect';
import reject from '@/lib/reject';
import withSession from '@/lib/withSession';
import getBody from '@/lib/getBody';
import Session from '@/models/Session';
import User from '@/models/User';
import { IErrorObject } from '@/typings/types';

async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  let data, user, session, isPasswordCorrect = false;

  try {
    data = getBody(req, ['email', 'password']);
  } catch (error) {
    const err = error as IErrorObject;
    return reject(res, err.message, err.opts);
  }

  await dbConnect();

  try {
    user = await User.findOne({ email: data.email });
    if (!user)
      throw {
        message: 'not-found',
        opts: {
          entity: 'user',
        },
      };
  } catch (error) {
    const err = error as IErrorObject;
    const type = err.opts ? err.message : 'internal';
    const opts = err.opts
      ? err.opts
      : { error: err as unknown as typeof Error };
    return reject(res, type, opts);
  }

  try {
    isPasswordCorrect = await user.comparePassword(data.password);
  } catch (error) {
    const err = error as IErrorObject;
    return reject(res, err.message, err.opts);
  }

  if (!isPasswordCorrect) {
    return reject(res, 'password-incorrect');
  }

  req.session.user = {
    _id: String(user._id),
  };

  try {
    const token = await req.session.save();
    session = await Session.create({ token, userId: user._id });
  } catch (error) {
    return reject(res, 'internal', { error: error as typeof Error });
  }

  res.status(200).send({
    code: 200,
    data: {
      session,
      user: omit(user.toObject(), ['password']),
    },
  });
}

export default withSession(login);
