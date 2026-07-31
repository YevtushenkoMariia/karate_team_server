"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsmenParamsSchema = exports.CreateSportsmenSchema = void 0;
// src/schemas/athlete.schema.ts
const typebox_1 = require("@sinclair/typebox");
exports.CreateSportsmenSchema = typebox_1.Type.Object({
    city: typebox_1.Type.String(),
    club: typebox_1.Type.String(),
    karate_level: typebox_1.Type.String(),
    role_status: typebox_1.Type.String(),
    coach: typebox_1.Type.String(),
    user_id: typebox_1.Type.Number(),
});
exports.SportsmenParamsSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
