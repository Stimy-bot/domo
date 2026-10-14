import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

export async function createUser(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.createUser(params, opts);
    }

    return apiCall("hello", "createUser", params, opts);
}
export async function deleteUser(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.deleteUser(params, opts);
    }

    return apiCall("hello", "deleteUser", params, opts);
}
export async function getUser(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.getUser(params, opts);
    }

    return apiCall("hello", "getUser", params, opts);
}
export async function pingDb(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.pingDb(params, opts);
    }

    return apiCall("hello", "pingDb", params, opts);
}
export async function updateUser(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.updateUser(params, opts);
    }

    return apiCall("hello", "updateUser", params, opts);
}
export async function greetAndLog(params, opts) {
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.greetAndLog(params, opts);
    }

    return apiCall("hello", "greetAndLog", params, opts);
}

export class Client {
  constructor() {
    this.createUser = createUser;
    this.deleteUser = deleteUser;
    this.getUser = getUser;
    this.pingDb = pingDb;
    this.updateUser = updateUser;
    this.greetAndLog = greetAndLog;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
