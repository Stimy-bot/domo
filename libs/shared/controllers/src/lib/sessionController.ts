// libs/shared/controllers/src/lib/sessionController.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import { z } from 'zod';
import { NOT_FOUND, UNAUTHORIZED, OK} from '@domo/types';
import type { SessionEntity } from '@domo/models';
import { AppErrorCode } from '@domo/constants';
import { catchErrors, appAssert } from '@domo/utils';

type ReqWithAuth = FastifyRequest & {
  userId?: string;
  sessionId?: string;
};

export const getSessionsHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const r = req as ReqWithAuth;

    // 1. Assert req.userId exists and is valid ObjectId
    appAssert(r.userId, UNAUTHORIZED, 'Not authorized', AppErrorCode.InvalidAccessToken);
    appAssert(ObjectId.isValid(r.userId), UNAUTHORIZED, 'Invalid user ID', AppErrorCode.InvalidAccessToken);

    const userObjectId = new ObjectId(r.userId as string);

    // 2. Query native MongoDB driver collection
    const sessions = await req.db
      .collection<SessionEntity>('sessions')
      .find(
        {
          userId: userObjectId,
          expiresAt: { $gt: new Date() },
        },
        {
          projection: {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
          },
          sort: { createdAt: -1 },
        },
      )
      .toArray();

    // 3. Map sessions and mark current session
    const response = sessions.map((session) => {
      const stringId = session._id.toString();
      return {
        ...session,
        id: stringId,
        ...(stringId === r.sessionId && {
          isCurrent: true,
        }),
      };
    });

    return reply.status(OK).send(response);
  },
);

export const deleteSessionHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const r = req as ReqWithAuth;

    // 1. Assert req.userId exists and is valid ObjectId
    appAssert(r.userId, UNAUTHORIZED, 'Not authorized', AppErrorCode.InvalidAccessToken);
    appAssert(ObjectId.isValid(r.userId), UNAUTHORIZED, 'Invalid user ID', AppErrorCode.InvalidAccessToken);

    const sessionId = z.string().parse(req.params.id);

    // Validate string is a valid ObjectId prior to querying native driver
    appAssert(ObjectId.isValid(sessionId), NOT_FOUND, 'Session not found');

    const userObjectId = new ObjectId(r.userId as string);

    // 2. Delete using native collection method
    const result = await req.db
      .collection<SessionEntity>('sessions')
      .findOneAndDelete({
        _id: new ObjectId(sessionId),
        userId: userObjectId,
      });

    appAssert(result, NOT_FOUND, 'Session not found');

    return reply.status(OK).send({ message: 'Session removed' });
  },
);
