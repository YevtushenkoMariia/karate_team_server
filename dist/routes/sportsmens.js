"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.athleteRoutes = athleteRoutes;
const sportsmen_1 = require("../controllers/sportsmen");
const sportsmen_2 = require("../schemas/sportsmen");
const controller = new sportsmen_1.AthleteController();
async function athleteRoutes(fastify) {
    fastify.get('/', controller.getAll);
    fastify.get('/:id', {
        schema: { params: sportsmen_2.AthleteParamsSchema },
        handler: controller.getById,
    });
    //   fastify.post('/', {
    //     schema: { body: CreateAthleteSchema },
    //     handler: controller.create,
    //   });
}
