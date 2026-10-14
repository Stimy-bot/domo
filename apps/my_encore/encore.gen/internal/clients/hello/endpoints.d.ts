import { CallOpts } from "encore.dev/api";

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type WithCallOpts<T extends (...args: any) => any> = (
  ...args: [...Parameters<T>, opts?: CallOpts]
) => ReturnType<T>;

import { createUser as createUser_handler } from "../../../../hello/api/createUser.js";
type createUser_Type = WithCallOpts<typeof createUser_handler>;
declare const createUser: createUser_Type;
export { createUser };

import { deleteUser as deleteUser_handler } from "../../../../hello/api/deleteUser.js";
type deleteUser_Type = WithCallOpts<typeof deleteUser_handler>;
declare const deleteUser: deleteUser_Type;
export { deleteUser };

import { getUser as getUser_handler } from "../../../../hello/api/getUser.js";
type getUser_Type = WithCallOpts<typeof getUser_handler>;
declare const getUser: getUser_Type;
export { getUser };

import { pingDb as pingDb_handler } from "../../../../hello/api/pingDb.js";
type pingDb_Type = WithCallOpts<typeof pingDb_handler>;
declare const pingDb: pingDb_Type;
export { pingDb };

import { updateUser as updateUser_handler } from "../../../../hello/api/updateUser.js";
type updateUser_Type = WithCallOpts<typeof updateUser_handler>;
declare const updateUser: updateUser_Type;
export { updateUser };

import { greetAndLog as greetAndLog_handler } from "../../../../hello/hello.js";
type greetAndLog_Type = WithCallOpts<typeof greetAndLog_handler>;
declare const greetAndLog: greetAndLog_Type;
export { greetAndLog };


export class Client {
  private constructor();

  readonly createUser: createUser_Type;
  readonly deleteUser: deleteUser_Type;
  readonly getUser: getUser_Type;
  readonly pingDb: pingDb_Type;
  readonly updateUser: updateUser_Type;
  readonly greetAndLog: greetAndLog_Type;
}

export declare function ref(): Client;
