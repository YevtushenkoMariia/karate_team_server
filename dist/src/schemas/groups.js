"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupBody = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.GroupBody = typebox_1.Type.Object({
    role: typebox_1.Type.String(),
});
