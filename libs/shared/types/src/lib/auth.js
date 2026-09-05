"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = exports.AuthEventUserSchema = void 0;
const zod_1 = require("zod");
exports.AuthEventUserSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    email: zod_1.z.string().nullable(),
    fullName: zod_1.z.string(),
});
// Roles available in your system
exports.ROLES = ['user', 'admin', 'superAdmin'];
