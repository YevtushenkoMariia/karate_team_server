"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteController = void 0;
const sportsmen_1 = require("../services/sportsmen");
const service = new sportsmen_1.AthleteService();
class AthleteController {
    async getAll(request, reply) {
        const athletes = await service.getAllAthletes();
        return reply.send(athletes);
    }
    async getById(request, reply) {
        const athlete = await service.getAthleteById(Number(request.params.id));
        if (!athlete) {
            return reply.status(404).send({ message: 'Не знайдено' });
        }
        return reply.send(athlete);
    }
}
exports.AthleteController = AthleteController;
