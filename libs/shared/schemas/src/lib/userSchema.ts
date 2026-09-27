import { Type, type Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  age: Type.Optional(Type.Number({ minimum: 18 })),
});

export type UserType = Static<typeof UserSchema>;
