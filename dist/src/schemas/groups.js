"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGroupSchema = exports.GroupIdParams = exports.UserIdParams = exports.GetGroupQuery = exports.GroupBody = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.GroupBody = typebox_1.Type.Object({
    role: typebox_1.Type.String(),
});
exports.GetGroupQuery = typebox_1.Type.Object({
    role: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.UserIdParams = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
});
exports.GroupIdParams = typebox_1.Type.Object({
    userId: typebox_1.Type.String(),
    groupId: typebox_1.Type.String(),
});
exports.JoinGroupSchema = typebox_1.Type.Object({
    groupCode: typebox_1.Type.String(),
});
