"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteParamsSchema = exports.CreateAthleteSchema = void 0;
// src/schemas/athlete.schema.ts
const typebox_1 = require("@sinclair/typebox");
exports.CreateAthleteSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    weightCategory: typebox_1.Type.String(),
    teamId: typebox_1.Type.Number(),
});
exports.AthleteParamsSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
});
