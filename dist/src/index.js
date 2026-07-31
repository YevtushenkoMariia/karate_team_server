"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const sportsmens_1 = require("./routes/sportsmens");
const auth_1 = require("./routes/auth");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const auth_2 = __importDefault(require("./plugins/auth"));
const cors_1 = __importDefault(require("@fastify/cors"));
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
    await app.register(cors_1.default, {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
    });
    await app.register(auth_2.default);
    app.register(sportsmens_1.athleteRoutes, { prefix: "/api/athletes" });
    app.register(auth_1.authRoutes, { prefix: "/api/auth" });
    return app;
}
