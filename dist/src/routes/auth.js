"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_1 = require("../schemas/auth");
const auth_2 = require("../controllers/auth");
const controller = new auth_2.AuthController();
async function authRoutes(fastify) {
    fastify.post("/register", {
        schema: {
            body: auth_1.RegisterUserSchema,
        },
        handler: controller.registerUser,
    });
    fastify.post("/login", {
        schema: {
            body: auth_1.LoginUserSchema,
        },
        handler: controller.loginUser,
    });
}
