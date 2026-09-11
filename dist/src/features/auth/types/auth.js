"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = exports.RegisterUserSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.RegisterUserSchema = typebox_1.Type.Object({
    role: typebox_1.Type.Union([
        typebox_1.Type.Literal('ADMIN'),
        typebox_1.Type.Literal('COACH'),
        typebox_1.Type.Literal('SPORTSMAN'),
    ]),
    name: typebox_1.Type.String({ minLength: 1 }),
    surname: typebox_1.Type.String({ minLength: 1 }),
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String({ minLength: 8 }),
    confirmPassword: typebox_1.Type.String({ minLength: 8 })
});
exports.LoginUserSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String({ minLength: 8 }),
});
