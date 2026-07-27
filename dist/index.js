"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const sportsmens_1 = require("./routes/sportsmens");
function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true
    });
    app.register(sportsmens_1.athleteRoutes, { prefix: '/api/athletes' });
    return app;
}
