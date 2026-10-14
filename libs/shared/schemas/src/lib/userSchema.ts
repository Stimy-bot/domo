import { Type, type Static, type TObject, type TString, type TOptional, type TNumber } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  age: Type.Optional(Type.Number({ minimum: 18 })),
}) as TObject<{
  name: TString;
  email: TString;
  age: TOptional<TNumber>;
}>;

export type User = Static<typeof UserSchema>;