import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as hello_service from "../../../../hello/encore.service";

export async function createUser(params, opts) {
    const handler = (await import("../../../../hello/api/createUser")).createUser;
    registerTestHandler({
        apiRoute: { service: "hello", name: "createUser", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "createUser", params, opts);
}

export async function deleteUser(params, opts) {
    const handler = (await import("../../../../hello/api/deleteUser")).deleteUser;
    registerTestHandler({
        apiRoute: { service: "hello", name: "deleteUser", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "deleteUser", params, opts);
}

export async function getUser(params, opts) {
    const handler = (await import("../../../../hello/api/getUser")).getUser;
    registerTestHandler({
        apiRoute: { service: "hello", name: "getUser", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "getUser", params, opts);
}

export async function pingDb(params, opts) {
    const handler = (await import("../../../../hello/api/pingDb")).pingDb;
    registerTestHandler({
        apiRoute: { service: "hello", name: "pingDb", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "pingDb", params, opts);
}

export async function updateUser(params, opts) {
    const handler = (await import("../../../../hello/api/updateUser")).updateUser;
    registerTestHandler({
        apiRoute: { service: "hello", name: "updateUser", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":false,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "updateUser", params, opts);
}

export async function greetAndLog(params, opts) {
    const handler = (await import("../../../../hello/hello")).greetAndLog;
    registerTestHandler({
        apiRoute: { service: "hello", name: "greetAndLog", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("hello", "greetAndLog", params, opts);
}

