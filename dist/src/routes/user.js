"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_1 = require("../schemas/user");
const user_2 = require("../controllers/user");
const controller = new user_2.UserController();
async function userRoutes(fastify) {
    fastify.post('/', {
        schema: {
            body: user_1.CreateUserSchema
        },
        handler: controller.createUser,
    });
    fastify.get('/:id', {
        schema: {
            params: {
                id: { type: 'string' }
            }
        },
        handler: controller.getUserById,
    });
}
