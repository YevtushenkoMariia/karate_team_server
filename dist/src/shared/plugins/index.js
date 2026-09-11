"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authPlugin = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authPlugin", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return auth_1.authorize; } });
