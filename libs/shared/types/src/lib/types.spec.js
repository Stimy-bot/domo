"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('types', () => {
    (0, vitest_1.it)('should work', () => {
        (0, vitest_1.expect)((0, types_1.types)()).toEqual('types');
    });
});
