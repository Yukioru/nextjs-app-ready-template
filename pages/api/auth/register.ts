import kebabCase from 'lodash/kebabCase';
import omit from 'lodash/omit';
import { NextApiRequest, NextApiResponse } from 'next';

import reject from '@/lib/reject';
import getBody from '@/lib/getBody';
import withSession from '@/lib/withSession';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import { IErrorObject } from '@/typings/types';

async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  let data, user, session;

  try {
    data = getBody(req, ['email', 'password', 'name']);
  } catch (error) {
    const err = error as IErrorObject;
    return reject(res, err.message, err.opts);
  }

  await dbConnect();

  const existUser = await User.findOne({ email: data.email });
  if (existUser) {
    return reject(res, 'exists', { entity: 'user' });
  }

  try {
    user = await User.create(data);

    req.session.user = {
      _id: String(user._id),
    };

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

export default withSession(register);
