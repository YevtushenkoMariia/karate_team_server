"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsmenController = void 0;
const sportsmen_1 = require("../services/sportsmen");
const logger_1 = require("../utils/logger");
const service = new sportsmen_1.SportsmenService();
class SportsmenController {
    async getAllSportsmens(reply) {
        const athletes = await service.getAllSportsmens();
        return reply.send(athletes);
    }
    async getSportsmenById(request, reply) {
        const athlete = await service.getSportsmenById(Number(request.params.id));
        if (!athlete) {
            logger_1.logger.warn(`Athlete with ID ${request.params.id} not found`);
            return reply.status(404).send({ message: 'Не знайдено' });
        }
        return reply.send(athlete);
    }
    async createSportsmen(request, reply) {
    }
}
exports.SportsmenController = SportsmenController;
