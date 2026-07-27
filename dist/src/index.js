"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const sportsmens_1 = require("./routes/sportsmens");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true
    });
    await app.register(swagger_1.default, {
        openapi: {
            info: {
                title: "Karate Team API",
                description: "API для управління спортсменами, тренерами та командами",
                version: "1.0.0",
            },
            servers: [{ url: "http://localhost:4000", description: "Local server" }],
        },
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
    });
    app.register(sportsmens_1.athleteRoutes, { prefix: "/api/athletes" });
    return app;
}
