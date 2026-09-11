"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const repositories_1 = require("../repositories");
const types_1 = require("../../../shared/types");
const repository = new repositories_1.LocationRepository();
class LocationService {
    async getCities() {
        const cities = await repository.getAllCities();
        if (!cities) {
            throw new types_1.AppError("Cities not found", 404);
        }
        return cities;
    }
    async getClubs() {
        const clubs = await repository.getAllClubs();
        if (!clubs) {
            throw new types_1.AppError("Clubs not found", 404);
        }
        return clubs;
    }
}
exports.LocationService = LocationService;
