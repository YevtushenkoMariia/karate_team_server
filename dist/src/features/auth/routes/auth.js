"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const types_1 = require("../types");
const controllers_1 = require("../controllers");
const controller = new controllers_1.AuthController();
async function authRoutes(fastify) {
    fastify.post("/register", {
        schema: {
            body: types_1.RegisterUserSchema,
        },
        handler: controller.registerUser,
    });
    fastify.post("/login", {
        schema: {
            body: types_1.LoginUserSchema,
        },
        handler: controller.loginUser,
    });
}
