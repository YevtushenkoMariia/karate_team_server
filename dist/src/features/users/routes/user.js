"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const controllers_1 = require("../controllers");
const types_1 = require("../types");
const client_1 = require("../../../../generated/prisma/client");
const plugins_1 = require("../../../shared/plugins");
const controller = new controllers_1.UserController();
async function userRoutes(fastify) {
    fastify.get("/profile", {
        schema: {
            querystring: types_1.UserProfileSchema,
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.getUserProfile,
    });
    fastify.put("/profile-update", {
        schema: {
            body: types_1.UpdateUserProfileSchema,
            security: [{ bearerAuth: [] }],
        },
        preHandler: [
            fastify.authenticate,
            (0, plugins_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH, client_1.role_type.SPORTSMAN),
        ],
        handler: controller.updateUserProfile,
    });
}
