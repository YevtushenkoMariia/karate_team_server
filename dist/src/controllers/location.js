"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const locations_1 = require("../services/locations");
const service = new locations_1.LocationService();
class LocationController {
    async getCities(request, reply) {
        try {
            const registeredCities = await service.getCities();
            return reply.status(200).send(registeredCities);
        }
        catch (error) {
            return reply.status(404).send({
                message: "Cities not found",
                error: error.message,
            });
        }
    }
    async getClubs(request, reply) {
        try {
            const registerdClubs = await service.getClubs();
            return reply.status(200).send(registerdClubs);
        }
        catch (error) {
            return reply.status(404).send({
                message: "Clubs not found",
                error: error.message,
            });
        }
    }
}
exports.LocationController = LocationController;
