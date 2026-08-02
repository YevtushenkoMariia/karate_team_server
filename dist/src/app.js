"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const auth_1 = require("./routes/auth");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const auth_2 = __importDefault(require("./plugins/auth"));
const cors_1 = __importDefault(require("@fastify/cors"));
const user_1 = require("./routes/user");
const location_1 = require("./routes/location");
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
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
    });
    await app.register(cors_1.default, {
        origin: process.env.ORIGIN_FRONTEND_URL,
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
    // app.register(sportsmenRoutes, { prefix: "/api/athletes" });
    app.register(auth_1.authRoutes, { prefix: "/api/auth" });
    app.register(user_1.userRoutes, { prefix: "/api/user" });
    app.register(location_1.locationRoutes, { prefix: "/api/location" });
    return app;
}
