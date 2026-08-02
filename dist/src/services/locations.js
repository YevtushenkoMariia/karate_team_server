"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const locations_1 = require("../repositories/locations");
const repository = new locations_1.LocationRepository();
class LocationService {
    async getCities() {
        const cities = await repository.getAllCities();
        return cities;
    }
    async getClubs() {
        const clubs = await repository.getAllClubs();
        return clubs;
    }
}
exports.LocationService = LocationService;
