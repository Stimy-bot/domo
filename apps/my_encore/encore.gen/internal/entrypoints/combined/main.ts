import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { createUser as hello_createUserImpl0 } from "../../../../hello/api/createUser";
import { deleteUser as hello_deleteUserImpl1 } from "../../../../hello/api/deleteUser";
import { getUser as hello_getUserImpl2 } from "../../../../hello/api/getUser";
import { pingDb as hello_pingDbImpl3 } from "../../../../hello/api/pingDb";
import { updateUser as hello_updateUserImpl4 } from "../../../../hello/api/updateUser";
import { greetAndLog as hello_greetAndLogImpl5 } from "../../../../hello/hello";
import * as hello_service from "../../../../hello/encore.service";


const gateways: any[] = [
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "hello",
            name:              "createUser",
            handler:           hello_createUserImpl0,
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
            handler:           hello_deleteUserImpl1,
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
            handler:           hello_getUserImpl2,
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
            handler:           hello_pingDbImpl3,
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
            handler:           hello_updateUserImpl4,
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
            handler:           hello_greetAndLogImpl5,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run(import.meta.url);
