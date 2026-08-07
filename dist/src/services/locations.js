"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const locations_1 = require("../repositories/locations");
const error_1 = require("../types/error");
const repository = new locations_1.LocationRepository();
class LocationService {
    async getCities() {
        const cities = await repository.getAllCities();
        if (!cities) {
            throw new error_1.AppError("Cities not found", 404);
        }
        return cities;
    }
    async getClubs() {
        const clubs = await repository.getAllClubs();
        if (!clubs) {
            throw new error_1.AppError("Clubs not found", 404);
        }
        return clubs;
    }
}
exports.LocationService = LocationService;
