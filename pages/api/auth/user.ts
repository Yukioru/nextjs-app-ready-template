import { NextApiRequest, NextApiResponse } from 'next';

import reject from '@/lib/reject';
import withSession from '@/lib/withSession';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

async function user(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  await dbConnect();

  const { user: sessionUser } = req.session;

  let user = null;
  try {
    if (sessionUser) {
      user = await User.findById(sessionUser._id).select('-password');
    }
  } catch (error) {
    return reject(res, 'internal', { error: error as typeof Error });
  }

  res.status(200).send({
    code: 200,
    data: {
      user,
    },
  });
}

export default withSession(user);
