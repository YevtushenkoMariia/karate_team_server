"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const auth_1 = __importDefault(require("./plugins/auth"));
const cors_1 = __importDefault(require("@fastify/cors"));
const router_1 = require("./router");
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
    await app.register(auth_1.default);
    (0, router_1.registerRoutes)(app);
    return app;
}
