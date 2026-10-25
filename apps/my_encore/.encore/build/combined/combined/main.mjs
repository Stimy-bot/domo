// This file was bundled by Encore v1.58.8
//
// https://encore.dev

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// hello/api/createUser.ts
import { api } from "encore.dev/api";

// hello/encore.service.ts
import { secret } from "encore.dev/config";
import { Service } from "encore.dev/service";
import { MongoClient } from "mongodb";
var encore_service_default = new Service("hello");
var mongoConnectionString = secret("MongoConnectionString");
var dbInstance = null;
async function getDb() {
  if (dbInstance) return dbInstance;
  const uri = mongoConnectionString();
  const client = new MongoClient(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true }
  });
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("MongoDB connected inside hello service");
  dbInstance = client.db("mydb");
  return dbInstance;
}

// hello/api/createUser.ts
var createUser = api(
  { method: "POST", path: "/users" },
  async (req) => {
    const db = await getDb();
    const users = db.collection("users");
    const result = await users.insertOne({
      name: req.name,
      email: req.email,
      createdAt: /* @__PURE__ */ new Date()
    });
    return { id: result.insertedId.toString() };
  }
);

// hello/api/deleteUser.ts
import { api as api2 } from "encore.dev/api";
import { ObjectId } from "mongodb";
var deleteUser = api2(
  { method: "DELETE", path: "/users/:id" },
  async ({ id }) => {
    const db = await getDb();
    const users = db.collection("users");
    const result = await users.deleteOne({ _id: new ObjectId(id) });
    return { deletedCount: result.deletedCount };
  }
);

// hello/api/getUser.ts
import { api as api3 } from "encore.dev/api";
import { ObjectId as ObjectId2 } from "mongodb";
var getUser = api3(
  { method: "GET", path: "/users/:id" },
  async ({ id }) => {
    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId2(id) });
    if (!user) return { error: "User not found" };
    return { user };
  }
);

// hello/api/pingDb.ts
import { api as api4 } from "encore.dev/api";
var pingDb = api4({ method: "GET", path: "/mongo/ping" }, async () => {
  const db = await getDb();
  const result = await db.command({ ping: 1 });
  return { ok: true, result };
});

// hello/api/updateUser.ts
import { api as api5 } from "encore.dev/api";
import { ObjectId as ObjectId3 } from "mongodb";
var updateUser = api5(
  { method: "PUT", path: "/users/:id" },
  async ({ id, name, email }) => {
    const db = await getDb();
    const users = db.collection("users");
    const update = {
      ...name && { name },
      ...email && { email },
      updatedAt: /* @__PURE__ */ new Date()
    };
    const result = await users.updateOne({ _id: new ObjectId3(id) }, { $set: update });
    return { modifiedCount: result.modifiedCount };
  }
);

// hello/hello.ts
import { api as api6 } from "encore.dev/api";
var greetAndLog = api6(
  { expose: true, method: "POST", path: "/hello" },
  async (params) => {
    const db = await getDb();
    const collection = db.collection("logs");
    const newLog = {
      name: params.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const result = await collection.insertOne(newLog);
    return {
      message: `Hello, ${params.name}!`,
      logId: result.insertedId.toString()
    };
  }
);

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [];
var handlers = [
  {
    apiRoute: {
      service: "hello",
      name: "createUser",
      handler: createUser,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": false, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "hello",
      name: "deleteUser",
      handler: deleteUser,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": false, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "hello",
      name: "getUser",
      handler: getUser,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": false, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "hello",
      name: "pingDb",
      handler: pingDb,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": false, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "hello",
      name: "updateUser",
      handler: updateUser,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": false, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "hello",
      name: "greetAndLog",
      handler: greetAndLog,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run(import.meta.url);
//# sourceMappingURL=main.mjs.map
