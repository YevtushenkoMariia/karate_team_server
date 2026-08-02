"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_1 = require("../controllers/user");
const user_2 = require("../schemas/user");
const client_1 = require("../../generated/prisma/client");
const auth_1 = require("../plugins/auth");
const controller = new user_1.UserController();
async function userRoutes(fastify) {
    fastify.get("/profile", {
        schema: {
            querystring: user_2.UserProfileSchema,
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getUserProfile,
    });
    fastify.put("/profile-update", {
        schema: {
            body: user_2.UpdateUserProfileSchema,
            security: [{ bearerAuth: [] }],
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.updateUserProfile,
    });
}
