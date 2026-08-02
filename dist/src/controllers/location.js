"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const locations_1 = require("../services/locations");
const service = new locations_1.LocationService();
class LocationController {
    async getCities(request, reply) {
        const result = await service.getCities();
        return reply.status(200).send(result);
    }
    async getClubs(request, reply) {
        const result = await service.getClubs();
        return reply.status(200).send(result);
    }
}
exports.LocationController = LocationController;
