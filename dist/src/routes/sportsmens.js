"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.athleteRoutes = athleteRoutes;
const client_1 = require("../../generated/prisma/client");
const sportsmen_1 = require("../controllers/sportsmen");
const sportsmen_2 = require("../schemas/sportsmen");
const auth_1 = require("../plugins/auth");
const controller = new sportsmen_1.SportsmenController();
async function athleteRoutes(fastify) {
    fastify.get('/', {
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH),
        ],
        handler: controller.getAllSportsmens,
    });
    fastify.get('/:id', {
        schema: {
            params: sportsmen_2.SportsmenParamsSchema,
        },
        preHandler: [
            fastify.authenticate,
            (0, auth_1.authorize)(client_1.role_type.ADMIN, client_1.role_type.COACH),
        ],
        handler: controller.getSportsmenById,
    });
}
