import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { createUser as createUserImpl0 } from "../../../../../hello/api/createUser";
import { deleteUser as deleteUserImpl1 } from "../../../../../hello/api/deleteUser";
import { getUser as getUserImpl2 } from "../../../../../hello/api/getUser";
import { pingDb as pingDbImpl3 } from "../../../../../hello/api/pingDb";
import { updateUser as updateUserImpl4 } from "../../../../../hello/api/updateUser";
import { greetAndLog as greetAndLogImpl5 } from "../../../../../hello/hello";
import * as hello_service from "../../../../../hello/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "hello",
            name:              "createUser",
            handler:           createUserImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "deleteUser",
            handler:           deleteUserImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "getUser",
            handler:           getUserImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "pingDb",
            handler:           pingDbImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "updateUser",
            handler:           updateUserImpl4,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "greetAndLog",
            handler:           greetAndLogImpl5,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
