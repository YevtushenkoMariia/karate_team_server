"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileSchema = exports.UserProfileSchema = exports.UserParamsSchema = exports.CreateUserSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.CreateUserSchema = typebox_1.Type.Object({
    birthday: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    surname: typebox_1.Type.String(),
    email: typebox_1.Type.String(),
    gender: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
    phone_number: typebox_1.Type.String(),
    role: typebox_1.Type.String(),
});
exports.UserParamsSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
exports.UserProfileSchema = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
    role: typebox_1.Type.String(),
});
exports.UpdateUserProfileSchema = typebox_1.Type.Object({
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    surname: typebox_1.Type.Optional(typebox_1.Type.String()),
    email: typebox_1.Type.Optional(typebox_1.Type.String()),
    gender: typebox_1.Type.Optional(typebox_1.Type.String()),
    phone_number: typebox_1.Type.Optional(typebox_1.Type.String()),
    birth_date: typebox_1.Type.Optional(typebox_1.Type.String()),
    city: typebox_1.Type.Optional(typebox_1.Type.String()),
    club: typebox_1.Type.Optional(typebox_1.Type.String()),
    karate_level: typebox_1.Type.Optional(typebox_1.Type.String()),
    position: typebox_1.Type.Optional(typebox_1.Type.String()),
    specialization: typebox_1.Type.Optional(typebox_1.Type.String()),
    status: typebox_1.Type.Optional(typebox_1.Type.String()),
});
