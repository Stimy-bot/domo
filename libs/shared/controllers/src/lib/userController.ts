import { ObjectId } from 'mongodb';
import { NOT_FOUND, OK } from '@domo/constants';
import { sanitizeUser, type UserEntity } from '@domo/models';
import { catchErrors, appAssert } from '@domo/utils';

export const getUserHandler = catchErrors(async (req, res) => {
  const usersCollection = req.db.collection<UserEntity>('users');

  const user = await usersCollection.findOne({
    _id: new ObjectId(req.userId),
  });

  appAssert(user, NOT_FOUND, 'User not found');

  return res.status(OK).send(sanitizeUser(user));
});